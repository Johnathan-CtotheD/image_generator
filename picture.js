// The photograph step. Takes the written brief and returns a photograph.
//
// The model name sits in an environment variable because Google renames this
// family often. The default below is the stable one Google names as the
// replacement for the old Imagen models, which shut down on 17 August 2026.

const MODEL = process.env.PICTURE_MODEL || "gemini-2.5-flash-image";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent";

function pictureRules(brief, shape) {
  return [
    "Make a photograph for a language learner to look at while doing a speaking task.",
    "",
    "Rules:",
    "No words anywhere in the picture. No signs, labels, captions, posters, screens with writing, logos or brand names. If something in the scene would normally carry writing, leave the surface blank.",
    "One clear situation, plainly lit, with only a few things happening. The learner has to describe it in simple language, so avoid busy backgrounds.",
    "Everyday settings and everyday objects, shown in their most ordinary form. Leave out anything specialist or unusual that would need specialist vocabulary to name.",
    "Show a mix of people where people appear, without leaning on stereotypes about who does what.",
    "Ordinary documentary photography. Not illustration, not stylised art, not advertising.",
    "Nothing distressing, nothing risky, nothing that would be out of place in a classroom.",
    shape === "wide" ? "Shape: landscape." : shape === "tall" ? "Shape: portrait." : "Shape: square.",
    "",
    "What to show:",
    brief
  ].join("\n");
}

export default async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: "No Google key set on the server. Add GOOGLE_API_KEY in the site settings." }), { status: 500 });
  }

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "Bad request." }), { status: 400 }); }
  if (!body.brief) return new Response(JSON.stringify({ error: "No brief to work from." }), { status: 400 });

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: pictureRules(body.brief, body.shape || "square") }] }]
      })
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({
        error: (data.error && data.error.message) || "The picture service refused the request."
      }), { status: 502 });
    }

    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const image = parts.find(p => p.inlineData || p.inline_data);
    if (!image) {
      const said = parts.map(p => p.text).filter(Boolean).join(" ");
      return new Response(JSON.stringify({
        error: said ? "No picture came back. The service said: " + said : "No picture came back."
      }), { status: 502 });
    }
    const inline = image.inlineData || image.inline_data;
    return new Response(JSON.stringify({
      dataUrl: "data:" + (inline.mimeType || inline.mime_type || "image/png") + ";base64," + inline.data
    }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Could not reach the picture service." }), { status: 502 });
  }
};

export const config = { path: "/api/picture" };
