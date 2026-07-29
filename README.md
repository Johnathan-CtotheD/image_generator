# Asset generator — how to put it online

## What is in here

- `public/index.html` — the page authors use.
- `netlify/functions/generate.js` — the writing step. The contract text lives here.
- `netlify/functions/draw.js` — the drawing step. The colour palette and type rules live here.
- `public/fonts/` — where the British Council Sans web font files go.
- `tools/outline_svg_text.py` — turns the words in a drawing into shapes, so the type survives when a file leaves the site. Not wired in yet.

The prompts and the palette sit on the server, not in the page. That way every author generates against the same rules, and nobody can change them by editing the page in a browser.

## Putting it online

1. Put this folder in a Git repository.
2. In Netlify, choose Add new site, then Import an existing project, and point it at that repository.
3. Netlify will read `netlify.toml` and needs nothing else. Leave the build command empty.
4. Before the first deploy finishes, go to Site configuration, then Environment variables, and add:

   - `ANTHROPIC_API_KEY` — the only key the site needs. It covers writing, drawing and illustrations.

   The key must never go in the repository.

   Two optional ones, if you ever want to change model without touching code:

   - `WRITING_MODEL`
   - `DRAWING_MODEL`

5. Deploy. The page is at the site address; the two functions answer at `/api/generate` and `/api/draw`.

## The font

Copy the regular and bold web font files into `public/fonts/` and name them as `public/fonts/README.txt` explains. Until then the page falls back to a plain sans-serif and nothing breaks.

Check first that the licence covers serving the font from a public site. If it does not, keep the site behind Netlify's password protection, under Site configuration, Access and security.

## What is not built yet

- **Photographs.** The site makes flat illustrations, not photographs. Where a task needs a real photograph, copy the brief the generator writes into whatever photo tool you already use. This keeps the site to one supplier and one key.
- **Checking pictures.** Every check runs on words, so nothing checks an illustration. Someone has to look at each one before it is used.
- **Export.** Drawings can be downloaded as they are, but the words in them are still live text, so they change appearance on a machine without the font. `tools/outline_svg_text.py` fixes that; it needs turning into a function, and it is written in Python, so either it moves to Node or the site gets a small Python function alongside.
- **Word lists.** They are loaded by hand in the browser each session. For a shared tool the frequency bands should be served with the site so everyone checks against the same lists, leaving only a house list as an upload.

## Keeping it private

Anyone with the address can use the site, and every use spends against the key. Turn on password protection or Netlify Identity before sharing the address more widely.
