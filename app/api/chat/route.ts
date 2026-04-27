import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { input, apiKey } = await req.json();

    if (!input || !apiKey) {
      return NextResponse.json(
        { error: "Missing input or apiKey" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: input,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: err },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      output: data.output?.[0]?.content?.[0]?.text ?? "",
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
