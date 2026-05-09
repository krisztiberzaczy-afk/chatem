export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CREATE_ACCESS_SECRET = process.env.CREATE_ACCESS_SECRET;

function generateAccessCode() {
  const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();

  return "IACM-" + part1 + "-" + part2;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function POST(req) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !CREATE_ACCESS_SECRET) {
      return new Response("Hiányzó szerver környezeti változó.", {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const authHeader = req.headers.get("authorization") || "";
    const expectedAuth = "Bearer " + CREATE_ACCESS_SECRET;

    if (authHeader !== expectedAuth) {
      return new Response("Nincs jogosultság.", {
        status: 401,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const body = await req.json().catch(function() {
      return {};
    });

    const accessCode = generateAccessCode();

    const totalBudgetUsd = typeof body.totalBudgetUsd === "number"
      ? body.totalBudgetUsd
      : 3.50;

    const insertRes = await fetch(
      `${SUPABASE_URL}/rest/v1/access_codes`,
      {
        method: "POST",
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          access_code: accessCode,
          used_budget_usd: 0,
          total_budget_usd: totalBudgetUsd,
          is_active: true
        })
      }
    );

    if (!insertRes.ok) {
      const errorText = await insertRes.text();

      return new Response("Supabase beszúrási hiba: " + errorText, {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const insertedRows = await insertRes.json();
    const insertedRow = insertedRows?.[0] || null;

    return new Response(JSON.stringify({
      success: true,
      accessCode: accessCode,
      totalBudgetUsd: totalBudgetUsd,
      row: insertedRow
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (e) {
    return new Response("Szerverhiba: " + e.message, {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
