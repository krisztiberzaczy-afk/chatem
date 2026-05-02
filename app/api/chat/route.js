export const dynamic = "force-dynamic";

export async function POST(req) {
  const { input, apiKey } = await req.json();

  const prompt = `
IDE ÍRD A SAJÁT PROMPTODAT

User: ${input}
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
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
        output: data.choices?.[0]?.message?.content || "Nincs válasz"
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
    // update
  });
}
