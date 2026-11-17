/**
 * 课堂英雄 - Google Apps Script 后端
 *
 * 把这个文件的全部内容贴到 Google Sheet 的「扩展程序 → Apps Script」里，
 * 然后「部署 → 新建部署 → 网页应用」（执行身份：我；访问权限：任何人）。
 *
 * 工作表（第一次使用时自动创建）：
 *   teachers   教师账号（密码只存加盐哈希）
 *   data       每位教师的完整数据（JSON，过长时自动拆到多列）
 *   积分总览    方便在表格里直接查看的积分明细（每次保存时自动刷新）
 *   classes    班级和分页的对应关系（程序用）
 *   每个班级一个分页：建班后第一次保存时自动创建，改名、删除班级时同步。
 *   分页内容由程序生成，只供查看，手动修改会在下次保存时被覆盖。
 */

const SHEET_TEACHERS = 'teachers';
const SHEET_DATA = 'data';
const SHEET_VIEW = '积分总览';
const SHEET_CLASSES = 'classes';
const RESERVED = [SHEET_TEACHERS, SHEET_DATA, SHEET_VIEW, SHEET_CLASSES];
const CHUNK = 40000; // 单元格上限 50000 字符，留出余量

function doGet() {
  return out({ ok: true, app: 'ClassHero' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const handlers = { register: register, login: login, load: load, save: save };
    const fn = handlers[req.action];
    if (!fn) return out({ ok: false, error: 'unknown_action' });
    return out(fn(req));
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name, header, allText) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    if (allText !== false) s.getRange(1, 1, s.getMaxRows(), s.getMaxColumns()).setNumberFormat('@');
    s.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
    s.setFrozenRows(1);
  }
  return s;
}

function teachersSheet() {
  return getSheet(SHEET_TEACHERS, ['id', 'username', 'name', 'salt', 'passwordHash', 'token', 'createdAt']);
}

function dataSheet() {
  return getSheet(SHEET_DATA, ['teacherId', 'updatedAt', 'json']);
}

function hash(salt, pw) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + pw, Utilities.Charset.UTF_8)
    .map(function (b) { return ((b + 256) % 256).toString(16); })
    .map(function (h) { return h.length < 2 ? '0' + h : h; })
    .join('');
}

function findRow(sheet, col, val) {
  const v = sheet.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) {
    if (String(v[i][col]) === String(val)) return { row: i + 1, values: v[i] };
  }
  return null;
}

function publicUser(v) {
  return { id: String(v[0]), username: String(v[1]), name: String(v[2]) };
}

function register(r) {
  const u = String(r.username || '').trim();
  const p = String(r.password || '');
  const n = String(r.name || '').trim();
  if (!u || !p || !n) return { ok: false, error: 'missing_fields' };
  const s = teachersSheet();
  if (findRow(s, 1, u)) return { ok: false, error: 'username_taken' };
  const id = Utilities.getUuid(), salt = Utilities.getUuid(), token = Utilities.getUuid();
  const row = [id, u, n, salt, hash(salt, p), token, new Date().toISOString()];
  s.getRange(s.getLastRow() + 1, 1, 1, row.length).setNumberFormat('@').setValues([row]);
  return { ok: true, token: token, user: publicUser(row) };
}

function login(r) {
  const f = findRow(teachersSheet(), 1, String(r.username || '').trim());
  if (!f || hash(f.values[3], String(r.password || '')) !== String(f.values[4])) {
    return { ok: false, error: 'bad_login' };
  }
  return { ok: true, token: String(f.values[5]), user: publicUser(f.values) };
}

function auth(token) {
  if (!token) return null;
  const f = findRow(teachersSheet(), 5, token);
  return f ? publicUser(f.values) : null;
}

function load(r) {
  const user = auth(r.token);
  if (!user) return { ok: false, error: 'bad_token' };
  const f = findRow(dataSheet(), 0, user.id);
  if (!f) return { ok: true, data: null };
  const json = f.values.slice(2).join('');
  return { ok: true, data: json ? JSON.parse(json) : null, updatedAt: String(f.values[1]) };
}

function save(r) {
  const user = auth(r.token);
  if (!user) return { ok: false, error: 'bad_token' };
  if (!r.data || !Array.isArray(r.data.classes)) return { ok: false, error: 'bad_data' };
  const json = JSON.stringify(r.data);
  const chunks = [];
  for (let i = 0; i < json.length; i += CHUNK) chunks.push(json.slice(i, i + CHUNK));
  const now = new Date().toISOString();
  const row = [user.id, now].concat(chunks);

  const s = dataSheet();
  const f = findRow(s, 0, user.id);
  const rowNum = f ? f.row : s.getLastRow() + 1;
  const lastCol = Math.max(s.getLastColumn(), row.length);
  if (f) s.getRange(rowNum, 1, 1, lastCol).clearContent();
  s.getRange(rowNum, 1, 1, row.length).setNumberFormat('@').setValues([row]);

  updateView(user, r.data);
  syncClassTabs(user, r.data);
  return { ok: true, updatedAt: now };
}

/** 刷新「积分总览」里这位教师的行：教师 / 班级 / 学生 / 活动 / 次数 / 分数 */
function updateView(user, data) {
  const header = ['教师', '班级', '学生', '活动', '次数', '分数', '学生总分'];
  const s = getSheet(SHEET_VIEW, header, false);
  const all = s.getDataRange().getValues();
  const keep = all.slice(1).filter(function (row) { return String(row[0]) !== user.username; });
  const mine = [];
  (data.classes || []).forEach(function (c) {
    const acts = c.activities || [];
    (c.students || []).forEach(function (st) {
      const counts = st.activityCounts || {};
      const total = acts.reduce(function (t, a) { return t + (counts[a.id] || 0) * a.pointValue; }, 0);
      acts.forEach(function (a) {
        const n = counts[a.id] || 0;
        mine.push([user.username, c.name, st.name, a.name, n, n * a.pointValue, total]);
      });
    });
  });
  const rows = keep.concat(mine).map(function (r) { return r.slice(0, header.length); });
  if (s.getLastRow() > 1) s.getRange(2, 1, s.getLastRow() - 1, header.length).clearContent();
  if (rows.length) {
    const range = s.getRange(2, 1, rows.length, header.length);
    s.getRange(2, 1, rows.length, 4).setNumberFormat('@');
    range.setValues(rows);
  }
}

function classesSheet() {
  return getSheet(SHEET_CLASSES, ['teacherId', 'classId', 'sheetId', 'className']);
}

function cleanName(name) {
  const n = String(name || '').replace(/[:\\\/?*\[\]]/g, '').trim().slice(0, 80);
  return n || '班级';
}

/** 给班级分页取一个不重名的名字：一班 → 一班（王老师） → 一班（王老师）2 … */
function uniqueTabName(ss, name, user, self) {
  const base = cleanName(name);
  const free = function (n) {
    if (RESERVED.indexOf(n) >= 0) return false;
    const s = ss.getSheetByName(n);
    return !s || (self && s.getSheetId() === self.getSheetId());
  };
  if (free(base)) return base;
  const withName = base + '（' + user.name + '）';
  if (free(withName)) return withName;
  for (let i = 2; ; i++) if (free(withName + i)) return withName + i;
}

/** 每个班级对应一个分页；新建、改名、删除都跟着班级走 */
function syncClassTabs(user, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reg = classesSheet();
  const rows = reg.getDataRange().getValues().slice(1).filter(function (r) { return r[0] !== ''; });
  const others = rows.filter(function (r) { return String(r[0]) !== user.id; });
  const mine = {};
  rows.forEach(function (r) {
    if (String(r[0]) === user.id) mine[String(r[1])] = { sheetId: Number(r[2]), name: String(r[3]) };
  });
  const byId = {};
  ss.getSheets().forEach(function (s) { byId[s.getSheetId()] = s; });

  const next = {};
  (data.classes || []).forEach(function (c) {
    const old = mine[c.id];
    let sh = old && byId[old.sheetId];
    if (!sh) {
      sh = ss.insertSheet(uniqueTabName(ss, c.name, user, null));
    } else if (old.name !== c.name) {
      sh.setName(uniqueTabName(ss, c.name, user, sh));
    }
    writeClassTab(sh, c);
    next[c.id] = { sheetId: sh.getSheetId(), name: c.name };
  });

  Object.keys(mine).forEach(function (cid) {
    if (!next[cid] && byId[mine[cid].sheetId]) ss.deleteSheet(byId[mine[cid].sheetId]);
  });

  const all = others.map(function (r) { return r.slice(0, 4); }).concat(Object.keys(next).map(function (cid) {
    return [user.id, cid, String(next[cid].sheetId), next[cid].name];
  }));
  if (reg.getLastRow() > 1) reg.getRange(2, 1, reg.getLastRow() - 1, 4).clearContent();
  if (all.length) reg.getRange(2, 1, all.length, 4).setNumberFormat('@').setValues(all);
}

/** 分页内容：学生 | 每项活动的次数 | 总分 */
function writeClassTab(sh, c) {
  const acts = c.activities || [];
  const header = ['学生'].concat(acts.map(function (a) { return a.name + '（' + a.pointValue + '分/次）'; }), ['总分']);
  const rows = (c.students || []).map(function (st) {
    const counts = st.activityCounts || {};
    const n = acts.map(function (a) { return counts[a.id] || 0; });
    const total = acts.reduce(function (t, a, i) { return t + n[i] * a.pointValue; }, 0);
    return [st.name].concat(n, [total]);
  });
  sh.clearContents();
  const all = [header].concat(rows);
  sh.getRange(1, 1, all.length, 1).setNumberFormat('@');
  sh.getRange(1, 1, all.length, header.length).setValues(all);
  sh.getRange(1, 1, 1, header.length).setFontWeight('bold');
  sh.setFrozenRows(1);
}
