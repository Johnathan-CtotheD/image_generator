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
  "Pointing at the still asset: the script may tell the learner to look at the still asset, for example by saying have a look at the table. This is encouraged.",
  "",
  "One thing the audio must never do: it must not act out the task the learner has been set. The audio is the material the learner works from, not a model answer. A script that performs the task hands the learner the words instead of making them find their own.",
  "",
  "This matters most in comparison tasks. Where the learner is asked to weigh one thing against another, each asset carries one side and one side only. The audio speaks about its side; the still asset shows the other.",
  "",
  "That does not stop the audio doing its usual job of setting the scene. There is a difference between naming the question and answering it. The audio may say that a choice is being talked about, so that the learner knows what is at issue, and then stay on its own side of it. What it must not do is describe the other side, quote its figures, weigh the two against each other, ask which is better, or sum up. If your script finds itself doing any of those, you have written the learner's answer for them: cut it back to the one side it carries, keeping only the sentence or two that frames the question.",
  "",
  "How to read the brief: it describes the task the learner will do, and it often names the assets themselves — a video diary, a magazine photograph, a notice on a wall. Those names tell you what to build. Work out which part of the brief describes each asset, build exactly those two things, and add nothing the brief does not call for. The brief is a specification, not a scene to be dramatised.",
  "",
  "The audio is also never about the task. Do not write commentary on the topic as a teaching point, do not address the learner as a learner, and do not mention the task, the assessment or the assets. Write the thing itself, as it would be heard in the world."
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

// The kinds of audio the non-static asset can be. Each one tells the bot what
// it is writing, so that a brief mentioning a podcast produces a podcast and
// not something adjacent to one.
const AUDIO_MODES = {
  "podcast": "A podcast episode. Hosts talking to their listeners about the topic. Warm and informal, with a short welcome at the start and a sign-off at the end. The hosts talk about the topic; they do not interview a guest.",
  "radio news": "A short radio news item. A newsreader reporting the story plainly and neutrally. No opinions, no chat, no sign-off beyond a closing line.",
  "interview": "An interview. A presenter asking questions and one guest answering them. The guest supplies the substance; the presenter keeps it moving.",
  "conversation": "A conversation between two people who know each other, talking about the topic in an everyday setting. Natural and unscripted in feel, with no audience being addressed.",
  "announcement": "A spoken announcement, of the kind heard in a station, airport, school or shop. One voice, addressed to everyone present, brief and clear.",
  "voicemail": "A voicemail or phone message left for the learner or for someone in the situation. One voice, speaking to one person, with a reason for calling.",
  "talk": "A short talk or presentation given to an audience. A speaker setting out the topic in an orderly way.",
  "vlog": "A video diary or vlog entry. One person talking to camera about the topic from their own point of view.",
  "advert": "A radio advertisement for a service or event connected to the topic. Persuasive but not misleading. The service or event must be invented, never a real company."
};

const VOICE_COUNTS = {
  "one": "Write this for one voice only. A single speaker throughout, with nobody replying. Do not add a second person, a caller, a co-host or an interviewee.",
  "two": "Write this for two voices. Two named speakers taking turns, each with a clear reason to be there. Do not add a third."
};

function voiceInstruction(count, mode) {
  const line = VOICE_COUNTS[count];
  if (!line) return null;
  if (count === "one" && (mode === "interview" || mode === "conversation")) {
    return "The author has asked for one voice, but a " + mode + " needs two people. Write it for two voices.";
  }
  if (count === "two" && (mode === "announcement" || mode === "voicemail" || mode === "vlog")) {
    return "The author has asked for two voices, but a " + mode + " is normally one person speaking alone. Write it for one voice.";
  }
  return line;
}

function modeInstruction(mode) {
  const chosen = AUDIO_MODES[mode];
  if (!chosen) return null;
  return "The kind of audio you are writing is fixed: " + mode + ". " + chosen +
    " Write this kind and no other. If the task brief mentions this kind of audio as the source of the topic, that is the audio you are writing, not something that happens before or after it.";
}

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
  const hasAudio = both || b.kind === "moving";
  const modeLine = hasAudio ? modeInstruction(b.audioMode) : null;
  if (modeLine) fixed.push(modeLine);
  const voiceLine = hasAudio ? voiceInstruction(b.voiceCount, b.audioMode) : null;
  if (voiceLine) fixed.push(voiceLine);
  if (both) fixed.push("Suggested share of the budget: roughly sixty percent script, forty percent still asset.");
  fixed.push("Invent the names of any company, product, service, place or publication you mention. Never use a real one.");
  if (b.listsLoaded) fixed.push("The author has loaded the frequency band lists for this level, and every word you write will be checked against them automatically.");
  if (b.stillKind && (both || b.kind === "still")) {
    fixed.push("Kind of still asset the author has asked for: " + b.stillKind + ". Use this form.");
    if (/photograph|picture/.test(b.stillKind)) {
      fixed.push("Because the still asset is a photograph, it can only hold what a camera can capture. Write a brief for a single photograph and nothing else. It must not contain printed words, figures, tables, captions, data or statistics of any kind, and you must not describe it as a magazine spread, an article or a page with text beside it. The details the learner takes from it are visible things: what is there, how many, who is doing what, what the place is like.");
    }
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
