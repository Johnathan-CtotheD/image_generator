// The writing step. The contract text lives here, on the server, so that no
// author can change it and no browser ever sees the key.

const LEVELS = {
  A1: { assets: "one", vocab: "every word from the first thousand most common words",
        budgetWords: "forty to fifty words", pace: null },
  A2: { assets: "one", vocab: "every word from the first two thousand most common words",
        budgetWords: "eighty to ninety words", pace: null },
  B1: { assets: "both", vocab: "ninety-five percent of words from the first three thousand most common words",
        budgetWords: "two hundred and eighty to three hundred and twenty words",
        pace: "twenty-four to twenty-nine seconds per hundred syllables" },
  B2: { assets: "both", vocab: "ninety-five percent of words from the first five thousand most common words",
        budgetWords: "seven hundred to seven hundred and fifty words",
        pace: "twenty to twenty-two seconds per hundred syllables" }
};

const PARTITION = [
  "You are producing the input material for one learner speaking task. The task has two channels of information, and you must divide the task's information between them so that the learner needs both to complete the task.",
  "",
  "The order is fixed. The first asset is the audio, and it always carries the context. The learner meets it before anything else, so it must make sense on its own, without the still asset in front of them. The second asset is the still one, and it carries the details.",
  "",
  "The audio script carries the context and the main headlines. It sets up the situation, the people involved, what is happening and why it matters. It states the big facts in general terms. It never gives specific, checkable details.",
  "",
  "The still asset carries the details. It holds the specific, checkable information the learner must find and use: times, dates, prices, names, quantities, places, options, conditions. It gives only enough framing for the details to make sense.",
  "",
  "The overlap allowance: the two assets may share one linking reference, a name or a set of names that shows the learner both assets belong to the same world. Nothing else should appear in both.",
  "",
  "Before you finish, apply the partition test. Every piece of information the learner needs must live in exactly one asset. If a detail appears in the script, move it to the still asset. If context appears only in the still asset, move it into the script. If a learner could complete the task with only one of the two assets, the division has failed, so redistribute the information and test again.",
  "",
  "The headline and detail pairing: the strongest scripts describe in general terms what the still asset shows exactly. For example, the script says dinner in Spain is famously late, and the table shows the actual times. Use this pairing wherever it fits.",
  "",
  "Pointing at the still asset: the script may tell the learner to look at the still asset, for example by saying have a look at the table. This is encouraged."
].join("\n");

const SINGLE_CONTENT = [
  "You are producing the input material for one learner speaking task, and this task uses one asset only. That asset is a content asset: the learner works from it, taking specific information out of it and putting that information into words.",
  "",
  "It may be a thing with words on it, such as a table, timetable, notice, advert, menu or message thread, or it may be a picture the learner has to describe. Either way the learner has to name what is there.",
  "",
  "Because the learner has to describe what this asset shows, everything in it must be something they can say with the language they have at their level. Choose actions and objects the learner can name using words from the level's word lists. Avoid anything that can only be described with an off-list collocation, or a phrasal or multi-word verb. Avoid specialist scenes and specialist equipment: a picture of mountaineers clipping carabiners is a poor content asset at B1, because the learner can see exactly what is happening and has no words for it. Keep the number of things happening small, so the learner is not pushed into complicated linking language.",
  "",
  "The asset must stand on its own, with only light framing around the information."
].join("\n");

const SINGLE_CONTEXT = [
  "You are producing the input material for one learner speaking task, and this task uses one asset only. That asset is a context asset: it sets the scene.",
  "",
  "It shows where the learner is, who is involved and what kind of situation it is. Its job is to switch on what the learner already knows about that situation, so that they come to the task with ideas and expectations. The learner is not asked to list what is in it, so it does not have to supply checkable details, and it may be richer and busier than a content asset. What matters is that the situation is one the learner recognises and can talk about using their own language.",
  "",
  "The asset must stand on its own, within the word budget."
].join("\n");

const SEC_BOTH = [
  "===BEGIN STILL_ASSET_CONTENT===",
  "(The full text of the still asset: the actual words of the table, notice, timetable, advert or message thread, with the layout shown by simple headings, rows and labels. If it is a picture, write a precise brief for it instead.)",
  "===END STILL_ASSET_CONTENT===",
  "",
  "===BEGIN STILL_ASSET_DESCRIPTION===",
  "(A description of the still asset for a learner who cannot see it. Between two hundred and two hundred and fifty characters.)",
  "===END STILL_ASSET_DESCRIPTION===",
  "",
  "===BEGIN SCRIPT===",
  "(The full script for the audio. One speaker or a conversation, whichever suits the task. Speaker names before each line if it is a conversation.)",
  "===END SCRIPT===",
  "",
  "===BEGIN VOICE_NOTES===",
  "speakers: (how many, and their genders. Cast against stereotype where a role carries stereotype risk, and in conversations balance knowledge and authority across the speakers.)",
  "accent: (a light international accent is acceptable at B1 and above, UK accents only below that)",
  "age: (suited to the task and the learners)",
  "speed: (state the speed given above, and note slightly slower if it is a conversation)",
  "===END VOICE_NOTES===",
  "",
  "===BEGIN BOT_TALLY===",
  "still asset word count: (number)",
  "script word count: (number)",
  "script syllable estimate: (number)",
  "linking reference: (the shared name, or list of names, that appears in both assets)",
  "division note: (one line: which details sit in the still asset, and which headlines sit in the script)",
  "===END BOT_TALLY==="
].join("\n");

const SEC_STILL = [
  "===BEGIN STILL_ASSET_CONTENT===",
  "(The full text of the asset: the actual words of the table, notice, timetable, advert or message thread, with the layout shown by simple headings, rows and labels. If it is a picture, write a precise brief for it instead.)",
  "===END STILL_ASSET_CONTENT===",
  "",
  "===BEGIN STILL_ASSET_DESCRIPTION===",
  "(A description of the asset for a learner who cannot see it. Between two hundred and two hundred and fifty characters.)",
  "===END STILL_ASSET_DESCRIPTION===",
  "",
  "===BEGIN BOT_TALLY===",
  "still asset word count: (number)",
  "division note: (one line: what the asset gives the learner)",
  "===END BOT_TALLY==="
].join("\n");

const SEC_SCRIPT = [
  "===BEGIN SCRIPT===",
  "(The full script for the audio. One speaker or a conversation, whichever suits the task. Speaker names before each line if it is a conversation.)",
  "===END SCRIPT===",
  "",
  "===BEGIN VOICE_NOTES===",
  "speakers: (how many, and their genders. Cast against stereotype where a role carries stereotype risk.)",
  "accent: (a light international accent is acceptable at B1 and above, UK accents only below that)",
  "age: (suited to the task and the learners)",
  "speed: (state the speed given above)",
  "===END VOICE_NOTES===",
  "",
  "===BEGIN BOT_TALLY===",
  "script word count: (number)",
  "script syllable estimate: (number)",
  "division note: (one line: what the asset gives the learner)",
  "===END BOT_TALLY==="
].join("\n");

function buildPrompt(b) {
  const L = LEVELS[b.level];
  if (!L) throw new Error("unknown level");
  const both = b.mode === "both";
  const rule = both ? PARTITION : (b.role === "content" ? SINGLE_CONTENT : SINGLE_CONTEXT);
  const sections = both ? SEC_BOTH : (b.kind === "still" ? SEC_STILL : SEC_SCRIPT);

  const fixed = [
    "Level: " + b.level + ".",
    "Vocabulary: " + L.vocab + ".",
    "Word budget: " + L.budgetWords + " in total across everything the learner reads and hears."
  ];
  if (L.pace) fixed.push("Speaking speed for any audio: " + L.pace + ".");
  if (both) fixed.push("Suggested share of the budget: roughly sixty percent script, forty percent still asset.");
  if (b.listsLoaded) fixed.push("The author has loaded the frequency band lists for this level, and every word you write will be checked against them automatically.");
  if (b.stillKind && (both || b.kind === "still")) {
    fixed.push("Kind of still asset the author has asked for: " + b.stillKind + ". Use this form.");
    if (/chart|graph/.test(b.stillKind)) {
      fixed.push("Because the still asset is a " + b.stillKind + ", set it out so it can be drawn: give a title, a label for each axis or slice, the unit, and then the figures as simple labelled rows, one row per bar, point or slice. Keep the number of figures small, between four and six, so the learner can talk about them. Choose figures that differ clearly from each other. Make sure the comparisons the learner will need to make can be made with the language of the level: at lower levels stay with plain rises and falls and simple comparisons.");
    }
  }

  let prompt = rule +
    "\n\nThe fixed settings for this task, which you must work inside and must not change:\n" + fixed.join("\n") +
    "\n\nThe task, as supplied by the author:\n" + b.spec +
    "\n\nWrite exactly the labelled sections below, each between its BEGIN and END lines. Write nothing outside them: no preamble, no commentary, no closing remarks.\n\n" + sections;

  if (b.previousText && b.fixes) {
    prompt += "\n\nYou have written this once already and it did not pass the checks. Here is what you wrote:\n\n" +
      b.previousText + "\n\nWhat went wrong:\n" + b.fixes +
      "\n\nWrite the whole thing again, keeping what worked and fixing what did not. Use the same labelled sections and write nothing outside them.";
  }
  return prompt;
}

export default async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "No key set on the server." }), { status: 500 });

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "Bad request." }), { status: 400 }); }

  if (!body.spec || !String(body.spec).trim()) {
    return new Response(JSON.stringify({ error: "No task brief supplied." }), { status: 400 });
  }

  let prompt;
  try { prompt = buildPrompt(body); }
  catch (e) { return new Response(JSON.stringify({ error: String(e.message) }), { status: 400 }); }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.WRITING_MODEL || "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: (data.error && data.error.message) || "The model refused the request." }), { status: 502 });
    }
    const text = (data.content || []).map(c => (c.type === "text" ? c.text : "")).join("\n");
    return new Response(JSON.stringify({ text }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Could not reach the model." }), { status: 502 });
  }
};

export const config = { path: "/api/generate" };
