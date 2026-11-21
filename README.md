<h1>课堂英雄 · Class Heroes · Wira Kelas · வகுப்பறை நாயகர்கள்</h1>

[华文](#华文) · [English](#english) · [Bahasa Melayu](#bahasa-melayu) · [தமிழ்](#தமிழ்)

---

## 华文

课堂英雄是给老师用的课堂积分网页：给学生的课堂活动加分、记录阅读，查看每个学生的进度和班级排行榜。数据存到 Google Sheets，换电脑、换手机都能接着用。

### 功能

- **账号与云端同步**：每位老师注册自己的账号，数据自动同步到 Google Sheet，页面左下角会显示同步状态。
- **多个班级**：可以添加、改名、换颜色、删除班级，顶部下拉菜单随时切换。
- **活动**：自定义活动名称、分值、图标和颜色，比如“听写满分 10 分”“按时交功课 5 分”。
- **学生**：可以逐个添加，也可以一次粘贴整份名单导入。
- **加分**（管理页）：每个学生一行，每个活动一个按钮。点一下加分，右键或长按减一次，每次操作后都可以撤销。
- **概览**：按活动、按日期查看全班的加分记录，还可以导出、导入 JSON 备份。
- **进度**：查看单个学生每项活动、每一天的得分表。
- **排行榜**：全班总分排名，也可以只看某一项活动。
- **阅读打卡**：点书本打卡，满 10 本算 1 轮。有本周、本月阅读统计和阅读榜。阅读记录单独统计，不计入积分。
- **幸运转盘**：默认用本班学生名单，也可以改成任何选项。抽过的人不会重复，剩下的名单会显示出来。
- **倒计时**：有常用时长可选，也可以自己设定，能暂停、加 1 分钟。关掉弹窗也会继续计时，时间到会响铃提醒。
- **备份提醒**：每改动 30 次，会提醒下载一次备份。
- **四种界面语言**：页面左上角可以切换华文、English、Melayu、தமிழ்。

### 部署

这是一个纯静态网页，放到 GitHub Pages 就能用。要把数据存到 Google Sheets，请按 [`gas/README.md`](gas/README.md) 的步骤部署 Apps Script，再把网址填进 `js/config.js`。`API_URL` 留空的话，数据只保存在浏览器里。

---

## English

Class Heroes is a classroom points website for teachers. Award points for class activities, log reading, and see each student's progress and the class leaderboard. Data is saved to Google Sheets, so you can carry on from any computer or phone.

### Features

- **Accounts and cloud sync**: each teacher has their own account. Data syncs to Google Sheets automatically, and the sync status is shown at the bottom left.
- **Multiple classes**: add, rename, recolour and delete classes, and switch between them from the menu at the top.
- **Activities**: set your own name, points, icon and colour, e.g. "Spelling full marks, 10 pts" or "Homework on time, 5 pts".
- **Students**: add them one by one, or paste a whole class list at once.
- **Awarding points** (Manage page): one row per student with one button per activity. Tap to add points, right-click or long-press to take one away. Every change can be undone.
- **Overview**: the whole class's records by activity and date, plus JSON export and import for backups.
- **Progress**: one student's points per activity, per day.
- **Leaderboard**: class ranking by total points, or by a single activity.
- **Reading log**: tap a book to log it, and 10 books make 1 round. Includes weekly and monthly stats and a reading leaderboard. Reading is tracked separately and does not count towards points.
- **Lucky wheel**: starts with the class list, or use any options you like. Picked names are not repeated, and the remaining names are shown.
- **Timer**: preset or custom durations, with pause and +1 minute. It keeps running when the window is closed and beeps when time is up.
- **Backup reminder**: after every 30 changes, you are reminded to download a backup.
- **Four interface languages**: switch at the top left between 华文, English, Melayu and தமிழ்.

### Setup

This is a static website and runs on GitHub Pages. To store data in Google Sheets, deploy the Apps Script following [`gas/README.en.md`](gas/README.en.md) and put its URL in `js/config.js`. If `API_URL` is empty, data stays in the browser only.

---

## Bahasa Melayu

Wira Kelas ialah laman web mata kelas untuk guru. Beri mata untuk aktiviti kelas, rekod bacaan, dan lihat kemajuan setiap murid serta papan pendahulu kelas. Data disimpan dalam Google Sheets, jadi anda boleh menyambung kerja dari mana-mana komputer atau telefon.

### Ciri-ciri

- **Akaun dan penyegerakan awan**: setiap guru ada akaun sendiri. Data disegerakkan ke Google Sheets secara automatik, dan status penyegerakan dipaparkan di bahagian bawah kiri.
- **Beberapa kelas**: tambah, tukar nama, tukar warna dan padam kelas, serta tukar antara kelas melalui menu di bahagian atas.
- **Aktiviti**: tetapkan nama, mata, ikon dan warna sendiri, contohnya "Ejaan penuh, 10 mata" atau "Kerja rumah siap, 5 mata".
- **Murid**: tambah seorang demi seorang, atau tampal seluruh senarai kelas sekali gus.
- **Memberi mata** (halaman Urus): satu baris untuk setiap murid, dengan satu butang untuk setiap aktiviti. Tekan untuk tambah mata, klik kanan atau tekan lama untuk tolak satu. Setiap perubahan boleh dibuat asal.
- **Ringkasan**: rekod seluruh kelas mengikut aktiviti dan tarikh, serta eksport dan import JSON untuk sandaran.
- **Kemajuan**: mata seorang murid bagi setiap aktiviti, setiap hari.
- **Papan pendahulu**: kedudukan kelas mengikut jumlah mata, atau mengikut satu aktiviti.
- **Rekod bacaan**: tekan buku untuk merekod, dan 10 buku = 1 pusingan. Ada statistik mingguan dan bulanan serta papan pendahulu bacaan. Bacaan dikira berasingan dan tidak termasuk dalam mata.
- **Roda bertuah**: menggunakan senarai murid kelas, atau apa-apa pilihan anda. Nama yang sudah terpilih tidak diulang, dan nama yang belum terpilih dipaparkan.
- **Pemasa**: tempoh pilihan atau tetapan sendiri, dengan jeda dan +1 minit. Pemasa terus berjalan walaupun tetingkap ditutup, dan berbunyi apabila masa tamat.
- **Peringatan sandaran**: selepas setiap 30 perubahan, anda diingatkan untuk memuat turun sandaran.
- **Empat bahasa paparan**: tukar di bahagian atas kiri antara 华文, English, Melayu dan தமிழ்.

### Pemasangan

Ini laman web statik dan boleh dijalankan di GitHub Pages. Untuk menyimpan data dalam Google Sheets, pasang Apps Script mengikut [`gas/README.ms.md`](gas/README.ms.md) dan masukkan URL-nya dalam `js/config.js`. Jika `API_URL` dibiarkan kosong, data hanya disimpan dalam pelayar.

---

## தமிழ்

வகுப்பறை நாயகர்கள் என்பது ஆசிரியர்களுக்கான வகுப்புப் புள்ளி இணையதளம். வகுப்புச் செயல்பாடுகளுக்குப் புள்ளிகள் வழங்கலாம், வாசிப்பைப் பதிவு செய்யலாம், ஒவ்வொரு மாணவரின் முன்னேற்றத்தையும் வகுப்புத் தரவரிசையையும் பார்க்கலாம். தரவு Google Sheets-இல் சேமிக்கப்படுவதால், எந்தக் கணினியிலிருந்தும் தொலைபேசியிலிருந்தும் தொடரலாம்.

### அம்சங்கள்

- **கணக்கும் மேகக்கணி ஒத்திசைவும்**: ஒவ்வொரு ஆசிரியருக்கும் தனிக் கணக்கு உண்டு. தரவு தானாக Google Sheets-உடன் ஒத்திசைக்கப்படும். ஒத்திசைவு நிலை கீழ் இடப்பக்கத்தில் காட்டப்படும்.
- **பல வகுப்புகள்**: வகுப்புகளைச் சேர்க்கலாம், பெயர் மாற்றலாம், நிறம் மாற்றலாம், நீக்கலாம். மேலே உள்ள பட்டியலில் வகுப்புகளுக்கு இடையே மாறலாம்.
- **செயல்பாடுகள்**: பெயர், புள்ளிகள், சின்னம், நிறம் ஆகியவற்றை நீங்களே அமைக்கலாம், எ.கா. "எழுத்துக்கூட்டல் முழு மதிப்பெண், 10 புள்ளிகள்".
- **மாணவர்கள்**: ஒவ்வொருவராகச் சேர்க்கலாம், அல்லது முழு வகுப்புப் பட்டியலையும் ஒரே நேரத்தில் ஒட்டலாம்.
- **புள்ளி வழங்குதல்** (நிர்வாகப் பக்கம்): ஒவ்வொரு மாணவருக்கும் ஒரு வரி, ஒவ்வொரு செயல்பாட்டுக்கும் ஒரு பொத்தான். அழுத்தினால் புள்ளி சேரும். வலது-கிளிக் அல்லது நீண்ட அழுத்தம் ஒன்றைக் குறைக்கும். ஒவ்வொரு மாற்றத்தையும் செயல்தவிர்க்கலாம்.
- **மேலோட்டம்**: முழு வகுப்பின் பதிவுகளைச் செயல்பாடு, தேதி வாரியாகப் பார்க்கலாம். காப்புப்பிரதிக்கு JSON ஏற்றுமதி, இறக்குமதி வசதியும் உண்டு.
- **முன்னேற்றம்**: ஒரு மாணவர் ஒவ்வொரு செயல்பாட்டிலும் ஒவ்வொரு நாளும் பெற்ற புள்ளிகள்.
- **தரவரிசை**: மொத்தப் புள்ளிகள் அல்லது ஒரு செயல்பாட்டின்படி வகுப்புத் தரவரிசை.
- **வாசிப்புப் பதிவு**: புத்தகத்தை அழுத்திப் பதிவு செய்யலாம். 10 புத்தகங்கள் = 1 சுற்று. வாராந்திர, மாதாந்திரப் புள்ளிவிவரங்களும் வாசிப்புத் தரவரிசையும் உண்டு. வாசிப்பு தனியாகக் கணக்கிடப்படும், புள்ளிகளில் சேராது.
- **அதிர்ஷ்டச் சக்கரம்**: வகுப்பின் மாணவர் பட்டியலுடன் தொடங்கும், விரும்பிய எதையும் சேர்க்கலாம். தேர்வானவர்கள் மீண்டும் வர மாட்டார்கள், மீதமுள்ளவர்களின் பட்டியல் காட்டப்படும்.
- **நேரக் கணிப்பான்**: முன்னமைக்கப்பட்ட அல்லது விருப்ப நேரம், இடைநிறுத்தம், +1 நிமிடம் வசதிகளுடன். சாளரத்தை மூடினாலும் ஓடிக்கொண்டிருக்கும், நேரம் முடிந்ததும் ஒலிக்கும்.
- **காப்புப்பிரதி நினைவூட்டல்**: ஒவ்வொரு 30 மாற்றங்களுக்குப் பிறகும் காப்புப்பிரதியைப் பதிவிறக்க நினைவூட்டும்.
- **நான்கு இடைமுக மொழிகள்**: மேல் இடப்பக்கத்தில் 华文, English, Melayu, தமிழ் ஆகியவற்றுக்கு இடையே மாற்றலாம்.

### அமைப்பு

இது ஒரு நிலையான (static) இணையதளம், GitHub Pages-இல் இயங்கும். தரவை Google Sheets-இல் சேமிக்க, [`gas/README.ta.md`](gas/README.ta.md) படி Apps Script-ஐ நிறுவி, அதன் URL-ஐ `js/config.js`-இல் சேருங்கள். `API_URL` காலியாக இருந்தால், தரவு உலாவியில் மட்டுமே சேமிக்கப்படும்.
