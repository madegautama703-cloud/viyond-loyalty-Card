'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  RotateCw,
  Smartphone,
  Check,
  Plus,
  Minus,
  Award,
  Mail,
  Search,
  Download,
  Sliders,
  ChevronDown,
  X,
  Globe,
  Home,
  Share,
  WifiOff,
  HardDrive,
  User,
  Users,
} from 'lucide-react';

type Language = 'id' | 'en';

const MAX_STAMPS = 8;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  tier: string;
  currentStamps: number;
  totalRedeemedStamps: number;
  lastVisit: string;
  isLocalDevice?: boolean;
}

const STORAGE_KEYS = {
  CUSTOMER_ID: 'sissi_anon_customer_id',
  CUSTOMER_NAME: 'sissi_anon_customer_name',
  CURRENT_STAMPS: 'sissi_anon_current_stamps',
  REDEEMED_STAMPS: 'sissi_anon_redeemed_stamps',
  BACKUP_EMAIL: 'sissi_anon_backup_email',
  PWA_SHORTCUT_PINNED: 'sissi_pwa_shortcut_pinned',
};

function generateRandomCustomerId(): string {
  const blockA = Math.floor(1000 + Math.random() * 9000);
  const blockB = Math.floor(100 + Math.random() * 900);
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const checkChar = letters.charAt(Math.floor(Math.random() * letters.length));
  return `SIS-${blockA}-${blockB}${checkChar}`;
}

// Production Webhook URL Google Sheets Dasbor B2B Sissi
const B2B_WEBHOOK_URL = 'https://n8n.srv2075779.hstgr.cloud/webhook/get-dasbor-sissi';

// 8 Stamp Slots matching the visual placement on /kartu-belakang-kosong.png:
// Row 1: 5 circles (columns 1..5)
// Row 2: 3 circles centered beneath columns 2, 3, and 4
const STAMP_SLOTS = [
  { index: 1, gridClass: 'row-start-1 col-start-1' },
  { index: 2, gridClass: 'row-start-1 col-start-2' },
  { index: 3, gridClass: 'row-start-1 col-start-3' },
  { index: 4, gridClass: 'row-start-1 col-start-4' },
  { index: 5, gridClass: 'row-start-1 col-start-5' },
  { index: 6, gridClass: 'row-start-2 col-start-2' },
  { index: 7, gridClass: 'row-start-2 col-start-3' },
  { index: 8, gridClass: 'row-start-2 col-start-4' },
];

const TRANSLATIONS = {
  id: {
    navFront: 'Tampak Depan',
    navGrid: 'Grid 8 Stempel',
    navPwa: 'Pintasan PWA',
    navB2B: 'Buku Besar B2B',
    ctaIssueStamp: 'Tambah +1 Stempel',
    stampsActive: 'Stempel Aktif',
    totalRedeemedLabel: 'Total Ditukar',
    localSavedBadge: 'Tersimpan Permanen di Perangkat (Anonim)',
    modeSplit: 'Kartu + B2B',
    modePass: 'Fokus Kartu',
    modeDashboard: 'Dasbor B2B',
    exportHtml: 'Ekspor HTML',
    stageFrontLabel: 'Sisi Depan · Sissi Heritage (/kartu-depan.png)',
    stageBackLabel: 'Sisi Belakang · 8 Stempel & QR (/kartu-belakang-kosong.png)',
    tiltLabel: 'Kemiringan',
    flipToFront: 'Balik ke Depan',
    flipToBack: 'Balik ke Belakang',
    cardAriaLabel:
      'Kartu Loyalitas Digital Sissi Heritage. Ketuk atau tekan Enter untuk membalik antara sisi depan dan 8 stempel di belakang.',
    toggleStampTitle: 'Ubah Stempel #',
    stageFooterHint:
      'Klik kartu untuk membalik 3D · Klik salah satu dari 8 lingkaran di belakang untuk menambah/mengurangi stempel',
    drawerActiveBelow: 'Menu Tarik Aktif di Bawah ↓',
    flipForWalletActions: 'Balik ke Belakang untuk Menu Pintasan & Cadangan',
    studioTitle: 'Studio Kartu & Kontrol Giroskop',
    studioSubtitle:
      'Desain kustom Sissi Heritage, penyimpanan lokal anonim, & orientasi 3-sumbu',
    gyroLinked: 'Sensor Terhubung',
    pairMotionSensor: 'Hubungkan Sensor Gerak',
    activeCardholderProfile: 'Profil Kartu Aktif (Lokal & B2B)',
    localDeviceMemberName: 'Pelanggan Sissi (Perangkat Ini)',
    stampsWord: 'stempel',
    stampProgress: 'Progres Stempel',
    lifetimeRedeemed: 'Total Ditukar Seumur Hidup',
    btnRemove: 'Kurangi',
    btnStampPlus: 'Stempel +1',
    btnRedeemAll: 'Tukar 8',
    gyroSimulatorTitle: 'Simulator Kemiringan DeviceOrientation',
    resetAxis: 'Reset Sumbu',
    pitchLabel: 'Pitch (Sumbu-X Beta)',
    rollLabel: 'Roll (Sumbu-Y Gamma)',
    drawerHintOpen:
      'Menu tarik pintasan PWA & cadangan aktif di bagian bawah layar.',
    drawerHintClosed:
      'Balik kartu ke sisi belakang untuk memunculkan menu Tambahkan ke Layar Utama.',
    showFrontFace: 'Lihat Sisi Depan',
    flipAndOpenDrawer: 'Balik & Buka Menu',
    b2bTitle: 'Direktori Stempel & Penukaran Pelanggan B2B',
    b2bSubtitle:
      'Buku besar merchant Sissi Heritage yang melacak ID pelanggan anonim, progres 8 stempel, dan total stempel yang ditukarkan.',
    kpiRegistered: 'Total ID Kartu Aktif',
    kpiTotalRedeemed: 'Total Stempel Ditukarkan',
    kpiActiveUnredeemed: 'Stempel Aktif Belum Ditukar',
    kpiRewardsReady: 'Hadiah Siap Klaim (8/8)',
    searchPlaceholder: 'Cari pelanggan, ID (SIS-...), atau status perangkat...',
    filterAll: 'Semua Kartu',
    filterReady: 'Siap Klaim (8/8)',
    filterVip: '32+ Ditukar',
    thCustomerId: 'Customer_ID',
    thCustomerName: 'Nama Pelanggan',
    thActiveGrid: 'Total_Stempel',
    thTotalRedeemed: 'Total_Klaim',
    thMerchantActions: 'Aksi Kasir',
    noRecordsMatch: 'Tidak ada data pelanggan yang cocok dengan',
    activeOn3dCard: '· Aktif di Kartu 3D',
    localDeviceTag: 'Perangkat Ini · localStorage',
    drawerHeader: 'Pintasan Aplikasi & Cadangan Kartu',
    flipFrontToDismiss: 'Balik ke Depan untuk Menutup',
    btnAddToHomeScreen: 'Add to Home Screen',
    btnEmailBackup: 'Email Backup',
    modalPwaTitle: 'Tambahkan ke Layar Utama (Pintasan PWA)',
    modalEmailTitle: 'Cadangan Email Kartu Terenkripsi',
    modalLocalIdLabel: 'ID Pelanggan Anonim (localStorage)',
    modalStorageState: 'Status Penyimpanan',
    modalStoragePermanent: 'Permanen · Tanpa Login',
    modalSyncedBalance: 'Saldo Stempel Saat Ini',
    pwaInstructionsTitle: 'Cara Memasang Pintasan Aplikasi Web (PWA):',
    pwaIosStep1:
      '1. Di Safari iOS, ketuk ikon Bagikan (Share) di bilah bawah.',
    pwaIosStep2:
      '2. Pilih "Tambahkan ke Layar Utama" (Add to Home Screen) untuk akses instan.',
    pwaAndroidStep:
      'Di Chrome / Android / Desktop: Ketuk tombol "Pasang Pintasan PWA Sekarang" di bawah atau pilih "Install" pada menu browser.',
    btnClose: 'Tutup',
    btnCancel: 'Batal',
    btnInstallPwaNow: 'Pasang Pintasan PWA Sekarang',
    emailModalDesc:
      'Kirim tautan pemulihan terenkripsi berisi kode QR unik dan saldo stempel lokal Anda',
    emailModalToAddress: 'ke alamat email Anda:',
    recipientEmailLabel: 'Email Penerima Cadangan',
    btnSendRecovery: 'Kirim Kartu Pemulihan',
    offlineBanner:
      'Mode Offline — ID Kartu & Stempel Anda tetap aman di penyimpanan lokal.',
    toastIssuedStamp: (delta: number, id: string) =>
      `Berhasil menambahkan +${delta} stempel ke ${id}`,
    toastNeedAllStamps:
      'Kumpulkan seluruh 8 stempel untuk menukarkan hadiah gratis',
    toastRedeemedAll: (name: string) =>
      `Berhasil menukar 8 stempel untuk ${name} (+8 tercatat di buku B2B)`,
    toastExportHtml: 'Berhasil mengunduh file tunggal HTML mandiri',
    toastGyroLinked: 'Sensor gerak DeviceOrientation berhasil terhubung',
    toastGyroDeclined:
      'Izin sensor ditolak — menggunakan kemiringan sentuh interaktif',
    toastGyroActive:
      'Pendengar DeviceOrientation aktif — miringkan ponsel atau geser kartu',
    toastGyroSimulated: 'Menggunakan simulator kursor & giroskop interaktif',
    toastPwaInstalled: (id: string) =>
      `Pintasan PWA Sissi Heritage (${id}) berhasil dipasang ke Layar Utama`,
    toastEmailSent: (id: string, email: string) =>
      `Cadangan kartu (${id}) dikirim ke ${email}`,
    toastLangChanged: 'Bahasa diubah ke Bahasa Indonesia',
  },
  en: {
    navFront: 'Card Front',
    navGrid: '8-Stamp Grid',
    navPwa: 'PWA Shortcut',
    navB2B: 'B2B Ledger',
    ctaIssueStamp: 'Issue +1 Stamp',
    stampsActive: 'Stamps Active',
    totalRedeemedLabel: 'Total Redeemed',
    localSavedBadge: 'Saved Permanently in Browser (Anonymous)',
    modeSplit: 'Pass + B2B Split',
    modePass: 'Card Focus',
    modeDashboard: 'B2B Dashboard Mode',
    exportHtml: 'Export HTML',
    stageFrontLabel: 'Front Face · Sissi Heritage (/kartu-depan.png)',
    stageBackLabel: 'Back Face · 8 Stamps & QR (/kartu-belakang-kosong.png)',
    tiltLabel: 'Tilt',
    flipToFront: 'Flip to Front',
    flipToBack: 'Flip to Back',
    cardAriaLabel:
      'Sissi Heritage Digital Loyalty Card. Tap or press Enter to flip between front face and 8-stamp back.',
    toggleStampTitle: 'Toggle Stamp #',
    stageFooterHint:
      'Click card surface to flip 3D pass · Click any of the 8 circles on the back to toggle stamps',
    drawerActiveBelow: 'Drawer Active Below ↓',
    flipForWalletActions: 'Flip to Back for Home Screen & Backup Menu',
    studioTitle: 'Pass Studio & Gyro Controls',
    studioSubtitle:
      'Custom Sissi Heritage artwork, anonymous localStorage persistence, & 3-axis orientation',
    gyroLinked: 'Gyro Linked',
    pairMotionSensor: 'Pair Motion Sensor',
    activeCardholderProfile: 'Active Pass Profile (Local & B2B)',
    localDeviceMemberName: 'Sissi Guest (This Device)',
    stampsWord: 'stamps',
    stampProgress: 'Stamp Progress',
    lifetimeRedeemed: 'Lifetime Redeemed',
    btnRemove: 'Remove',
    btnStampPlus: 'Stamp +1',
    btnRedeemAll: 'Redeem 8',
    gyroSimulatorTitle: 'DeviceOrientation Tilt Simulator',
    resetAxis: 'Reset Axis',
    pitchLabel: 'Pitch (Beta X-Axis)',
    rollLabel: 'Roll (Gamma Y-Axis)',
    drawerHintOpen:
      'Slide-up PWA Home Screen & Backup drawer is active at the bottom.',
    drawerHintClosed:
      'Flip the card to the back to reveal the Add to Home Screen & Email Backup drawer.',
    showFrontFace: 'Show Front Face',
    flipAndOpenDrawer: 'Flip & Open Drawer',
    b2bTitle: 'B2B Customer Stamp & Redemption Directory',
    b2bSubtitle:
      'Live Sissi Heritage merchant ledger tracking anonymous Customer IDs, 8-stamp progress, and cumulative redeemed stamps.',
    kpiRegistered: 'Active Card IDs',
    kpiTotalRedeemed: 'Total Redeemed Stamps',
    kpiActiveUnredeemed: 'Active Unredeemed Stamps',
    kpiRewardsReady: 'Rewards Ready (8/8)',
    searchPlaceholder: 'Search by customer name, ID (SIS-...), or device...',
    filterAll: 'All Passes',
    filterReady: 'Reward Ready (8/8)',
    filterVip: '32+ Redeemed',
    thCustomerId: 'Customer_ID',
    thCustomerName: 'Customer Name',
    thActiveGrid: 'Total_Stempel',
    thTotalRedeemed: 'Total_Klaim',
    thMerchantActions: 'Cashier Actions',
    noRecordsMatch: 'No customer records match',
    activeOn3dCard: '· Active on 3D Card',
    localDeviceTag: 'This Browser · localStorage',
    drawerHeader: 'PWA Shortcut & Pass Backup',
    flipFrontToDismiss: 'Flip to Front to Dismiss',
    btnAddToHomeScreen: 'Add to Home Screen',
    btnEmailBackup: 'Email Backup',
    modalPwaTitle: 'Add to Home Screen (PWA Shortcut)',
    modalEmailTitle: 'Encrypted Pass Email Backup',
    modalLocalIdLabel: 'Anonymous Customer ID (localStorage)',
    modalStorageState: 'Storage Persistence',
    modalStoragePermanent: 'Permanent · No Login Required',
    modalSyncedBalance: 'Current Stamp Balance',
    pwaInstructionsTitle: 'How to Install as a Home Screen Web App:',
    pwaIosStep1:
      '1. In iOS Safari, tap the Share icon in the bottom navigation bar.',
    pwaIosStep2:
      '2. Scroll down and select "Add to Home Screen" for instant 1-tap access.',
    pwaAndroidStep:
      'On Chrome / Android / Desktop: Click "Install PWA Shortcut Now" below or choose "Install" from your browser menu.',
    btnClose: 'Close',
    btnCancel: 'Cancel',
    btnInstallPwaNow: 'Install PWA Shortcut Now',
    emailModalDesc:
      'Send an encrypted recovery link containing your unique QR code and local stamp balance',
    emailModalToAddress: 'to your email address:',
    recipientEmailLabel: 'Backup Recipient Email',
    btnSendRecovery: 'Send Recovery Pass',
    offlineBanner:
      'Offline Mode — Your anonymous Customer ID & stamps remain safely stored in localStorage.',
    toastIssuedStamp: (delta: number, id: string) =>
      `Issued +${delta} stamp to ${id}`,
    toastNeedAllStamps:
      'Collect all 8 stamps to redeem a complimentary reward',
    toastRedeemedAll: (name: string) =>
      `Redeemed 8 stamps for ${name} (+8 added to B2B ledger)`,
    toastExportHtml: 'Downloaded standalone single-file HTML bundle',
    toastGyroLinked: 'DeviceOrientation motion sensor linked',
    toastGyroDeclined:
      'Motion permission declined — using interactive touch tilt',
    toastGyroActive:
      'DeviceOrientation listener active — tilt your device or drag card',
    toastGyroSimulated: 'Using interactive pointer & gyroscope simulator',
    toastPwaInstalled: (id: string) =>
      `Sissi Heritage PWA shortcut (${id}) installed to Home Screen`,
    toastEmailSent: (id: string, email: string) =>
      `Backup pass (${id}) sent to ${email}`,
    toastLangChanged: 'Language switched to English',
  },
};

export default function DigitalLoyaltyApp() {
  const [lang, setLang] = useState<Language>('id');
  const t = TRANSLATIONS[lang];

  // Anonymous LocalStorage Customer State + Dynamic B2B Ledger from Google Sheets
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [localCustomerId, setLocalCustomerId] = useState<string>('');
  const [localCustomer, setLocalCustomer] = useState<CustomerRecord | null>(null);
  const [isLoadingB2B, setIsLoadingB2B] = useState<boolean>(true);
  const [b2bError, setB2bError] = useState<string | null>(null);

  // PWA Install Prompt & Connectivity State
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Card Interactivity State
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; gx: number; gy: number }>({
    rx: 0,
    ry: 0,
    gx: 50,
    gy: 50,
  });
  const [gyroStatus, setGyroStatus] = useState<'idle' | 'active' | 'simulated'>('idle');

  // View / Dashboard Mode State
  const [viewMode, setViewMode] = useState<'pass' | 'dashboard' | 'split'>('split');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tableFilter, setTableFilter] = useState<'all' | 'ready' | 'vip'>('all');

  // Slide-Up Drawer Action Modal State ('pwa' | 'email' | 'name' | null)
  const [actionModal, setActionModal] = useState<{
    type: 'pwa' | 'email' | 'name' | null;
    emailInput?: string;
    nameInput?: string;
  }>({ type: null });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [appOrigin, setAppOrigin] = useState<string>('https://app.sissiheritage.com');
  const cardStageRef = useRef<HTMLDivElement | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setAppOrigin(window.location.origin);
    }
  }, []);

  // 1. Anonymous Local Storage Initialization on First Page Load (Zero Login Required)
  useEffect(() => {
    try {
      let storedId = window.localStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
      if (!storedId) {
        storedId = generateRandomCustomerId();
        window.localStorage.setItem(STORAGE_KEYS.CUSTOMER_ID, storedId);
      }

      const rawStamps = window.localStorage.getItem(STORAGE_KEYS.CURRENT_STAMPS);
      const parsedStamps =
        rawStamps !== null
          ? Math.max(0, Math.min(MAX_STAMPS, parseInt(rawStamps, 10) || 0))
          : 5;
      if (rawStamps === null) {
        window.localStorage.setItem(
          STORAGE_KEYS.CURRENT_STAMPS,
          String(parsedStamps)
        );
      }

      const rawRedeemed = window.localStorage.getItem(
        STORAGE_KEYS.REDEEMED_STAMPS
      );
      const parsedRedeemed =
        rawRedeemed !== null ? Math.max(0, parseInt(rawRedeemed, 10) || 0) : 16;
      if (rawRedeemed === null) {
        window.localStorage.setItem(
          STORAGE_KEYS.REDEEMED_STAMPS,
          String(parsedRedeemed)
        );
      }

      const savedEmail =
        window.localStorage.getItem(STORAGE_KEYS.BACKUP_EMAIL) ||
        'guest.pass@sissi-heritage.io';

      const savedName =
        window.localStorage.getItem(STORAGE_KEYS.CUSTOMER_NAME) ||
        'Pelanggan Sissi';

      const anonRecord: CustomerRecord = {
        id: storedId,
        name: savedName,
        email: savedEmail,
        tier: 'Sissi Heritage Local Pass',
        currentStamps: parsedStamps,
        totalRedeemedStamps: parsedRedeemed,
        lastVisit: '2026-10-30',
        isLocalDevice: true,
      };

      setLocalCustomerId(storedId);
      setLocalCustomer(anonRecord);
      setSelectedCustomerId(storedId);
    } catch {
      const fallbackId = 'SIS-9042-718K';
      setLocalCustomerId(fallbackId);
    }
  }, []);

  // 2. Service Worker Registration, PWA Install Event & Online Status Listeners
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {});
    }
    if ('caches' in window) {
      window.caches
        .keys()
        .then((keys) => {
          keys.forEach((key) => {
            if (key !== 'vespera-loyalty-pwa-v3') {
              window.caches.delete(key).catch(() => {});
            }
          });
        })
        .catch(() => {});
    }

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true ||
      window.localStorage.getItem(STORAGE_KEYS.PWA_SHORTCUT_PINNED) === 'true';
    setIsPwaInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsOnline(window.navigator.onLine);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
      try {
        window.localStorage.setItem(STORAGE_KEYS.PWA_SHORTCUT_PINNED, 'true');
      } catch {}
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper untuk mengekstrak seluruh baris pelanggan baik dari format { data: [...] } maupun array langsung [...]
  const extractCustomerRows = (input: any): any[] => {
    if (!input) return [];

    if (
      typeof input === 'object' &&
      !Array.isArray(input) &&
      (input.code === 0 ||
        (typeof input.message === 'string' &&
          input.message.toLowerCase().includes('no item')))
    ) {
      return [];
    }

    if (Array.isArray(input)) {
      const flattened: any[] = [];
      for (const entry of input) {
        if (!entry || typeof entry !== 'object') continue;
        if (Array.isArray(entry)) {
          flattened.push(...extractCustomerRows(entry));
        } else if (Array.isArray(entry.data)) {
          flattened.push(...extractCustomerRows(entry.data));
        } else if (Array.isArray(entry.rows)) {
          flattened.push(...extractCustomerRows(entry.rows));
        } else if (Array.isArray(entry.items)) {
          flattened.push(...extractCustomerRows(entry.items));
        } else if (Array.isArray(entry.records)) {
          flattened.push(...extractCustomerRows(entry.records));
        } else if (entry.json && typeof entry.json === 'object') {
          flattened.push(...extractCustomerRows(entry.json));
        } else if (entry.body && typeof entry.body === 'object') {
          flattened.push(...extractCustomerRows(entry.body));
        } else {
          flattened.push(entry);
        }
      }
      return flattened;
    }

    if (typeof input === 'object') {
      if (Array.isArray(input.data)) return extractCustomerRows(input.data);
      if (Array.isArray(input.rows)) return extractCustomerRows(input.rows);
      if (Array.isArray(input.items)) return extractCustomerRows(input.items);
      if (Array.isArray(input.records))
        return extractCustomerRows(input.records);
      if (Array.isArray(input.customers))
        return extractCustomerRows(input.customers);
      if (Array.isArray(input.result)) return extractCustomerRows(input.result);

      if (input.data && typeof input.data === 'object') {
        const fromData = extractCustomerRows(input.data);
        if (fromData.length > 0) return fromData;
      }
      if (input.body && typeof input.body === 'object') {
        const fromBody = extractCustomerRows(input.body);
        if (fromBody.length > 0) return fromBody;
      }
      if (input.json && typeof input.json === 'object') {
        const fromJson = extractCustomerRows(input.json);
        if (fromJson.length > 0) return fromJson;
      }

      if (
        input.Customer_ID !== undefined ||
        input.customer_id !== undefined ||
        input.CustomerID !== undefined ||
        input.customerId !== undefined ||
        input.Total_Stempel !== undefined ||
        input.total_stempel !== undefined
      ) {
        return [input];
      }

      const values = Object.values(input);
      if (
        values.length > 0 &&
        values.every((v) => v && typeof v === 'object')
      ) {
        const fromValues = extractCustomerRows(values);
        if (fromValues.length > 0) return fromValues;
      }
    }

    return [];
  };

  // 3. Dynamic B2B Data Fetching via n8n Webhook (Google Sheets)
  const fetchB2BCustomers = async () => {
    setIsLoadingB2B(true);
    setB2bError(null);
    try {
      let itemsList: any[] = [];

      // Ambil dari proxy internal /api/dasbor dan langsung ke B2B_WEBHOOK_URL dengan { cache: 'no-store' }
      const [proxyResult, directResult] = await Promise.allSettled([
        fetch('/api/dasbor', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
          cache: 'no-store',
        }).then((r) => (r.ok ? r.json() : null)),
        fetch(B2B_WEBHOOK_URL, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          cache: 'no-store',
        }).then((r) => (r.ok ? r.json() : null)),
      ]);

      const proxyRows =
        proxyResult.status === 'fulfilled'
          ? extractCustomerRows(proxyResult.value)
          : [];
      const directRows =
        directResult.status === 'fulfilled'
          ? extractCustomerRows(directResult.value)
          : [];

      // Gunakan hasil yang memiliki baris terbanyak (atau gabungkan seluruh baris unik dari Google Sheets)
      if (directRows.length >= proxyRows.length && directRows.length > 0) {
        itemsList = directRows;
      } else if (proxyRows.length > 0) {
        itemsList = proxyRows;
      }

      if (itemsList.length === 0) {
        setCustomers([]);
        setIsLoadingB2B(false);
        return;
      }

      // Map according to Google Sheets columns: Customer_ID, Total_Stempel, Total_Klaim
      const mapped: CustomerRecord[] = itemsList.map((item: any, idx: number) => {
        const id = String(
          item.Customer_ID ??
            item.customer_id ??
            item.CustomerID ??
            item.customerId ??
            item.ID ??
            item.id ??
            `SIS-${1000 + idx}`
        ).trim();

        const currentStamps = Math.max(
          0,
          Math.min(
            MAX_STAMPS,
            parseInt(
              String(
                item.Total_Stempel ??
                  item.total_stempel ??
                  item.TotalStempel ??
                  item.stampsAfter ??
                  item.Stempel ??
                  item.stempel ??
                  0
              ),
              10
            ) || 0
          )
        );

        const totalRedeemedStamps = Math.max(
          0,
          parseInt(
            String(
              item.Total_Klaim ??
                item.total_klaim ??
                item.TotalKlaim ??
                item.Klaim ??
                item.klaim ??
                0
            ),
            10
          ) || 0
        );

        const name = String(
          item.Nama ??
            item.nama ??
            item.Customer_Name ??
            item.CustomerName ??
            item.Nama_Pelanggan ??
            item.Name ??
            `Pelanggan ${id}`
        ).trim();

        const email = String(
          item.Email ??
            item.email ??
            `${id.toLowerCase()}@member.sissiheritage.com`
        ).trim();

        const favMenu = String(
          item.Menu_Favorit ?? item.menu_favorit ?? ''
        ).trim();

        const tier = String(
          item.Tier ??
            item.tier ??
            (favMenu
              ? `Favorit: ${favMenu}`
              : totalRedeemedStamps >= 32
              ? 'Sissi VIP Member'
              : 'Sissi Heritage Member')
        );

        const lastVisit = String(
          item.Kunjungan_Terakhir ??
            item.kunjungan_terakhir ??
            item.Last_Visit ??
            item.last_visit ??
            item.Tanggal ??
            item.tanggal ??
            'Tercatat di Sheets'
        );

        return {
          id,
          name,
          email,
          tier,
          currentStamps,
          totalRedeemedStamps,
          lastVisit,
        };
      });

      setCustomers(mapped);
    } catch (err: any) {
      console.error('Error fetching B2B data:', err);
      setB2bError(err?.message || 'Gagal memuat data dari webhook');
    } finally {
      setIsLoadingB2B(false);
    }
  };

  useEffect(() => {
    fetchB2BCustomers();
  }, []);

  const fallbackCustomer: CustomerRecord = useMemo(
    () => ({
      id: localCustomerId || 'SIS-LOCAL-001',
      name: 'Pelanggan Sissi',
      email: 'guest@sissi-heritage.io',
      tier: 'Sissi Heritage Local Pass',
      currentStamps: 0,
      totalRedeemedStamps: 0,
      lastVisit: 'Hari ini',
      isLocalDevice: true,
    }),
    [localCustomerId]
  );

  const activeCustomer: CustomerRecord = useMemo(() => {
    if (selectedCustomerId) {
      const b2bMatch = customers.find((c) => c.id === selectedCustomerId);
      if (b2bMatch) return b2bMatch;
      if (localCustomer && localCustomer.id === selectedCustomerId) return localCustomer;
    }
    return localCustomer || customers[0] || fallbackCustomer;
  }, [customers, selectedCustomerId, localCustomer, fallbackCustomer]);

  const persistLocalCustomerUpdate = (
    customerId: string,
    nextStamps: number,
    nextRedeemed: number
  ) => {
    if (customerId !== localCustomerId) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.CURRENT_STAMPS,
        String(nextStamps)
      );
      window.localStorage.setItem(
        STORAGE_KEYS.REDEEMED_STAMPS,
        String(nextRedeemed)
      );
    } catch {}
  };

  // DeviceOrientation API Listener for Physical Phone Tilt
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      const normalizedBeta = Math.max(-30, Math.min(30, event.beta - 40));
      const normalizedGamma = Math.max(-30, Math.min(30, event.gamma));

      const rx = Number((-normalizedBeta * 0.55).toFixed(2));
      const ry = Number((normalizedGamma * 0.65).toFixed(2));
      const gx = Math.round(50 + (normalizedGamma / 30) * 40);
      const gy = Math.round(50 + (normalizedBeta / 30) * 40);

      setGyroStatus('active');
      setTilt({ rx, ry, gx, gy });
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const requestGyroPermission = async () => {
    try {
      const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
        const permission = await DeviceOrientationEventTyped.requestPermission();
        if (permission === 'granted') {
          setGyroStatus('active');
          triggerToast(t.toastGyroLinked);
        } else {
          triggerToast(t.toastGyroDeclined);
        }
      } else {
        setGyroStatus('active');
        triggerToast(t.toastGyroActive);
      }
    } catch {
      setGyroStatus('simulated');
      triggerToast(t.toastGyroSimulated);
    }
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardStageRef.current) return;
    const rect = cardStageRef.current.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width;
    const yRel = (e.clientY - rect.top) / rect.height;

    const ry = Number(((xRel - 0.5) * 26).toFixed(2));
    const rx = Number(((0.5 - yRel) * 22).toFixed(2));
    const gx = Math.round(xRel * 100);
    const gy = Math.round(yRel * 100);

    setTilt({ rx, ry, gx, gy });
  };

  const handleStagePointerLeave = () => {
    if (gyroStatus !== 'simulated') {
      setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
    }
  };

  const updateCustomerStamps = (customerId: string, delta: number) => {
    if (localCustomer && customerId === localCustomer.id) {
      const nextStamps = Math.max(
        0,
        Math.min(MAX_STAMPS, localCustomer.currentStamps + delta)
      );
      persistLocalCustomerUpdate(customerId, nextStamps, localCustomer.totalRedeemedStamps);
      setLocalCustomer((prev) => (prev ? { ...prev, currentStamps: nextStamps } : null));
    }
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const nextStamps = Math.max(
          0,
          Math.min(MAX_STAMPS, c.currentStamps + delta)
        );
        persistLocalCustomerUpdate(c.id, nextStamps, c.totalRedeemedStamps);
        return {
          ...c,
          currentStamps: nextStamps,
          lastVisit: 'Hari ini',
        };
      })
    );
    if (delta > 0) {
      triggerToast(t.toastIssuedStamp(delta, customerId));
    }
  };

  const setExactStampCount = (
    customerId: string,
    count: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (localCustomer && customerId === localCustomer.id) {
      const target = localCustomer.currentStamps === count ? count - 1 : count;
      const clamped = Math.max(0, Math.min(MAX_STAMPS, target));
      persistLocalCustomerUpdate(customerId, clamped, localCustomer.totalRedeemedStamps);
      setLocalCustomer((prev) => (prev ? { ...prev, currentStamps: clamped } : null));
    }
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const target = c.currentStamps === count ? count - 1 : count;
        const clamped = Math.max(0, Math.min(MAX_STAMPS, target));
        persistLocalCustomerUpdate(c.id, clamped, c.totalRedeemedStamps);
        return {
          ...c,
          currentStamps: clamped,
          lastVisit: 'Hari ini',
        };
      })
    );
  };

  const redeemCustomerReward = (customerId: string) => {
    if (localCustomer && customerId === localCustomer.id) {
      if (localCustomer.currentStamps < MAX_STAMPS) {
        triggerToast(t.toastNeedAllStamps);
        return;
      }
      const nextRedeemed = localCustomer.totalRedeemedStamps + MAX_STAMPS;
      persistLocalCustomerUpdate(customerId, 0, nextRedeemed);
      setLocalCustomer((prev) => (prev ? { ...prev, currentStamps: 0, totalRedeemedStamps: nextRedeemed } : null));
      triggerToast(t.toastRedeemedAll(localCustomer.name));
      return;
    }
    const target = customers.find((c) => c.id === customerId);
    if (!target || target.currentStamps < MAX_STAMPS) {
      triggerToast(t.toastNeedAllStamps);
      return;
    }
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const nextRedeemed = c.totalRedeemedStamps + MAX_STAMPS;
        persistLocalCustomerUpdate(c.id, 0, nextRedeemed);
        return {
          ...c,
          currentStamps: 0,
          totalRedeemedStamps: nextRedeemed,
          lastVisit: 'Hari ini',
        };
      })
    );
    triggerToast(
      t.toastRedeemedAll(
        target.isLocalDevice ? t.localDeviceMemberName : target.name
      )
    );
  };

  const handleAddToHomeScreenClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsPwaInstalled(true);
          setDeferredPrompt(null);
          try {
            window.localStorage.setItem(STORAGE_KEYS.PWA_SHORTCUT_PINNED, 'true');
          } catch {}
          triggerToast(t.toastPwaInstalled(activeCustomer.id));
          return;
        }
      } catch {
        // Fall through to guided PWA shortcut modal
      }
    }
    setActionModal({ type: 'pwa' });
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const displayName = c.isLocalDevice ? t.localDeviceMemberName : c.name;
      const matchesQuery =
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesQuery) return false;
      if (tableFilter === 'ready') return c.currentStamps === MAX_STAMPS;
      if (tableFilter === 'vip') return c.totalRedeemedStamps >= 32;
      return true;
    });
  }, [customers, searchQuery, tableFilter, t.localDeviceMemberName]);

  const b2bStats = useMemo(() => {
    const totalMembers = customers.length;
    const activeStamps = customers.reduce((acc, c) => acc + c.currentStamps, 0);
    const totalRedeemed = customers.reduce(
      (acc, c) => acc + c.totalRedeemedStamps,
      0
    );
    const readyCount = customers.filter(
      (c) => c.currentStamps === MAX_STAMPS
    ).length;
    return { totalMembers, activeStamps, totalRedeemed, readyCount };
  }, [customers]);

  const activeDisplayName = activeCustomer.name;

  const frontCardholderName = useMemo(() => {
    return (activeCustomer.name || 'PELANGGAN SISSI').toUpperCase();
  }, [activeCustomer.name]);

  // Generate and download a standalone single-file HTML version referencing /kartu-depan.png, /kartu-belakang-kosong.png, and /stamp-icon.png
  const handleDownloadSingleFileHtml = () => {
    const singleFileSource = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#0B0D11" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>Sissi Heritage Digital Loyalty Card — PWA</title>
<style>
  :root { --rx: 0deg; --ry: 0deg; --gx: 50%; --gy: 50%; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif; }
  body { background: #0B0D11; color: #F1F5F9; min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden; }
  header { display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .brand { font-weight: 700; font-size: 18px; }
  .btn { background: #F59E0B; color: #0B0D11; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; }
  main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 20px 140px; }
  @keyframes floatCard { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
  .float-wrap { animation: floatCard 5.5s ease-in-out infinite; perspective: 1400px; width: min(480px, 92vw); }
  .card-tilt { width: 100%; aspect-ratio: 2769 / 1742; transform-style: preserve-3d; transform: rotateX(var(--rx)) rotateY(var(--ry)); transition: transform 0.12s ease-out; cursor: pointer; }
  .card-flipper { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1); }
  .card-flipper.flipped { transform: rotateY(180deg); }
  .card-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; }
  .card-front { transform: rotateY(0deg) translateZ(2px); }
  .card-back { transform: rotateY(180deg) translateZ(2px); }
  .card-shell { width: 100%; height: 100%; border-radius: 20px; overflow: hidden; position: relative; box-shadow: 0 28px 60px -12px rgba(0,0,0,0.75); }
  .bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .stamp-grid {
    position: absolute; left: 14.45%; top: 31.06%; width: 71.07%; height: 44.20%;
    display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(2, 1fr);
    column-gap: 4.15%; row-gap: 14.80%; z-index: 10;
  }
  .qr-box {
    position: absolute; left: 79.75%; top: 68.85%; width: 17.02%; height: 27.10%;
    background: #FFFFFF; border-radius: 14%; padding: 4%; display: flex; align-items: center; justify-content: center; z-index: 10;
  }
</style>
</head>
<body>
  <header>
    <div class="brand">Sissi Heritage</div>
    <button class="btn" id="flipBtn">${t.flipToBack}</button>
  </header>
  <main>
    <div class="float-wrap">
      <div class="card-tilt" id="cardTilt">
        <div class="card-flipper" id="cardFlipper">
          <div class="card-face card-front">
            <div class="card-shell" style="position:relative;">
              <img src="/kartu-depan.png?v=3" alt="Front" class="bg-img" />
              <div style="position:absolute;left:5.71%;top:21.42%;max-width:85%;z-index:10;color:#EDE2CC;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;font-size:13px;pointer-events:none;text-shadow:0 1px 2px rgba(0,0,0,0.4);">
                ${frontCardholderName}
              </div>
            </div>
          </div>
          <div class="card-face card-back">
            <div class="card-shell">
              <img src="/kartu-belakang-kosong.png" alt="Back" class="bg-img" />
              <div class="stamp-grid" id="stampGrid"></div>
              <div class="qr-box">
                <img id="qrImg" alt="QR Code" style="width:100%;height:100%;object-fit:contain;" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <script>
    let cid = localStorage.getItem('sissi_anon_customer_id') || '${activeCustomer.id}';
    let cStamps = localStorage.getItem('sissi_anon_current_stamps') || '${activeCustomer.currentStamps}';
    let baseOrigin = window.location.origin || 'https://app.sissiheritage.com';
    document.getElementById('qrImg').src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(baseOrigin + '/kasir?id=' + encodeURIComponent(cid) + '&stamps=' + encodeURIComponent(cStamps));
    const positions = [
      { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 },
      { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }
    ];
    const grid = document.getElementById('stampGrid');
    positions.forEach((pos, idx) => {
      const slot = document.createElement('div');
      slot.style.gridRowStart = pos.r;
      slot.style.gridColumnStart = pos.c;
      slot.style.position = 'relative';
      slot.style.overflow = 'visible';
      slot.style.padding = '8%';
      slot.style.display = 'flex';
      slot.style.alignItems = 'center';
      slot.style.justifyContent = 'center';
      if (idx < ${activeCustomer.currentStamps}) {
        const img = document.createElement('img');
        img.src = idx % 2 === 0 ? '/stamp-roti.png' : '/stamp-kopi.png';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        slot.appendChild(img);
      }
      grid.appendChild(slot);
    });
    const flipper = document.getElementById('cardFlipper');
    let flipped = false;
    function toggleFlip() {
      flipped = !flipped;
      flipper.classList.toggle('flipped', flipped);
    }
    document.getElementById('cardTilt').addEventListener('click', toggleFlip);
    document.getElementById('flipBtn').addEventListener('click', toggleFlip);
  </script>
</body>
</html>`;

    const blob = new Blob([singleFileSource], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sissi-heritage-loyalty-pwa-${lang}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(t.toastExportHtml);
  };

  return (
    <div
      className="min-h-screen bg-[#000000] text-[#F5F5F7] antialiased flex flex-col relative overflow-x-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* Embedded Keyframes, 3D Backface-Visibility & Holographic Overlay Styles */}
      <style>{`
        @keyframes floatCardContinuous {
          0%, 100% {
            transform: translate3d(0, 0px, 0) rotateZ(0deg);
          }
          50% {
            transform: translate3d(0, -12px, 0) rotateZ(0.3deg);
          }
        }
        @keyframes holoShimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .metal-card-floating {
          animation: floatCardContinuous 5.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          will-change: transform;
        }
        .perspective-stage {
          perspective: 1400px;
          -webkit-perspective: 1400px;
        }
        .card-3d-tilt {
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          transition: transform 140ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .card-3d-flipper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          transition: transform 740ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .card-3d-flipper.is-flipped {
          transform: rotateY(180deg);
          -webkit-transform: rotateY(180deg);
        }
        .card-face-plane {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 20px;
        }
        .card-face-front-plane {
          transform: rotateY(0deg) translateZ(2px);
          -webkit-transform: rotateY(0deg) translateZ(2px);
          z-index: 2;
        }
        .card-face-back-plane {
          transform: rotateY(180deg) translateZ(2px);
          -webkit-transform: rotateY(180deg) translateZ(2px);
          z-index: 1;
        }
        .card-surface-shell {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 30px 65px -15px rgba(0, 0, 0, 0.85),
            0 0 0 1px rgba(255, 255, 255, 0.22),
            inset 0 1px 1px rgba(255, 255, 255, 0.35);
        }
        .holographic-sheen {
          background: linear-gradient(
            125deg,
            transparent 16%,
            rgba(255, 210, 130, 0.22) 32%,
            rgba(130, 240, 220, 0.18) 44%,
            rgba(180, 160, 255, 0.18) 55%,
            rgba(255, 160, 200, 0.18) 66%,
            transparent 82%
          );
          background-size: 220% 220%;
          animation: holoShimmer 6.5s ease-in-out infinite;
          mix-blend-mode: soft-light;
        }
        @media (prefers-reduced-motion: reduce) {
          .metal-card-floating,
          .holographic-sheen {
            animation: none !important;
          }
        }
      `}</style>

      {/* Apple Ultra-Minimalist Top Navigation Bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 lg:px-10 h-11 border-b border-white/[0.08]"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}
      >
        <a
          href="#top"
          className="text-[14px] font-semibold tracking-[-0.025em] leading-[1.06] text-[#F5F5F7] whitespace-nowrap shrink-0"
        >
          Sissi Heritage
        </a>

        <nav className="hidden md:flex items-center gap-7">
          <button
            type="button"
            onClick={() => {
              setViewMode('split');
              setIsFlipped(false);
            }}
            className="text-[12px] font-normal tracking-[-0.01em] text-[#F5F5F7]/80 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.navFront}
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('split');
              setIsFlipped(true);
            }}
            className="text-[12px] font-normal tracking-[-0.01em] text-[#F5F5F7]/80 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.navGrid}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsFlipped(true);
              handleAddToHomeScreenClick();
            }}
            className="text-[12px] font-normal tracking-[-0.01em] text-[#F5F5F7]/80 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.navPwa}
          </button>
          <button
            type="button"
            onClick={() =>
              setViewMode((prev) =>
                prev === 'dashboard' ? 'split' : 'dashboard'
              )
            }
            className="text-[12px] font-normal tracking-[-0.01em] text-[#F5F5F7]/80 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.navB2B}
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => updateCustomerStamps(activeCustomer.id, 1)}
            className="bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal tracking-[-0.01em] px-[18px] py-[6px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.ctaIssueStamp}
          </button>
        </div>
      </header>

      {/* Workspace Control Bar (Below the Top Bar) */}
      <div className="border-b border-white/[0.06] bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Clean Unboxed Metadata showing Anonymous LocalStorage Status */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#86868B]">
            <span className="text-[#F5F5F7] font-medium flex items-center gap-1.5">
              <span>{activeDisplayName}</span>
              {activeCustomer.isLocalDevice && (
                <button
                  type="button"
                  onClick={() =>
                    setActionModal({
                      type: 'name',
                      nameInput: activeCustomer.name,
                    })
                  }
                  className="text-[11px] text-[#86868B] hover:text-[#2997FF] underline cursor-pointer"
                  title="Ganti Nama Pemilik Kartu"
                >
                  (Ubah Nama)
                </button>
              )}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-[#2997FF] font-semibold">
              {activeCustomer.id}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-[#F5F5F7]/90">
              {activeCustomer.currentStamps} / {MAX_STAMPS} {t.stampsActive}
            </span>
            {activeCustomer.isLocalDevice && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">
                  {t.localSavedBadge}
                </span>
              </>
            )}
          </div>

          {/* Interactive Language Selector, Workspace Mode Toggles & Single-File HTML Export */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Pilihan Bahasa / Language Selector"
              className="flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#86868B] mr-0.5 shrink-0" />
              <button
                type="button"
                onClick={() => {
                  setLang('id');
                  triggerToast(TRANSLATIONS.id.toastLangChanged);
                }}
                className={`bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'id'
                    ? 'border-[#2997FF] text-[#2997FF]'
                    : 'border-white/[0.08] text-[#F5F5F7]'
                }`}
              >
                ID · Indonesia
              </button>
              <button
                type="button"
                onClick={() => {
                  setLang('en');
                  triggerToast(TRANSLATIONS.en.toastLangChanged);
                }}
                className={`bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'en'
                    ? 'border-[#2997FF] text-[#2997FF]'
                    : 'border-white/[0.08] text-[#F5F5F7]'
                }`}
              >
                EN · English
              </button>
            </div>

            <div
              role="group"
              aria-label="Workspace View Mode"
              className="flex items-center gap-1.5"
            >
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'split'
                    ? 'border-[#2997FF] text-[#2997FF]'
                    : 'border-white/[0.08] text-[#F5F5F7]'
                }`}
              >
                {t.modeSplit}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('pass')}
                className={`bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'pass'
                    ? 'border-[#2997FF] text-[#2997FF]'
                    : 'border-white/[0.08] text-[#F5F5F7]'
                }`}
              >
                {t.modePass}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className={`bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'dashboard'
                    ? 'border-[#2997FF] text-[#2997FF]'
                    : 'border-white/[0.08] text-[#F5F5F7]'
                }`}
              >
                {t.modeDashboard}
              </button>
            </div>

            <a
              href={`/kasir?id=${encodeURIComponent(activeCustomer.id)}&stamps=${activeCustomer.currentStamps}`}
              className="inline-flex items-center gap-1.5 bg-[#161618] hover:bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer"
              title="Buka Portal Kasir (/kasir)"
            >
              <span>{lang === 'id' ? 'Portal Kasir' : 'Cashier Portal'}</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadSingleFileHtml}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#161618] hover:bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer"
              title={t.exportHtml}
            >
              <Download className="w-3.5 h-3.5 text-[#2997FF]" />
              <span>{t.exportHtml}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main
        id="top"
        className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-10 py-8 pb-44 space-y-12"
      >
        {/* SECTION 1: 3D CUSTOM DESIGN LOYALTY CARD & INTERACTIVE TELEMETRY */}
        {viewMode !== 'dashboard' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 Columns: 3D Floating Card Stage */}
            <div
              ref={cardStageRef}
              onPointerMove={handleStagePointerMove}
              onPointerLeave={handleStagePointerLeave}
              className="lg:col-span-7 relative bg-[#161618] rounded-[24px] p-6 sm:p-10 border border-white/[0.06] shadow-2xl flex flex-col items-center justify-between min-h-[460px] select-none overflow-hidden"
            >
              {/* Subtle Ambient Stage Illumination */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[480px] h-[260px] rounded-full opacity-25 blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(239,229,209,0.28) 0%, rgba(74,73,40,0.28) 55%, transparent 80%)',
                }}
              />

              {/* Top Stage Bar */}
              <div className="w-full flex items-center justify-between gap-4 z-10">
                <div className="text-xs text-[#86868B] flex items-center gap-2">
                  <span className="font-medium text-[#F5F5F7]">
                    {isFlipped ? t.stageBackLabel : t.stageFrontLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-[#86868B]">
                    {t.tiltLabel} {tilt.rx.toFixed(1)}° / {tilt.ry.toFixed(1)}°
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionModal({
                        type: 'name',
                        nameInput: activeCustomer.name,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#161618] hover:bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] hover:border-[#2997FF] text-[13px] px-[14px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer"
                    title={lang === 'id' ? 'Ubah Nama Pemilik Kartu' : 'Edit Cardholder Name'}
                  >
                    <User className="w-3.5 h-3.5 text-[#2997FF]" />
                    <span>{lang === 'id' ? 'Ubah Nama' : 'Edit Name'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 bg-[#161618] hover:bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#2997FF]" />
                    <span>{isFlipped ? t.flipToFront : t.flipToBack}</span>
                  </button>
                </div>
              </div>

              {/* Centerpiece: Continuous Floating Wrapper -> DeviceOrientation 3D Tilt -> 3D Flip Card */}
              <div className="my-8 w-full flex items-center justify-center z-10 perspective-stage">
                <div className="metal-card-floating w-full max-w-[480px]">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={t.cardAriaLabel}
                    onClick={() => setIsFlipped((prev) => !prev)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsFlipped((prev) => !prev);
                      }
                    }}
                    className="card-3d-tilt w-full aspect-[2769/1742] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-[20px]"
                    style={{
                      transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                    }}
                  >
                    <div
                      className={`card-3d-flipper ${isFlipped ? 'is-flipped' : ''}`}
                    >
                      {/* ================= CARD FRONT FACE (/kartu-depan.png) ================= */}
                      <div
                        aria-hidden={isFlipped}
                        className={`card-face-plane card-face-front-plane transition-opacity duration-200 ${
                          isFlipped
                            ? 'opacity-0 pointer-events-none delay-150'
                            : 'opacity-100 delay-75'
                        }`}
                      >
                        <div
                          className="card-surface-shell bg-[#4A4928] relative"
                          style={{ containerType: 'inline-size' }}
                        >
                          {/* Custom Front Face Background Asset */}
                          <img
                            src="/kartu-depan.png?v=3"
                            alt="Sissi Heritage Loyalty Card Front"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                          />

                          {/* Dynamic Cardholder Name (menyesuaikan nama pemilik kartu di bawah 'loyalty card') */}
                          <div
                            className="absolute z-30 pointer-events-none select-none overflow-hidden"
                            style={{
                              left: '5.71%',
                              top: '21.42%',
                              maxWidth: '52%',
                            }}
                          >
                            <span
                              className="font-medium uppercase text-[#EDE2CC] truncate block"
                              style={{
                                letterSpacing: '0.14em',
                                fontSize: 'clamp(10px, 3.1cqi, 16px)',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.45)',
                                lineHeight: 1.15,
                              }}
                            >
                              {frontCardholderName}
                            </span>
                          </div>

                          {/* Dynamic Holographic Foil Overlay on top of /kartu-depan.png */}
                          <div
                            aria-hidden="true"
                            className="holographic-sheen pointer-events-none absolute inset-0 opacity-80 z-20"
                          />

                          {/* Dynamic Specular Glare following DeviceOrientation / Gyroscope */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 transition-opacity duration-200 z-20"
                            style={{
                              background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255, 255, 255, 0.28) 0%, rgba(251, 191, 36, 0.10) 30%, transparent 64%)`,
                            }}
                          />
                        </div>
                      </div>

                      {/* ================= CARD BACK FACE (/kartu-belakang-kosong.png + 8 Stamp Grid + QR) ================= */}
                      <div
                        aria-hidden={!isFlipped}
                        className={`card-face-plane card-face-back-plane transition-opacity duration-200 ${
                          isFlipped
                            ? 'opacity-100 delay-75'
                            : 'opacity-0 pointer-events-none delay-150'
                        }`}
                      >
                        <div className="card-surface-shell bg-[#EFE5D1]">
                          {/* Custom Back Face Base Asset (/kartu-belakang-kosong.png) */}
                          <img
                            src="/kartu-belakang-kosong.png"
                            alt="Sissi Heritage Loyalty Card Back"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                          />

                          {/* Top-Right Anonymous Customer ID Badge */}
                          <div className="absolute top-[7.5%] right-[5.5%] z-10 pointer-events-none">
                            <span className="font-mono tabular-nums text-[10px] sm:text-xs font-semibold text-[#4A4928]/85 tracking-wider">
                              ID · {activeCustomer.id}
                            </span>
                          </div>

                          {/* =========================================================
                              8-STAMP CSS GRID OVERLAY
                              Matches the exact visual placement of the 8 empty circles
                              on /kartu-belakang-kosong.png:
                              - Bounding box: left 14.45%, top 31.06%, width 71.07%, height 44.20%
                              - 5 columns x 2 rows (Row 1: cols 1..5, Row 2: cols 2..4)
                          ========================================================= */}
                          <div
                            className="absolute z-10 grid grid-cols-5 grid-rows-2 overflow-visible"
                            style={{
                              left: '14.45%',
                              top: '31.06%',
                              width: '71.07%',
                              height: '44.20%',
                              columnGap: '4.15%',
                              rowGap: '14.80%',
                            }}
                          >
                            {STAMP_SLOTS.map((slot, index) => {
                              const isStamped =
                                slot.index <= activeCustomer.currentStamps;
                              const stampSrc =
                                index % 2 === 0
                                  ? '/stamp-roti.png'
                                  : '/stamp-kopi.png';
                              return (
                                <button
                                  key={slot.index}
                                  type="button"
                                  onClick={(e) =>
                                    setExactStampCount(
                                      activeCustomer.id,
                                      slot.index,
                                      e
                                    )
                                  }
                                  title={`${t.toggleStampTitle}${slot.index}`}
                                  aria-label={`Stamp circle ${slot.index}`}
                                  className={`${slot.gridClass} relative w-full h-full rounded-full overflow-visible p-[8%] flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A4928] transition-transform active:scale-95`}
                                >
                                  {isStamped && (
                                    <div className="w-full h-full flex items-center justify-center overflow-visible">
                                      <img
                                        src={stampSrc}
                                        alt={`Stamp ${slot.index}`}
                                        style={{ objectFit: 'contain' }}
                                        className="w-full h-full max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-300 scale-100 block"
                                      />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* =========================================================
                              DYNAMIC <img /> QR CODE OVERLAY
                              Positioned strictly inside the white 'TEMPAT QR CODE'
                              bounding box at bottom-right of /kartu-belakang-kosong.png:
                              left: 79.75%, top: 68.85%, width: 17.02%, height: 27.10%
                          ========================================================= */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            title={`${appOrigin}/kasir?id=${activeCustomer.id}&stamps=${activeCustomer.currentStamps}`}
                            className="absolute z-10 bg-white flex items-center justify-center p-[1.2%] overflow-hidden"
                            style={{
                              left: '79.75%',
                              top: '68.85%',
                              width: '17.02%',
                              height: '27.10%',
                              borderRadius: '14%',
                            }}
                          >
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                                `${appOrigin}/kasir?id=${encodeURIComponent(activeCustomer.id)}&stamps=${activeCustomer.currentStamps}`
                              )}`}
                              alt="QR Code"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain block"
                            />
                          </div>

                          {/* Holographic & Specular Overlays on top of /kartu-belakang-kosong.png */}
                          <div
                            aria-hidden="true"
                            className="holographic-sheen pointer-events-none absolute inset-0 opacity-70 z-20"
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-20"
                            style={{
                              background: `radial-gradient(circle at ${100 - tilt.gx}% ${tilt.gy}%, rgba(255, 255, 255, 0.26) 0%, transparent 60%)`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stage Helper Bar */}
              <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs text-[#86868B] z-10">
                <span>{t.stageFooterHint}</span>
                <span className="font-mono tabular-nums text-[#2997FF]">
                  {isFlipped ? t.drawerActiveBelow : t.flipForWalletActions}
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Pass Controls & DeviceOrientation Gyro Simulator */}
            <div className="lg:col-span-5 bg-[#161618] rounded-[24px] p-6 border border-white/[0.06] shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 gap-3">
                  <div>
                    <h1 className="text-lg font-semibold tracking-[-0.025em] leading-[1.06] text-[#F5F5F7]">
                      {t.studioTitle}
                    </h1>
                    <p className="text-xs text-[#86868B] mt-1">
                      {t.studioSubtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={requestGyroPermission}
                    className={`inline-flex items-center gap-1.5 bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      gyroStatus === 'active'
                        ? 'border-[#2997FF] text-[#2997FF]'
                        : 'border-white/[0.08] text-[#F5F5F7]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#2997FF]" />
                    <span>
                      {gyroStatus === 'active'
                        ? t.gyroLinked
                        : t.pairMotionSensor}
                    </span>
                  </button>
                </div>

                {/* Anonymous LocalStorage Pass Indicator + Profile Switcher */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="member-select"
                      className="font-medium text-[#86868B]"
                    >
                      {t.activeCardholderProfile}
                    </label>
                    <span className="font-mono tabular-nums text-[11px] text-emerald-400 flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      <span>localStorage: {localCustomerId}</span>
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      id="member-select"
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full bg-[#000000] border border-white/[0.08] focus:border-[#0071E3] rounded-full pl-4 pr-10 py-2.5 text-[14px] text-[#F5F5F7] outline-none appearance-none cursor-pointer transition-all"
                    >
                      {customers.map((c, idx) => (
                        <option
                          key={`${c.id}-${idx}`}
                          value={c.id}
                          className="bg-[#161618] text-[#F5F5F7]"
                        >
                          {c.name} — {c.id} ({c.currentStamps}/{MAX_STAMPS}{' '}
                          {t.stampsWord})
                        </option>
                      ))}
                      {localCustomer &&
                        !customers.some((c) => c.id === localCustomer.id) && (
                          <option
                            value={localCustomer.id}
                            className="bg-[#161618] text-[#F5F5F7]"
                          >
                            {t.localDeviceMemberName} — {localCustomer.id} (
                            {localCustomer.currentStamps}/{MAX_STAMPS}{' '}
                            {t.stampsWord})
                          </option>
                        )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#86868B] pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Stamp Issuance & Redemption Controls (8 Stamps) */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#F5F5F7] font-medium">
                      {t.stampProgress} ({activeCustomer.currentStamps} /{' '}
                      {MAX_STAMPS})
                    </span>
                    <span className="font-mono tabular-nums text-[#86868B]">
                      {t.lifetimeRedeemed}: {activeCustomer.totalRedeemedStamps}
                    </span>
                  </div>

                  {/* Clean Segmented 8-Stamp Progress Bar */}
                  <div className="grid grid-cols-8 gap-1.5 h-2">
                    {Array.from({ length: MAX_STAMPS }, (_, idx) => (
                      <div
                        key={idx}
                        className={`rounded-full transition-colors ${
                          idx < activeCustomer.currentStamps
                            ? 'bg-[#0071E3]'
                            : 'bg-white/[0.08]'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => updateCustomerStamps(activeCustomer.id, -1)}
                      disabled={activeCustomer.currentStamps <= 0}
                      className="bg-[#161618] hover:bg-[#2C2C2E] disabled:opacity-40 text-[#F5F5F7] border border-white/[0.08] text-[13px] px-[16px] py-[8px] rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>{t.btnRemove}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateCustomerStamps(activeCustomer.id, 1);
                        if (!isFlipped) setIsFlipped(true);
                      }}
                      disabled={activeCustomer.currentStamps >= MAX_STAMPS}
                      className="bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-40 text-white text-[13px] font-normal tracking-[-0.01em] px-[18px] py-[8px] rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.btnStampPlus}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => redeemCustomerReward(activeCustomer.id)}
                      className={`text-[13px] px-[16px] py-[8px] rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                        activeCustomer.currentStamps === MAX_STAMPS
                          ? 'bg-[#161618] hover:bg-[#2C2C2E] border-[#2997FF] text-[#2997FF]'
                          : 'bg-[#161618] text-[#86868B] border-white/[0.08]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{t.btnRedeemAll}</span>
                    </button>
                  </div>
                </div>

                {/* DeviceOrientation Tilt Calibration Sliders */}
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#F5F5F7] flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#2997FF]" />
                      <span>{t.gyroSimulatorTitle}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setGyroStatus('idle');
                        setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
                      }}
                      className="text-xs text-[#86868B] hover:text-[#F5F5F7] transition-colors cursor-pointer"
                    >
                      {t.resetAxis}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-[#86868B]">
                        <span>{t.pitchLabel}</span>
                        <span className="font-mono tabular-nums text-[#F5F5F7]">
                          {tilt.rx}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-24}
                        max={24}
                        step={1}
                        value={tilt.rx}
                        onChange={(e) => {
                          const rx = Number(e.target.value);
                          setGyroStatus('simulated');
                          setTilt((prev) => ({
                            ...prev,
                            rx,
                            gy: Math.round(50 - (rx / 24) * 40),
                          }));
                        }}
                        className="w-full accent-[#0071E3] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-[#86868B]">
                        <span>{t.rollLabel}</span>
                        <span className="font-mono tabular-nums text-[#F5F5F7]">
                          {tilt.ry}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-24}
                        max={24}
                        step={1}
                        value={tilt.ry}
                        onChange={(e) => {
                          const ry = Number(e.target.value);
                          setGyroStatus('simulated');
                          setTilt((prev) => ({
                            ...prev,
                            ry,
                            gx: Math.round(50 + (ry / 24) * 40),
                          }));
                        }}
                        className="w-full accent-[#0071E3] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flip Action CTA */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <div className="text-xs text-[#86868B]">
                  {isFlipped ? t.drawerHintOpen : t.drawerHintClosed}
                </div>
                <button
                  type="button"
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className="bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal tracking-[-0.01em] px-[18px] py-[8px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isFlipped ? t.showFrontFace : t.flipAndOpenDrawer}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: TOGGLEABLE B2B MERCHANT DASHBOARD (APPLE BENTO GRID & GLASSOS TABLE) */}
        {viewMode !== 'pass' && (
          <section aria-label={t.b2bTitle} className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] leading-[1.06] text-[#F5F5F7]">
                  {t.b2bTitle}
                </h2>
                <p className="text-sm text-[#86868B] mt-1.5">{t.b2bSubtitle}</p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => fetchB2BCustomers()}
                  disabled={isLoadingB2B}
                  className="inline-flex items-center gap-2 bg-[#161618] hover:bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] hover:border-[#2997FF] text-[13px] px-4 py-2 rounded-full transition-all cursor-pointer disabled:opacity-50"
                  title="Segarkan data dari Google Sheets"
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 text-[#2997FF] ${
                      isLoadingB2B ? 'animate-spin' : ''
                    }`}
                  />
                  <span>
                    {isLoadingB2B
                      ? lang === 'id'
                        ? 'Menyinkronkan...'
                        : 'Syncing...'
                      : lang === 'id'
                      ? 'Segarkan Google Sheets'
                      : 'Sync Google Sheets'}
                  </span>
                </button>
              </div>
            </div>

            {/* Apple Bento Grid Metric Cards (4 Summary Metric Containers) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#161618] rounded-[24px] p-6 border border-white/[0.06] shadow-2xl">
                <div className="text-xs font-medium text-[#86868B]">
                  {t.kpiRegistered}
                </div>
                <div className="mt-3 text-[40px] md:text-[48px] font-semibold tracking-tight leading-none font-mono tabular-nums bg-gradient-to-b from-white via-[#F5F5F7] to-[#86868B] bg-clip-text text-transparent">
                  {b2bStats.totalMembers}
                </div>
              </div>

              <div className="bg-[#161618] rounded-[24px] p-6 border border-white/[0.06] shadow-2xl">
                <div className="text-xs font-medium text-[#86868B]">
                  {t.kpiTotalRedeemed}
                </div>
                <div className="mt-3 text-[40px] md:text-[48px] font-semibold tracking-tight leading-none font-mono tabular-nums bg-gradient-to-b from-[#64D2FF] via-[#2997FF] to-[#0071E3] bg-clip-text text-transparent">
                  {b2bStats.totalRedeemed}
                </div>
              </div>

              <div className="bg-[#161618] rounded-[24px] p-6 border border-white/[0.06] shadow-2xl">
                <div className="text-xs font-medium text-[#86868B]">
                  {t.kpiActiveUnredeemed}
                </div>
                <div className="mt-3 text-[40px] md:text-[48px] font-semibold tracking-tight leading-none font-mono tabular-nums bg-gradient-to-b from-white via-[#F5F5F7] to-[#86868B] bg-clip-text text-transparent">
                  {b2bStats.activeStamps}
                </div>
              </div>

              <div className="bg-[#161618] rounded-[24px] p-6 border border-white/[0.06] shadow-2xl">
                <div className="text-xs font-medium text-[#86868B]">
                  {t.kpiRewardsReady}
                </div>
                <div className="mt-3 text-[40px] md:text-[48px] font-semibold tracking-tight leading-none font-mono tabular-nums bg-gradient-to-b from-[#6EE7B7] via-[#34D399] to-[#10B981] bg-clip-text text-transparent">
                  {b2bStats.readyCount}
                </div>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#86868B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-[#161618] border border-white/[0.08] focus:border-[#0071E3] rounded-full pl-10 pr-4 py-2 text-[14px] text-[#F5F5F7] placeholder-[#86868B] outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 self-start">
                <button
                  type="button"
                  onClick={() => setTableFilter('all')}
                  className={`bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    tableFilter === 'all'
                      ? 'border-[#2997FF] text-[#2997FF]'
                      : 'border-white/[0.08] text-[#F5F5F7]'
                  }`}
                >
                  {t.filterAll}
                </button>
                <button
                  type="button"
                  onClick={() => setTableFilter('ready')}
                  className={`bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    tableFilter === 'ready'
                      ? 'border-[#2997FF] text-[#2997FF]'
                      : 'border-white/[0.08] text-[#F5F5F7]'
                  }`}
                >
                  {t.filterReady}
                </button>
                <button
                  type="button"
                  onClick={() => setTableFilter('vip')}
                  className={`bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    tableFilter === 'vip'
                      ? 'border-[#2997FF] text-[#2997FF]'
                      : 'border-white/[0.08] text-[#F5F5F7]'
                  }`}
                >
                  {t.filterVip}
                </button>
              </div>
            </div>

            {/* B2B Customer Data Table (GlassOS Bento Container) */}
            <div className="bg-[#161618] rounded-[24px] border border-white/[0.06] shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[12px] font-medium text-[#86868B] border-b border-white/[0.06] uppercase tracking-wider">
                      <th className="py-4 px-5">{t.thCustomerId}</th>
                      <th className="py-4 px-5">{t.thCustomerName}</th>
                      <th className="py-4 px-5">{t.thActiveGrid}</th>
                      <th className="py-4 px-5 text-right">
                        {t.thTotalRedeemed}
                      </th>
                      <th className="py-4 px-5 text-right">
                        {t.thMerchantActions}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingB2B ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <div className="inline-flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-2 border-white/[0.12] border-t-[#2997FF] rounded-full animate-spin" />
                            <p className="text-sm font-medium text-[#F5F5F7]">
                              {lang === 'id'
                                ? 'Mengambil data dari Google Sheets...'
                                : 'Fetching customer records from Google Sheets...'}
                            </p>
                            <span className="text-[11px] font-mono text-[#86868B] bg-black/40 px-3 py-1 rounded-full border border-white/[0.06]">
                              GET /webhook/get-dasbor-sissi
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-3 px-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#1D1D1F] border border-white/[0.08] flex items-center justify-center text-[#86868B]">
                              <Users className="w-6 h-6 text-[#2997FF]" />
                            </div>
                            <h3 className="text-base font-semibold text-[#F5F5F7] tracking-tight">
                              {searchQuery
                                ? lang === 'id'
                                  ? 'Pelanggan Tidak Ditemukan'
                                  : 'No Customers Found'
                                : lang === 'id'
                                ? 'Belum Ada Data Pelanggan'
                                : 'No Customer Records'}
                            </h3>
                            <p className="text-xs text-[#86868B] leading-relaxed">
                              {searchQuery
                                ? `${t.noRecordsMatch} "${searchQuery}".`
                                : lang === 'id'
                                ? 'Respons webhook dari Google Sheets saat ini mengembalikan 0 data pelanggan. Transaksi baru yang diinput kasir akan otomatis tercatat dan muncul di sini.'
                                : 'Google Sheets webhook currently returned 0 customer records. New transactions recorded by the cashier will appear here automatically.'}
                            </p>
                            <button
                              type="button"
                              onClick={() => fetchB2BCustomers()}
                              className="mt-2 inline-flex items-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              <span>
                                {lang === 'id'
                                  ? 'Muat Ulang Data'
                                  : 'Reload Data'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer, idx) => {
                        const isSelected = customer.id === activeCustomer.id;
                        return (
                          <tr
                            key={`${customer.id}-${idx}`}
                            onClick={() => setSelectedCustomerId(customer.id)}
                            className={`border-b border-white/[0.04] transition-colors text-[14px] text-[#F5F5F7] cursor-pointer ${
                              isSelected
                                ? 'bg-[#0071E3]/[0.08] hover:bg-[#0071E3]/[0.12]'
                                : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <td className="py-4 px-5">
                              <span className="font-mono tabular-nums text-xs text-[#2997FF] font-semibold">
                                {customer.id}
                              </span>
                            </td>

                            <td className="py-4 px-5">
                              <div className="font-semibold text-[#F5F5F7] flex items-center gap-2">
                                <span>{customer.name}</span>
                                {isSelected && (
                                  <span className="text-[11px] font-normal text-[#2997FF]">
                                    {t.activeOn3dCard}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[#86868B] mt-0.5">
                                {customer.email} · {customer.tier}
                              </div>
                            </td>

                            <td className="py-4 px-5">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono tabular-nums text-xs text-[#86868B] w-12">
                                  {customer.currentStamps} / {MAX_STAMPS}
                                </span>
                                <div className="w-24 h-2 rounded-full bg-white/[0.08] overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      customer.currentStamps === MAX_STAMPS
                                        ? 'bg-emerald-400'
                                        : 'bg-[#0071E3]'
                                    }`}
                                    style={{
                                      width: `${
                                        (customer.currentStamps / MAX_STAMPS) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-5 text-right font-mono tabular-nums font-semibold text-[#F5F5F7]">
                              {customer.totalRedeemedStamps}
                            </td>

                            <td
                              className="py-4 px-5 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="inline-flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCustomerStamps(customer.id, 1)
                                  }
                                  disabled={customer.currentStamps >= MAX_STAMPS}
                                  className="bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-40 text-white text-[13px] font-normal tracking-[-0.01em] px-[18px] py-[8px] rounded-full transition-all cursor-pointer whitespace-nowrap"
                                >
                                  {t.btnStampPlus}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    redeemCustomerReward(customer.id)
                                  }
                                  disabled={customer.currentStamps < MAX_STAMPS}
                                  className={`bg-[#161618] hover:bg-[#2C2C2E] border text-[13px] px-[16px] py-[7px] rounded-full transition-all cursor-pointer whitespace-nowrap ${
                                    customer.currentStamps === MAX_STAMPS
                                      ? 'border-[#2997FF] text-[#2997FF]'
                                      : 'border-white/[0.08] text-[#86868B] opacity-50'
                                  }`}
                                >
                                  {t.btnRedeemAll}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Watermark: Powered by Viyond (B2B Dashboard Footer) */}
            <div className="flex items-center justify-center pt-8 pb-4 select-none">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161618] border border-white/[0.06] opacity-50 hover:opacity-85 transition-opacity">
                <span className="text-[11px] font-normal tracking-tight text-[#86868B]">
                  Powered by
                </span>
                <img
                  src="/viyond-logo.png"
                  alt="Viyond"
                  className="h-5 w-auto object-contain"
                />
                <span className="text-[12px] font-medium tracking-tight text-[#F5F5F7]">
                  Viyond
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================================
          SLIDE-UP ACTION MENU DRAWER
          Strictly triggered when the card flips to the back (isFlipped === true)
          Contains 'Add to Home Screen' (PWA shortcut) and 'Email Backup'
      ===================================================================== */}
      <aside
        aria-label="PWA Home Screen and Backup Slide-Up Action Menu"
        aria-hidden={!isFlipped}
        className={`fixed left-0 right-0 bottom-0 z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isFlipped
            ? 'translate-y-0 pointer-events-auto'
            : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="max-w-2xl mx-auto px-4">
          <div
            className="rounded-t-[24px] bg-[#161618]/90 border-t border-x border-white/[0.08] shadow-[0_-20px_50px_rgba(0,0,0,0.85)] px-6 pt-3 pb-6"
            style={{
              backdropFilter: 'saturate(180%) blur(20px)',
              WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            }}
          >
            {/* Drag Handle Affordance */}
            <div className="w-10 h-1.5 bg-white/[0.2] rounded-full mx-auto mb-3" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-[#86868B]">
                <span className="font-semibold text-[#F5F5F7]">
                  {t.drawerHeader}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[#2997FF]">
                  {activeCustomer.id}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#86868B]">
                  {activeCustomer.currentStamps}/{MAX_STAMPS} {t.stampsWord}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="text-xs text-[#86868B] hover:text-[#F5F5F7] transition-colors self-end sm:self-auto cursor-pointer"
              >
                {t.flipFrontToDismiss}
              </button>
            </div>

            {/* 2 Action Buttons: 'Add to Home Screen' (PWA) & 'Email Backup' */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToHomeScreenClick}
                className="min-h-[46px] bg-[#161618] hover:bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] text-[13px] px-[16px] py-[10px] rounded-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer whitespace-nowrap"
              >
                <Home className="w-4 h-4 text-[#2997FF] shrink-0" />
                <span>{t.btnAddToHomeScreen}</span>
                {isPwaInstalled && (
                  <Check className="w-3.5 h-3.5 text-emerald-400 ml-1 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setActionModal({
                    type: 'email',
                    emailInput: activeCustomer.email,
                  })
                }
                className="min-h-[46px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal tracking-[-0.01em] px-[18px] py-[10px] rounded-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer whitespace-nowrap"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>{t.btnEmailBackup}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          INTERACTIVE MODAL FOR 'ADD TO HOME SCREEN' (PWA) OR 'EMAIL BACKUP'
      ===================================================================== */}
      {actionModal.type && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActionModal({ type: null })}
        >
          <div
            className="w-full max-w-md rounded-[24px] bg-[#161618] border border-white/[0.08] p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-base font-semibold tracking-[-0.025em] leading-[1.06] text-[#F5F5F7]">
                {actionModal.type === 'pwa'
                  ? t.modalPwaTitle
                  : actionModal.type === 'name'
                  ? (lang === 'id' ? 'Ubah Nama Pemilik Kartu' : 'Edit Cardholder Name')
                  : t.modalEmailTitle}
              </h3>
              <button
                type="button"
                onClick={() => setActionModal({ type: null })}
                className="p-1 text-[#86868B] hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {actionModal.type === 'pwa' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#000000] border border-white/[0.06] space-y-2.5 text-xs">
                  <div className="flex items-center gap-3 pb-2 border-b border-white/[0.06]">
                    <div className="w-11 h-11 rounded-xl bg-[#4A4928] border border-white/[0.12] flex items-center justify-center font-bold text-[#EFE5D1] text-base shrink-0">
                      sissi
                    </div>
                    <div>
                      <div className="font-semibold text-[#F5F5F7] text-sm">
                        Sissi Heritage Loyalty Card
                      </div>
                      <div className="text-[#86868B] text-[11px]">
                        PWA Standalone Shortcut · /manifest.webmanifest
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868B]">{t.modalLocalIdLabel}</span>
                    <span className="font-mono tabular-nums text-[#2997FF] font-semibold">
                      {activeCustomer.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868B]">{t.modalStorageState}</span>
                    <span className="text-emerald-400 font-medium">
                      {t.modalStoragePermanent}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868B]">{t.modalSyncedBalance}</span>
                    <span className="font-mono tabular-nums text-[#F5F5F7]">
                      {activeCustomer.currentStamps} / {MAX_STAMPS}{' '}
                      {t.stampsWord}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#000000]/80 border border-white/[0.06] space-y-2 text-xs text-[#86868B] leading-relaxed">
                  <div className="font-semibold text-[#F5F5F7] flex items-center gap-1.5">
                    <Share className="w-3.5 h-3.5 text-[#2997FF]" />
                    <span>{t.pwaInstructionsTitle}</span>
                  </div>
                  {isIOS ? (
                    <div className="space-y-1 text-[#F5F5F7]/90">
                      <p>{t.pwaIosStep1}</p>
                      <p>{t.pwaIosStep2}</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-[#F5F5F7]/90">
                      <p>{t.pwaAndroidStep}</p>
                      <p className="text-[#86868B]">{t.pwaIosStep1}</p>
                      <p className="text-[#86868B]">{t.pwaIosStep2}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActionModal({ type: null })}
                    className="bg-[#161618] hover:bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] text-[13px] px-[16px] py-[7px] rounded-full cursor-pointer transition-all"
                  >
                    {t.btnClose}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (deferredPrompt) {
                        await deferredPrompt.prompt();
                      }
                      setIsPwaInstalled(true);
                      try {
                        window.localStorage.setItem(
                          STORAGE_KEYS.PWA_SHORTCUT_PINNED,
                          'true'
                        );
                      } catch {}
                      setActionModal({ type: null });
                      triggerToast(t.toastPwaInstalled(activeCustomer.id));
                    }}
                    className="bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal tracking-[-0.01em] px-[18px] py-[8px] rounded-full cursor-pointer transition-all"
                  >
                    {t.btnInstallPwaNow}
                  </button>
                </div>
              </div>
            ) : actionModal.type === 'name' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newName = (actionModal.nameInput ?? activeCustomer.name).trim() || 'Pelanggan Sissi';
                  if (activeCustomer.isLocalDevice) {
                    try {
                      window.localStorage.setItem(STORAGE_KEYS.CUSTOMER_NAME, newName);
                    } catch {}
                  }
                  setCustomers((prev) =>
                    prev.map((c) =>
                      c.id === activeCustomer.id ? { ...c, name: newName } : c
                    )
                  );
                  setActionModal({ type: null });
                  triggerToast(
                    lang === 'id'
                      ? `Nama kartu diperbarui menjadi "${newName}"`
                      : `Cardholder name updated to "${newName}"`
                  );
                }}
                className="space-y-4"
              >
                <p className="text-xs text-[#86868B] leading-relaxed">
                  {lang === 'id'
                    ? 'Nama ini akan dicetak otomatis di bagian depan kartu digital Sissi Heritage tepat di bawah tulisan LOYALTY CARD.'
                    : 'This name is dynamically rendered on the front face of your Sissi Heritage loyalty pass right beneath LOYALTY CARD.'}
                </p>
                <div>
                  <label className="block text-xs text-[#86868B] mb-1.5 font-medium">
                    {lang === 'id' ? 'Nama Pemilik Kartu' : 'Cardholder Name'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={32}
                    placeholder="Contoh: MADE PASEK"
                    value={actionModal.nameInput ?? activeCustomer.name}
                    onChange={(e) =>
                      setActionModal((prev) => ({
                        ...prev,
                        nameInput: e.target.value,
                      }))
                    }
                    className="w-full bg-[#000000] border border-white/[0.08] focus:border-[#0071E3] rounded-full px-4 py-2.5 text-[14px] text-[#F5F5F7] placeholder-[#86868B] outline-none transition-all uppercase"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActionModal({ type: null })}
                    className="bg-[#161618] hover:bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] text-[13px] px-[16px] py-[7px] rounded-full cursor-pointer transition-all"
                  >
                    {t.btnCancel}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal tracking-[-0.01em] px-[18px] py-[8px] rounded-full cursor-pointer transition-all"
                  >
                    {lang === 'id' ? 'Simpan Nama' : 'Save Name'}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const targetEmail =
                    actionModal.emailInput || activeCustomer.email;
                  try {
                    window.localStorage.setItem(
                      STORAGE_KEYS.BACKUP_EMAIL,
                      targetEmail
                    );
                  } catch {}
                  setCustomers((prev) =>
                    prev.map((c) =>
                      c.id === activeCustomer.id
                        ? { ...c, email: targetEmail }
                        : c
                    )
                  );
                  setActionModal({ type: null });
                  triggerToast(
                    t.toastEmailSent(activeCustomer.id, targetEmail)
                  );
                }}
                className="space-y-4"
              >
                <p className="text-xs text-[#86868B] leading-relaxed">
                  {t.emailModalDesc} (
                  <span className="font-mono tabular-nums text-[#2997FF]">
                    {activeCustomer.id}
                  </span>
                  ) {t.emailModalToAddress}
                </p>
                <div>
                  <label className="block text-xs text-[#86868B] mb-1.5">
                    {t.recipientEmailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={actionModal.emailInput ?? activeCustomer.email}
                    onChange={(e) =>
                      setActionModal((prev) => ({
                        ...prev,
                        emailInput: e.target.value,
                      }))
                    }
                    className="w-full bg-[#000000] border border-white/[0.08] focus:border-[#0071E3] rounded-full px-4 py-2 text-[14px] text-[#F5F5F7] placeholder-[#86868B] outline-none transition-all"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActionModal({ type: null })}
                    className="bg-[#161618] hover:bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] text-[13px] px-[16px] py-[7px] rounded-full cursor-pointer transition-all"
                  >
                    {t.btnCancel}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal tracking-[-0.01em] px-[18px] py-[8px] rounded-full cursor-pointer transition-all"
                  >
                    {t.btnSendRecovery}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Offline Connectivity Banner */}
      {!isOnline && (
        <div
          role="status"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-[#161618] border border-white/[0.12] px-4 py-2 text-xs font-medium text-[#F5F5F7] shadow-2xl"
        >
          <WifiOff className="w-4 h-4 text-[#2997FF] shrink-0" />
          <span>{t.offlineBanner}</span>
        </div>
      )}

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-14 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#161618]/95 border border-white/[0.12] text-xs font-medium text-[#F5F5F7] shadow-2xl backdrop-blur-md"
        >
          <Check className="w-4 h-4 text-[#2997FF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Watermark: Powered by Viyond (Main Interface Corner) */}
      <aside
        aria-label="Agency Attribution"
        className={`fixed bottom-4 right-5 z-30 select-none pointer-events-auto transition-opacity duration-300 ${
          isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161618]/80 backdrop-blur-md border border-white/[0.08] shadow-2xl opacity-45 hover:opacity-90 transition-opacity">
          <span className="text-[11px] font-normal tracking-tight text-[#86868B]">
            Powered by
          </span>
          <img
            src="/viyond-logo.png"
            alt="Viyond"
            className="h-5 w-auto object-contain"
          />
          <span className="text-[12px] font-medium tracking-tight text-[#F5F5F7]">
            Viyond
          </span>
        </div>
      </aside>
    </div>
  );
}
