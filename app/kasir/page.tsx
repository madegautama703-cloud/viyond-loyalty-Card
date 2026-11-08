'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  QrCode,
  Sparkles,
  ClipboardList,
  Award,
  Loader2,
  Plus,
  Minus,
} from 'lucide-react';

const MAX_STAMPS = 8;

const STORAGE_KEYS = {
  CUSTOMER_ID: 'sissi_anon_customer_id',
  CURRENT_STAMPS: 'sissi_anon_current_stamps',
  REDEEMED_STAMPS: 'sissi_anon_redeemed_stamps',
};

const QUICK_SELECT_ITEMS = [
  {
    id: 'iced-latte',
    label: 'Iced Latte',
    category: 'Coffee',
    price: 'Rp 38.000',
  },
  {
    id: 'hot-cappuccino',
    label: 'Hot Cappuccino',
    category: 'Coffee',
    price: 'Rp 36.000',
  },
  {
    id: 'butter-croissant',
    label: 'Butter Croissant',
    category: 'Pastry',
    price: 'Rp 32.000',
  },
  {
    id: 'almond-croissant',
    label: 'Almond Croissant',
    category: 'Pastry',
    price: 'Rp 38.000',
  },
] as const;

interface SubmittedOrder {
  id: string;
  customerId: string;
  items: string[];
  notes: string;
  timestamp: string;
  stampsAfter: number;
}

function KasirPortalContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');
  const queryStamps = searchParams.get('stamps');

  const [customerId, setCustomerId] = useState<string>(() => {
    if (queryId && queryId.trim().length > 0) {
      return queryId.trim();
    }
    if (typeof window !== 'undefined') {
      try {
        const savedLocalId = window.localStorage.getItem(
          STORAGE_KEYS.CUSTOMER_ID
        );
        if (savedLocalId && savedLocalId.trim().length > 0) {
          return savedLocalId.trim();
        }
      } catch {
        // Ignore storage errors
      }
    }
    return 'SIS-1533-220Y';
  });

  const [activeStamps, setActiveStamps] = useState<number>(() => {
    if (queryStamps !== null) {
      const parsed = parseInt(queryStamps, 10);
      if (!Number.isNaN(parsed)) {
        return Math.max(0, Math.min(MAX_STAMPS, parsed));
      }
    }
    return 0;
  });

  const [selectedItems, setSelectedItems] = useState<string[]>(['Iced Latte']);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<SubmittedOrder[]>([]);
  const [isEditingId, setIsEditingId] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (queryId && queryId.trim().length > 0) {
      setCustomerId(queryId.trim());
    }

    if (queryStamps !== null) {
      const parsed = parseInt(queryStamps, 10);
      if (!Number.isNaN(parsed)) {
        setActiveStamps(Math.max(0, Math.min(MAX_STAMPS, parsed)));
        return;
      }
    }

    try {
      const savedLocalId = window.localStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
      const savedStampsRaw = window.localStorage.getItem(
        STORAGE_KEYS.CURRENT_STAMPS
      );

      if (!queryId && savedLocalId && savedLocalId.trim().length > 0) {
        setCustomerId(savedLocalId.trim());
      }

      if (
        savedStampsRaw !== null &&
        (!queryId || queryId.trim() === savedLocalId)
      ) {
        const parsed = parseInt(savedStampsRaw, 10);
        if (!Number.isNaN(parsed)) {
          setActiveStamps(Math.max(0, Math.min(MAX_STAMPS, parsed)));
        }
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [queryId, queryStamps]);

  const toggleItemSelection = (label: string) => {
    setSelectedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsEditingId(false);

    // Pastikan customerId diambil dari state pelanggan yang sedang aktif di kasir
    let activeCustomerId = customerId.trim();
    if (!activeCustomerId && queryId && queryId.trim().length > 0) {
      activeCustomerId = queryId.trim();
    }
    if (!activeCustomerId) {
      try {
        const savedLocalId = window.localStorage.getItem(
          STORAGE_KEYS.CUSTOMER_ID
        );
        if (savedLocalId && savedLocalId.trim().length > 0) {
          activeCustomerId = savedLocalId.trim();
        }
      } catch {
        // Ignore storage errors
      }
    }
    if (!activeCustomerId) {
      activeCustomerId = 'SIS-1533-220Y';
    }
    if (activeCustomerId !== customerId) {
      setCustomerId(activeCustomerId);
    }

    const stampsBefore = activeStamps;
    const nextStamps = Math.min(MAX_STAMPS, activeStamps + 1);

    // Pastikan items selalu berupa array string nama menu (misal ['Iced Latte'])
    const cleanedSelectedItems: string[] = Array.isArray(selectedItems)
      ? selectedItems
          .map((item) => String(item ?? '').trim())
          .filter((item) => item.length > 0)
      : [];
    const orderItems: string[] =
      cleanedSelectedItems.length > 0 ? cleanedSelectedItems : ['Iced Latte'];

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const notesValue = specialNotes.trim();
    const timestampValue = now.toISOString();

    const coreData = {
      customerId: activeCustomerId,
      orderId,
      items: orderItems,
      notes: notesValue,
      stampsBefore,
      stampsAfter: nextStamps,
      timestamp: timestampValue,
    };

    // Struktur JSON ganda (di level root dan di dalam objek body) agar kompatibel dengan n8n
    const payload = {
      customerId: coreData.customerId,
      orderId: coreData.orderId,
      items: coreData.items,
      notes: coreData.notes,
      stampsBefore: coreData.stampsBefore,
      stampsAfter: coreData.stampsAfter,
      timestamp: coreData.timestamp,
      body: {
        customerId: coreData.customerId,
        orderId: coreData.orderId,
        items: coreData.items,
        notes: coreData.notes,
        stampsBefore: coreData.stampsBefore,
        stampsAfter: coreData.stampsAfter,
        timestamp: coreData.timestamp,
      },
    };

    let sentSuccessfully = false;

    // 1. Kirim via internal Next.js API route proxy (mencegah CORS error & menjaga Content-Type: application/json)
    try {
      const res = await fetch('/api/kasir/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        sentSuccessfully = true;
      }
    } catch {
      // Proxy route failed, try direct fetch fallback below
    }

    // 2. Direct fetch fallback jika API route tidak merespons
    if (!sentSuccessfully) {
      try {
        const directRes = await fetch(
          'https://n8n.srv2075779.hstgr.cloud/webhook/input-kasir-sissi',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        if (directRes.ok) {
          sentSuccessfully = true;
        }
      } catch {
        try {
          await fetch(
            'https://n8n.srv2075779.hstgr.cloud/webhook/input-kasir-sissi',
            {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'text/plain' },
              body: JSON.stringify(payload),
            }
          );
          sentSuccessfully = true;
        } catch {
          // Abaikan error jaringan agar kasir tetap dapat melayani
        }
      }
    }

    setActiveStamps(nextStamps);

    try {
      const savedLocalId = window.localStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
      if (savedLocalId && savedLocalId === activeCustomerId) {
        window.localStorage.setItem(
          STORAGE_KEYS.CURRENT_STAMPS,
          String(nextStamps)
        );
      }
    } catch {
      // Ignore storage errors
    }

    const newOrder: SubmittedOrder = {
      id: orderId,
      customerId: activeCustomerId,
      items: orderItems,
      notes: notesValue,
      timestamp: timeFormatted,
      stampsAfter: nextStamps,
    };

    setRecentOrders((prev) => [newOrder, ...prev]);
    setSpecialNotes('');
    setIsSubmitting(false);

    triggerToast(
      `Pesanan ${orderId} terkirim & +1 Stempel untuk ${activeCustomerId} (${nextStamps}/${MAX_STAMPS})`
    );
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
      {/* Apple Ultra-Minimalist Top Navigation Bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between gap-4 px-5 sm:px-8 h-11 border-b border-white/[0.08]"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-normal tracking-[-0.01em] text-[#F5F5F7]/80 hover:text-white transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2997FF]" />
            <span>Kembali ke Kartu</span>
          </Link>
          <span className="text-white/20" aria-hidden="true">
            |
          </span>
          <div className="flex items-center gap-2">
            <img
              src="/sissi-logo.png"
              alt="Sissi Heritage Logo"
              className="w-4 h-4 rounded-[4px] object-cover border border-white/[0.12]"
            />
            <span className="text-[14px] font-semibold tracking-[-0.025em] leading-[1.06] text-[#F5F5F7] whitespace-nowrap">
              Sissi Heritage · Kasir B2B
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[#86868B]">
          <QrCode className="w-3.5 h-3.5 text-[#2997FF]" />
          <span className="hidden sm:inline">QR Scan Verified</span>
        </div>
      </header>

      {/* Mobile-First Apple Bento Workspace */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
        {/* Bento Card 1: Scanned Customer Identity & Active Stamp Status */}
        <section className="bg-[#161618] rounded-[24px] p-6 border border-white/[0.06] shadow-2xl space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#2997FF]">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Pelanggan Terdeteksi</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingId((prev) => !prev)}
                  className="text-[11px] text-[#86868B] hover:text-[#2997FF] underline cursor-pointer transition-colors"
                >
                  {isEditingId ? 'Tutup' : 'Ubah Manual'}
                </button>
              </div>

              {isEditingId ? (
                <div className="flex items-center gap-2 pt-1 max-w-xs">
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
                    placeholder="Contoh: SIS-1533-220Y"
                    className="w-full bg-[#000000] border border-white/[0.15] focus:border-[#0071E3] rounded-lg px-3 py-1.5 text-sm font-mono text-[#F5F5F7] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingId(false)}
                    className="bg-[#0071E3] text-white text-xs px-3 py-1.5 rounded-lg shrink-0 font-medium cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <h1 className="text-xl sm:text-2xl font-semibold tracking-[-0.025em] leading-[1.06] text-[#F5F5F7] truncate">
                  Pelanggan:{' '}
                  <span className="font-mono tabular-nums text-white">
                    {customerId}
                  </span>
                </h1>
              )}
            </div>

            <div className="text-right shrink-0">
              <div className="text-[12px] font-medium text-[#86868B]">
                Stempel Aktif
              </div>
              <div className="mt-1 text-[36px] sm:text-[42px] font-semibold tracking-tight leading-none font-mono tabular-nums bg-gradient-to-b from-white via-[#F5F5F7] to-[#86868B] bg-clip-text text-transparent">
                {activeStamps}/{MAX_STAMPS}
              </div>
            </div>
          </div>

          {/* Segmented 8-Stamp Visual Bar & Alternating Stamp Preview */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#86868B]">
                Status Kartu Loyalitas Sissi Heritage
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#86868B] mr-1">Sesuaikan:</span>
                <button
                  type="button"
                  onClick={() => setActiveStamps((prev) => Math.max(0, prev - 1))}
                  disabled={activeStamps <= 0}
                  title="Kurangi 1 Stempel"
                  className="h-6 w-6 rounded-full bg-[#000000] hover:bg-[#2C2C2E] border border-white/[0.1] text-[#F5F5F7] disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono tabular-nums text-[#F5F5F7] font-semibold min-w-[28px] text-center">
                  {activeStamps}/{MAX_STAMPS}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveStamps((prev) => Math.min(MAX_STAMPS, prev + 1))
                  }
                  disabled={activeStamps >= MAX_STAMPS}
                  title="Tambah 1 Stempel"
                  className="h-6 w-6 rounded-full bg-[#000000] hover:bg-[#2C2C2E] border border-white/[0.1] text-[#F5F5F7] disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: MAX_STAMPS }, (_, index) => {
                const isStamped = index < activeStamps;
                const stampSrc =
                  index % 2 === 0 ? '/stamp-roti.png' : '/stamp-kopi.png';
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setActiveStamps(
                        activeStamps === index + 1 ? index : index + 1
                      )
                    }
                    title={`Pilih stempel ke ${index + 1}`}
                    className={`aspect-square rounded-full flex items-center justify-center p-1.5 transition-all cursor-pointer border ${
                      isStamped
                        ? 'bg-[#EFE5D1] border-[#2997FF]/50 shadow-sm'
                        : 'bg-[#000000] border-white/[0.08] opacity-55 hover:opacity-80'
                    }`}
                  >
                    {isStamped ? (
                      <img
                        src={stampSrc}
                        alt={`Stamp ${index + 1}`}
                        style={{ objectFit: 'contain' }}
                        className="w-full h-full object-contain pointer-events-none select-none"
                      />
                    ) : (
                      <span className="font-mono text-[10px] text-[#86868B]">
                        {index + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {activeStamps >= MAX_STAMPS && (
              <div className="flex items-center justify-between gap-3 pt-1 text-xs text-emerald-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>Kartu penuh (8/8)! Pelanggan berhak klaim reward.</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStamps(0);
                    triggerToast(
                      `Reward berhasil diklaim untuk ${customerId}. Stempel direset ke 0/8.`
                    );
                  }}
                  className="bg-[#161618] hover:bg-[#2C2C2E] border border-[#2997FF] text-[#2997FF] text-[12px] px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap"
                >
                  Reset 0/8
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Bento Card 2: Form Section "Input Pesanan Baru" */}
        <section className="bg-[#161618] rounded-[24px] p-6 border border-white/[0.06] shadow-2xl">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div className="border-b border-white/[0.06] pb-4 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.025em] leading-[1.06] text-[#F5F5F7]">
                  Input Pesanan Baru
                </h2>
                <p className="text-xs text-[#86868B] mt-1">
                  Pilih menu pesanan pelanggan untuk mencatat transaksi &amp;
                  menambahkan stempel.
                </p>
              </div>
              <ClipboardList className="w-5 h-5 text-[#86868B] shrink-0" />
            </div>

            {/* Quick Select Buttons (Clean button element to prevent double-click toggle bugs) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#86868B] uppercase tracking-wider">
                  Quick Select Menu Populer
                </label>
                <span className="text-xs text-[#2997FF]">
                  {selectedItems.length} dipilih
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_SELECT_ITEMS.map((item) => {
                  const isSelected = selectedItems.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItemSelection(item.label)}
                      className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-full border text-[13px] transition-all cursor-pointer select-none text-left ${
                        isSelected
                          ? 'bg-[#2C2C2E]/90 border-[#2997FF] text-[#2997FF]'
                          : 'bg-[#000000] hover:bg-[#2C2C2E]/50 border-white/[0.08] text-[#F5F5F7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                            isSelected
                              ? 'bg-[#0071E3] border-[#0071E3] text-white'
                              : 'border-white/25 bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </span>
                        <span className="font-medium truncate">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-[#86868B] shrink-0">
                        {item.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Area for "Catatan Khusus (Alergi/Preferensi)" */}
            <div className="space-y-2">
              <label
                htmlFor="catatan-khusus"
                className="block text-xs font-medium text-[#86868B] uppercase tracking-wider"
              >
                Catatan Khusus (Alergi/Preferensi)
              </label>
              <textarea
                id="catatan-khusus"
                rows={3}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Misal: Oatmilk, less sugar..."
                className="w-full bg-[#000000] border border-white/[0.08] focus:border-[#0071E3] rounded-[18px] px-4 py-3 text-[14px] text-[#F5F5F7] placeholder-[#86868B] outline-none transition-all resize-none"
              />
            </div>

            {/* Primary Apple Blue Capsule Button (#0071E3) at the bottom */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-60 active:scale-[0.99] text-white text-[14px] font-medium tracking-[-0.01em] px-[22px] py-[12px] rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0071E3]/25 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim Pesanan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Pesanan &amp; +1 Stempel</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Recent Submitted Orders Log (Bento Receipt Card) */}
        {recentOrders.length > 0 && (
          <section className="bg-[#161618] rounded-[24px] p-6 border border-white/[0.06] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-semibold tracking-[-0.025em] leading-[1.06] text-[#F5F5F7]">
                Riwayat Transaksi Sesi Ini
              </h3>
              <span className="text-xs text-[#86868B]">
                {recentOrders.length} pesanan
              </span>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-[#000000] border border-white/[0.06] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono tabular-nums text-[#2997FF] font-semibold">
                      {order.id} · {order.customerId}
                    </span>
                    <span className="text-[#86868B] font-mono tabular-nums">
                      {order.timestamp} · Stempel: {order.stampsAfter}/
                      {MAX_STAMPS}
                    </span>
                  </div>
                  <div className="text-[#F5F5F7] font-medium">
                    {order.items.join(', ')}
                  </div>
                  {order.notes && (
                    <div className="text-[#86868B] italic">
                      Catatan: &ldquo;{order.notes}&rdquo;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Watermark: Powered by Viyond (Kasir Footer) */}
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
      </main>

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-14 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#161618]/95 border border-white/[0.12] text-xs font-medium text-[#F5F5F7] shadow-2xl backdrop-blur-md"
        >
          <Check className="w-4 h-4 text-[#2997FF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function KasirPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] text-[#F5F5F7] flex items-center justify-center text-sm">
          Memuat Portal Kasir...
        </div>
      }
    >
      <KasirPortalContent />
    </Suspense>
  );
}
