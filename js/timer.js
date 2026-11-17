// ⏱️ 倒计时：「管理」页最下方，幸运转盘旁边。弹窗里可以调整时长，关掉弹窗后也会继续计时。
const C = { open: false, total: 300, remain: 300, running: false, endAt: 0, done: false, tick: null };
const fmt = s => { s = Math.max(0, Math.ceil(s)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
const cLeft = () => C.running ? Math.max(0, (C.endAt - Date.now()) / 1000) : C.remain;

function renderTimerButton() {
  const label = C.running || C.remain < C.total ? `⏱️ ${fmt(cLeft())}` : '⏱️ 倒计时';
  return `<button class="btn copen${C.done ? ' cdone' : ''}" id="cOpen">${C.done ? '⏰ 时间到！' : label}</button>`;
}

function renderTimer() {
  if (!C.open) return '';
  const m = Math.floor(C.total / 60), s = C.total % 60, editable = !C.running && C.remain === C.total;
  return `<div class="mdo" id="cOverlay"><div class="mdc wmd" style="border-color:#2A9D8F">
    <div class="fx jb ac mb"><h2 class="tgn">⏱️ 倒计时</h2><button class="wx" id="cClose" title="关闭">✖</button></div>
    <div class="cring" id="cRing"><div class="cdisp${C.done ? ' cdone' : ''}" id="cDisp">${C.done ? '时间到！' : fmt(cLeft())}</div></div>
    ${editable ? `<div class="fx jc ac fw mb" style="gap:6px">
      <input class="inp cnum" id="cMin" type="number" min="0" max="99" value="${m}"><b>分</b>
      <input class="inp cnum" id="cSec" type="number" min="0" max="59" value="${s}"><b>秒</b></div>
      <div class="fx jc fw mb">${[30, 60, 180, 300, 600].map(v => `<button class="btn cpre${C.total === v ? ' on' : ''}" data-cp="${v}">${v < 60 ? v + ' 秒' : v / 60 + ' 分钟'}</button>`).join('')}</div>` : ''}
    <div class="fx jc fw">
      ${C.running ? `<button class="btn bd" id="cPause">⏸ 暂停</button>` : `<button class="btn bs" id="cStart"${C.total ? '' : ' disabled'}>▶ ${C.remain < C.total && !C.done ? '继续' : '开始'}</button>`}
      ${C.running || C.remain < C.total || C.done ? `<button class="btn bp" id="cAdd">+1 分钟</button><button class="btn bgr" id="cReset">↺ 重置</button>` : ''}
    </div></div></div>`;
}

function beep() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    [0, .35, .7].forEach(t => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(.3, ac.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + t + .3);
      o.start(ac.currentTime + t); o.stop(ac.currentTime + t + .3);
    });
  } catch {}
}

function cPaint() {
  const left = cLeft(), d = $('cDisp'), r = $('cRing'), b = $('cOpen');
  if (d && !C.done) d.textContent = fmt(left);
  if (r) r.style.setProperty('--p', C.total ? (left / C.total * 360) + 'deg' : '0deg');
  if (b && !C.done) b.textContent = `⏱️ ${fmt(left)}`;
}

function cTick() {
  if (!C.running) return;
  if (cLeft() <= 0) {
    clearInterval(C.tick); C.running = false; C.remain = 0; C.done = true;
    beep(); C.open = true; render(); return;
  }
  cPaint();
}

function cStart() {
  if (C.done || C.remain <= 0) { C.remain = C.total; C.done = false; }
  if (!C.remain) return;
  C.endAt = Date.now() + C.remain * 1000; C.running = true;
  clearInterval(C.tick); C.tick = setInterval(cTick, 200);
  render();
}

function cSetTotal(sec) {
  C.total = Math.max(0, Math.min(99 * 60 + 59, sec)); C.remain = C.total; C.done = false;
}

function bindTimer() {
  const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
  on('cOpen', () => { C.open = true; if (C.done) { C.done = false; C.remain = C.total; } render(); });
  on('cClose', () => { C.open = false; render(); });
  const ov = $('cOverlay'); if (ov) ov.onclick = e => { if (e.target === ov) { C.open = false; render(); } };
  const read = () => cSetTotal((parseInt($('cMin').value) || 0) * 60 + (parseInt($('cSec').value) || 0));
  const mi = $('cMin'), se = $('cSec');
  // 输入时只更新显示，不重绘整页，免得打字时输入框失去焦点
  const live = () => { read(); const d = $('cDisp'); if (d) d.textContent = fmt(C.total);
    document.querySelectorAll('[data-cp]').forEach(x => x.classList.toggle('on', +x.dataset.cp === C.total));
    const st = $('cStart'); if (st) st.disabled = !C.total; };
  if (mi) mi.oninput = live;
  if (se) se.oninput = live;
  document.querySelectorAll('[data-cp]').forEach(b => b.onclick = () => { cSetTotal(+b.dataset.cp); render(); });
  on('cStart', () => { if (mi) read(); cStart(); });
  on('cPause', () => { C.remain = cLeft(); C.running = false; clearInterval(C.tick); render(); });
  on('cAdd', () => {
    if (C.running) C.endAt += 60000; else C.remain += 60;
    if (C.done) { C.done = false; C.remain = 60; }
    C.total = Math.max(C.total, Math.ceil(cLeft())); render();
  });
  on('cReset', () => { clearInterval(C.tick); C.running = false; C.done = false; C.remain = C.total; render(); });
  cPaint();
}
