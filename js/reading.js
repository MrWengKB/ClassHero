// 📚 阅读打卡：和积分完全独立，不计入总分、排行榜和备份提醒。
// 每个学生：reading = { progress: 0-9, rounds: 完成轮数, log: [{ date, d }] }，d 为当次增减的本数。
const RB = 10; // 每轮 10 本
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const gR = s => s.reading || (s.reading = { progress: 0, rounds: 0, log: [] });
const rTotal = s => { const r = gR(s); return r.rounds * RB + r.progress; };
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const weekStart = () => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return ymd(d); };
const rSince = (s, from) => (gR(s).log || []).reduce((t, e) => t + (e.date >= from ? e.d : 0), 0);

function toast(msg) {
  let el = $('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
  el.textContent = msg; el.className = 'show';
  clearTimeout(toast.t); toast.t = setTimeout(() => { el.className = ''; }, 2500);
}

function toggleBook(sid, i) {
  const s = gSts().find(x => String(x.id) === sid);
  if (!s) return;
  const r = gR(s), before = r.progress;
  let d;
  if (i < r.progress) { d = i - r.progress; r.progress = i; }
  else {
    d = i + 1 - r.progress; r.progress = i + 1;
    if (r.progress === RB) { r.rounds++; r.progress = 0; setTimeout(() => toast(`🎉 ${s.name} 完成一轮阅读！`), 300); }
  }
  if (d) { (r.log || (r.log = [])).push({ date: getDate(), d }); }
  S.rAnim = sid + '-' + i;
  save(); render();
}

function renderReading() {
  const sts = gSts();
  const wk = weekStart(), mo = getDate().slice(0, 8) + '01';
  const books = s => { const p = gR(s).progress; return Array.from({ length: RB }, (_, i) =>
    `<button class="rbk${i < p ? ' on' : ''}${S.rAnim === s.id + '-' + i ? ' pop' : ''}" data-rb="${s.id}-${i}" title="${i < p ? '点击取消' : '点击打卡'}">📖</button>`).join(''); };
  const rows = sts.length === 0 ? `<p class="tgr tc">${T.noStudents}</p>` : sts.map(s => `<div class="rrow">
      <div class="rname"><span class="rav">${esc(s.name.charAt(0))}</span><strong>${esc(s.name)}</strong></div>
      <div class="rbooks">${books(s)}</div>
      <div class="rmed">🏅 <b>${gR(s).rounds}</b> 轮</div></div>`).join('');
  const total = sts.reduce((t, s) => t + rTotal(s), 0);
  const rank = [...sts].sort((a, b) => rTotal(b) - rTotal(a)).filter(s => rTotal(s) > 0).slice(0, 10);
  const stat = (n, l, c) => `<div class="rst" style="background:${c}22;color:${c}"><div class="rsn">${n}</div><div>${l}</div></div>`;
  S.rAnim = null;
  return `<div class="crd crd-r"><h2 class="trd mb">📚 阅读打卡</h2>
    <p class="tgr mb" style="font-size:.8rem">点击书本打卡，满 ${RB} 本 = 1 轮 🏅。阅读记录独立统计，不计入积分。</p>${rows}</div>
    ${sts.length ? `<div class="crd crd-r"><h2 class="trd mb">📊 班级阅读统计</h2><div class="rsts">
      ${stat(sts.length, '学生总数', '#457B9D')}${stat(sts.reduce((t, s) => t + gR(s).rounds, 0), '累计轮数', '#F4A261')}
      ${stat(total, '总阅读量', '#2A9D8F')}${stat((total / sts.length).toFixed(1), '人均阅读', '#9B5DE5')}
      ${stat(sts.reduce((t, s) => t + rSince(s, wk), 0), '本周阅读', '#F15BB5')}${stat(sts.reduce((t, s) => t + rSince(s, mo), 0), '本月阅读', '#E63946')}
    </div></div>
    <div class="crd crd-r"><h2 class="trd mb">🏆 阅读榜</h2>${rank.length === 0 ? `<p class="tgr tc">${T.noHistory}</p>` : rank.map((s, i) =>
      `<div class="acr fx ac jb"><span>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1)} <strong>${esc(s.name)}</strong></span><span class="tgr" style="font-size:.8rem">本周 ${rSince(s, wk)} 本 · 共 <b class="trd">${rTotal(s)}</b> 本</span></div>`).join('')}</div>` : ''}`;
}

function bindReading() {
  document.querySelectorAll('[data-rb]').forEach(b => b.onclick = () => {
    const k = b.dataset.rb, j = k.lastIndexOf('-');
    toggleBook(k.slice(0, j), +k.slice(j + 1));
  });
}
