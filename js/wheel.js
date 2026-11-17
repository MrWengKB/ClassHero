// 🎯 幸运转盘：「管理」页最下方有按钮，点开是弹窗。默认用本班学生名单，可自由修改。
// 状态放在 W 里，页面重绘（加分等）时转盘不会丢失。
const W = { open: false, edited: false, classId: null, text: '', items: [], picked: [], rotation: 0, spinning: false, result: '', msg: '' };
const WHEEL_COLORS = ['#E63946', '#F4A261', '#F9C74F', '#2A9D8F', '#457B9D', '#9B5DE5', '#F15BB5', '#52C77A', '#45B7D1', '#FF8B94'];
const WMIN = 2, WMAX = 40;

function wheelSyncClass() {
  const cls = gCls();
  if (cls && W.classId !== cls.id) {
    Object.assign(W, { classId: cls.id, edited: false, items: [], picked: [], rotation: 0, result: '', msg: '' });
  }
  if (!W.edited) W.text = gSts().map(s => s.name).join('\n');
}

// 管理页最下方的按钮
function renderWheelButton() {
  return `<div class="tc" style="margin:8px 0 24px"><button class="btn wopen" id="wOpen">🎯 幸运转盘</button></div>`;
}

function renderWheel() {
  if (!W.open) return '';
  wheelSyncClass();
  const remaining = W.items.filter(x => !W.picked.includes(x));
  return `<div class="mdo" id="wOverlay"><div class="mdc wmd" id="wheelCard" style="border-color:#F15BB5">
    <div class="fx jb ac mb"><h2 class="tpk">🎯 幸运转盘</h2><button class="wx" id="wClose" title="关闭">✖</button></div>
    <textarea class="inp" id="wText" style="min-height:90px" placeholder="每行一个，${WMIN}-${WMAX} 项">${esc(W.text)}</textarea>
    <div class="tgr mb${W.msg.startsWith('⚠️') ? ' werr' : ''}" style="font-size:.8rem;margin-top:-6px">${esc(W.msg || '✏️ 默认是本班学生名单，也可以改成任何选项，每行一个')}</div>
    <div class="fx fw jc"><button class="btn bpu" id="wMake">✨ 生成转盘</button><button class="btn bgr" id="wFill">👥 用本班学生名单</button></div>
    ${W.items.length ? `<div class="wbox"><div class="wptr"></div><canvas id="wCanvas"></canvas>
      <button class="wspin${W.spinning ? ' dis' : ''}" id="wSpin" title="转动">▶</button></div>
      <div class="tc" style="min-height:44px">${W.result ? `<span class="wres">🎉 ${esc(W.result)}</span>` : ''}</div>
      ${W.picked.length ? `<div class="wrem"><h3 class="tpk tc mb">${remaining.length ? `📋 还没抽到（${remaining.length}/${W.items.length}）` : '🎊 全部都抽到过了！'}</h3>
        ${remaining.length ? `<div class="wlist">${remaining.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}</div>` : ''}` : ''}
  </div></div>`;
}

function drawWheel() {
  const cv = $('wCanvas');
  if (!cv || !W.items.length) return;
  const size = Math.min(420, cv.parentElement.offsetWidth || 420), dpr = window.devicePixelRatio || 1;
  cv.width = size * dpr; cv.height = size * dpr; cv.style.width = cv.style.height = size + 'px';
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  const c = size / 2, r = size / 2, n = W.items.length, a = 2 * Math.PI / n;
  W.items.forEach((item, i) => {
    const start = i * a - Math.PI / 2;
    ctx.beginPath(); ctx.moveTo(c, c); ctx.arc(c, c, r, start, start + a); ctx.closePath();
    let col = WHEEL_COLORS[i % WHEEL_COLORS.length];
    if (i === n - 1 && n % WHEEL_COLORS.length === 1) col = WHEEL_COLORS[1]; // 首尾不同色
    ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.translate(c, c); ctx.rotate(start + a / 2);
    let fs = Math.max(10, Math.min(22, size / 16, (r * a) * 0.55));
    ctx.font = `bold ${fs}px system-ui,sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let t = item; const maxW = r * 0.6;
    while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -1);
    if (t !== item) t = t.slice(0, -1) + '…';
    ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.strokeText(t, r * 0.62, 0);
    ctx.fillStyle = '#1F2937'; ctx.fillText(t, r * 0.62, 0);
    ctx.restore();
  });
  cv.style.transition = 'none';
  cv.style.transform = `rotate(${W.rotation}deg)`;
}

function spinWheel() {
  if (W.spinning || W.items.length < WMIN) return;
  W.spinning = true; W.result = '';
  $('wSpin')?.classList.add('dis');
  W.rotation += (5 + Math.floor(Math.random() * 3)) * 360 + Math.random() * 360;
  const cv = $('wCanvas');
  if (cv) { void cv.offsetWidth; cv.style.transition = 'transform 4s cubic-bezier(.17,.67,.12,.99)'; cv.style.transform = `rotate(${W.rotation}deg)`; }
  setTimeout(() => {
    const top = (360 - (W.rotation % 360)) % 360; // 指针在正上方，转盘顺时针转
    const win = W.items[Math.floor(top / (360 / W.items.length)) % W.items.length];
    W.result = win; if (!W.picked.includes(win)) W.picked.push(win);
    W.spinning = false;
    if (W.open && $('wheelCard')) render();
  }, 4000);
}

function bindWheel() {
  const op = $('wOpen'); if (op) op.onclick = () => { W.open = true; render(); };
  const cl = $('wClose'); if (cl) cl.onclick = () => { W.open = false; render(); };
  const ov = $('wOverlay'); if (ov) ov.onclick = e => { if (e.target === ov) { W.open = false; render(); } };
  const t = $('wText'); if (t) t.oninput = e => { W.text = e.target.value; W.edited = true; };
  const mk = $('wMake'); if (mk) mk.onclick = () => {
    const lines = W.text.split('\n').map(x => x.trim()).filter(Boolean);
    if (lines.length < WMIN) { W.msg = `⚠️ 至少需要 ${WMIN} 项`; return render(); }
    if (lines.length > WMAX) { W.msg = `⚠️ 最多 ${WMAX} 项`; return render(); }
    Object.assign(W, { items: lines, picked: [], result: '', msg: `✅ 共 ${lines.length} 项，点中间的按钮转动` });
    render();
  };
  const fl = $('wFill'); if (fl) fl.onclick = () => { W.edited = false; W.msg = ''; render(); };
  const sp = $('wSpin'); if (sp) sp.onclick = spinWheel;
  drawWheel();
}
window.addEventListener('resize', () => { if (!W.spinning) drawWheel(); });
