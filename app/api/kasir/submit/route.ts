import { NextResponse } from 'next/server';

const WEBHOOK_PROD_URL =
  'https://n8n.srv2075779.hstgr.cloud/webhook/input-kasir-sissi';
const WEBHOOK_TEST_URL =
  'https://n8n.srv2075779.hstgr.cloud/webhook-test/input-kasir-sissi';

export async function POST(request: Request) {
  try {
    const rawPayload = await request.json();
    const source =
      rawPayload && typeof rawPayload === 'object'
        ? { ...(rawPayload.body || {}), ...rawPayload }
        : {};

    const customerId = String(source.customerId ?? '').trim();
    const orderId = String(
      source.orderId ?? `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    ).trim();

    const rawItems = Array.isArray(source.items)
      ? source.items
      : typeof source.items === 'string' && source.items.trim().length > 0
      ? [source.items.trim()]
      : [];
    const parsedItems: string[] = rawItems
      .map((item: unknown) => String(item ?? '').trim())
      .filter((item: string) => item.length > 0);
    const items: string[] =
      parsedItems.length > 0 ? parsedItems : ['Iced Latte'];

    const notes = String(source.notes ?? '').trim();
    const stampsBefore = Number.isFinite(Number(source.stampsBefore))
      ? Number(source.stampsBefore)
      : 0;
    const stampsAfter = Number.isFinite(Number(source.stampsAfter))
      ? Number(source.stampsAfter)
      : stampsBefore + 1;
    const timestamp = String(source.timestamp || new Date().toISOString());

    const coreData = {
      customerId,
      orderId,
      items,
      notes,
      stampsBefore,
      stampsAfter,
      timestamp,
    };

    // Dual-level JSON payload compatible with both root ($json.customerId)
    // and nested body ($json.body.customerId) expressions in n8n
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

    let webhookResponse: Response | null = null;
    let targetUrlUsed = WEBHOOK_PROD_URL;

    // 1. Prioritaskan Production Webhook URL
    try {
      webhookResponse = await fetch(WEBHOOK_PROD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // 2. Jika 404 (misal n8n sedang dalam sesi editor test mode), fallback ke /webhook-test/
      if (webhookResponse.status === 404) {
        targetUrlUsed = WEBHOOK_TEST_URL;
        webhookResponse = await fetch(WEBHOOK_TEST_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
    } catch {
      // 3. Jika fetch production gagal, coba test URL
      targetUrlUsed = WEBHOOK_TEST_URL;
      webhookResponse = await fetch(WEBHOOK_TEST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }

    if (webhookResponse && webhookResponse.ok) {
      const dataText = await webhookResponse.text();
      return NextResponse.json({
        success: true,
        endpoint: targetUrlUsed,
        data: dataText,
      });
    }

    return NextResponse.json(
      {
        success: false,
        endpoint: targetUrlUsed,
        status: webhookResponse?.status || 502,
        statusText: webhookResponse?.statusText || 'Webhook unreachable',
      },
      { status: webhookResponse?.status || 502 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
