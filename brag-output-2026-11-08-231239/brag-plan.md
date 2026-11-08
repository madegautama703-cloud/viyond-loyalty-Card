# Brag Plan: Sissi Heritage — Digital Loyalty Pass & B2B Console

> Run: `--full`, tone `cinematic` (storytelling), landscape. Output: `brag-output-2026-11-08-225924/` (v1 tidak disentuh).

## What is this app?
Kartu loyalitas digital 3D untuk kafe **Sissi Heritage** yang hidup di browser (tanpa unduh, tanpa login, tersimpan di perangkat), plus portal kasir `/kasir` dan dasbor B2B untuk membaca stempel & klaim hadiah.

## The angle
Kartu kertas hilang di saku; aplikasi loyalitas minta unduhan dan akun. Sissi Heritage menjawabnya dengan satu kartu logam-holografik yang tinggal dibuka. Ceritanya dibangun seperti trailer: masalah kecil yang akrab → satu gerakan membalik kartu → wow → ajakan.

## Hook (0–3s)
Layar hitam. Kartu depan Sissi Heritage (`public/kartu-depan.png`) muncul dengan kilau holografik yang bergerak. Teks: **"Kartu loyalitas selalu hilang."** (kalimat jujur, bukan klaim produk). Kartu tampak jatuh/tergelincir keluar frame lalu naik kembali di akhir hook.

## Struktur cerita
| Babak | Waktu | Isi |
|---|---|---|
| Hook | 0.0–3.0s | Kartu muncul, "Kartu loyalitas selalu hilang." |
| Masalah | 3.0–7.0s | Dua baris bergantian: "Kartu kertas hilang di saku." / "Aplikasi minta unduh dan login." (framing, bukan klaim) |
| Solusi | 7.0–12.0s | Kartu 3D miring mengikuti sensor, label `Tersimpan Permanen di Perangkat (Anonim)`, teks "Tanpa unduh aplikasi. Tanpa login." |
| Momen wow | 12.0–19.0s | Kartu terbalik 180° → 8 stempel terisi berurutan sampai `8 / 8`; cut ke `/kasir` (`QR Pelanggan Terdeteksi`, tombol `Submit Pesanan & +1 Stempel`, banner `Kartu penuh (8/8)! Pelanggan berhak klaim reward.`); cut ke dasbor B2B (4 KPI + tabel pelanggan) |
| CTA | 19.0–22.0s | Kartu + "Sissi Heritage Digital Loyalty Pass" + "The Old Corner Hits Differen" + ajakan "Buka kartunya." |

## Key moments / alur pengguna nyata
1. **Entry:** buka kartu 3D (ID `SIS-9042-718K` — ID demo fiktif), miringkan.
2. **Key action:** balik kartu → grid 8 stempel (`stamp-roti.png`, `stamp-kopi.png`) + QR; kasir di `/kasir` mengirim pesanan dan `+1 Stempel`.
3. **Result:** `8/8 · Siap Klaim` dan dasbor B2B menyajikan metrik.

Catatan: UI di layar direkonstruksi dari komponen asli (`app/page.tsx`, `app/kasir/page.tsx`) dengan aset asli di `public/`. Nama pelanggan, ID, dan angka adalah data demo fiktif; tidak ada rahasia dari `.env` dipakai.

## Tone
- Preset: `cinematic`
- Creative direction: trailer sinematik hangat — kafe heritage bertemu konsol B2B gelap.
- Interpretasi: gerak lambat-besar (push-in, flip 3D), cut tegas pada beat kuat, teks pendek tapi bertahan ≥1.2s agar terbaca; tanpa jargon SaaS.

## Format: landscape — 1920x1080
## Duration: 22 detik

## Visual identity (dari proyek)
- Background: `#000000`, panel `#161618` (border `rgba(255,255,255,0.08)`)
- Accent: `#0071E3` / `#2997FF` (biru), `#4A4928` (zaitun kartu depan), `#EFE5D1` (krem kartu belakang), `#10B981` (zamrud, reward)
- Text: `#F5F5F7`, muted `#86868B`
- Display/body font: stack sistem Apple (`-apple-system`, SF Pro) dengan fallback Plus Jakarta Sans; mono untuk ID
- Elemen terkuat: kartu depan/belakang + stempel roti & kopi

## Share copy (draft)
Kartu loyalitas selalu hilang, jadi Sissi Heritage membuatnya hidup di browser: kartu 3D, 8 stempel, portal kasir, dasbor B2B. Tanpa unduh, tanpa login.

## Audio direction
- Role: cinematic support
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (~110 BPM; dari `assets/music/`, CC BY 4.0 Sascha Ende — kredit di share copy)
- Treatment: masuk 0s fade-in 0.5s, volume ~0.32, mulai naik di babak solusi, fade-out 20.2–22s
- Cue guidance: baca `cues/...vol-12...music-cues.md`; target strongCue ≈ 4.39s (masalah), 8.74s (solusi/flip), 13.11s (cut ke `/kasir`), 17.47s (dasbor→CTA); stempel berurutan di jendela beat-grid (disesuaikan saat composition)
- Audio-reactive: subtle — glow panggung di belakang kartu bernapas dengan RMS/bass; tanpa waveform
- SFX: sparse–moderate, selaras gerak (`casino/card-slide-1` flip, `interface/click_003` stempel, `impact/impactBell_heavy_000` untuk 8/8, `impact/impactSoft_medium_001` transisi); hindari SFX frekuensi tinggi berulang
- Restraint: audio tidak boleh menutupi teks atau terasa riuh

## Storyboard

### Scene 1 — Hook — 3.0s
Kartu depan melayang di hitam, glow holografik. Teks "Kartu loyalitas selalu hilang." Audio: hening-hangat, fade-in musik, satu swell rendah.

### Scene 2 — Masalah — 4.0s (3.0–7.0)
Kartu mengecil/blur ke sisi; dua baris teks bergantian (masing-masing ~1.7s). Transisi: push dolly gelap. Audio: SFX lembut pada pergantian baris, strongCue 4.39s.

### Scene 3 — Solusi — 5.0s (7.0–12.0)
Kartu kembali tajam, miring 3 sumbu dengan telemetri `Kemiringan` dan lencana `Tersimpan Permanen di Perangkat (Anonim)`. Teks "Tanpa unduh aplikasi. Tanpa login." Audio: musik naik, hit pada 8.74s.

### Scene 4 — Wow A: Flip & 8 stempel — 4.0s (12.0–16.0)
Kartu membalik 180° ke sisi belakang (ID + QR); 8 stempel terisi satu per satu hingga `8 / 8`. Sequential: ya, snap ke beat-grid (teks hanya label `8 / 8`). Audio: card-slide, klik per stempel, bell di 8/8.

### Scene 5 — Wow B: Kasir & Dasbor — 3.5s (16.0–19.5)
**/kasir 16.0–17.5** (`QR Pelanggan Terdeteksi`, klik `Submit Pesanan & +1 Stempel`), **Dasbor B2B 17.5–19.5** (4 KPI + tabel, badge `8/8 · Siap Klaim`). Cut keras pada strongCue 13.11/17.47 yang paling dekat.

### Scene 6 — CTA — 2.5s (19.5–22.0)
Kartu depan kembali, teks "Sissi Heritage Digital Loyalty Pass", sub "The Old Corner Hits Differen", ajakan "Buka kartunya." Musik fade-out.

> Catatan jujur: Wow A+B (7s) padat; jika terbaca terlalu cepat, saya perpanjang total ke 24s (masih di batas 25s).
