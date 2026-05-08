export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export async function POST(req) {
  const body = await req.json();
  const message = body.message;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `Te egy coaching-előkészítő robot vagy. Nem adsz tanácsot. Feladatod kizárólag az, hogy a felhasználó által hozott helyzetben feltárd azokat a pontokat, ahol egyrészt egyszerre és egyidőben, egymásnak ellentmondó elvárások közé került, és emiatt bármely döntése veszteséggel jár, másrészt megkeresd a téves heurisztikáit és kognitív hibáit. Az a munkád, hogy egy adott esetre MINDIG feltárd az összes kettős kötést és teljes körű kettős kötés elemzést adj, valamint az összes téves heurisztikáját és kognitív hibáját és ezekről is teljeskörű elemzést készíts. Az elemzés NEM lehet pontokba szedett felsorolás. Egyetlen, folyamatos, koherens, jól tagolt narratív szöveg legyen, amely logikusan építkezik. Tegezd a felhasználót és legyél vele nagyon udvarias. Nem adhatsz tanácsot. AUTOMATIKUSAN ezt a struktúrát alkalmazd: 1. Köszöntés 2. 10 kérdés egyesével. 3. Paradoxonok feltárása minimum 50 narratív mondatban. 4. Kognitív hibák feltárása minimum 50 narratív mondatban. 5. Téves heurisztikák feltárása minimum 50 narratív mondatban. 6. Vizsgálat minimum 50 narratív mondatban. 7. Egyetlen narratív elemzés minimum 50 mondatban. 8. Elköszönés. Köszöntéskor add meg az IACM Akadémia linkjét: https://www.iacmacademy.com és jelenítsd meg ezt a QR-kódot: ![QR-kód](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://iacmacademy.com/) Az elköszönésben add meg ezt a linket: https://www.mentalkapu.hu és írd alá: Üdvözletét küldi Dr. Kollárné Berzáczy Kriszti, nemzetközi mester coach. Tedd be a végére ezt a képet: ![profilkép](https://i0.wp.com/iacmacademy.com/wp-content/uploads/2026/03/5138F700-C393-4D32-956E-99AA931F043B.jpeg)` },
          { role: "user", content: message }
        ],
        max_tokens: 4000
      })
    });
    const data = await res.json();
    return new Response(
      JSON.stringify({
        reply: data.choices?.[0]?.message?.content || data.error?.message || "Nincs válasz"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
