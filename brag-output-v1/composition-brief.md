# Hyperframes Composition Brief: Sissi Heritage — Vespera Metal Loyalty Pass & B2B Console

## Objective
Create a short launch-style brag video for **Sissi Heritage Digital Loyalty Pass & B2B Console**.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20 seconds (600 frames at 30fps)

## Source Material
- Project root: `/Users/madepasekmaesagautama/antigravity/Vespera-Metal-Loyalty-Pass-&-B2B-Console`
- Primary files read: `app/layout.tsx`, `app/page.tsx`, `app/kasir/page.tsx`, `public/kartu-depan.png`, `public/kartu-belakang-kosong.png`, `public/stamp-roti.png`, `public/stamp-kopi.png`, `public/viyond-logo.png`, `public/viyond-logo-white.png`
- Product name: `Sissi Heritage Digital Loyalty Pass & B2B Console`
- Tagline / strongest claim: `"The Old Corner Hits Differen"` · `"Tersimpan Permanen di Perangkat (Anonim)"`
- Key UI or visual moment to recreate:
  1. 3D floating Sissi Heritage card (`/kartu-depan.png` & `/kartu-belakang-kosong.png`) with holographic foil sheen, 3-axis DeviceOrientation tilt telemetry, and 180° 3D flip.
  2. 8-Stamp grid filling with custom `/stamp-roti.png` (croissant) and `/stamp-kopi.png` (latte art) stamps, plus dynamic QR code and slide-up `Add to Home Screen` & `Email Backup` drawer.
  3. `/kasir` B2B Cashier Portal scanning `SIS-9042-718K`, selecting `Iced Latte` & `Butter Croissant`, and issuing `+1 Stempel`.
  4. Apple Bento B2B Merchant Dashboard (`Direktori Stempel & Penukaran Pelanggan B2B`) with 4 KPI cards and live customer ledger row.
- Copy that must appear verbatim:
  - `Sissi Heritage`
  - `The Old Corner Hits Differen`
  - `Tersimpan Permanen di Perangkat (Anonim)`
  - `Add to Home Screen` / `Email Backup`
  - `QR Pelanggan Terdeteksi`
  - `Direktori Stempel & Penukaran Pelanggan B2B`
  - `Powered by Viyond`

## Creative Direction
- Tone preset: `polished`
- Creative direction: `Apple-grade dark studio product film meets warm heritage café craft`
- Interpretation: Smooth, high-contrast dark studio presentation (`#000000` canvas, `#161618` Bento glass surfaces) showcasing the real Sissi Heritage card artwork (`#4A4928` olive-bronze front, `#EFE5D1` warm cream back) and tactile UI interactions.
- Angle: Physical café stamp cards get lost and loyalty apps demand downloads and logins. Sissi Heritage gives customers an instant 3D holographic pass saved permanently in `localStorage` with zero login, paired with a 1-tap QR Cashier Portal and live Google Sheets B2B Ledger.
- Hook: Floating 3D Sissi Heritage front pass tilting with live gyro telemetry (`Kemiringan -8.5° / +14.0°`) — *"Tanpa unduh aplikasi. Tanpa login."*
- Outro / punchline: Front and back 3D cards floating together — *"Sissi Heritage Digital Loyalty Pass — The Old Corner Hits Differen."*
- Avoid:
  - Generic SaaS language ("streamline your workflow")
  - Abstract filler visuals
  - Unrelated visual redesign

## Visual Identity
- Background: `#000000` (primary canvas), `#161618` (Bento card surface with `rgba(255, 255, 255, 0.08)` border)
- Text: `#F5F5F7` (primary), `#86868B` (secondary metadata), `#EDE2CC` (cardholder name on card front)
- Accent: `#0071E3` / `#2997FF` (interactive blue), `#34D399` / `#10B981` (emerald status), `#4A4928` (Sissi olive), `#EFE5D1` (Sissi cream)
- Display font: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", sans-serif`
- Body font: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", sans-serif` + monospace `SF Mono, JetBrains Mono, monospace` (`tabular-nums`)
- Visual references from the project:
  - `assets/images/kartu-depan.png`
  - `assets/images/kartu-belakang-kosong.png`
  - `assets/images/stamp-roti.png`
  - `assets/images/stamp-kopi.png`
  - `assets/images/viyond-logo-white.png`

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. **Hook: 3D Floating Metal Pass** — 4.0s (0.0s–4.0s) — 3D Sissi Heritage front face floating & tilting with live gyro telemetry (`Kemiringan -8.5° / +14.0°`), holographic sheen, `PELANGGAN SISSI`, and `Tersimpan Permanen di Perangkat (Anonim)`. Headline: *"Tanpa unduh aplikasi. Tanpa login."*
2. **Reveal: 180° Flip, 8-Stamp Grid & PWA Drawer** — 4.7s (4.0s–8.7s) — Card flips 180° at `4.39s` to `/kartu-belakang-kosong.png` showing `ID · SIS-9042-718K` and QR code; stamps 6, 7, and 8 (`stamp-kopi.png`, `stamp-roti.png`, `stamp-kopi.png`) pop in on beat (`5.34s`, `6.00s`, `6.56s`) reaching `8 / 8 Stempel Aktif`, while the slide-up drawer (`Add to Home Screen` & `Email Backup`) rises from the bottom.
3. **Highlight 1: Instant QR Cashier Portal (`/kasir`)** — 4.4s (8.7s–13.1s) — Enters on strong cue `8.74s`. Cashier portal shows `QR Pelanggan Terdeteksi · SIS-9042-718K`, quick-selects `Iced Latte (Rp 38.000)` & `Butter Croissant (Rp 32.000)`, clicks `Kirim Pesanan & +1 Stempel`, and triggers toast `Pesanan ORD-4821 terkirim & +1 Stempel (8/8)`.
4. **Highlight 2: Live B2B Google Sheets Ledger** — 4.4s (13.1s–17.5s) — Enters on strong cue `13.11s`. 4 Apple Bento KPI cards (`148` ID Kartu Aktif, `1,240` Stempel Ditukarkan, `612` Stempel Aktif, `19` Hadiah Siap Klaim 8/8) snap in on beat (`13.64s`, `14.20s`, `14.73s`, `15.29s`) above the live customer table row with `Tukar 8` active.
5. **Outro / Punchline** — 2.5s (17.5s–20.0s) — Enters on strong cue `17.47s`. Dual 3D hero showcase of Front & Back Sissi Heritage passes with `Powered by Viyond` badge and headline *"Sissi Heritage Digital Loyalty Pass — The Old Corner Hits Differen."*

## Audio
- Audio role: `cinematic support` / `warm bed`
- Audio arc: Smooth fade-in at 0.0s (`0.34` volume), steady 110 BPM pulse driving card flip, sequential stamp pops, cashier order, and Bento KPI reveals, fading cleanly from 18.8s to 20.0s under the final bell payoff.
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: Volume `0.34`, fade-in 0.0s–0.5s, fade-out 18.6s–20.0s.
- Music cue guidance: Bundled preset `/Users/madepasekmaesagautama/.agents/skills/brag/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` (109.96 BPM).
  - Beat-locked major moments (`// beat-locked`): `4.39s` (card 3D flip), `8.74s` (Scene 3 Cashier reveal), `13.11s` (Scene 4 B2B Dashboard reveal), `17.47s` (Scene 5 Outro reveal).
  - Beat-grid sequential events (`// beat-grid`): Stamps 6–8 at `5.34s, 6.00s, 6.56s` + reward ready bell at `7.09s`; Cashier menu pills at `9.83s, 10.37s` + submit at `11.46s`; B2B KPI cards at `13.64s, 14.20s, 14.73s, 15.29s`.
- Audio-reactive treatment: `subtle`; ambient stage radial glow (`#EFE5D1` / `#4A4928` halo) and holographic sheen intensity subtly breathe with the music's 110 BPM pulse.
- Audio-coupled moments:
  - `0.20s` — Scene 1 card entrance (`impact/impactSoft_medium_001.ogg`)
  - `1.64s` — Gyro sensor linked pill (`interface/click_002.ogg`)
  - `4.39s` — 180° 3D card flip (`casino/card-slide-1.ogg`)
  - `5.34s, 6.00s, 6.56s` — Stamps 6, 7, 8 pop in (`interface/click_003.ogg`)
  - `7.09s` — 8/8 Reward Ready & PWA drawer slide-up (`impact/impactBell_heavy_000.ogg`)
  - `8.74s` — Scene 3 Cashier Portal transition (`impact/impactSoft_medium_004.ogg`)
  - `9.83s, 10.37s` — Quick-select Iced Latte & Butter Croissant (`ui/click2.ogg`)
  - `11.46s` — Submit order & +1 stamp toast (`interface/bong_001.ogg`)
  - `13.11s` — Scene 4 B2B Dashboard transition (`impact/impactSoft_medium_002.ogg`)
  - `13.64s, 15.29s` — B2B KPI Bento cards first & last snap (`interface/click_005.ogg`)
  - `17.47s` — Scene 5 Outro dual-card reveal (`impact/impactBell_heavy_003.ogg`)
- SFX selection guidance: All selected from low/medium HF-risk picks in `sfx-analysis.md`.
- Audio files: Copied into `brag-output/composition/assets/music/` and `brag-output/composition/assets/sfx/`.
