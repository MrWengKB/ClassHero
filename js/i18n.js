// 🌐 界面语言：华文 / English / Bahasa Melayu / தமிழ்
// 每种语言一套文字。缺的词会自动用华文补上。带参数的文字写成函数。
// 选过的语言记在本机浏览器（ch_lang），没选过时按浏览器语言猜，猜不到就用华文。
const LANGS = [['zh', '华文'], ['en', 'English'], ['ms', 'Melayu'], ['ta', 'தமிழ்']];
const HTML_LANG = { zh: 'zh-CN', en: 'en', ms: 'ms', ta: 'ta' };

const I18N = {
zh: {
  appTitle: "课堂英雄", login: "登录", logout: "退出", username: "用户名", password: "密码", teacherName: "教师姓名", createTeacher: "创建账户",
  students: "学生", addStudent: "添加学生", importStudents: "导入", studentName: "学生姓名", activities: "活动", addActivity: "添加活动", points: "分", total: "总计",
  save: "保存", cancel: "取消", edit: "编辑", noActivities: "还没有活动", noStudents: "还没有学生", addClass: "添加班级", className: "班级名称", noClasses: "没有班级",
  welcomeMessage: "欢迎！创建班级开始", createFirstClass: "创建班级", switchClass: "切换班级", exportData: "导出", importData: "导入",
  dataExported: "导出成功！", dataImported: "导入成功！", invalidFile: "无效文件", showAll: "全部", filterBy: "筛选", leaderboard: "排行榜",
  teacherMode: "管理", classOverview: "概览", studentProgress: "进度", reading: "阅读", selectStudent: "选择学生", noHistory: "暂无记录", dailyTotal: "每日总计",
  back: "返回", activityName: "活动名称", pointValue: "分值", icon: "图标", color: "颜色", pasteHere: "粘贴姓名（每行一个，或用逗号隔开）",
  backupTitle: "备份提醒", backupMessage: "数据存在浏览器，建议备份", backupNow: "下载", backupLater: "稍后",
  ptsPer: n => `${n} 分/次`, language: "语言",
  // 加分
  tapHint: "👆 点按钮加分 · 右键或长按减一次", chipTitle: (a, n) => `${a}：点一下 +${n}，右键或长按 −${n}`, delStudent: "删除学生", undo: "撤销",
  // 登录、确认
  wrongLogin: "用户名或密码错误", fillAll: "请填写所有字段", userExists: "用户名已存在", confirm: "确定？",
  errBadToken: "登录已失效，请重新登录", errNetwork: "无法连接服务器，请检查网络",
  syncPending: "⏳ 待同步", syncSaving: "☁️ 同步中…", syncSaved: "✅ 已同步到 Google Sheet", syncError: "⚠️ 同步失败，点此重试", syncLoading: "☁️ 读取中…",
  // 阅读
  readTitle: "阅读打卡", readHint: n => `点击书本打卡，满 ${n} 本 = 1 轮 🏅。阅读记录独立统计，不计入积分。`, roundUnit: "轮", bookTick: "点击打卡", bookUntick: "点击取消",
  roundDone: name => `🎉 ${name} 完成一轮阅读！`, readStats: "班级阅读统计", stStudents: "学生总数", stRounds: "累计轮数", stBooks: "总阅读量", stAvg: "人均阅读",
  stWeek: "本周阅读", stMonth: "本月阅读", readRank: "阅读榜", rankLine: (w, t) => `本周 ${w} 本 · 共 <b class="trd">${t}</b> 本`,
  // 转盘
  wheel: "幸运转盘", close: "关闭", wheelPh: (a, b) => `每行一个，${a}-${b} 项`, wheelTip: "✏️ 默认是本班学生名单，也可以改成任何选项，每行一个",
  wheelMake: "✨ 生成转盘", wheelFill: "👥 用本班学生名单", spin: "转动", notPicked: (r, t) => `📋 还没抽到（${r}/${t}）`, allPicked: "🎊 全部都抽到过了！",
  wheelMin: n => `⚠️ 至少需要 ${n} 项`, wheelMax: n => `⚠️ 最多 ${n} 项`, wheelReady: n => `✅ 共 ${n} 项，点中间的按钮转动`,
  // 倒计时
  timer: "倒计时", timeUp: "时间到！", minU: "分", secU: "秒", secs: n => `${n} 秒`, mins: n => `${n} 分钟`, pause: "暂停", resume: "继续", start: "开始", addMin: "+1 分钟", reset: "重置"
},

en: {
  appTitle: "Class Heroes", login: "Log in", logout: "Log out", username: "Username", password: "Password", teacherName: "Teacher name", createTeacher: "Create account",
  students: "Students", addStudent: "Add student", importStudents: "Import", studentName: "Student name", activities: "Activities", addActivity: "Add activity", points: "pts", total: "Total",
  save: "Save", cancel: "Cancel", edit: "Edit", noActivities: "No activities yet", noStudents: "No students yet", addClass: "Add class", className: "Class name", noClasses: "No classes",
  welcomeMessage: "Welcome! Create a class to start", createFirstClass: "Create class", switchClass: "Switch class", exportData: "Export", importData: "Import",
  dataExported: "Exported!", dataImported: "Imported!", invalidFile: "Invalid file", showAll: "All", filterBy: "Filter", leaderboard: "Leaderboard",
  teacherMode: "Manage", classOverview: "Overview", studentProgress: "Progress", reading: "Reading", selectStudent: "Choose a student", noHistory: "No records yet", dailyTotal: "Daily total",
  back: "Back", activityName: "Activity name", pointValue: "Points", icon: "Icon", color: "Colour", pasteHere: "Paste names (one per line, or separated by commas)",
  backupTitle: "Backup reminder", backupMessage: "Your data is stored in this browser. Please download a backup.", backupNow: "Download", backupLater: "Later",
  ptsPer: n => `${n} pts each`, language: "Language",
  tapHint: "👆 Tap a button to add points · right-click or long-press to take one away", chipTitle: (a, n) => `${a}: tap +${n}, right-click or long-press −${n}`, delStudent: "Delete student", undo: "Undo",
  wrongLogin: "Wrong username or password", fillAll: "Please fill in all fields", userExists: "Username already taken", confirm: "Are you sure?",
  errBadToken: "Your session has expired. Please log in again.", errNetwork: "Cannot reach the server. Please check your connection.",
  syncPending: "⏳ Waiting to sync", syncSaving: "☁️ Syncing…", syncSaved: "✅ Synced to Google Sheet", syncError: "⚠️ Sync failed, tap to retry", syncLoading: "☁️ Loading…",
  readTitle: "Reading log", readHint: n => `Tap a book to log it. ${n} books = 1 round 🏅. Reading is tracked separately and does not count towards points.`, roundUnit: "rounds", bookTick: "Tap to log", bookUntick: "Tap to undo",
  roundDone: name => `🎉 ${name} finished a reading round!`, readStats: "Class reading stats", stStudents: "Students", stRounds: "Rounds", stBooks: "Books read", stAvg: "Books per student",
  stWeek: "This week", stMonth: "This month", readRank: "Reading leaderboard", rankLine: (w, t) => `This week ${w} · Total <b class="trd">${t}</b> books`,
  wheel: "Lucky wheel", close: "Close", wheelPh: (a, b) => `One per line, ${a}-${b} items`, wheelTip: "✏️ Starts with this class's students. You can change it to anything, one per line.",
  wheelMake: "✨ Make wheel", wheelFill: "👥 Use class list", spin: "Spin", notPicked: (r, t) => `📋 Not picked yet (${r}/${t})`, allPicked: "🎊 Everyone has been picked!",
  wheelMin: n => `⚠️ Need at least ${n} items`, wheelMax: n => `⚠️ At most ${n} items`, wheelReady: n => `✅ ${n} items. Tap the middle button to spin.`,
  timer: "Timer", timeUp: "Time's up!", minU: "min", secU: "sec", secs: n => `${n} sec`, mins: n => `${n} min`, pause: "Pause", resume: "Resume", start: "Start", addMin: "+1 min", reset: "Reset"
},

ms: {
  appTitle: "Wira Kelas", login: "Log masuk", logout: "Log keluar", username: "Nama pengguna", password: "Kata laluan", teacherName: "Nama guru", createTeacher: "Cipta akaun",
  students: "Murid", addStudent: "Tambah murid", importStudents: "Import", studentName: "Nama murid", activities: "Aktiviti", addActivity: "Tambah aktiviti", points: "mata", total: "Jumlah",
  save: "Simpan", cancel: "Batal", edit: "Sunting", noActivities: "Belum ada aktiviti", noStudents: "Belum ada murid", addClass: "Tambah kelas", className: "Nama kelas", noClasses: "Tiada kelas",
  welcomeMessage: "Selamat datang! Cipta kelas untuk bermula", createFirstClass: "Cipta kelas", switchClass: "Tukar kelas", exportData: "Eksport", importData: "Import",
  dataExported: "Berjaya dieksport!", dataImported: "Berjaya diimport!", invalidFile: "Fail tidak sah", showAll: "Semua", filterBy: "Tapis", leaderboard: "Papan pendahulu",
  teacherMode: "Urus", classOverview: "Ringkasan", studentProgress: "Kemajuan", reading: "Bacaan", selectStudent: "Pilih murid", noHistory: "Belum ada rekod", dailyTotal: "Jumlah harian",
  back: "Kembali", activityName: "Nama aktiviti", pointValue: "Mata", icon: "Ikon", color: "Warna", pasteHere: "Tampal nama (satu nama setiap baris, atau dipisahkan dengan koma)",
  backupTitle: "Peringatan sandaran", backupMessage: "Data disimpan dalam pelayar ini. Sila muat turun sandaran.", backupNow: "Muat turun", backupLater: "Nanti",
  ptsPer: n => `${n} mata setiap kali`, language: "Bahasa",
  tapHint: "👆 Tekan butang untuk tambah mata · klik kanan atau tekan lama untuk tolak satu", chipTitle: (a, n) => `${a}: tekan +${n}, klik kanan atau tekan lama −${n}`, delStudent: "Padam murid", undo: "Buat asal",
  wrongLogin: "Nama pengguna atau kata laluan salah", fillAll: "Sila isi semua ruangan", userExists: "Nama pengguna sudah digunakan", confirm: "Anda pasti?",
  errBadToken: "Sesi tamat. Sila log masuk semula.", errNetwork: "Tidak dapat menghubungi pelayan. Sila semak sambungan internet.",
  syncPending: "⏳ Menunggu penyegerakan", syncSaving: "☁️ Sedang disegerakkan…", syncSaved: "✅ Disegerakkan ke Google Sheet", syncError: "⚠️ Gagal disegerakkan, tekan untuk cuba lagi", syncLoading: "☁️ Memuatkan…",
  readTitle: "Rekod bacaan", readHint: n => `Tekan buku untuk merekod. ${n} buku = 1 pusingan 🏅. Rekod bacaan dikira berasingan dan tidak termasuk dalam mata.`, roundUnit: "pusingan", bookTick: "Tekan untuk rekod", bookUntick: "Tekan untuk batal",
  roundDone: name => `🎉 ${name} telah menamatkan satu pusingan bacaan!`, readStats: "Statistik bacaan kelas", stStudents: "Bilangan murid", stRounds: "Jumlah pusingan", stBooks: "Jumlah buku", stAvg: "Purata seorang",
  stWeek: "Minggu ini", stMonth: "Bulan ini", readRank: "Papan pendahulu bacaan", rankLine: (w, t) => `Minggu ini ${w} · Jumlah <b class="trd">${t}</b> buku`,
  wheel: "Roda bertuah", close: "Tutup", wheelPh: (a, b) => `Satu setiap baris, ${a}-${b} item`, wheelTip: "✏️ Senarai murid kelas ini digunakan dahulu. Anda boleh tukar kepada apa-apa pilihan, satu setiap baris.",
  wheelMake: "✨ Jana roda", wheelFill: "👥 Guna senarai murid", spin: "Putar", notPicked: (r, t) => `📋 Belum terpilih (${r}/${t})`, allPicked: "🎊 Semua sudah terpilih!",
  wheelMin: n => `⚠️ Perlu sekurang-kurangnya ${n} item`, wheelMax: n => `⚠️ Paling banyak ${n} item`, wheelReady: n => `✅ ${n} item. Tekan butang di tengah untuk memutar.`,
  timer: "Pemasa", timeUp: "Masa tamat!", minU: "minit", secU: "saat", secs: n => `${n} saat`, mins: n => `${n} minit`, pause: "Jeda", resume: "Sambung", start: "Mula", addMin: "+1 minit", reset: "Set semula"
},

ta: {
  appTitle: "வகுப்பறை நாயகர்கள்", login: "உள்நுழை", logout: "வெளியேறு", username: "பயனர் பெயர்", password: "கடவுச்சொல்", teacherName: "ஆசிரியர் பெயர்", createTeacher: "கணக்கு உருவாக்கு",
  students: "மாணவர்கள்", addStudent: "மாணவரைச் சேர்", importStudents: "இறக்குமதி", studentName: "மாணவர் பெயர்", activities: "செயல்பாடுகள்", addActivity: "செயல்பாட்டைச் சேர்", points: "புள்ளிகள்", total: "மொத்தம்",
  save: "சேமி", cancel: "ரத்து", edit: "திருத்து", noActivities: "இன்னும் செயல்பாடுகள் இல்லை", noStudents: "இன்னும் மாணவர்கள் இல்லை", addClass: "வகுப்பைச் சேர்", className: "வகுப்பின் பெயர்", noClasses: "வகுப்புகள் இல்லை",
  welcomeMessage: "வரவேற்கிறோம்! தொடங்க ஒரு வகுப்பை உருவாக்குங்கள்", createFirstClass: "வகுப்பை உருவாக்கு", switchClass: "வகுப்பை மாற்று", exportData: "ஏற்றுமதி", importData: "இறக்குமதி",
  dataExported: "ஏற்றுமதி செய்யப்பட்டது!", dataImported: "இறக்குமதி செய்யப்பட்டது!", invalidFile: "தவறான கோப்பு", showAll: "அனைத்தும்", filterBy: "வடிகட்டு", leaderboard: "தரவரிசை",
  teacherMode: "நிர்வாகம்", classOverview: "மேலோட்டம்", studentProgress: "முன்னேற்றம்", reading: "வாசிப்பு", selectStudent: "மாணவரைத் தேர்ந்தெடுங்கள்", noHistory: "இன்னும் பதிவுகள் இல்லை", dailyTotal: "தினசரி மொத்தம்",
  back: "பின்செல்", activityName: "செயல்பாட்டின் பெயர்", pointValue: "புள்ளிகள்", icon: "சின்னம்", color: "நிறம்", pasteHere: "பெயர்களை ஒட்டுங்கள் (ஒரு வரிக்கு ஒன்று, அல்லது காற்புள்ளியால் பிரித்து)",
  backupTitle: "காப்புப்பிரதி நினைவூட்டல்", backupMessage: "தரவு இந்த உலாவியில் சேமிக்கப்பட்டுள்ளது. காப்புப்பிரதியைப் பதிவிறக்குங்கள்.", backupNow: "பதிவிறக்கு", backupLater: "பிறகு",
  ptsPer: n => `ஒவ்வொரு முறைக்கும் ${n} புள்ளிகள்`, language: "மொழி",
  tapHint: "👆 புள்ளி சேர்க்க பொத்தானை அழுத்துங்கள் · ஒன்றைக் குறைக்க வலது-கிளிக் அல்லது நீண்ட அழுத்தம்", chipTitle: (a, n) => `${a}: அழுத்தினால் +${n}, வலது-கிளிக் அல்லது நீண்ட அழுத்தம் −${n}`, delStudent: "மாணவரை நீக்கு", undo: "செயல்தவிர்",
  wrongLogin: "பயனர் பெயர் அல்லது கடவுச்சொல் தவறு", fillAll: "எல்லா புலங்களையும் நிரப்புங்கள்", userExists: "பயனர் பெயர் ஏற்கனவே உள்ளது", confirm: "உறுதியா?",
  errBadToken: "அமர்வு காலாவதியானது. மீண்டும் உள்நுழையுங்கள்.", errNetwork: "சேவையகத்தை அணுக முடியவில்லை. இணைய இணைப்பைச் சரிபாருங்கள்.",
  syncPending: "⏳ ஒத்திசைக்கக் காத்திருக்கிறது", syncSaving: "☁️ ஒத்திசைக்கிறது…", syncSaved: "✅ Google Sheet உடன் ஒத்திசைக்கப்பட்டது", syncError: "⚠️ ஒத்திசைவு தோல்வி, மீண்டும் முயல அழுத்துங்கள்", syncLoading: "☁️ ஏற்றுகிறது…",
  readTitle: "வாசிப்புப் பதிவு", readHint: n => `பதிவு செய்ய புத்தகத்தை அழுத்துங்கள். ${n} புத்தகங்கள் = 1 சுற்று 🏅. வாசிப்பு தனியாகக் கணக்கிடப்படும், புள்ளிகளில் சேராது.`, roundUnit: "சுற்றுகள்", bookTick: "பதிவு செய்ய அழுத்துங்கள்", bookUntick: "ரத்து செய்ய அழுத்துங்கள்",
  roundDone: name => `🎉 ${name} ஒரு வாசிப்புச் சுற்றை முடித்தார்!`, readStats: "வகுப்பு வாசிப்புப் புள்ளிவிவரம்", stStudents: "மாணவர்கள்", stRounds: "மொத்தச் சுற்றுகள்", stBooks: "வாசித்த புத்தகங்கள்", stAvg: "சராசரி",
  stWeek: "இந்த வாரம்", stMonth: "இந்த மாதம்", readRank: "வாசிப்புத் தரவரிசை", rankLine: (w, t) => `இந்த வாரம் ${w} · மொத்தம் <b class="trd">${t}</b> புத்தகங்கள்`,
  wheel: "அதிர்ஷ்டச் சக்கரம்", close: "மூடு", wheelPh: (a, b) => `ஒரு வரிக்கு ஒன்று, ${a}-${b} உருப்படிகள்`, wheelTip: "✏️ இந்த வகுப்பின் மாணவர் பட்டியலுடன் தொடங்குகிறது. எதையும் மாற்றலாம், ஒரு வரிக்கு ஒன்று.",
  wheelMake: "✨ சக்கரத்தை உருவாக்கு", wheelFill: "👥 வகுப்புப் பட்டியலைப் பயன்படுத்து", spin: "சுழற்று", notPicked: (r, t) => `📋 இன்னும் தேர்வாகாதவர்கள் (${r}/${t})`, allPicked: "🎊 அனைவரும் தேர்வாகிவிட்டனர்!",
  wheelMin: n => `⚠️ குறைந்தது ${n} உருப்படிகள் தேவை`, wheelMax: n => `⚠️ அதிகபட்சம் ${n} உருப்படிகள்`, wheelReady: n => `✅ ${n} உருப்படிகள். சுழற்ற நடுவில் உள்ள பொத்தானை அழுத்துங்கள்.`,
  timer: "நேரக் கணிப்பான்", timeUp: "நேரம் முடிந்தது!", minU: "நிமி", secU: "வினா", secs: n => `${n} வினாடி`, mins: n => `${n} நிமிடம்`, pause: "இடைநிறுத்து", resume: "தொடர்", start: "தொடங்கு", addMin: "+1 நிமிடம்", reset: "மீட்டமை"
}
};

function detectLang() {
  try { const v = localStorage.getItem('ch_lang'); if (I18N[v]) return v; } catch { }
  const n = (navigator.language || '').toLowerCase();
  return n.startsWith('en') ? 'en' : n.startsWith('ms') ? 'ms' : n.startsWith('ta') ? 'ta' : 'zh';
}
// 语音功能已移除：清掉它以前存在浏览器里的设置（包括老师填过的 AI 密钥）
try { Object.keys(localStorage).filter(k => k.startsWith('ch_voice')).forEach(k => localStorage.removeItem(k)); } catch { }

let LANG = detectLang();
let T = { ...I18N.zh, ...I18N[LANG] };
document.documentElement.lang = HTML_LANG[LANG];
document.title = T.appTitle;

function setLang(l) {
  if (!I18N[l]) return;
  LANG = l; T = { ...I18N.zh, ...I18N[l] };
  try { localStorage.setItem('ch_lang', l); } catch { }
  document.documentElement.lang = HTML_LANG[l];
  document.title = T.appTitle;
  render();
  if (typeof setSync === 'function' && S.sync) setSync(S.sync);
}

// 语言切换器：主页顶部的一排小按钮
function renderLangSwitch() {
  return `<div class="lsw" role="group" aria-label="${T.language}">${LANGS.map(([k, n]) => `<button class="${k === LANG ? 'on' : ''}" data-lang="${k}" lang="${k}">${n}</button>`).join('')}</div>`;
}

const IC = { Star: "⭐", Trophy: "🏆", Book: "📚", Sparkles: "✨", Award: "🎖️", Users: "👥" };
const CO = ['bgb-c', 'bgg-c', 'bgp-c', 'bgo-c', 'bgr-c', 'bgk-c', 'bgy-c'];
