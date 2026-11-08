import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const WEBHOOK_GET_PROD_URL =
  'https://n8n.srv2075779.hstgr.cloud/webhook/get-dasbor-sissi';
const WEBHOOK_GET_TEST_URL =
  'https://n8n.srv2075779.hstgr.cloud/webhook-test/get-dasbor-sissi';

function extractCustomerRows(input: any): any[] {
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
    if (Array.isArray(input.records)) return extractCustomerRows(input.records);
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
    if (values.length > 0 && values.every((v) => v && typeof v === 'object')) {
      const fromValues = extractCustomerRows(values);
      if (fromValues.length > 0) return fromValues;
    }
  }

  return [];
}

export async function GET() {
  try {
    let res = await fetch(WEBHOOK_GET_PROD_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
    });

    if (res.status === 404) {
      res = await fetch(WEBHOOK_GET_TEST_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
        cache: 'no-store',
      });
    }

    const rawData = await res.json().catch(() => null);
    const rows = extractCustomerRows(rawData);

    return NextResponse.json(
      { data: rows },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err) {
    console.error('API dasbor proxy error:', err);
    return NextResponse.json(
      { data: [] },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }
}
