// 与 Google Sheet（Apps Script 网页应用）同步。API_URL 为空时这里的函数都不做事。
const SESSION_KEY = 'chSess', DIRTY_KEY = 'chDirty';
const dirtyKey = () => DIRTY_KEY + '_' + (S.user && S.user.id);
const setDirty = v => { try { v ? localStorage.setItem(dirtyKey(), '1') : localStorage.removeItem(dirtyKey()); } catch {} };
const isDirty = () => localStorage.getItem(dirtyKey()) === '1';
const ERR = { username_taken: '用户名已存在', bad_login: '用户名或密码错误', missing_fields: '请填写所有字段', bad_token: '登录已失效，请重新登录', network: '无法连接服务器，请检查网络' };
let _cloudTimer = null, _cloudBusy = false, _cloudAgain = false;

function api(action, payload) {
  // text/plain 避免浏览器发预检请求（Apps Script 不支持预检）
  return fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, ...payload }) })
    .then(r => r.json())
    .catch(() => ({ ok: false, error: 'network' }));
}

function setSync(state) {
  S.sync = state;
  const el = $('sync');
  if (!el) return;
  const txt = { pending: '⏳ 待同步', saving: '☁️ 同步中…', saved: '✅ 已同步到 Google Sheet', error: '⚠️ 同步失败，点此重试', loading: '☁️ 读取中…' };
  el.textContent = txt[state] || '';
  el.className = state === 'error' ? 'err' : '';
  el.onclick = state === 'error' ? () => cloudPush() : null;
}

function cloudSave() {
  if (!API_URL || !S.token) return;
  clearTimeout(_cloudTimer);
  setDirty(true);
  setSync('pending');
  _cloudTimer = setTimeout(cloudPush, 800);
}

async function cloudPush() {
  if (!API_URL || !S.token) return;
  clearTimeout(_cloudTimer);
  if (_cloudBusy) { _cloudAgain = true; return; }
  _cloudBusy = true;
  setSync('saving');
  const r = await api('save', { token: S.token, data: S.data });
  _cloudBusy = false;
  if (r.error === 'bad_token') { alert(ERR.bad_token); return forceLogout(); }
  if (_cloudAgain) { _cloudAgain = false; return cloudPush(); }
  if (r.ok) setDirty(false);
  setSync(r.ok ? 'saved' : 'error');
}

function startSession(user, token) {
  S.user = user; S.token = token; S.loggedIn = 1;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
}

// 首次登录云端时，如果云端没有数据，把这台电脑上同名账号的旧数据搬上去
function localDataFor(username) {
  try {
    const sys = JSON.parse(localStorage.getItem('chS') || '{}');
    const t = (sys.teachers || []).find(x => x.username === username);
    const d = t && localStorage.getItem('ch_' + t.id);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}

async function cloudPull() {
  setSync('loading');
  const r = await api('load', { token: S.token });
  if (r.error === 'bad_token') { alert(ERR.bad_token); return forceLogout(); }
  if (!r.ok) { setSync('error'); return; }
  // 本机有还没传上去的改动（比如断网时改的），以本机为准补传
  if (isDirty()) { render(); return cloudPush(); }
  if (r.data) {
    S.data = normData(r.data);
    localStorage.setItem('ch_' + S.user.id, JSON.stringify({ ...S.data, lastUpdated: Date.now() }));
    setSync('saved');
  } else {
    const old = localDataFor(S.user.username);
    if (old) { S.data = normData(old); save(); } else setSync('');
  }
  if (S.data.activeClassId && !S.data.classes.some(c => c.id === S.data.activeClassId)) S.data.activeClassId = S.data.classes[0]?.id || null;
  render();
}

async function cloudAuth(action, payload, btn) {
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  const r = await api(action, payload);
  if (!r.ok) { alert(ERR[r.error] || r.error); render(); return; }
  startSession(r.user, r.token);
  S.login = { u: '', p: '' }; S.reg = { n: '', u: '', p: '' };
  S.data = { activeClassId: null, classes: [], changes: 0, lastBackup: 0 };
  load(); // 先用本机缓存，马上能看到
  render();
  await cloudPull();
}

function cloudLogin() { return cloudAuth('login', { username: S.login.u, password: S.login.p }, document.querySelector('#loginForm button')); }
function cloudRegister() { return cloudAuth('register', { name: S.reg.n, username: S.reg.u, password: S.reg.p }, document.querySelector('#regForm button')); }

function cloudLogout() {
  if (!API_URL) return;
  if (S.sync === 'pending' || S.sync === 'saving' || S.sync === 'error') cloudBeacon();
  localStorage.removeItem(SESSION_KEY);
  S.token = null; setSync('');
}

function forceLogout() {
  localStorage.removeItem(SESSION_KEY);
  S.token = null; S.loggedIn = 0; S.user = null;
  S.data = { activeClassId: null, classes: [], changes: 0, lastBackup: 0 };
  setSync(''); render();
}

// 页面关闭前还有没同步的改动，用 sendBeacon 补发一次
function cloudBeacon() {
  if (!API_URL || !S.token) return;
  try { navigator.sendBeacon(API_URL, new Blob([JSON.stringify({ action: 'save', token: S.token, data: S.data })], { type: 'text/plain;charset=utf-8' })); } catch {}
}
window.addEventListener('pagehide', () => { if (S.sync === 'pending' || S.sync === 'saving') cloudBeacon(); });

// 打开页面时恢复上次的登录（只在云端模式下）
function cloudRestore() {
  if (!API_URL) return false;
  let sess = null;
  try { sess = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch {}
  if (!sess || !sess.token) return false;
  S.user = sess.user; S.token = sess.token; S.loggedIn = 1;
  load(); render(); cloudPull();
  return true;
}
