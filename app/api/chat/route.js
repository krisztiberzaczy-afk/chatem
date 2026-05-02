export const dynamic = "force-dynamic";

export async function POST(req) {
  const { message } = await req.json();

  const prompt = `
IDE ÍRD A SAJÁT PROMPTODAT

User: ${message}
`;

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
          { role: "system", content: "Te egy segítő AI vagy." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await res.json();

    return new Response(
      JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "Nincs válasz"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ error: "API hiba" }),
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
