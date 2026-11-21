// 🎤 语音加分：老师说「王小明听写满分」「李华按时交功课」，不用点按钮。
// 1) 浏览器语音识别（zh-CN）把话变成文字；
// 2) 先用本地规则在文字里找「学生姓名」和「活动名称」；
// 3) 规则看不懂时，如果老师在 ⚙️ 里填了自己的 AI 接口，就请 AI 来理解；没填就提示正确说法。
// AI 的密钥只存在本机浏览器（localStorage），不会进入班级数据，也不会同步到云端。

const V = { open: false, listening: false, rec: null, status: '', heard: '', result: '', kind: '', busy: false, setOpen: false, testMsg: '' };
const VKEY = 'ch_voice_ai';
const VPRESETS = {
  deepseek: { label: 'DeepSeek', fmt: 'openai', base: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  qwen: { label: '通义千问', fmt: 'openai', base: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  kimi: { label: 'Kimi（月之暗面）', fmt: 'openai', base: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
  openai: { label: 'OpenAI', fmt: 'openai', base: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  claude: { label: 'Claude（Anthropic）', fmt: 'anthropic', base: 'https://api.anthropic.com/v1', model: 'claude-opus-5-5' },
  custom: { label: '', fmt: 'openai', base: '', model: '' }
};

function vGetAI() {
  try { const c = JSON.parse(localStorage.getItem(VKEY) || 'null'); return c && c.key && c.base && c.model ? c : null; } catch { return null; }
}
function vLoadAI() {
  try { return JSON.parse(localStorage.getItem(VKEY) || 'null') || { preset: 'deepseek', ...VPRESETS.deepseek, key: '' }; } catch { return { preset: 'deepseek', ...VPRESETS.deepseek, key: '' }; }
}

// ───────────── 规则解析 ─────────────
const CN_NUM = { 一: 1, 二: 2, 两: 2, 兩: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
// 去掉空格和标点、英文转小写：中文、英文、马来文、淡米尔文都按同一套方法比对
const vNorm = t => String(t || '').toLowerCase().replace(/[\s，。,.!！?？、；;：:“”"'‘’（）()《》…~～\-_/]/g, '');
const HAS_CJK = t => /[\u3400-\u9fff]/.test(t);
// 记下去掉空格后每个位置是不是一个词的开头：英文名「Ali」不能从「kali」中间匹配出来
let vStarts = [];
function vWordStarts(raw) {
  const out = []; let gap = true, prev = '';
  for (const ch of String(raw || '').toLowerCase()) {
    if (vNorm(ch) === '') { gap = true; continue; }
    out.push(gap || HAS_CJK(ch) || HAS_CJK(prev)); gap = false; prev = ch;
  }
  return out;
}
const EN_NUM = { one: 1, once: 1, two: 2, twice: 2, three: 3, thrice: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, lapan: 8, sembilan: 9, sepuluh: 10 };
const vNum = t => {
  if (EN_NUM[t]) return EN_NUM[t];
  if (/^\d+$/.test(t)) return parseInt(t);
  if (t === '十') return 10;
  if (t.length === 2 && t[0] === '十') return 10 + (CN_NUM[t[1]] || 0);
  if (t.length === 2 && t[1] === '十') return (CN_NUM[t[0]] || 1) * 10;
  return CN_NUM[t] || 1;
};
const vDiff = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d; };
// 关键词：中文、English、Bahasa Melayu、தமிழ் 都认（文字已去空格、转小写）
const MINUS_RE = /扣|减|減|撤销|撤銷|撤回|取消|去掉|删掉|刪掉|删除|刪除|拿掉|收回|minus|deduct|takeaway|takeoff|remove|undo|cancel|tolak|kurangkan|batal|கழி|நீக்கு/;
const ALL_RE = /全班|所有人|所有同学|所有同學|全体|全體|大家|wholeclass|everyone|everybody|allstudents|semuamurid|semuaorang|seluruhkelas|semua|அனைவரும்|எல்லோரும்|எல்லாரும்/;
const TIMES_RE = /(\d+|[一二两兩三四五六七八九十]+|one|two|three|four|five|six|seven|eight|nine|ten|satu|dua|tiga|empat|lima|enam|tujuh|lapan|sembilan|sepuluh)(次|个|個|下|回|遍|times?|kali|முறை)|(once|twice|thrice)/;

// 在 text 中查找 needle，跳过已被别的词占用的位置
function vFind(text, used, needle) {
  const out = [];
  for (let i = text.indexOf(needle); i >= 0; i = text.indexOf(needle, i + 1)) {
    let free = true; for (let k = i; k < i + needle.length; k++) if (used[k]) { free = false; break; }
    if (free && (HAS_CJK(needle) || vStarts[i] !== false)) out.push(i);
  }
  return out;
}
function vClaim(used, pos, len) { for (let k = pos; k < pos + len; k++) used[k] = true; }

// 近似匹配：同样长度、只差一个字（语音识别常把「小」听成「晓」）
function vFuzzy(text, used, needle) {
  const n = needle.length, out = [];
  for (let i = 0; i + n <= text.length; i++) {
    let free = true; for (let k = i; k < i + n; k++) if (used[k]) { free = false; break; }
    if (free && vDiff(text.substr(i, n), needle) === 1 && (HAS_CJK(needle) || vStarts[i] !== false)) out.push(i);
  }
  return out;
}

/**
 * 把一句话解析成加分操作。
 * 返回 { ok, ops: [{ s, a, times, minus }], fuzzy, why }
 */
function voiceParse(raw, sts, acts) {
  const text = vNorm(raw);
  vStarts = vWordStarts(raw);
  if (!text) return { ok: false, why: T.vWhyEmpty };
  const used = new Array(text.length).fill(false), toks = [];
  let fuzzy = false;
  const addTok = (type, obj, pos, len) => { vClaim(used, pos, len); toks.push({ type, obj, pos, len }); };

  // 名字、活动名都按长度从长到短找，避免「王小明」被「小明」抢先
  const byLen = (arr, f) => [...arr].sort((a, b) => f(b).length - f(a).length);
  const stuList = byLen(sts, s => s.name).filter(s => vNorm(s.name));
  const actList = byLen(acts, a => a.name).filter(a => vNorm(a.name));

  // ① 全名
  stuList.forEach(s => vFind(text, used, vNorm(s.name)).forEach(p => addTok('s', s, p, vNorm(s.name).length)));
  // ② 全班
  { const m = text.match(ALL_RE); if (m) { const p = text.indexOf(m[0]); if (!used[p]) addTok('all', null, p, m[0].length); } }
  // ③ 活动全名
  actList.forEach(a => vFind(text, used, vNorm(a.name)).forEach(p => addTok('a', a, p, vNorm(a.name).length)));
  // ④ 只叫名字：中文去掉姓（「小明听写满分」）；英文等只叫名字里的某一个词（「Tom」→ Tom Lee）。要求在本班唯一
  stuList.forEach(s => {
    const n = vNorm(s.name), parts = [];
    if (HAS_CJK(s.name)) { if (n.length >= 3) parts.push(n.slice(1)); }
    else s.name.toLowerCase().split(/[\s\-_/]+/).map(vNorm).filter(w => w.length >= 3 && w !== n).forEach(w => parts.push(w));
    parts.forEach(given => {
      if (stuList.filter(x => vNorm(x.name).includes(given)).length !== 1) return;
      vFind(text, used, given).forEach(p => addTok('s', s, p, given.length));
    });
  });
  // ⑤ 活动名的一部分（「交功课」→「按时交功课」，「homework」→ Homework on time），要求只属于一个活动
  //    中文按字取片段（至少 2 个字）；英文等按词取片段（至少 4 个字母）
  const VSTOP = ['time', 'times', 'kali', 'class', 'full', 'good', 'with', 'from', 'well', 'done'];
  const pieces = name => {
    const out = [];
    if (HAS_CJK(name)) { const n = vNorm(name); for (let L = n.length - 1; L >= 2; L--) for (let i = 0; i + L <= n.length; i++) out.push(n.substr(i, L)); }
    else { const w = name.toLowerCase().split(/[\s\-_/]+/).map(vNorm).filter(Boolean); for (let L = w.length - 1; L >= 1; L--) for (let i = 0; i + L <= w.length; i++) { const p = w.slice(i, i + L).join(''); if (p.length >= 4 && !VSTOP.includes(p)) out.push(p); } }
    return out;
  };
  actList.forEach(a => {
    if (toks.some(t => t.obj === a)) return;
    for (const sub of pieces(a.name)) {
      if (actList.filter(x => vNorm(x.name).includes(sub)).length !== 1) continue;
      const ps = vFind(text, used, sub);
      if (ps.length) { ps.forEach(p => addTok('a', a, p, sub.length)); return; }
    }
  });
  // ⑥ 近似名字、近似活动（只差一个字），只在还缺的时候用
  const hasS = () => toks.some(t => t.type === 's' || t.type === 'all'), hasA = () => toks.some(t => t.type === 'a');
  const fzMin = x => HAS_CJK(x) ? 3 : 5; // 英文名太短时不做近似，免得误认
  if (!hasS()) stuList.forEach(s => { const n = vNorm(s.name); if (n.length >= fzMin(s.name)) vFuzzy(text, used, n).forEach(p => { addTok('s', s, p, n.length); fuzzy = true; }); });
  if (!hasA()) actList.forEach(a => { const n = vNorm(a.name); if (n.length >= fzMin(a.name)) vFuzzy(text, used, n).forEach(p => { addTok('a', a, p, n.length); fuzzy = true; }); });

  if (!hasS()) return { ok: false, why: T.vWhyStudent };
  if (!hasA()) return { ok: false, why: T.vWhyActivity };

  // 分组：连续的名字算一组，后面跟着的活动属于这组；下一个名字开始新的一组
  toks.sort((a, b) => a.pos - b.pos);
  const groups = []; let cur = null;
  toks.forEach(t => {
    if (t.type !== 'a') {
      if (!cur || cur.acts.length && cur.stus.length) { cur = { stus: [], acts: [], start: t.pos }; groups.push(cur); }
      cur.stus.push(...(t.type === 'all' ? sts : [t.obj]));
    } else {
      if (!cur) { cur = { stus: [], acts: [], start: t.pos }; groups.push(cur); }
      if (!cur.acts.includes(t.obj)) cur.acts.push(t.obj);
    }
  });
  // 「听写满分：王小明、李华」——活动在前、名字在后
  for (let i = 0; i < groups.length - 1; i++) {
    if (!groups[i].stus.length && !groups[i + 1].acts.length) { groups[i + 1].acts = groups[i].acts; groups[i + 1].start = groups[i].start; groups.splice(i, 1); i--; }
  }
  // 「王小明听写满分，李华也是」——没说活动的名字沿用上一组的活动
  groups.forEach((g, i) => { if (!g.acts.length && i > 0) g.acts = groups[i - 1].acts; });
  if (groups.some(g => !g.stus.length || !g.acts.length)) return { ok: false, why: T.vWhyPair };

  // 每组的范围文字里找「扣/减」和「N次」（把名字、活动名先挖掉，免得活动名里的数字被误读）
  const masked = text.split('').map((c, i) => used[i] ? '|' : c).join('');
  const ops = [];
  groups.forEach((g, i) => {
    const from = i === 0 ? 0 : g.start, to = i + 1 < groups.length ? groups[i + 1].start : text.length;
    const span = masked.slice(from, to);
    const minus = MINUS_RE.test(span);
    const m = span.match(TIMES_RE);
    const times = Math.min(10, Math.max(1, m ? vNum(m[1] || m[3]) : 1));
    [...new Set(g.stus)].forEach(s => g.acts.forEach(a => ops.push({ s, a, times, minus })));
  });
  return { ok: true, ops, fuzzy };
}

// ───────────── 执行与撤销 ─────────────
function voiceApply(ops, prefix) {
  const done = [];
  ops.forEach(o => {
    let n = 0;
    for (let k = 0; k < o.times; k++) {
      if (o.minus) { if (awardRemove(o.s, o.a)) n++; } else { awardAdd(o.s, o.a); n++; }
    }
    if (n) done.push({ ...o, n });
  });
  if (!done.length) { vShow(T.vNothingToRemove, 'err'); return; }
  const line = done.map(o => `${o.s.name} · ${o.a.name} ${o.minus ? '−' : '+'}${o.a.pointValue * o.n}${o.n > 1 ? T.vTimes(o.n) : ''}`).join(T.vLineSep);
  const undo = () => {
    done.forEach(o => { for (let k = 0; k < o.n; k++) o.minus ? awardAdd(o.s, o.a) : awardRemove(o.s, o.a); });
    inc(); render(); vShow(T.vUndone(line), 'ok');
  };
  if (done.length === 1) S.pop = done[0].s.id + '|' + done[0].a.id;
  inc(); render();
  undoBar('🎤 ' + line, undo);
  vShow((prefix || '✅ ') + line, 'ok');
}

function vExample() {
  const n = gSts()[0]?.name || (LANG === 'zh' ? '王小明' : 'Ali'), a = gActs()[0]?.name || (LANG === 'zh' ? '听写满分' : 'Spelling');
  return HAS_CJK(n + a) ? n + a : n + ' ' + a;
}
function vHelp() {
  const sts = gSts(), acts = gActs();
  const ex = vExample();
  return T.vHelp(ex) + (acts.length ? ' ' + T.vActsList(acts.map(a => a.name).join(T.vSep)) : '');
}

async function voiceHandle(alts) {
  alts = alts.filter(Boolean);
  if (!alts.length) return;
  V.heard = alts[0];
  const sts = gSts(), acts = gActs();
  if (!sts.length || !acts.length) { vShow(T.vNoData, 'err'); return; }
  // 识别器给的几个候选都试一遍，同音字常常在第二、三个候选里
  for (const t of alts) {
    const r = voiceParse(t, sts, acts);
    if (r.ok) { V.heard = t; voiceApply(r.ops, r.fuzzy ? T.vFuzzy : '✅ '); return; }
  }
  const why = voiceParse(alts[0], sts, acts).why;
  const ai = vGetAI();
  if (!ai) { vShow(T.vNotUnderstood(why, vHelp()), 'err'); return; }
  V.busy = true; vShow(T.vAskingAI, 'busy');
  try {
    const res = await voiceAI(ai, alts[0], sts, acts);
    const ops = [];
    (res.actions || []).forEach(x => {
      const a = acts.find(y => y.name === x.activity);
      const list = /^(全班|所有人)$/.test(x.student) ? sts : sts.filter(y => y.name === x.student);
      if (!a || !list.length) return;
      const times = Math.min(10, Math.max(1, parseInt(x.times) || 1));
      list.forEach(s => ops.push({ s, a, times, minus: !!x.minus }));
    });
    if (ops.length) voiceApply(ops, T.vAIResult);
    else vShow(T.vAINo(res.note, vHelp()), 'err');
  } catch (e) {
    vShow(T.vAIError(e.message, vHelp()), 'err');
  } finally { V.busy = false; vPaint(); }
}

// ───────────── AI 兜底 ─────────────
const VSYS = () => `你是小学课堂积分助手。老师会口头说一句加分或扣分指令（来自语音识别，可能有同音错别字）。老师可能用中文、English、Bahasa Melayu、தமிழ் 或其他语言，也可能几种语言混着说。
请根据给出的学生名单和活动列表，判断老师想给哪些学生的哪个活动加（或扣）几次。
规则：
- student 必须原样使用名单里的姓名；如果是全班，写 "全班"。
- activity 必须原样使用活动列表里的名称；选意思最接近的那个。
- times 是次数（整数，默认 1）；扣分、撤销时 minus 为 true。
- 无法判断时 actions 为空数组，在 note 里用一句${T.vNoteLang}说明原因。
只输出 JSON，不要输出其他文字，格式：{"actions":[{"student":"","activity":"","times":1,"minus":false}],"note":""}`;

async function voiceAI(cfg, said, sts, acts) {
  const user = JSON.stringify({ 学生名单: sts.map(s => s.name), 活动列表: acts.map(a => ({ 名称: a.name, 分值: a.pointValue })), 老师说: said });
  const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 30000);
  const base = cfg.base.replace(/\/+$/, '');
  let text = '';
  try {
    if (cfg.fmt === 'anthropic') {
      const body = { model: cfg.model, max_tokens: 1024, system: VSYS(), messages: [{ role: 'user', content: user }] };
      if (/^claude-(opus|sonnet|haiku)-5|^claude-(fable|mythos)/.test(cfg.model)) body.output_config = { effort: 'low' };
      const r = await fetch(base + '/messages', {
        method: 'POST', signal: ctl.signal,
        headers: { 'content-type': 'application/json', 'x-api-key': cfg.key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify(body)
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error?.message || 'HTTP ' + r.status);
      if (j.stop_reason === 'refusal') throw new Error(T.vErrRefusal);
      text = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    } else {
      const r = await fetch(base + '/chat/completions', {
        method: 'POST', signal: ctl.signal,
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + cfg.key },
        body: JSON.stringify({ model: cfg.model, messages: [{ role: 'system', content: VSYS() }, { role: 'user', content: user }] })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error?.message || 'HTTP ' + r.status);
      text = j.choices?.[0]?.message?.content || '';
    }
  } catch (e) {
    if (e.name === 'AbortError') throw new Error(T.vErrTimeout);
    if (e instanceof TypeError) throw new Error(T.vErrConnect);
    throw e;
  } finally { clearTimeout(tm); }
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error(T.vErrJson);
  return JSON.parse(text.slice(a, b + 1));
}

// ───────────── 语音识别 ─────────────
// 识别语言默认跟着界面语言走（华文→普通话，English→英语，Melayu→马来语，தமிழ்→淡米尔语）。
// 面板里的下拉框可以换成同一种语言的其他口音或别的语言，按界面语言分别记住。
const VLANGS = [['zh-CN', '普通话'], ['zh-TW', '國語（台灣）'], ['zh-HK', '粵語'], ['en-US', 'English (US)'], ['en-GB', 'English (UK)'], ['ms-MY', 'Bahasa Melayu'], ['ta-SG', 'தமிழ் (சிங்கப்பூர்)'], ['ta-IN', 'தமிழ் (இந்தியா)']];
const VL_DEFAULT = { zh: 'zh-CN', en: 'en-US', ms: 'ms-MY', ta: 'ta-SG' };
const VL_UI = { 'zh-CN': 'zh', 'zh-TW': 'zh', 'zh-HK': 'zh', 'en-US': 'en', 'en-GB': 'en', 'ms-MY': 'ms', 'ta-SG': 'ta', 'ta-IN': 'ta' };
const vLangKey = () => 'ch_voice_lang_' + LANG;
function vLang() {
  try { const v = localStorage.getItem(vLangKey()); if (v && VL_UI[v]) return v; } catch { }
  return VL_DEFAULT[LANG] || 'zh-CN';
}
function voiceLangChanged() { voiceStop(); V.result = ''; V.heard = ''; vPaint(); const m = $('vmic'); if (m) m.title = T.vMicTitle; }

const VSR = window.SpeechRecognition || window.webkitSpeechRecognition;

// 停止录音：不等浏览器的 onend（有的浏览器语音服务卡住时 onend 永远不来），直接把界面复原
function voiceStop(msg) {
  clearTimeout(V.wd);
  const rec = V.rec; V.rec = null; V.listening = false;
  if (rec) { rec.onend = rec.onresult = rec.onerror = null; try { rec.abort(); } catch { } }
  if (msg) vShow(msg, 'err'); else vPaint();
}

function voiceListen() {
  if (V.listening || V.rec) { voiceStop(T.vStopped); return; }
  if (!VSR) { vShow(T.vNoSR, 'err'); return; }
  const rec = new VSR();
  rec.lang = vLang(); rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 5;
  let final = null, gotAudio = false;
  // 看门狗：8 秒内既没收到声音也没有文字 → 多半是语音服务连不上；20 秒还没结束就强制停止
  const arm = ms => { clearTimeout(V.wd); V.wd = setTimeout(() => { if (V.rec === rec) voiceStop(gotAudio ? T.vNotHeard : T.vNoResponse); }, ms); };
  rec.onstart = () => { V.listening = true; V.heard = ''; vShow(T.vListening, 'busy'); arm(8000); };
  rec.onaudiostart = rec.onsoundstart = rec.onspeechstart = () => { if (!gotAudio) { gotAudio = true; arm(20000); } };
  rec.onresult = e => {
    gotAudio = true; arm(20000);
    const r = e.results[e.results.length - 1];
    V.heard = r[0].transcript; vPaint();
    if (r.isFinal) final = Array.from(r, x => x.transcript);
  };
  rec.onerror = e => {
    const m = { 'not-allowed': T.vMicDenied, 'service-not-allowed': T.vMicDenied, 'no-speech': T.vNoSpeech, 'audio-capture': T.vNoMic, network: T.vNetErr }[e.error];
    if (e.error !== 'aborted') vShow('⚠️ ' + (m || T.vSRErr(e.error)), 'err');
  };
  rec.onend = () => { clearTimeout(V.wd); if (V.rec !== rec) return; V.listening = false; V.rec = null; vPaint(); if (final) voiceHandle(final); else if (V.kind === 'busy' && !V.busy) vShow(T.vNotHeard, 'err'); };
  V.rec = rec; V.listening = true; vShow(T.vListening, 'busy'); arm(8000);
  try { rec.start(); } catch { voiceStop(T.vNoResponse); }
}

// ───────────── 界面 ─────────────
function vShow(msg, kind) { V.result = msg; V.kind = kind || ''; V.open = true; vPaint(); }

function vEnsure() {
  if ($('vfab')) return;
  const fab = document.createElement('div');
  fab.id = 'vfab';
  fab.innerHTML = `<div id="vpanel"></div><button id="vmic" title="${esc(T.vMicTitle)}">🎤</button>`;
  document.body.appendChild(fab);
  $('vmic').onclick = () => { V.open = true; voiceListen(); vPaint(); };
}

function vPaint() {
  const p = $('vpanel'), mic = $('vmic');
  if (!p) return;
  mic.className = V.listening ? 'on' : '';
  mic.textContent = V.listening ? '⏹' : '🎤';
  if (!V.open) { p.className = ''; p.innerHTML = ''; return; }
  const ai = vGetAI();
  p.className = 'show';
  p.innerHTML = `<div class="fx jb ac"><b>🎤 ${T.vTitle}</b><span class="fx ac"><select id="vlang" class="vlsel" title="${T.vLangTitle}">${VLANGS.map(([k, n]) => `<option value="${k}"${vLang() === k ? ' selected' : ''}>${n}</option>`).join('')}</select><button class="vic" id="vset" title="${T.vSettings}">⚙️</button><button class="vic" id="vx" title="${T.close}">✖</button></span></div>
    ${V.heard ? `<div class="vheard">「${esc(V.heard)}」</div>` : ''}
    ${V.result ? `<div class="vres ${V.kind}">${esc(V.result)}</div>` : `<div class="vres">${esc(T.vIntro(vExample(), (I18N[VL_UI[vLang()]] || T).vKw))}</div>`}
    <form id="vform" class="fx ac" style="gap:6px;margin-top:8px"><input class="inp" id="vtxt" placeholder="${T.vTypeHere}" autocomplete="off" style="margin:0;padding:8px;font-size:.9rem"><button class="btn bp" style="margin:0;flex:none">${T.vSend}</button></form>
    <div class="tgr" style="font-size:.7rem;margin-top:6px">${ai ? esc(T.vAIOn(VPRESETS[ai.preset]?.label || T.vOther)) : T.vAIOff}</div>`;
  $('vlang').onchange = e => { try { localStorage.setItem(vLangKey(), e.target.value); } catch { } voiceStop(); };
  $('vx').onclick = () => { V.open = false; voiceStop(); };
  $('vset').onclick = () => { V.setOpen = true; V.testMsg = ''; vPaintSet(); };
  $('vform').onsubmit = e => { e.preventDefault(); const t = $('vtxt').value.trim(); if (t && !V.busy) voiceHandle([t]); };
}

function vPaintSet() {
  let ov = $('vsetov');
  if (!V.setOpen) { ov?.remove(); return; }
  if (!ov) { ov = document.createElement('div'); ov.id = 'vsetov'; ov.className = 'mdo'; document.body.appendChild(ov); }
  const c = vLoadAI();
  ov.innerHTML = `<div class="mdc wmd" style="border-color:#9B5DE5">
    <div class="fx jb ac mb"><h3 class="tpu">${T.vSetTitle}</h3><button class="wx" id="vsClose" title="${T.close}">✖</button></div>
    <p class="tgr mb" style="font-size:.8rem">${T.vSetIntro}</p>
    <label class="vlb">${T.vProvider}</label><select class="inp" id="vsPre">${Object.entries(VPRESETS).map(([k, v]) => `<option value="${k}"${c.preset === k ? ' selected' : ''}>${v.label || T.vOther}</option>`).join('')}</select>
    <label class="vlb">${T.vBase}</label><input class="inp" id="vsBase" value="${esc(c.base || '')}" placeholder="https://…/v1">
    <label class="vlb">${T.vModel}</label><input class="inp" id="vsModel" value="${esc(c.model || '')}">
    <label class="vlb">${T.vKey}</label><input class="inp" id="vsKey" type="password" value="${esc(c.key || '')}" placeholder="sk-…" autocomplete="off">
    <p class="tgr mb" style="font-size:.75rem">${T.vPrivacy}</p>
    ${V.testMsg ? `<div class="vres ${V.testMsg.startsWith('✅') ? 'ok' : 'err'} mb">${esc(V.testMsg)}</div>` : ''}
    <button class="btn bs" id="vsSave">${T.save}</button><button class="btn bp" id="vsTest">${T.vTest}</button><button class="btn bgr" id="vsClear">${T.vClear}</button></div>`;
  const read = () => ({ preset: $('vsPre').value, fmt: VPRESETS[$('vsPre').value].fmt, base: $('vsBase').value.trim(), model: $('vsModel').value.trim(), key: $('vsKey').value.trim() });
  const store = cfg => { try { localStorage.setItem(VKEY, JSON.stringify(cfg)); return true; } catch { return false; } };
  ov.onclick = e => { if (e.target === ov) { V.setOpen = false; vPaintSet(); } };
  $('vsClose').onclick = () => { V.setOpen = false; vPaintSet(); };
  $('vsPre').onchange = () => { const p = VPRESETS[$('vsPre').value]; $('vsBase').value = p.base; $('vsModel').value = p.model; };
  $('vsSave').onclick = () => { store(read()); V.setOpen = false; vPaintSet(); vPaint(); toast(vGetAI() ? T.vSaved : T.vSavedNoKey); };
  $('vsClear').onclick = () => { try { localStorage.removeItem(VKEY); } catch { } V.testMsg = T.vCleared; vPaintSet(); vPaint(); };
  $('vsTest').onclick = async () => {
    const cfg = read();
    if (!cfg.key || !cfg.base || !cfg.model) { V.testMsg = T.vFillAll; vPaintSet(); return; }
    store(cfg); V.testMsg = T.vTesting; vPaintSet();
    const sts = gSts().length ? gSts() : [{ name: '王小明' }], acts = gActs().length ? gActs() : [{ name: '听写满分', pointValue: 10 }];
    try {
      const r = await voiceAI(cfg, `${sts[0].name}${acts[0].name}`, sts, acts);
      V.testMsg = T.vTestOk((r.actions || []).length);
    } catch (e) { V.testMsg = '⚠️ ' + e.message; }
    vPaintSet(); vPaint();
  };
}

// 每次重绘后调用：登录且有班级时才显示麦克风按钮
function voiceSync() {
  const on = S.loggedIn && gCls();
  if (!on) { voiceStop(); $('vfab')?.remove(); V.open = false; V.setOpen = false; vPaintSet(); return; }
  // 第一次出现或换了班级时才重画面板（不打断正在打字的输入框）
  const fresh = !$('vfab') || V.cls !== gCls().id; V.cls = gCls().id; vEnsure(); if (fresh) vPaint();
}
