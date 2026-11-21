[华文](README.md) · [English](README.en.md) · [Bahasa Melayu](README.ms.md) · [தமிழ்](README.ta.md)

# Simpan data dalam Google Sheets

1. Cipta Google Sheet baharu (nama bebas, contohnya "Data Wira Kelas").
2. Buka menu **Sambungan → Apps Script** (*Extensions → Apps Script*), padam kod yang sedia ada dalam editor, tampal semua kandungan `Code.gs` dari folder ini, kemudian tekan Ctrl+S untuk simpan.
3. Di bahagian atas kanan, klik **Gunakan → Penggunaan baharu** (*Deploy → New deployment*) dan pilih jenis **Apl web** (*Web app*):
   - Laksanakan sebagai (*Execute as*): **Saya** (*Me*)
   - Siapa yang mempunyai akses (*Who has access*): **Sesiapa sahaja** (*Anyone*)
4. Klik **Gunakan** (*Deploy*) dan berikan kebenaran apabila diminta. Mesej "Google belum mengesahkan apl ini" akan dipaparkan. Klik **Lanjutan → Pergi ke … (tidak selamat)** (*Advanced → Go to … (unsafe)*). Ini skrip anda sendiri.
5. Salin **URL apl web** (berakhir dengan `/exec`), tampal di antara tanda petikan `API_URL = '…'` dalam `js/config.js`, kemudian simpan dan muat naik.

Selepas itu, daftar akaun baharu di laman web. Akaun awan berasingan daripada akaun lama yang disimpan dalam pelayar.
Jika anda mendaftar pada komputer yang sama dengan nama pengguna yang sama, data lama dalam pelayar akan dipindahkan ke Sheet secara automatik.

Setiap kali anda mengubah `Code.gs`, gunakan semula melalui **Gunakan → Urus penggunaan → Sunting → Versi: Versi baharu** (*Deploy → Manage deployments → Edit → Version: New version*). URL tidak berubah.

Helaian (tab) berikut dicipta secara automatik. Namanya dalam bahasa Cina kerana skrip menciptanya begitu:
- `teachers`: akaun (kata laluan hanya disimpan sebagai cincang bergaram, bukan teks biasa)
- `data`: data penuh setiap guru (digunakan oleh program, jangan sunting secara manual)
- `Points overview` (ringkasan mata): kiraan dan mata setiap murid bagi setiap aktiviti. Boleh dilihat, ditapis dan dibuat carta terus.
- `classes`: padanan antara kelas dan tab (digunakan oleh program)
- **Dua tab bagi setiap kelas**: contohnya "4A" untuk mata (murid, kiraan setiap aktiviti, jumlah), dan "4A · Reading" untuk rekod bacaan (kemajuan semasa, pusingan selesai, jumlah buku, rekod terakhir). Kedua-duanya berasingan. Tab muncul beberapa saat selepas kelas dicipta, dan akan ditukar nama atau dipadam bersama kelas. Tab ini dijana oleh program dan hanya untuk dilihat. Suntingan manual akan ditulis ganti apabila data disimpan semula.
- **Guna bahasa sendiri**: nama tab dan tajuk lajur dalam bahasa Inggeris secara lalai. Buka `Code.gs` dan ubah `LABELS` di bahagian atas; komen `/* */` selepas setiap baris ada cadangan bahasa Cina, Melayu dan Tamil. Simpan, kemudian gunakan semula (Deploy → Manage deployments → Edit → Version: New version). Tab dengan nama lama akan ditukar nama secara automatik apabila data disimpan semula.

> Selepas mengemas kini `Code.gs`, ingat untuk menggunakan versi baharu (lihat nota selepas langkah 5).
