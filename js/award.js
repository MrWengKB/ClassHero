// 管理页的学生列表：每个学生一行，活动是一横排按钮。
// 点一下 = 加一次分；右键或长按 = 减一次。每次加减都会同步历史记录。
function renderStudentRows(sts, acts) {
  const pop = S.pop; S.pop = null;
  return `<div class="crd cb"><p class="tgr mb" style="font-size:.75rem">👆 点按钮加分 · 右键或长按减一次</p>${sts.map(s => `<div class="srow">
    <div class="sname">${esc(s.name)}</div>
    <div class="schips">${acts.map(a => { const c = s.activityCounts[a.id] || 0; return `<button class="chip ${a.color}${pop === s.id + '|' + a.id ? ' pop' : ''}" data-aw="${s.id}|${a.id}" title="${esc(a.name)}：点一下 +${a.pointValue}，右键或长按 −${a.pointValue}">
      <span>${IC[a.icon]}</span><span class="cnm">${esc(a.name)}</span>${c ? `<b class="ccnt">${c}</b>` : ''}</button>`; }).join('')}</div>
    <span class="scb">${cTS(s)} 🏆</span>
    <button class="sdel" data-ds="${s.id}" title="删除学生">🗑️</button></div>`).join('')}</div>`;
}

function awardFind(key) {
  const [sid, aid] = key.split('|');
  return { s: gSts().find(x => String(x.id) === sid), a: gActs().find(x => x.id === aid) };
}

function awardAdd(s, a) {
  s.activityCounts[a.id] = (s.activityCounts[a.id] || 0) + 1;
  (s.activityHistory[a.id] || (s.activityHistory[a.id] = [])).push({ date: getDate(), count: 1, points: a.pointValue });
}

// 减一次：计数 −1，并从最近的历史记录里扣掉一次，保证概览/进度和总分一致
function awardRemove(s, a) {
  if (!(s.activityCounts[a.id] > 0)) return false;
  s.activityCounts[a.id]--;
  const h = s.activityHistory[a.id] || [];
  for (let i = h.length - 1; i >= 0; i--) {
    if (h[i].count > 0) {
      const per = h[i].points / h[i].count;
      h[i].count--; h[i].points -= per;
      if (h[i].count === 0) h.splice(i, 1);
      break;
    }
  }
  return true;
}

function undoBar(text, undo) {
  let el = $('undo');
  if (!el) { el = document.createElement('div'); el.id = 'undo'; document.body.appendChild(el); }
  el.innerHTML = `<span>${esc(text)}</span>${undo ? '<button id="undoBtn">↩ 撤销</button>' : ''}`;
  el.className = 'show';
  const b = $('undoBtn'); if (b) b.onclick = () => { undo(); el.className = ''; };
  clearTimeout(undoBar.t); undoBar.t = setTimeout(() => { el.className = ''; }, 5000);
}

function awardClick(key, minus) {
  const { s, a } = awardFind(key);
  if (!s || !a) return;
  if (minus) {
    if (!awardRemove(s, a)) return;
    undoBar(`${s.name} · ${a.name} −${a.pointValue}`, () => { awardAdd(s, a); inc(); render(); });
  } else {
    awardAdd(s, a);
    undoBar(`${s.name} · ${a.name} +${a.pointValue}`, () => { awardRemove(s, a); inc(); render(); });
  }
  S.pop = key;
  inc(); render();
}

// 长按后页面会重绘，松手时的 click 会落到新按钮上，所以用全局标记把它挡掉
let awLong = false, awIgnoreUntil = 0;
document.addEventListener('pointerup', () => { if (awLong) { awLong = false; awIgnoreUntil = Date.now() + 400; } }, true);

function bindAward() {
  document.querySelectorAll('[data-aw]').forEach(b => {
    let timer = null;
    b.onclick = () => { if (awLong || Date.now() < awIgnoreUntil) return; awardClick(b.dataset.aw, false); };
    b.oncontextmenu = e => { e.preventDefault(); if (e.pointerType === 'touch' || awLong) return; awardClick(b.dataset.aw, true); };
    b.onpointerdown = e => { if (e.pointerType === 'mouse') return; timer = setTimeout(() => { awLong = true; awardClick(b.dataset.aw, true); }, 550); };
    b.onpointerup = b.onpointerleave = b.onpointercancel = () => clearTimeout(timer);
  });
}
