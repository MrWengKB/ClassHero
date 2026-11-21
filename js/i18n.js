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
  timer: "倒计时", timeUp: "时间到！", minU: "分", secU: "秒", secs: n => `${n} 秒`, mins: n => `${n} 分钟`, pause: "暂停", resume: "继续", start: "开始", addMin: "+1 分钟", reset: "重置",
  // 语音加分
  vTitle: "语音加分", vMicTitle: "语音加分：点一下，说「姓名 + 活动」", vLangTitle: "识别语言", vTypeHere: "也可以在这里打字", vSend: "发送",
  vIntro: (ex, kw) => `点 🎤 后说「姓名 + 活动」，例如「${ex}」。可以一次说几个人，也可以说 ${kw}。`, vKw: "「扣」「两次」「全班」",
  vHelp: ex => `请按「学生姓名 + 活动名称」来说，例如「${ex}」。`, vActsList: l => `本班活动：${l}。`, vSep: "、", vLineSep: "；",
  vTimes: n => `（${n} 次）`, vUndone: l => `↩ 已撤销：${l}`, vNothingToRemove: "⚠️ 没有可以扣的分（次数已经是 0）",
  vNoData: "⚠️ 本班还没有学生或活动，先在「管理」页添加。", vFuzzy: "✅（按近似读音匹配）", vNotUnderstood: (why, help) => `🤔 没听懂（${why}）。${help} 想说得更随意，可以点 ⚙️ 填写 AI 接口。`,
  vWhyEmpty: "没有听到内容", vWhyStudent: "没找到学生姓名", vWhyActivity: "没找到活动名称", vWhyPair: "学生和活动没能对应上",
  vAskingAI: "🤖 规则没对上，正在请 AI 理解…", vAIResult: "🤖 AI 理解为：", vAINo: (note, help) => `🤔 AI 也没看懂${note ? '（' + note + '）' : ''}。${help}`, vAIError: (m, help) => `⚠️ AI 接口出错：${m}。${help}`,
  vErrRefusal: "模型拒绝回答", vErrTimeout: "等待超时", vErrConnect: "连不上接口（网址不对，或该服务不允许网页直接调用）", vErrJson: "AI 返回的不是 JSON",
  vNoSR: "⚠️ 这个浏览器不支持语音识别，请用 Chrome、Edge（电脑或安卓手机）或 iPhone 的 Safari。也可以在下面直接打字。", vListening: "👂 正在听…请说「姓名 + 活动」",
  vMicDenied: "麦克风权限被拒绝，请在地址栏左侧允许使用麦克风", vNoSpeech: "没听到声音，再点一次 🎤 试试", vNoMic: "没有找到麦克风", vNetErr: "语音识别需要联网，请检查网络",
  vSRErr: e => `语音识别出错：${e}`, vNotHeard: "没听清，再点一次 🎤 试试",
  vAIOn: name => `🤖 规则看不懂时会请 AI 理解（${name}）`, vAIOff: "只按规则理解。点 ⚙️ 可以接入自己的 AI，说法更自由。", vSettings: "AI 设置",
  vSetTitle: "⚙️ 语音指令 · AI 设置（可选）", vSetIntro: "不填也能用：按「学生姓名 + 活动名称」说就行。填了以后，规则看不懂的话会交给 AI 理解，比如「小明今天听写全对，给他加一下」。",
  vProvider: "服务商", vBase: "接口地址", vModel: "模型名称", vKey: "API 密钥",
  vPrivacy: "🔒 密钥只保存在这台电脑的浏览器里，不会上传到课堂英雄或 Google 表格，换电脑需要重新填写。使用 AI 时，你说的那句话、本班学生姓名和活动名称会发送给所选的服务商。",
  vTest: "测试连接", vClear: "清除", vSaved: "✅ 已保存 AI 设置", vSavedNoKey: "已保存（未填密钥，只按规则理解）", vCleared: "已清除，只按规则理解",
  vFillAll: "⚠️ 请填写接口地址、模型名称和密钥", vTesting: "⏳ 正在测试…", vTestOk: n => `✅ 连接成功，AI 返回了 ${n} 条操作（测试不会加分）`,
  vOther: "其他（OpenAI 兼容接口）", vStopped: "已停止。再点 🎤 重新开始。", vNoResponse: "⚠️ 语音识别没有回应。请用 Chrome、Edge（电脑或安卓手机）或 iPhone 的 Safari 打开本网站（应用里的内置浏览器、Brave、Firefox 都不行），并确认麦克风可用。也可以在下面打字。", vSvcDenied: "语音识别服务没有开启。iPhone/iPad/Mac：到 设置 → Siri（或 键盘）里打开“听写”。安卓：到 设置 → 应用 → Google，给“麦克风”权限。", vIOSSafari: "iPhone/iPad 上的 Chrome、Edge 等浏览器不能用语音识别，请改用 Safari 打开本网站。", vNoteLang: "中文"
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
  timer: "Timer", timeUp: "Time's up!", minU: "min", secU: "sec", secs: n => `${n} sec`, mins: n => `${n} min`, pause: "Pause", resume: "Resume", start: "Start", addMin: "+1 min", reset: "Reset",
  vTitle: "Voice points", vMicTitle: "Voice points: tap and say \"name + activity\"", vLangTitle: "Speech language", vTypeHere: "Or type here", vSend: "Send",
  vIntro: (ex, kw) => `Tap 🎤 and say "name + activity", e.g. "${ex}". You can name several students at once, or say ${kw}.`, vKw: '"minus" "twice" "whole class"',
  vHelp: ex => `Please say "student name + activity name", e.g. "${ex}".`, vActsList: l => `Activities in this class: ${l}.`, vSep: ", ", vLineSep: "; ",
  vTimes: n => ` (${n} times)`, vUndone: l => `↩ Undone: ${l}`, vNothingToRemove: "⚠️ Nothing to take away (count is already 0)",
  vNoData: "⚠️ This class has no students or activities yet. Add them on the Manage page first.", vFuzzy: "✅ (closest match) ", vNotUnderstood: (why, help) => `🤔 Not understood (${why}). ${help} To speak more freely, tap ⚙️ and add an AI service.`,
  vWhyEmpty: "nothing heard", vWhyStudent: "no student name found", vWhyActivity: "no activity name found", vWhyPair: "could not match students to activities",
  vAskingAI: "🤖 Rules did not match, asking the AI…", vAIResult: "🤖 AI understood: ", vAINo: (note, help) => `🤔 The AI did not understand either${note ? ' (' + note + ')' : ''}. ${help}`, vAIError: (m, help) => `⚠️ AI error: ${m}. ${help}`,
  vErrRefusal: "the model declined to answer", vErrTimeout: "timed out", vErrConnect: "cannot connect (wrong address, or the service does not allow calls from web pages)", vErrJson: "the AI did not return JSON",
  vNoSR: "⚠️ This browser does not support speech recognition. Please use Chrome or Edge (computer or Android) or Safari on iPhone, or type below.", vListening: "👂 Listening… say \"name + activity\"",
  vMicDenied: "Microphone blocked. Allow it from the icon on the left of the address bar.", vNoSpeech: "Nothing heard. Tap 🎤 to try again.", vNoMic: "No microphone found", vNetErr: "Speech recognition needs an internet connection",
  vSRErr: e => `Speech recognition error: ${e}`, vNotHeard: "Didn't catch that. Tap 🎤 to try again.",
  vAIOn: name => `🤖 The AI helps when the rules don't understand (${name})`, vAIOff: "Rules only. Tap ⚙️ to connect your own AI for freer commands.", vSettings: "AI settings",
  vSetTitle: "⚙️ Voice commands · AI settings (optional)", vSetIntro: "Works without this: just say \"student name + activity name\". With an AI service, commands the rules don't understand are passed to the AI, e.g. \"Tom got all his spelling right today, give him the points\".",
  vProvider: "Provider", vBase: "API address", vModel: "Model name", vKey: "API key",
  vPrivacy: "🔒 The key stays in this browser only. It is not uploaded to Class Heroes or Google Sheets, so you need to enter it again on another computer. When the AI is used, what you said plus this class's student and activity names are sent to the chosen provider.",
  vTest: "Test", vClear: "Clear", vSaved: "✅ AI settings saved", vSavedNoKey: "Saved (no key, rules only)", vCleared: "Cleared, rules only",
  vFillAll: "⚠️ Please fill in the address, model and key", vTesting: "⏳ Testing…", vTestOk: n => `✅ Connected. The AI returned ${n} action(s) (the test adds no points).`,
  vOther: "Other (OpenAI-compatible)", vStopped: "Stopped. Tap 🎤 to start again.", vNoResponse: "⚠️ Speech recognition is not responding. Please open this site in Chrome or Edge (computer or Android) or Safari on iPhone (built-in app browsers, Brave and Firefox do not work) and check your microphone. You can also type below.", vSvcDenied: "Speech recognition service is off. iPhone/iPad/Mac: turn on Dictation in Settings → Siri (or Keyboard). Android: Settings → Apps → Google → allow Microphone.", vIOSSafari: "On iPhone/iPad, Chrome, Edge and other browsers cannot use speech recognition. Please open this site in Safari.", vNoteLang: "English"
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
  timer: "Pemasa", timeUp: "Masa tamat!", minU: "minit", secU: "saat", secs: n => `${n} saat`, mins: n => `${n} minit`, pause: "Jeda", resume: "Sambung", start: "Mula", addMin: "+1 minit", reset: "Set semula",
  vTitle: "Mata melalui suara", vMicTitle: "Mata melalui suara: tekan dan sebut \"nama + aktiviti\"", vLangTitle: "Bahasa pertuturan", vTypeHere: "Atau taip di sini", vSend: "Hantar",
  vIntro: (ex, kw) => `Tekan 🎤 dan sebut "nama + aktiviti", contohnya "${ex}". Boleh sebut beberapa murid sekali gus, atau sebut ${kw}.`, vKw: '"tolak" "dua kali" "semua"',
  vHelp: ex => `Sila sebut "nama murid + nama aktiviti", contohnya "${ex}".`, vActsList: l => `Aktiviti kelas ini: ${l}.`, vSep: ", ", vLineSep: "; ",
  vTimes: n => ` (${n} kali)`, vUndone: l => `↩ Dibatalkan: ${l}`, vNothingToRemove: "⚠️ Tiada mata untuk ditolak (kiraan sudah 0)",
  vNoData: "⚠️ Kelas ini belum ada murid atau aktiviti. Tambah dahulu di halaman Urus.", vFuzzy: "✅ (padanan terdekat) ", vNotUnderstood: (why, help) => `🤔 Tidak faham (${why}). ${help} Untuk bercakap dengan lebih bebas, tekan ⚙️ dan tambah perkhidmatan AI.`,
  vWhyEmpty: "tiada apa-apa didengar", vWhyStudent: "nama murid tidak dijumpai", vWhyActivity: "nama aktiviti tidak dijumpai", vWhyPair: "murid dan aktiviti tidak dapat dipadankan",
  vAskingAI: "🤖 Peraturan tidak sepadan, sedang bertanya kepada AI…", vAIResult: "🤖 Kefahaman AI: ", vAINo: (note, help) => `🤔 AI juga tidak faham${note ? ' (' + note + ')' : ''}. ${help}`, vAIError: (m, help) => `⚠️ Ralat AI: ${m}. ${help}`,
  vErrRefusal: "model enggan menjawab", vErrTimeout: "masa menunggu tamat", vErrConnect: "tidak dapat disambungkan (alamat salah, atau perkhidmatan tidak membenarkan panggilan dari laman web)", vErrJson: "AI tidak memulangkan JSON",
  vNoSR: "⚠️ Pelayar ini tidak menyokong pengecaman suara. Sila guna Chrome atau Edge (komputer atau Android) atau Safari pada iPhone, atau taip di bawah.", vListening: "👂 Sedang mendengar… sebut \"nama + aktiviti\"",
  vMicDenied: "Mikrofon disekat. Benarkan melalui ikon di sebelah kiri bar alamat.", vNoSpeech: "Tiada suara didengar. Tekan 🎤 untuk cuba lagi.", vNoMic: "Mikrofon tidak dijumpai", vNetErr: "Pengecaman suara memerlukan sambungan internet",
  vSRErr: e => `Ralat pengecaman suara: ${e}`, vNotHeard: "Kurang jelas. Tekan 🎤 untuk cuba lagi.",
  vAIOn: name => `🤖 AI membantu apabila peraturan tidak faham (${name})`, vAIOff: "Peraturan sahaja. Tekan ⚙️ untuk menyambung AI anda sendiri.", vSettings: "Tetapan AI",
  vSetTitle: "⚙️ Arahan suara · Tetapan AI (pilihan)", vSetIntro: "Boleh digunakan tanpa tetapan ini: sebut sahaja \"nama murid + nama aktiviti\". Dengan AI, arahan yang tidak difahami oleh peraturan akan dihantar kepada AI.",
  vProvider: "Penyedia", vBase: "Alamat API", vModel: "Nama model", vKey: "Kunci API",
  vPrivacy: "🔒 Kunci hanya disimpan dalam pelayar ini. Ia tidak dimuat naik ke Wira Kelas atau Google Sheets, jadi perlu diisi semula di komputer lain. Apabila AI digunakan, ayat yang anda sebut serta nama murid dan aktiviti kelas ini dihantar kepada penyedia yang dipilih.",
  vTest: "Uji", vClear: "Kosongkan", vSaved: "✅ Tetapan AI disimpan", vSavedNoKey: "Disimpan (tiada kunci, peraturan sahaja)", vCleared: "Dikosongkan, peraturan sahaja",
  vFillAll: "⚠️ Sila isi alamat, model dan kunci", vTesting: "⏳ Sedang menguji…", vTestOk: n => `✅ Berjaya disambungkan. AI memulangkan ${n} tindakan (ujian tidak menambah mata).`,
  vOther: "Lain-lain (serasi OpenAI)", vStopped: "Dihentikan. Tekan 🎤 untuk mula semula.", vNoResponse: "⚠️ Pengecaman suara tidak bertindak balas. Sila buka laman ini dengan Chrome atau Edge (komputer atau Android) atau Safari pada iPhone (pelayar terbina dalam aplikasi, Brave dan Firefox tidak boleh) dan semak mikrofon. Anda juga boleh menaip di bawah.", vSvcDenied: "Perkhidmatan pengecaman suara tidak aktif. iPhone/iPad/Mac: hidupkan Imlak (Dictation) di Tetapan → Siri (atau Papan Kekunci). Android: Tetapan → Apl → Google → benarkan Mikrofon.", vIOSSafari: "Pada iPhone/iPad, Chrome, Edge dan pelayar lain tidak boleh menggunakan pengecaman suara. Sila buka laman ini dengan Safari.", vNoteLang: "Bahasa Melayu"
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
  timer: "நேரக் கணிப்பான்", timeUp: "நேரம் முடிந்தது!", minU: "நிமி", secU: "வினா", secs: n => `${n} வினாடி`, mins: n => `${n} நிமிடம்`, pause: "இடைநிறுத்து", resume: "தொடர்", start: "தொடங்கு", addMin: "+1 நிமிடம்", reset: "மீட்டமை",
  vTitle: "குரல் மூலம் புள்ளிகள்", vMicTitle: "குரல் மூலம் புள்ளிகள்: அழுத்தி \"பெயர் + செயல்பாடு\" என்று சொல்லுங்கள்", vLangTitle: "பேச்சு மொழி", vTypeHere: "அல்லது இங்கே தட்டச்சு செய்யுங்கள்", vSend: "அனுப்பு",
  vIntro: (ex, kw) => `🎤 அழுத்தி "பெயர் + செயல்பாடு" என்று சொல்லுங்கள், எ.கா. "${ex}". பல மாணவர்களை ஒரே நேரத்தில் சொல்லலாம், அல்லது ${kw} என்று சொல்லலாம்.`, vKw: '"கழி" "2 முறை" "அனைவரும்"',
  vHelp: ex => `"மாணவர் பெயர் + செயல்பாட்டின் பெயர்" என்று சொல்லுங்கள், எ.கா. "${ex}".`, vActsList: l => `இந்த வகுப்பின் செயல்பாடுகள்: ${l}.`, vSep: ", ", vLineSep: "; ",
  vTimes: n => ` (${n} முறை)`, vUndone: l => `↩ செயல்தவிர்க்கப்பட்டது: ${l}`, vNothingToRemove: "⚠️ குறைக்கப் புள்ளிகள் இல்லை (எண்ணிக்கை ஏற்கனவே 0)",
  vNoData: "⚠️ இந்த வகுப்பில் இன்னும் மாணவர்களோ செயல்பாடுகளோ இல்லை. முதலில் நிர்வாகப் பக்கத்தில் சேருங்கள்.", vFuzzy: "✅ (நெருங்கிய பொருத்தம்) ", vNotUnderstood: (why, help) => `🤔 புரியவில்லை (${why}). ${help} இன்னும் சுதந்திரமாகப் பேச ⚙️ அழுத்தி AI சேவையைச் சேருங்கள்.`,
  vWhyEmpty: "எதுவும் கேட்கவில்லை", vWhyStudent: "மாணவர் பெயர் கிடைக்கவில்லை", vWhyActivity: "செயல்பாட்டின் பெயர் கிடைக்கவில்லை", vWhyPair: "மாணவர்களையும் செயல்பாடுகளையும் பொருத்த முடியவில்லை",
  vAskingAI: "🤖 விதிகள் பொருந்தவில்லை, AI-யிடம் கேட்கிறது…", vAIResult: "🤖 AI புரிந்துகொண்டது: ", vAINo: (note, help) => `🤔 AI-க்கும் புரியவில்லை${note ? ' (' + note + ')' : ''}. ${help}`, vAIError: (m, help) => `⚠️ AI பிழை: ${m}. ${help}`,
  vErrRefusal: "மாதிரி பதிலளிக்க மறுத்தது", vErrTimeout: "நேரம் கடந்தது", vErrConnect: "இணைக்க முடியவில்லை (முகவரி தவறு, அல்லது இணையப் பக்கங்களிலிருந்து அழைப்பதை அந்தச் சேவை அனுமதிக்கவில்லை)", vErrJson: "AI JSON தரவில்லை",
  vNoSR: "⚠️ இந்த உலாவி பேச்சு அறிதலை ஆதரிக்கவில்லை. Chrome அல்லது Edge (கணினி அல்லது Android) அல்லது iPhone Safari பயன்படுத்துங்கள், அல்லது கீழே தட்டச்சு செய்யுங்கள்.", vListening: "👂 கேட்கிறது… \"பெயர் + செயல்பாடு\" என்று சொல்லுங்கள்",
  vMicDenied: "ஒலிவாங்கி தடுக்கப்பட்டுள்ளது. முகவரிப் பட்டியின் இடப்பக்கச் சின்னத்தில் அனுமதியுங்கள்.", vNoSpeech: "எதுவும் கேட்கவில்லை. மீண்டும் 🎤 அழுத்துங்கள்.", vNoMic: "ஒலிவாங்கி கிடைக்கவில்லை", vNetErr: "பேச்சு அறிதலுக்கு இணைய இணைப்பு தேவை",
  vSRErr: e => `பேச்சு அறிதல் பிழை: ${e}`, vNotHeard: "சரியாகக் கேட்கவில்லை. மீண்டும் 🎤 அழுத்துங்கள்.",
  vAIOn: name => `🤖 விதிகளுக்குப் புரியாதபோது AI உதவும் (${name})`, vAIOff: "விதிகள் மட்டும். உங்கள் சொந்த AI-ஐ இணைக்க ⚙️ அழுத்துங்கள்.", vSettings: "AI அமைப்புகள்",
  vSetTitle: "⚙️ குரல் கட்டளைகள் · AI அமைப்புகள் (விருப்பம்)", vSetIntro: "இது இல்லாமலும் வேலை செய்யும்: \"மாணவர் பெயர் + செயல்பாட்டின் பெயர்\" என்று சொன்னால் போதும். AI சேர்த்தால், விதிகளுக்குப் புரியாத கட்டளைகள் AI-யிடம் அனுப்பப்படும்.",
  vProvider: "சேவை வழங்குநர்", vBase: "API முகவரி", vModel: "மாதிரியின் பெயர்", vKey: "API சாவி",
  vPrivacy: "🔒 சாவி இந்த உலாவியில் மட்டுமே சேமிக்கப்படும். அது வகுப்பறை நாயகர்கள் அல்லது Google Sheets-க்குப் பதிவேற்றப்படாது, எனவே வேறு கணினியில் மீண்டும் நிரப்ப வேண்டும். AI பயன்படுத்தும்போது, நீங்கள் சொன்னதும் இந்த வகுப்பின் மாணவர், செயல்பாட்டுப் பெயர்களும் தேர்ந்தெடுத்த வழங்குநருக்கு அனுப்பப்படும்.",
  vTest: "சோதி", vClear: "அழி", vSaved: "✅ AI அமைப்புகள் சேமிக்கப்பட்டன", vSavedNoKey: "சேமிக்கப்பட்டது (சாவி இல்லை, விதிகள் மட்டும்)", vCleared: "அழிக்கப்பட்டது, விதிகள் மட்டும்",
  vFillAll: "⚠️ முகவரி, மாதிரி, சாவி மூன்றையும் நிரப்புங்கள்", vTesting: "⏳ சோதிக்கிறது…", vTestOk: n => `✅ இணைக்கப்பட்டது. AI ${n} செயல்களைத் தந்தது (சோதனையில் புள்ளிகள் சேர்க்கப்படாது).`,
  vOther: "பிற (OpenAI இணக்கமானது)", vStopped: "நிறுத்தப்பட்டது. மீண்டும் தொடங்க 🎤 அழுத்துங்கள்.", vNoResponse: "⚠️ பேச்சு அறிதல் பதிலளிக்கவில்லை. Chrome அல்லது Edge (கணினி அல்லது Android) அல்லது iPhone Safari-இல் இந்தத் தளத்தைத் திறங்கள் (செயலிகளுக்குள் உள்ள உலாவி, Brave, Firefox வேலை செய்யாது), ஒலிவாங்கியையும் சரிபாருங்கள். கீழே தட்டச்சும் செய்யலாம்.", vSvcDenied: "பேச்சு அறிதல் சேவை இயக்கப்படவில்லை. iPhone/iPad/Mac: அமைப்புகள் → Siri (அல்லது விசைப்பலகை) என்பதில் Dictation-ஐ இயக்குங்கள். Android: அமைப்புகள் → செயலிகள் → Google → ஒலிவாங்கியை அனுமதியுங்கள்.", vIOSSafari: "iPhone/iPad-இல் Chrome, Edge போன்ற உலாவிகளில் பேச்சு அறிதல் வேலை செய்யாது. இந்தத் தளத்தை Safari-இல் திறங்கள்.", vNoteLang: "தமிழ்"
}
};

function detectLang() {
  try { const v = localStorage.getItem('ch_lang'); if (I18N[v]) return v; } catch { }
  const n = (navigator.language || '').toLowerCase();
  return n.startsWith('en') ? 'en' : n.startsWith('ms') ? 'ms' : n.startsWith('ta') ? 'ta' : 'zh';
}
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
  if (typeof voiceLangChanged === 'function') voiceLangChanged();
}

// 语言切换器：主页顶部的一排小按钮
function renderLangSwitch() {
  return `<div class="lsw" role="group" aria-label="${T.language}">${LANGS.map(([k, n]) => `<button class="${k === LANG ? 'on' : ''}" data-lang="${k}" lang="${k}">${n}</button>`).join('')}</div>`;
}

const IC = { Star: "⭐", Trophy: "🏆", Book: "📚", Sparkles: "✨", Award: "🎖️", Users: "👥" };
const CO = ['bgb-c', 'bgg-c', 'bgp-c', 'bgo-c', 'bgr-c', 'bgk-c', 'bgy-c'];
