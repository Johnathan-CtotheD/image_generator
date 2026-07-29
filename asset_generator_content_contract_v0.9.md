# AiBC Asset Generator — Content Contract (version zero-nine)

How it fits together: **the reader step → the writing step (this document controls it) → the checking step → the presentation step (decided later)**

The bot writes *only* the labelled sections listed under "What the bot must produce". All fixed numbers (word limits, vocabulary levels, speaking speed) come from the level table and are added to the bot's instructions as fixed text by the system — the bot never invents or changes them. Nothing in this document assumes a final file format; how the assets end up looking on screen is decided later.

Naming rule for everything bot-facing: sections, labels and cross-references use **names, not numbers**. Bots are unreliable with numbered references, so every part of this contract is referred to by its name (for example "the partition rule", "the detail-leak check"), never by a section number.

---

## The order of the two assets

When a task uses both assets, their order is fixed and is part of the design, not a presentation choice:

- **The first asset is the moving one, and it always carries the context.** The learner meets it first. It sets up the situation before any detail arrives.
- **The second asset is the still one, and it carries the details.** The learner turns to it once the situation is established.

Everything downstream keeps this order: the bot writes the first asset before the second, and the author sees them in that order on screen.

## What the bot is given

The writing step receives:

| Item | Where it comes from | Notes |
|---|---|---|
| Task summary | The reader step | The situation, what the learner has to do, and what kind of speaking it involves |
| Level | The tracker or spec | A1 to C2 |
| Topic | The tracker or spec | |
| Still-asset type | The tracker, or the author's choice | "document" (the usual choice) or "photo" — see the open decisions list |
| Moving-asset type | The tracker, or the author's choice | "audio" (the usual choice) or "video" — see the open decisions list |
| Shape | The author's choice | square, tall or wide |
| Kind of still asset | The author's choice | table, bar chart, line graph, pie chart, timetable, notice, advert, menu, message thread, or picture — or left open for the bot to choose the best fit |
| Number of assets | The level table sets the default; the author may change it | Either "both assets" or "one asset only" — see the single-asset option below |
| What the single asset does | The author's choice, only when one asset is requested | Either "content" (it carries the details) or "context" (it sets up the situation) — this choice drives what the asset shows |
| The fixed numbers for the level | Added by the system from the level table | Word budget, vocabulary level, speaking speed |

The reader step follows the same discipline as the rest of the platform: "not stated" is an acceptable answer, and if the reader step is unsure about something important, it stops and asks a person rather than quietly guessing.

## The partition rule (this is the text the bot sees)

> You are producing the input material for one learner speaking task. The task has two channels of information, and you must divide the task's information between them so that the learner needs both to complete the task. The learner meets the first asset — the audio — before the second asset, so the audio must make sense on its own without the still asset in front of them.
>
> **The audio or video script carries the context and the main headlines.** It sets up the situation, the people involved, what is happening and why it matters. It states the big facts in general terms. It never gives specific, checkable details.
>
> **The still asset carries the details.** It holds the specific, checkable information the learner must find and use: times, dates, prices, names, quantities, places, options, conditions. It gives only enough framing for the details to make sense.
>
> **The overlap allowance:** the two assets may share one linking reference — a name, or a set of names, that shows the learner both assets belong to the same world (for example, an event name, or the set of things being compared). Nothing else should appear in both.
>
> **Before you finish, apply the partition test:** every piece of information the learner needs must live in exactly one asset. If a detail appears in the script, move it to the still asset. If context appears only in the still asset, move it into the script. If a learner could complete the task with only one of the two assets, the division has failed — redistribute the information and test again.
>
> **The headline-and-detail pairing:** the strongest scripts *describe in general terms* what the still asset *shows exactly*. For example, the script says dinner in Spain is famously late; the table shows the actual times. Use this pairing wherever it fits.
>
> **Pointing at the still asset:** the script may tell the learner to look at the still asset (for example, "have a look at the table"). This is encouraged — it shows the learner the two parts belong together.
>
> **When there is only one asset**, the partition rule does not apply. Instead, follow what the author has said the asset is for. If it is a **content** asset, it carries the information the learner has to describe or use, and everything in it must be nameable with the language of the level. If it is a **context** asset, it sets up the situation and switches on what the learner already knows, and it does not have to supply checkable details. Either way the asset must stand on its own, within the word budget.

## What the bot must produce

The bot writes exactly the labelled sections below, each between its BEGIN and END lines, with nothing outside them. When the task uses both assets, the bot writes all the sections. When the task uses one asset only, the bot writes just the sections for that asset — the still-asset sections for a still asset, or the script and voice notes for a moving asset — and the tally leaves out anything that does not apply. A content asset is a still asset; a context asset is a script for audio.

```
===BEGIN STILL_ASSET_CONTENT===
(The full text of the still asset. If the type is "document": the actual
words of the notice, timetable, advert, table or message thread, with the
layout shown by simple headings, rows and labels. If the type is "photo":
a precise written brief for the photograph instead — subject, setting,
composition, inclusion considerations — not the image itself.)
===END STILL_ASSET_CONTENT===

===BEGIN STILL_ASSET_DESCRIPTION===
(A description of the still asset for a learner who cannot see it.
Between two hundred and two hundred and fifty characters.)
===END STILL_ASSET_DESCRIPTION===

===BEGIN SCRIPT===
(The full script for the audio or video. One speaker or a conversation,
whichever suits the task. Speaker names before each line if it is a
conversation. No directions except [pause] where needed.)
===END SCRIPT===

===BEGIN VOICE_NOTES===
speakers: (how many, and their genders — cast against stereotype where a
  role carries stereotype risk; in conversations, make sure knowledge and
  authority are balanced across the speakers)
accent: (lowest levels: UK accents only; B1 and above: a light
  international accent is acceptable)
age: (suited to the task and the learners)
speed: (state the target speed the system supplied; note "slightly
  slower" if the script is a conversation)
===END VOICE_NOTES===

===BEGIN BOT_TALLY===
still asset word count: (number)
script word count: (number)
script syllable estimate: (number)
linking reference: (the shared name, or list of names, that appears in
  both assets)
division note: (one line: which details sit in the still asset, and which
  headlines sit in the script)
===END BOT_TALLY===
```

The bot's tally is a cross-check for the checking step — the system still counts everything itself.

## The single-asset option

The level table sets how many assets a task gets by default: one still asset at the two lowest levels, and both a still and a moving asset from B1 upward. The author can ask for **one asset only**, at any level, and the generator will always produce it.

**The caution.** Where the level's default is both assets — B1 and above — the generator produces the single asset but tells the author plainly that one asset may not be the best fit at this level, because the two-channel design is what makes the learner work across two sources. The author decides; the generator does not refuse.

**Content or context.** When the author asks for one asset, they say what that asset is for. This is the choice that matters, and it drives everything about what the asset shows.

- **A content asset is the one the learner works from.** The learner takes specific information out of it and puts that information into words. It may be a thing with words on it — a table, timetable, notice, advert, menu or message thread — or it may be a picture the learner has to describe. Either way, the learner has to *name what is there*.
- **A context asset sets the scene, and it is always the moving asset.** Context is carried by audio, never by a still. It establishes where the learner is, who is involved and what kind of situation it is, and its job is to switch on what the learner already knows, so that they come to the task with ideas and expectations. The learner is not asked to list what is in it.

This means the two choices are not independent. A still asset is a content asset; a moving asset is a context asset. When the author asks for one asset only, choosing what it is for also chooses what kind it is.

**The language check on a content asset.** Because the learner has to describe what a content asset shows, everything in it must be something they can say with the language they have at their level:

- Choose actions and objects the learner can name using words from the level's lists.
- Avoid anything that can only be described with an off-list collocation, or a phrasal or multi-word verb — if naming what is happening forces the learner above their level, choose something else.
- Avoid specialist scenes and specialist equipment. A picture of mountaineers clipping carabiners is a poor content asset at B1: the learner can see exactly what is happening and has no words for it.
- Keep the number of things happening small, so the learner is not pushed into complicated linking language.

The same restraint applies to the written description that goes with the asset.

**Charts and graphs.** A chart is a content asset: the learner reads figures off it and puts them into words. When the author asks for one, the asset is written out so that it can be drawn — a title, a label for each axis or slice, the unit, then the figures as simple labelled rows, one row per bar, point or slice. Two further rules apply:

- Keep the figures few, four to six, and make them differ clearly from one another. A chart where everything is about the same gives the learner nothing to say.
- The comparison the learner has to make must be sayable at the level. At lower levels stay with plain rises and falls and simple comparisons, and avoid shapes that can only be described with specialist or off-list language — the carabiner problem in numerical form.

**Context assets are judged differently.** A context asset does not have to be nameable item by item, because the learner is not being asked to name it. The test is whether it switches on the right ideas about the situation, not whether every word in it sits on the list — though it still keeps to the level's language, since the learner has to follow it.

**A consequence worth spelling out.** Because context is always carried by audio, every picture the generator produces is a content asset. The language check on content assets therefore applies to every picture without exception: if the learner cannot name what is in it with the language of their level, it is the wrong picture.

**The rest of the rules in single-asset tasks.**

- The whole word budget for the level goes to the single asset.
- The partition rule, the detail-leak check and the linking-reference check are switched off, because there is nothing to divide information between. Every other check still runs.
- The option cannot add assets. Nothing in this contract produces more than one still and one moving asset.

## The level table (fixed numbers — supplied by the system, never written by the bot)

| Level | Assets (default) | Vocabulary | Word budget (both assets together) | Speaking speed (seconds per hundred syllables) |
|---|---|---|---|---|
| A1 | still asset only | all words from the first thousand | forty to fifty | — |
| A2 | still asset only | all words from the first two thousand | eighty to ninety | — |
| B1 | one still, one moving | ninety-five percent from the first three thousand | two hundred and eighty to three hundred and twenty | twenty-four to twenty-nine |
| B2 | one still, one moving | ninety-five percent from the first five thousand | seven hundred to seven hundred and fifty | twenty to twenty-two |
| C1 | one still, one moving | **to be confirmed** | **to be confirmed** | twenty to twenty-two |
| C2 | one still, one moving | **to be confirmed** | **to be confirmed** | **to be confirmed** |

The word budget covers everything the learner reads and hears across both assets (see the open decisions list). Suggested split from B1 upward: roughly sixty percent script, forty percent still asset, adjustable to suit the task. Conversations run slightly slower than the stated speed.

## The checking step (done by the system after the bot writes)

Every check below is done automatically by the system on the bot's output — none of it relies on the bot. A failed check means the system asks the bot to try again (twice at most), then sends the output to a person.

- **The completeness check** — all required sections are present, correctly labelled, with nothing written outside them.
- **The word budget check** — the system's own count of the still asset plus the script sits inside the word budget; if the bot's tally disagrees with the system's count by more than about five percent, the output is flagged.
- **The description length check** — the still-asset description is between two hundred and two hundred and fifty characters.
- **The vocabulary check** — the words used are measured against the word lists for the level; proper names and the linking reference don't count against it.
- **The length-of-audio check** — the syllable estimate times the speaking speed must come in under about two minutes.
- **The detail-leak check** — no times, prices, quantities or dates in the script, apart from inside the linking reference. A leak is flagged for a person to look at rather than automatically failed, because a number can occasionally be a legitimate headline. *Runs only when the task uses both assets.*
- **The linking-reference check** — every name in the linking reference appears in both assets. *Runs only when the task uses both assets.*

## Open decisions (for the deviser and the guidelines owner)

- **Usual still-asset type.** This contract assumes "document" (text-and-layout things: timetables, notices, adverts, message threads) whenever the still asset carries the details, because details have to be readable rather than guessed at, and it keeps everything in one system. Photographs are supported through the written-brief route: they suit context assets naturally, and they can also serve as content assets where the learner is meant to describe what is happening — in which case the language check on content assets applies in full. Confirm with the deviser that detail-carrying still assets are expected to be documents.
- **Usual moving-asset type.** This contract assumes audio. The video row of the guidelines is unfinished, and its stated size limit (one megabyte for up to two minutes of video) cannot be right — flag to the guidelines owner as a probable typing error.
- **What the word budget covers.** Treated here as everything across both assets together. The other reading is a separate budget per asset. One line from the guidelines owner settles it, and only the level table and the word budget check would change.
- **The two highest levels.** Their numbers are blank in the guidelines. This blocks generation at those levels only; A1 to B2 can be built now.
- **The word budget when there is one asset only.** This contract gives the single asset the whole budget for its level. The other reading is a reduced budget, since one channel carries less. Worth a line from the guidelines owner, as it affects the highest levels most.
- **The second asset from B1 upward.** The guidelines table left its type as a question mark; confirmed as a moving asset in conversation with the deviser; audio or video per the decision above.

## Version history

Version zero-one — first draft, written against the Asset Guidelines (AiBC, first of June draft, incomplete). The contract deliberately says nothing about final presentation; the labelled sections are the stable handover point. If the guidelines' numbers change, only the level table changes here.

Version zero-two — the linking reference widened from a single shared name to a name or set of names, after the first live trial (a podcast and table about urban sports), where the four sport names correctly appeared in both assets.

Version zero-three — whole contract rewritten in plain English; all numbered sections and numbered checks replaced with named ones, because bots are unreliable with numbered references; the headline-and-detail pairing and the pointing-at-the-still-asset guidance added to the partition rule, following the second live trial (a monologue and table about meal times).

Version zero-four — the number of assets became a default set by the level rather than a fixed rule, with an author option to produce one asset only, at any level and of either kind. The partition rule, the detail-leak check and the linking-reference check now switch off in single-asset tasks; the single asset takes the whole word budget for its level, pending confirmation.

Version zero-five — the single-asset option settled: the generator always produces the single asset, but cautions the author where the level's default is both assets. The author's choice is now what the asset is *for* — content or context — rather than which kind it is, and that choice drives what the asset shows. A context asset must depict only what the learner can describe with the level's language: no scenes that force off-list collocations or phrasal verbs.

Version zero-six — the language check moved to where it belongs. It applies to **content** assets, because those are the ones the learner has to describe, and a scene the learner can see but cannot name is useless to them (mountaineers with carabiners at B1). Context assets are judged on whether they switch on the right ideas, not on whether every object in them is on the word list, and may therefore be richer. A content asset is also no longer assumed to be a document: a picture the learner must describe is a content asset too.

Version zero-seven — the order of the two assets fixed: the first asset is the moving one and always carries the context, the second is the still one and carries the details. The author can now also say what kind of still asset they want (table, timetable, notice, advert, menu, message thread or picture), or leave it open for the bot to pick the best fit for the task.

Version zero-eight — charts and graphs added as kinds of still asset (bar chart, line graph, pie chart). A chart is treated as a content asset and is written out so it can be drawn: title, labels, unit, and the figures as labelled rows. Two rules attach to it — few figures that clearly differ, and a comparison the learner can actually put into words at their level.

Version zero-nine — context is carried by the moving asset by definition. A still asset is a content asset; a context asset is audio. The author's choice between content and context therefore also settles which kind of asset it is, rather than being a separate decision. One consequence: every picture the generator produces is a content asset, so the language check on content assets applies to all of them.
