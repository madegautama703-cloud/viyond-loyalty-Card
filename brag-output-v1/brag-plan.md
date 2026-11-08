# Brag Plan: Sissi Heritage — Vespera Metal Loyalty Pass & B2B Console

## What is this app?
Aplikasi web Kartu Loyalitas Digital 3D interaktif dan Konsol Kasir/B2B untuk **Sissi Heritage** (*"The Old Corner Hits Differen"*) yang memadukan efek kemiringan giroskop 3-sumbu (`DeviceOrientation`), kilau holografik, grid 8 stempel kopi & croissant yang tersimpan permanen tanpa login (`localStorage`), pemindaian QR kasir (`/kasir`), menu tarik pintasan PWA, serta sinkronisasi langsung ke buku besar B2B Google Sheets.

## The angle
Kartu kertas selalu hilang di saku, sedangkan aplikasi loyalitas kafe selalu memaksa pelanggan mengunduh aplikasi 80MB dan membuat akun. **Sissi Heritage Digital Loyalty Pass** membalik aturan itu: cukup buka di browser, kartu 3D bertekstur metalik-holografik langsung aktif secara anonim di perangkat Anda, miring mengikuti gerakan tangan, berbalik 180° menampilkan 8 stempel kopi & croissant beserta kode QR unik, dan langsung terhubung ke Portal Kasir serta Dasbor B2B merchant.

## Hook (first 2-3 seconds)
Kartu depan **Sissi Heritage** (`/kartu-depan.png`) melayang dalam ruang gelap `#000000` dengan kilau holografik yang bergerak mengikuti sudut kemiringan `Kemiringan -8.4° / +14.2°` dan nama pemilik kartu `PELANGGAN SISSI` di permukaan hijau-zaitun metalik `#4A4928`. Teks pembuka muncul tegas:
**"Tanpa unduh aplikasi. Tanpa login. Cukup balik kartunya."**

## Key moments (the middle)
- **Putaran 3D 180° & Grid 8 Stempel Kopi/Croissant:** Kartu berputar mulus (`rotateY(180deg)`) ke sisi belakang krem (`/kartu-belakang-kosong.png`), memperlihatkan ID pelanggan anonim `ID · SIS-9042-718K`, kode QR dinamis di sudut kanan bawah, dan 8 lingkaran stempel yang terisi satu per satu dengan ilustrasi croissant (`/stamp-roti.png`) dan latte art (`/stamp-kopi.png`) hingga mencapai `8 / 8 Stempel Aktif`, diikuti munculnya laci bawah (*Slide-Up Action Menu*) berisi tombol `Add to Home Screen` & `Email Backup`.
- **Simulasi Alur Kasir QR (`/kasir`):** Tampilan beralih ke **Portal Kasir B2B** (`QR Pelanggan Terdeteksi · SIS-9042-718K`), kursor memilih menu cepat `Iced Latte (Rp 38.000)` dan `Butter Croissant (Rp 32.000)`, lalu menekan tombol `+1 Stempel` yang memicu notifikasi `Pesanan ORD-4821 terkirim & +1 Stempel (8/8)`.
- **Buku Besar B2B & Metrik Bento Real-Time:** Empat kartu KPI bergaya Apple Bento (`Total ID Kartu Aktif`, `Total Stempel Ditukarkan`, `Stempel Aktif Belum Ditukar`, `Hadiah Siap Klaim (8/8)`) beserta tabel pelanggan menyala dengan status `8/8 · Siap Klaim` dan lencana `Powered by Viyond`.

## Outro / punchline
Kartu 3D Sissi Heritage kembali tampil gagah berdampingan dengan lencana `Tersimpan Permanen di Perangkat (Anonim)`.
**"Sissi Heritage Loyalty Pass — The Old Corner Hits Differen."**

## User flow worth showing
1. **Entry:** Pelanggan membuka kartu 3D Sissi Heritage (`SIS-9042-718K`) di browser tanpa login, memiringkan kartu dengan sensor gerak, lalu mengetuk kartu untuk membalik 3D ke sisi belakang (menampilkan grid 8 stempel & QR + laci pintasan PWA).
2. **Key Action:** Di portal `/kasir`, kasir memindai QR pelanggan, memilih *Iced Latte* & *Butter Croissant*, dan menambahkan stempel hingga penuh (`8/8`) dengan ikon stempel croissant & kopi yang terisi berurutan.
3. **Result:** Pelanggan siap menukarkan hadiah gratis (`Hadiah Siap Klaim 8/8`) dan menyimpan pintasan PWA ke layar utama, sementara Dasbor B2B menyinkronkan total stempel & klaim ke Google Sheets secara real-time.

## Tone
- Preset: `polished`
- Creative direction: `Apple-grade dark studio product film meets warm heritage café craft`
- Interpretation: Transisi bersih dan presisi tinggi di atas kanvas hitam pekat `#000000` dan permukaan Bento `#161618`, membiarkan tekstur kartu asli Sissi Heritage (`#4A4928` & `#EFE5D1`) dan aksi UI nyata berbicara tanpa jargon SaaS generik.

## Format: landscape — 1920x1080
## Duration: 20 seconds

## Visual identity (from the project)
- Background: `#000000` (Primary canvas) & `#161618` (Apple Bento glass containers with `rgba(255, 255, 255, 0.08)` border)
- Accent: `#0071E3` / `#2997FF` (Interactive blue), `#4A4928` (Sissi Heritage olive-bronze card front), `#EFE5D1` (Sissi Heritage warm cream card back), `#10B981` / `#34D399` (Emerald local storage & reward-ready accent)
- Text: `#F5F5F7` (Primary light text) & `#86868B` (Muted telemetry/metadata text)
- Display font: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", sans-serif`
- Body font: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", sans-serif` + monospace `JetBrains Mono` / `SF Mono` (`tabular-nums`) for IDs (`SIS-9042-718K`) & tilt degrees
- Strongest visual element: Kartu 3D interaktif `/kartu-depan.png` & `/kartu-belakang-kosong.png` dengan kilau holografik, kemiringan 3-sumbu, dan 8 slot stempel `/stamp-roti.png` & `/stamp-kopi.png`.

## Share copy (draft)
Kartu loyalitas fisik selalu hilang di dompet, aplikasi kafe selalu minta login. Jadi kami membangun Sissi Heritage Digital Loyalty Pass: kartu 3D interaktif dengan sensor gerak, 8 stempel kopi & croissant yang tersimpan permanen tanpa login, portal kasir QR instan, dan buku besar B2B real-time.

## Audio direction
- Role: `cinematic support` / `warm bed`
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (109.96 BPM, steady, clean, modern)
- Music treatment: Mulai pada 0.0s dengan fade-in halus (0.4s) pada volume `0.34`, menjaga ritme 110 BPM sepanjang demonstrasi produk, lalu fade-out lembut di 18.8s–20.0s agar denting penutup terdengar bersih.
- Music cue guidance: Preset cue file dibaca dari `happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.md`. Target strongCue: `4.39s` (putaran 3D kartu ke sisi belakang), `8.74s` (strong_beat 0.99 — peralihan ke Portal Kasir QR), `13.11s` (strong_beat 0.98 — pembukaan Buku Besar B2B), dan `17.47s` (strong_beat 0.99 — outro reveal). Jendela beat-grid: `4.91s, 5.34s, 6.00s, 6.56s, 7.09s` untuk pengisian berurutan stempel ke-4 hingga ke-8.
- Audio-reactive treatment: `subtle`; gunakan energi musik untuk membuat pendaran cahaya panggung (*ambient stage radial glow* `rgba(239,229,209,0.28)`) dan kilau holografik bernafas lembut tanpa grafik waveform/equalizer.
- SFX posture: `sparse` hingga `moderate`; presisi mengikuti aksi nyata pada UI (flip kartu, pop stempel, klik kasir, dan bel konfirmasi 8/8).
- Audio-coupled moments: Putaran kartu 3D (`casino/card-slide-1.ogg`), ketukan stempel berurutan pada beat (`interface/click_003.ogg`), konfirmasi 8/8 stempel penuh (`impact/impactBell_heavy_000.ogg`), dan transisi antar adegan (`impact/impactSoft_medium_001.ogg`).
- Restraint rule: Jangan menggunakan efek suara frekuensi tinggi yang tajam secara berulang; jaga agar semua teks tetap bertahan minimal 1.2–2.0 detik dalam kondisi diam agar nyaman dibaca.

## Storyboard

### Scene 1 — Hook: 3D Floating Metal Pass — 4.0s (0.0s – 4.0s)
Kartu depan **Sissi Heritage** (`/kartu-depan.png`) melayang di panggung gelap `#161618` dengan telemetri langsung `Sisi Depan · Sissi Heritage · Kemiringan -8.5° / +14.0°` dan lencana `Tersimpan Permanen di Perangkat (Anonim)`. Nama `PELANGGAN SISSI` dan kilau holografik bergerak mulus mengikuti simulasi sensor gerak `DeviceOrientation`.
Teks utama: **"Tanpa unduh aplikasi. Tanpa login."** diikuti sub-baris **"Kartu loyalitas 3D yang hidup di browser Anda."** (Settled hold > 2.2s).
Sequential/interaction: Simulasi kemiringan giroskop 3-sumbu (`rotateX` & `rotateY`) dan kilau spekular yang menyapu permukaan kartu.
Audio intent: Membangun kesan produk perangkat keras premium sejak detik pertama.
Audio-coupled idea: Desiran halus saat kartu muncul (`impact/impactSoft_medium_001.ogg` pada 0.2s) dan detak UI saat sensor gerak `Sensor Terhubung` aktif (`interface/click_002.ogg` pada 1.64s).
Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (masuk lembut pada 0.0s).
Transition mood: `clean` → Scene 2

### Scene 2 — Reveal: 180° Flip, 8-Stamp Grid & Slide-Up PWA Drawer — 4.7s (4.0s – 8.7s)
Tombol `Balik ke Belakang` menyala; kartu berputar 180° secara 3D (`rotateY(180deg)`) tepat di sekitar cue `4.39s` memperlihatkan `/kartu-belakang-kosong.png` dengan `ID · SIS-9042-718K` dan kode QR di kanan bawah. Lima stempel awal sudah terisi, lalu stempel ke-6 (kopi), ke-7 (croissant), dan ke-8 (kopi) masuk satu per satu mengikuti ketukan musik (`5.34s`, `6.00s`, `6.56s`) hingga status berubah menjadi `8 / 8 Stempel Aktif · Hadiah Siap Klaim!`. Begitu kartu menghadap belakang, laci bawah (*Slide-Up Action Menu*) meluncur naik menampilkan tombol `Add to Home Screen` & `Email Backup`.
Teks utama: **"Balik 180°. Kumpulkan 8 stempel kopi & croissant."** (Settled hold > 2.5s).
Sequential/interaction: Putaran kartu 3D + 3 stempel terakhir muncul berurutan di atas grid 8 lingkaran + laci bawah `Pintasan Aplikasi & Cadangan Kartu` meluncur naik.
Audio intent: Memberikan kepuasan taktil saat kartu berbalik dan stempel ke-8 melengkapi hadiah.
Audio-coupled idea: `casino/card-slide-1.ogg` saat kartu berputar (4.35s), `interface/click_003.ogg` pada tiap stempel baru (5.34s, 6.00s, 6.56s), dan `impact/impactBell_heavy_000.ogg` saat 8/8 penuh & laci PWA terbuka (7.09s).
Transition mood: `clean` → Scene 3

### Scene 3 — Highlight 1: Instant QR Cashier Portal (`/kasir`) — 4.4s (8.7s – 13.1s)
Beralih tepat pada strong cue `8.74s` ke tampilan **Sissi Heritage · Kasir B2B** (`/kasir`). Panel menampilkan `QR Pelanggan Terdeteksi · SIS-9042-718K`. Item pesanan cepat muncul dan dipilih: `Iced Latte (Rp 38.000)` dan `Butter Croissant (Rp 32.000)`. Tombol utama `Kirim Pesanan & +1 Stempel` ditekan, memunculkan toast hijau `Pesanan ORD-4821 terkirim & +1 Stempel untuk SIS-9042-718K (8/8)`.
Teks utama: **"Scan QR di kasir. Tambah stempel dalam satu ketukan."** (Settled hold > 2.4s).
Sequential/interaction: Pil menu `Iced Latte` & `Butter Croissant` menyala berurutan (`9.83s`, `10.37s`), diikuti klik tombol submit (`11.46s`) dan kemunculan toast konfirmasi.
Audio intent: Menunjukkan kecepatan operasional kasir tanpa perangkat POS tambahan.
Audio-coupled idea: Transisi masuk pada strong cue `8.74s` (`impact/impactSoft_medium_004.ogg`), ketukan pemilihan menu (`ui/click2.ogg`), dan bunyi konfirmasi pesanan (`interface/bong_001.ogg` pada 11.46s).
Transition mood: `clean` → Scene 4

### Scene 4 — Highlight 2: Live B2B Google Sheets Ledger — 4.4s (13.1s – 17.5s)
Beralih pada strong cue `13.11s` ke **Direktori Stempel & Penukaran Pelanggan B2B**. Empat kartu metrik Apple Bento muncul berurutan pada grid ketukan (`13.64s`, `14.20s`, `14.73s`, `15.29s`):
1. `Total ID Kartu Aktif: 148`
2. `Total Stempel Ditukarkan: 1,240`
3. `Stempel Aktif Belum Ditukar: 612`
4. `Hadiah Siap Klaim (8/8): 19`
Di bawahnya, baris tabel pelanggan `SIS-9042-718K · Pelanggan Sissi` menampilkan bar progres hijau penuh `8 / 8` dan aksi `Tukar 8` yang menyala.
Teks utama: **"Buku Besar B2B Real-Time. Tersinkronisasi ke Google Sheets."** (Settled hold > 2.4s).
Sequential/interaction: 4 kartu KPI Bento masuk berurutan dan bar progres `8 / 8` berkilau hijau emerald.
Audio intent: Menegaskan skala B2B yang rapi dan terukur di balik kartu pelanggan yang simpel.
Audio-coupled idea: Transisi masuk pada `13.11s` (`impact/impactSoft_medium_002.ogg`), diikuti aksen lembut pada kartu KPI pertama dan keempat (`interface/click_005.ogg`).
Transition mood: `soft` → Scene 5

### Scene 5 — Outro / Punchline — 2.5s (17.5s – 20.0s)
Masuk pada strong cue `17.47s`: kartu depan & belakang **Sissi Heritage** tampil berdampingan dalam komposisi hero 3D di atas panggung gelap dengan lencana `Powered by Viyond`.
Teks utama: **"Sissi Heritage Digital Loyalty Pass"**
Sub-baris: **"The Old Corner Hits Differen · Tanpa Login · Siap Pakai"** (Settled hold hingga 20.0s).
Sequential/interaction: Kedua sisi kartu melayang berdampingan dengan sapuan kilau holografik terakhir.
Audio intent: Penutup yang tenang, elegan, dan berkesan.
Audio-coupled idea: Denting penutup hangat pada `17.47s` (`impact/impactBell_heavy_003.ogg`) sementara musik melakukan fade-out halus hingga 20.0s.

**Music mood for this video:** `polished` / `cinematic` (`happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`)
**Audio summary:** Bed musik elektronik-akustik bersih bertempo 110 BPM yang mengiringi demonstrasi 3D kartu, ketukan pengisian 8 stempel kopi/croissant, transaksi QR kasir, dan dasbor B2B dengan aksen suara UI yang hangat dan presisi.
