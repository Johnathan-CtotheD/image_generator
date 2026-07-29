// The drawing step. Takes the still asset content and returns an SVG.
// The palette and type rules live here so every author draws to the same rules.

const FILLS = [
  "Dark indigo #27004C", "Mid indigo #5900C1", "Bright indigo #873BFF", "Violet #E2AFF9",
  "Blue #22A1FF", "Green #0DD166", "Aqua #44E2D3", "Orange #FF6631", "Pink #F9C0B4",
  "Yellow #F4EF4D", "Red #FF2D2D", "White #FFFFFF"
];

// Ordered so that each colour differs from the next in shade as well as hue.
const SERIES = ["#5900C1", "#22A1FF", "#0DD166", "#E2AFF9", "#F4EF4D"];

function drawPrompt(kindWord, content) {
  const isChart = /chart|graph/.test(kindWord);
  const lines = [
    "Draw the asset below as a single SVG image. It is a " + kindWord + " that a language learner will look at while doing a speaking task.",
    "",
    "Return the SVG and nothing else. No explanation, no code fences, no comments.",
    "Use a viewBox so it scales, around eight hundred by six hundred for a square or upright asset and around nine hundred by five hundred for a wide one.",
    "Put every word from the content below into the image, spelled exactly as written. Do not add words of your own, and do not leave any out.",
    "",
    "The colour palette is fixed and you must not use any colour outside it:",
    FILLS.join(", ") + ".",
    "",
    "How to use those colours:",
    "The background is white.",
    "Text may only be dark indigo #27004C, mid indigo #5900C1 or bright indigo #873BFF. No other colour is dark enough to read as text on white. Red #FF2D2D is allowed only for headings of twenty-four units or more.",
    "The other colours are for fills, rules and blocks, never for small text.",
    "Where text sits on a coloured fill: use white text on dark indigo and mid indigo, and dark indigo text on every other fill.",
    "",
    "Type and size:",
    'Set all text with font-family British Council Sans, then sans-serif as a fallback, written exactly as: font-family="British Council Sans, sans-serif".',
    "Nothing smaller than sixteen units. Headings twenty-four units or more.",
    "Write each line of text as its own text element. Do not use tspan.",
    "",
    "Keep it plain and uncluttered: clear headings, generous spacing, plain rules or light fills to separate rows and columns. No drop shadows, no gradients, no decorative flourishes."
  ];
  if (isChart) {
    lines.push(
      "",
      "Because this is a chart:",
      "Draw the axes, label them, mark the scale, and label every bar, point or slice directly with its own name and figure. Do not use a separate key or legend, because the learner must be able to read the chart without tracing a colour back to a list.",
      "Take the series colours in this order, and no others: " + SERIES.join(", ") + ". They are chosen so that each one differs from the next in shade as well as in hue, which means the chart still reads for a learner who cannot tell the colours apart.",
      "If you need more than five, do not add colours. Repeat the series and separate the repeats with a pattern: diagonal hatching, dots, or an outline with no fill.",
      "Give every fill a thin dark indigo outline so the shapes stay separate on a white background."
    );
  }
  lines.push("", "The content to draw:", content);
  return lines.join("\n");
}

function cleanSvg(t) {
  const m = t.match(/<svg[\s\S]*<\/svg>/i);
  let svg = m ? m[0] : "";
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "");
}

export default async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "No key set on the server." }), { status: 500 });

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "Bad request." }), { status: 400 }); }
  if (!body.content) return new Response(JSON.stringify({ error: "Nothing to draw." }), { status: 400 });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.DRAWING_MODEL || "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [{ role: "user", content: drawPrompt(body.stillKind || "still asset", body.content) }]
      })
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: (data.error && data.error.message) || "The model refused the request." }), { status: 502 });
    }
    const text = (data.content || []).map(c => (c.type === "text" ? c.text : "")).join("\n");
    const svg = cleanSvg(text);
    if (!svg) return new Response(JSON.stringify({ error: "The drawing came back empty." }), { status: 502 });
    return new Response(JSON.stringify({ svg }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Could not reach the model." }), { status: 502 });
  }
};

export const config = { path: "/api/draw" };
