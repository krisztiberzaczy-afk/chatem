export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "Nincs API kulcs (Vercel env)" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message,
      }),
    });

    const data = await response.json();

    return Response.json({
      output: data.output_text || "Nincs válasz",
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
