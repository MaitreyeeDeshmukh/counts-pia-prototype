# Counts

**Everything you do Counts.**

Counts asks a student one short question right after something happens, in class,
at work, or in the rest of their life. It keeps their answer in their own words,
shows them the skills inside it, and points them to the ASU resource that helps
them grow the ones they want next.

Built for the ASU Principled Innovation Academy "Articulating Skills" challenge
by Team 11 (Maitreyee, Larissa, Lois).

## The idea in one line

Experience -> Reflection -> Skill -> Evidence -> Growth -> Next step

Students already have the experience. What they lack is a moment to notice it
and the language to describe it. Counts supplies both, without ever putting
words in their mouth.

## Run it

No build step, no dependencies. Open `index.html` in a browser.

Tap **Load a sample semester** to see the app filled in with a made up student.

To produce the one file version (for emailing, or for the artifact viewer):

    python3 tools/build.py     # writes dist/counts.html

## Layout

    index.html              markup shell, loads the styles and scripts in order
    assets/css/styles.css   design tokens first, then components
    assets/js/data.js       skills, prompts, ASU resources, interview questions
    assets/js/state.js      saved state and small helpers
    assets/js/analysis.js   words -> skills, with an offline fallback
    assets/js/ui.js         small reused pieces of markup
    assets/js/views.js      one function per screen
    assets/js/app.js        router, events, demo seed data
    tools/build.py          inlines everything into dist/counts.html
    docs/NOTES.md           what is real, what is simulated, open questions
    docs/CHANGELOG.md       what changed and why

## Design rules we kept

1. The student's exact words are always shown next to the skill language.
2. Counts suggests, the student decides. Every suggested skill can be removed.
3. No invented facts, numbers, or outcomes. If the student did not say how it
   turned out, the draft says `[add how it turned out]`.
4. No wording that tells a student they lack anything. Gaps are framed as
   "skills you want to grow".
5. Unpaid work counts. Caregiving, translating for family, the family shop.

## Data

Everything a student enters is stored in their own browser (`localStorage`).
Nothing is uploaded. The instructor view shows counts only, never stories.
