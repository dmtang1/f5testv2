# F5 Personality Test — "Chemistry by Design" MVP
### Product Requirements Document (PRD) · Build Prompt for New Site

---

## 0. How to use this document (instructions to the builder)

You are building a **working MVP prototype** of a personality assessment web app. The current site (https://crowdcreate.us/f5-personality-test/) is a marketing/waitlist page only: it describes a test but does not contain one. The new site must contain a **real, functioning assessment** whose typing model, vocabulary, traits, and guidance come from the **Bink Inc. "Chemistry by Design"** deck (summarized in full in Section 8 — treat Section 8 as the source of truth for all content).

Build rules:
1. Follow the requirement IDs (FR-x, NFR-x) and satisfy every acceptance criterion in Section 13.
2. Use the content in Section 8 **verbatim** for trait lists, spot cues, and adjustment tips. Do not invent additional personality claims beyond what is marked "Draft — needs review."
3. Where this document says **[ASSUMPTION]**, implement the assumption but keep it easy to change (config/data file, not hard-coded in components).
4. Everything content-related (questions, types, tips) lives in data files (JSON/TS), separate from UI code, so the client can edit copy without touching components.
5. Do **not** include anything from Section 3's "Exclude" list.

---

## 1. Product overview

**Working name:** F5 Test — Chemistry by Design edition
**One-liner:** A short, shareable assessment that places a person into one of four communication/working-style types (Director, Motivator, Defender, Teammate) and gives them a practical playbook for adjusting how they work with each of the other types.
**Core principle (from the deck — the "Platinum Rule"):** *"Do unto others exactly as they would like to be done unto." It's not about you. It's about them.* Every results screen must reinforce this: the value is in **adapting to others**, not just labeling yourself.

### 1.1 Goals
| # | Goal | Measure |
|---|------|---------|
| G1 | Deliver a complete assessment → result → playbook flow end to end | A first-time user completes it in under 5 minutes |
| G2 | Make results feel personal and useful, not just a label | Result page has type + axis scores + strengths + "how to work with others" |
| G3 | Make results shareable to drive virality (carries over from the existing F5 "viral loop" idea) | Share link and result card work |
| G4 | Capture leads for the client | Email capture with consent after results |
| G5 | Be a credible prototype the client can demo and iterate on | Clean UI, editable content, analytics in place |

### 1.2 Non-goals for this MVP
See Section 5 (Out of scope).

---

## 2. Current site audit (what exists today)

Fetched from the live page. Retain the brand voice and structure where noted.

**Existing page structure (Elementor/WordPress, single page, anchor nav):**
- Nav anchors: Compare · How It Works · Famous Five · Get Early Access
- Hero: "The World's Most Powerful Personality Assessment" — audience line "For Individuals, Leaders & Teams"; CTA "Be first to take the F5 Test"; microcopy "Free results · No credit card · Shareable Fiveprint · We'll only email you about F5"
- Sample "YOUR FIVEPRINT" card: badge "V5", title "The Visionary", three scores (Explore 92 / Build 78 / Connect 71)
- **Comparison table** (F5 vs MBTI vs Enneagram vs 16Personalities) with rows: Memorable identity, Dimensional trait profile, Identifies current goals, Social-media/attention analysis, Maps who influences you, Your five complementary people, Viral Famous Five, 30-day action experiment
- **F5 Framework:** F1 Find Yourself · F2 Find Your Future · F3 Find Your Friction · F4 Find Your Five · F5 Find Your Path
- **Famous Five** sample card (Think/Build/Push/Connect/Live Like … with %), "Share My Famous Five" CTA
- "The Viral Loop" section, "F5 = Refresh" section, email capture form ("Get Early Access →"), footer with Privacy link

**Keep (adapt):** brand name "F5", the "Fiveprint" result-card concept, the F1–F5 framework as the site's organizing story, the tone (confident, aspirational, plain), the email-capture microcopy, the comparison-table idea, the privacy link.

**Change:** the site currently promises features (Famous Five, social-media analysis, 30-day experiment) that have no supporting source data in the deck. See Section 5 for how these are handled in the MVP.

> **[ASSUMPTION]** The exact visual style (colors, fonts, spacing) of the current site could not be extracted from text. The builder should use a modern, dark-on-light-accent design system defined in one theme file (CSS variables/Tailwind config) so the client can drop in the real brand tokens later. See NFR-10.

---

## 3. Source material: what to use from the deck

The deck is a facilitation workshop by **Bink Inc.** for an agency/client pairing. Much of it is engagement-specific and must not ship in a public product.

### 3.1 Include (drives the product)
| Deck slide(s) | Use in product |
|---|---|
| Defining the 4 types (2×2 grid, axes: Task/Private ↔ People/Open, Ask/Indirect ↔ Tell/Direct) | Core typing model and the 2×2 result visualization |
| Chemistry by Design (Platinum Rule) | Guiding principle, results-page framing |
| Decisions (T ↔ F) and T/F words | Explanatory content for the Task vs People axis ("How you decide") |
| Traits: Directors / Motivators / Defenders / Teammates | Result page trait lists |
| How to Spot Types (Telephone, Appearance, Office, Written, Leisure, Pace) | "Spot the types" reference and result-page "How others see you" |
| How you should adjust (You × Other matrix) | "Working with others" playbook — **the signature feature** |
| Who makes up the team? (2×2 team roster grid) | Inspiration for the optional Team Map (Section 6.9) — structure only, not the names |

### 3.2 Exclude (do not ship)
| Deck slide(s) | Reason |
|---|---|
| "Mohegan Sun" / "kbp" cars, Foxwoods jokes, Bob Barker, Letterman exercise, Win/Win consequences, desired results, next steps with dates, roster of named people | Client-specific workshop content and personal names |
| Principles of Idea Generation, "A metaphorical sampling," car photos, Indy winner photo | Unrelated to the assessment; third-party images with unknown licensing |
| National stereotypes (Japan/Germany/Mexico/France) | Stereotyping nationalities in a public consumer product is a reputational risk. Omit unless the client explicitly insists |
| Blank slides ("What Mohegan needs from kbp," "Don't forget evaluations," etc.) | No content |

### 3.3 Optional Phase 2 content
"Creating a Win/Win Agreement" (Desired Results · Shared Values · Team Processes · Accountability · Consequences; "Start with the end in mind," Stephen Covey) can become a **Team Charter** template feature. See Section 6.10.

---

## 4. Users and use cases

| Persona | Need | Key flow |
|---|---|---|
| **Individual explorer** | "What's my style and how do I get along better with others?" | Land → take test → see type → read playbook → share |
| **Leader / manager** | "How should I adjust my approach to each person on my team?" | Take test → open "Working with others" → pick each type |
| **Team member / colleague** | "My teammate sent me their result; what do I do with it?" | Open shared link → read "How to work with a [Type]" → take own test |
| **Client / demo audience** | Evaluate the prototype | Skim landing → complete test → review result page → try share |

Primary device: mobile-first (people will open shared links on phones), fully usable on desktop.

---

## 5. Scope

### 5.1 In scope (MVP)
1. Landing page (adapted from current F5 page)
2. Assessment (22 forced-choice questions, Section 7)
3. Scoring and type assignment (2 axes → 4 types, with strength and secondary-type nuance)
4. Result page ("Fiveprint" card, trait lists, decision-style explainer, how others spot you)
5. "Working with others" playbook (You × Other matrix, all 16 cells)
6. "Spot the Types" reference page
7. Shareable result link + copyable/downloadable result card
8. Email capture with consent
9. Basic analytics events
10. Privacy page/link, basic legal disclaimers

### 5.2 Out of scope (MVP) — show as "Coming soon" teasers only
| Feature (from current site) | MVP treatment |
|---|---|
| **Famous Five** (compare to public figures) | Teaser card only. No real-person matching (legal/likeness risk; no source data) |
| **F2 Find Your Future** (goals) | "Coming soon" teaser |
| **F3 Find Your Friction** (habits, social-media/attention analysis) | "Coming soon" teaser |
| **F5 Find Your Path** (30-day experiment) | "Coming soon" teaser |
| Accounts, login, payments, saved history | Not needed; results are stateless/shareable by link |
| AI/LLM-generated insights | Not in MVP; all copy is static from Section 8 |
| Native apps, admin CMS | Not in MVP |

> **[ASSUMPTION]** In the MVP, **F1 "Find Yourself"** is fully built (the assessment + result), and **F4 "Find Your Five"** is partially delivered via the "Working with others" playbook (who to adapt to and how) and the optional Team Map. F2, F3, F5 are teasers. Confirm with client.

---

## 6. Functional requirements

### 6.1 Information architecture / routes
| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/test` | Assessment (one question per screen) |
| `/results` | Result page for the user who just completed the test (reads from local state) |
| `/r/[code]` | Public shareable result page (e.g., `/r/DM-72-38`) — see FR-40 |
| `/types` | "Spot the Types" reference — all four types |
| `/types/[type]` | Detail page for each type (director, motivator, defender, teammate) |
| `/playbook` | "Working with others" — interactive You × Other matrix |
| `/team` | Optional Team Map (Section 6.9) — feature-flagged |
| `/privacy` | Privacy policy (link to existing https://crowdcreate.us/privacy-policy/ or replicate) |

### 6.2 Landing page (FR-1x)
- **FR-10** Sticky header with logo "F5" and nav: Compare · How It Works · Types · Take the Test (primary CTA button).
- **FR-11** Hero: headline, sub-copy, primary CTA "Take the F5 Test" → `/test`. Microcopy: "Free results · No credit card · Shareable Fiveprint · We'll only email you about F5". Show a sample Fiveprint card (static).
- **FR-12** "How it works" section: 3 steps — Answer 22 quick questions → Get your type + Fiveprint → Learn how to adapt to everyone else.
- **FR-13** "Chemistry by Design" section presenting the Platinum Rule quote and the 2×2 grid of the four types (clickable → `/types/[type]`).
- **FR-14** Comparison table (F5 vs typical personality tests). **Must be factually defensible:** limit rows to what the MVP actually delivers (e.g., Memorable identity, Two-axis dimensional profile, Practical "how to work with each type" playbook, Shareable result card). Do not claim features that are teasers as delivered. Do not use the trademarked terms "MBTI" or "Myers-Briggs" as competitor column headers without client/legal approval. **[ASSUMPTION]** Use generic "Traditional type tests."
- **FR-15** F1–F5 framework section; F1 marked "Live," F4 marked "Partly live," F2/F3/F5 marked "Coming soon."
- **FR-16** Coming-soon teaser cards for Famous Five and 30-day experiment with email capture ("Get early access").
- **FR-17** Footer: © F5 Test, Privacy link, disclaimer (Section 12).

### 6.3 Assessment (FR-2x)
- **FR-20** 22 questions, one per screen, two answer options (A/B) presented as large tappable cards. Keyboard accessible (1/2 or ←/→ keys; Enter to confirm).
- **FR-21** Progress bar and "Question X of 22." Back button to change the previous answer. Answers persist across page refresh (localStorage/sessionStorage).
- **FR-22** Option order randomized per session (which pole is A vs B) to reduce position bias; question order is fixed and interleaves the two axes (Q1 axis 1, Q2 axis 2, …).
- **FR-23** Intro screen before Q1: what it measures, time estimate (~3–4 min), "There are no right answers — pick the one that sounds most like your natural default at work."
- **FR-24** On the final answer, show a short "calculating" transition (≤1.5s), then route to `/results`.
- **FR-25** Optional (not required to proceed): a first-name field on the intro screen used to personalize the result card. Privacy note beside it.

### 6.4 Scoring (FR-3x) — see Section 7 for the model
- **FR-30** Compute two axis scores (0–100) from the 22 answers.
- **FR-31** Assign the primary type from the quadrant.
- **FR-32** Compute strength label per axis (Slight / Moderate / Strong).
- **FR-33** Compute a **secondary type** (the adjacent quadrant on the axis where the user is closest to the midpoint), shown as "You also show traits of a …". This adds dimensional nuance consistent with the site's "dimensional trait profile" claim.
- **FR-34** Scoring is deterministic and unit-tested (Section 13).

### 6.5 Result page (FR-4x)
- **FR-40** Header **Fiveprint card** (also the share image): type name, quadrant code (ST/NT/SF/NF shown as a small secondary label), a one-line summary, the two axis scores as labeled bars, and the F5 mark. Use the site's "V5" badge style if desired.
- **FR-41** **2×2 map**: the four quadrants with a dot placed at the user's exact (x, y) position. Axis labels: horizontal Ask/Indirect ↔ Tell/Direct; vertical Task/Private ↔ People/Open (use the deck's orientation: Task/Private on top, People/Open on bottom; Ask/Indirect on left, Tell/Direct on right).
- **FR-42** **Your traits:** full trait list for the type from Section 8.2 (verbatim, two columns on desktop).
- **FR-43** **How you decide:** shows the user's position on the Thinking (T) ↔ Feeling (F) spectrum with the Section 8.3 word lists (Thinkers vs Feelers) and the "Objective/Subjective, Analytical/Experiential, Non-personal/Interpersonal, Clarity/Harmony, Just/Merciful" pairs.
- **FR-44** **How others spot you:** the six spot cues for their type (Telephone, Appearance, Office, Written, Leisure, Pace) from Section 8.4.
- **FR-45** **Work with others:** four expandable cards, one per type (including their own), each showing the three adjustment tips "When you (type X) work with a (type Y)…" from Section 8.5. Link to `/playbook`.
- **FR-46** Platinum Rule callout: "It's not about you. It's about them." with a short line telling the user how to use the playbook.
- **FR-47** Actions: Share (FR-50), Save/Email my results (FR-60), Retake test, Explore other types.
- **FR-48** Secondary type callout (FR-33).

### 6.6 Sharing (FR-5x)
- **FR-50** "Share" button uses the Web Share API on supported devices; fallback: copy link.
- **FR-51** Shareable URL encodes the result without needing a database: `/r/[code]` where code = `[TypeInitial][SecondaryInitial?]-[axisXscore]-[axisYscore]` (example `DM-72-38`). Validate on load; invalid codes redirect to `/`.
- **FR-52** The public result page shows the Fiveprint card, type summary, and a prominent "Take the test yourself" CTA plus "How to work with a [Type]" guidance for the viewer (this is the viral hook and the "colleague received a link" use case).
- **FR-53** Open Graph/Twitter meta tags per result page with dynamic title ("[Name or 'Someone'] is a Director — What's your F5?") and an OG image of the Fiveprint card. **[ASSUMPTION]** Server-side generated OG image (e.g., Next.js `ImageResponse`) — if too heavy for MVP, use one static OG image per type (4 images).
- **FR-54** "Download card" produces a PNG of the Fiveprint card (nice-to-have; implement if time allows).
- **FR-55** Share text must not contain the person's email or any private data. Name is included only if the user entered one and opted to include it.

### 6.7 Email capture (FR-6x)
- **FR-60** After results (and in the landing footer), an email form: "Get your results + early access to the full F5." Required consent checkbox with text: "Email me my results and F5 updates. Unsubscribe anytime." Microcopy: "We'll only email you about F5."
- **FR-61** MVP storage: POST to a serverless endpoint that forwards to an email provider/CRM. **[ASSUMPTION]** Provider undecided → implement an adapter with a stub (logs + saves to a simple table/file) and one documented integration point (e.g., Mailchimp/ConvertKit/Resend/Google Sheets webhook). Client picks later.
- **FR-62** Store with the lead: email, name (if given), type, axis scores, timestamp, source (landing/results), consent flag. No other PII.
- **FR-63** Basic validation, honeypot field for bots, double-submit prevention, success and error states.

### 6.8 "Spot the Types" and "Playbook" pages (FR-7x)
- **FR-70** `/types` shows the four types in the 2×2 with short descriptors; `/types/[type]` shows traits (8.2), spot cues (8.4), and "How to work with a [Type]" as seen from each of the four "you" types (8.5).
- **FR-71** `/playbook`: interactive matrix. Two selectors — "I am a …" (Director/Motivator/Defender/Teammate; defaults to user's type if known) and "I'm working with a …" — displays the three tips for that cell. Also offer a full 4×4 grid view for print/screenshot.
- **FR-72** Include a "Spot them first" mini-guide beside the playbook: the six cues so users can identify the other person's type in the wild.
- **FR-73** All content pulled from the data file in Section 8.

### 6.9 Team Map (optional, feature-flagged `ENABLE_TEAM_MAP`)
Inspired by the deck's "Who makes up the team?" slide.
- **FR-80** A user can add up to 12 team members (name + type, chosen manually or via pasting their share link/code) and see them placed in the 2×2 grid.
- **FR-81** Shows a summary: counts per quadrant, "Missing perspectives" (empty quadrants), and a link to the playbook cell for each pair the user selects.
- **FR-82** State is client-side only in MVP (localStorage), exportable as an image. No server storage of names.

### 6.10 Team Charter (Phase 2 — do not build in MVP)
Template built from the Win/Win Agreement structure: **Desired Results · Shared Values · Team Processes · Accountability · Consequences**, with the "Living document" and "Annual review" guidance ("Should be a living document — recommend changes/additions, refer to for conflict resolution; annual review — examples of fulfillment, examples of shortfall, revisit desired results"). Document here only so the data model and navigation leave room for it.

### 6.11 Analytics (FR-9x)
Track (privacy-respecting, no PII in events): `landing_view`, `cta_click`, `test_start`, `question_answered` (index only), `test_complete` (type, axis strengths), `result_view`, `share_click`, `share_link_open`, `playbook_cell_view` (you/other), `email_submit`, `retake`. Consent banner if required by region (see NFR-7).

---

## 7. Assessment design

### 7.1 Model
The deck's 2×2 has two axes. Each axis is scored independently, producing a position in the grid.

| Axis | Pole A (score 0) | Pole B (score 100) | Deck label |
|---|---|---|---|
| **Vertical — "Focus"** | **Task / Private** | **People / Open** | Related to the Thinking (T) ↔ Feeling (F) decision-making spectrum |
| **Horizontal — "Style"** | **Ask / Indirect** | **Tell / Direct** | Ask/Tell communication style |

| | Ask / Indirect (left) | Tell / Direct (right) |
|---|---|---|
| **Task / Private (top)** | **Defender** (ST) | **Director** (NT) |
| **People / Open (bottom)** | **Teammate** (SF) | **Motivator** (NF) |

Note: the deck's letter codes (ST/NT/SF/NF) place Task/People on the T/F letter and Ask/Tell on the S/N letter. **The MVP should present the four type names and the two plain-language axes as primary; show the letter codes only as a small secondary label.** Do not claim the Ask/Tell axis is scientifically equivalent to the Sensing/Intuition scale — the deck doesn't define it; flag for client review (Section 14).

### 7.2 Scoring rules
- 22 items: 11 for the Focus axis, 11 for the Style axis. Each item is forced-choice; picking Pole A adds 0, Pole B adds 1 to that axis.
- **Axis score** = (count of Pole B picks ÷ 11) × 100, rounded to the nearest integer. (11 items → odd count → no exact 50/50 ties.)
- **Type:** Focus < 50 → Task/Private (top), else People/Open (bottom). Style < 50 → Ask/Indirect (left), else Tell/Direct (right).
- **Strength (per axis):** distance from 50 → `< 15` Slight · `15–34` Moderate · `≥ 35` Strong.
- **Secondary type:** find the axis where the user is closer to 50; flip that axis to get the adjacent quadrant. If both are equally close, prefer flipping the Style axis. Only display the secondary type if that axis's distance from 50 is `< 25`; otherwise show "Strongly [Type]."
- **Display in result:** Show axis scores as bars with the midpoint marked. Never present scores as a clinical diagnosis.

### 7.3 Draft question bank — **Draft — needs review by the client / a qualified psychometrician**
The deck contains no questions, so these items are **derived from the deck's trait and cue lists**. Option order is randomized at runtime (FR-22). `A`/`B` labels below are for the data file only.

**Prompt shown to the user:** "Which sounds more like you, most of the time?"

#### Focus axis (A = Task/Private → 0, B = People/Open → 1)
| ID | A — Task / Private | B — People / Open |
|---|---|---|
| F1 | When I make a tough call, I lean on objective analysis, policy, and facts. | When I make a tough call, I lean on the circumstances and how people will be affected. |
| F2 | I'd rather be known as just and firm. | I'd rather be known as humane and merciful. |
| F3 | In a disagreement, I favor clarity even if it's blunt. | In a disagreement, I favor harmony even if it softens the message. |
| F4 | I tend to keep my personal life and feelings to myself at work. | I tend to be open about my personal life and feelings at work. |
| F5 | On the phone I'm strictly business and brief. | On the phone I'm warm and conversational. |
| F6 | My workspace is organized around the work, with achievements on display. | My workspace is personal and friendly, open to people dropping in. |
| F7 | I give critique readily when something isn't right. | I lead with appreciation before anything else. |
| F8 | To convince someone, I use logic, standards, and precedent. | To convince someone, I appeal to people's values and situation. |
| F9 | I stay detached when emotions run high. | I get involved when emotions run high. |
| F10 | In a first meeting I want to get straight to the task. | In a first meeting I want to get to know the person first. |
| F11 | My emails are precise and to the point. | My emails are warm and friendly. |

#### Style axis (A = Ask/Indirect → 0, B = Tell/Direct → 1)
| ID | A — Ask / Indirect | B — Tell / Direct |
|---|---|---|
| S1 | In meetings I ask questions to draw out others' views before sharing mine. | In meetings I state my view right away. |
| S2 | I work at a deliberate pace and don't like to be hurried. | I work at a fast pace and want quick action. |
| S3 | I need time and low risk before I commit to a decision. | I decide quickly and want options to move on. |
| S4 | I tend to avoid conflict and keep the peace. | I'm comfortable with opposition and can even thrive on it. |
| S5 | I'm slow to get upset and keep my cool. | I speak up quickly when something needs correcting. |
| S6 | To get someone moving I suggest and invite. | To get someone moving I tell them what needs to happen. |
| S7 | I prefer steady, structured routines and schedules. | I prefer spontaneity and change. |
| S8 | I'm quiet and reserved until I know the room. | I'm expressive and energetic in most rooms. |
| S9 | In my free time I prefer relaxed, non-competitive activities. | In my free time I prefer competitive or high-energy activities. |
| S10 | I like to take the time to do it right, even if it's slower. | I like to decide fast and adjust as I go. |
| S11 | I usually let others set the direction and support it. | I usually set the direction and expect others to follow. |

Interleave order: F1, S1, F2, S2 … F11, S11.

### 7.4 Quality safeguards (MVP)
- Store the question bank as versioned data (`version: "0.1-draft"`) and include the version in analytics and share codes' metadata so scoring changes don't silently reinterpret old links.
- Include an internal `/debug/scoring` page (disabled in production) that lets the client input answer sets and see the resulting type, for review.

---

## 8. Content data (source of truth — from the Bink Inc. deck)

### 8.1 Type definitions
| Type | Code | Quadrant | One-line label (use in UI) |
|---|---|---|---|
| Director | NT | Task/Private × Tell/Direct | Decisive, goal-driven, wants quick action |
| Motivator | NF | People/Open × Tell/Direct | Enthusiastic, expressive, full of ideas |
| Defender | ST | Task/Private × Ask/Indirect | Thoughtful, detail-conscious, process-loving |
| Teammate | SF | People/Open × Ask/Indirect | Calm, steady, agreeable |

> The one-line labels above are **synthesized** from the trait lists to give the UI a headline; mark as "Draft — needs review."

### 8.2 Traits by type (verbatim from deck)

**Directors**
Dynamic/active · Must correct wrongs · Not easily discouraged · Confident · Strong need for change · Quick to judge · Usually right about tasks · Want organization · Want practical solutions · Want quick action · Decisive · Insist on goals · Thrive on opposition · Less need to be liked · Want options

**Motivators**
Sense of humor · Can be life of the party · Often more personal · Emotional · Enthusiastic, expressive · Curious · Quick to change · Sincere at heart · Bit of a child at heart · Open to big ideas · Love spontaneity · Enjoy compliments · Want you to feel at home · Quick to come up with new projects/ideas · Creative and colorful · Apologize readily · Don't hold grudges

**Defenders**
Deep and thoughtful · Analytical · Serious/purposeful · Talented and creative · Appreciate beauty · Sensitive to others · Self-sacrificing · Idealistic · Schedule oriented · Love process · Perfectionists · Detail conscious · Orderly and organized · Like economical solutions · Like graphs, charts, figures, lists

**Teammates**
Easy going/relaxed · Cool, calm, collected · Quiet, but witty · Keep emotions hidden · Not in a hurry · Can take the good with the bad · Slow to get upset · Competent and steady · Peaceful/agreeable · Good administrator · Avoid conflicts · Solve problems · Strong under pressure · Good listener · Many friends/contacts

### 8.3 Decisions: Thinking (T) ↔ Feeling (F)

Paired spectrum (Thinking ↔ Feeling): Objective ↔ Subjective · Analytical ↔ Experiential · Non-personal ↔ Interpersonal · Clarity ↔ Harmony · Just ↔ Merciful

| Thinkers (T) | Feelers (F) |
|---|---|
| Non-personal | Interpersonal |
| Objective | Subjective |
| Laws | Circumstances |
| Firmness | Persuasion |
| Just | Humane |
| Critique | Appreciate |
| Policy | Social values |
| Detached | Involved |
| Head | Heart |

### 8.4 How to spot types

| Cue | Director | Motivator | Defender | Teammate |
|---|---|---|---|---|
| **Telephone** | Short and to the point | Playful, conversational | Strictly business and brief | Warm and pleasant |
| **Appearance** | Functional, authoritative | Stylish, sporty | Conservative, classic | Pleasant, friendly |
| **Office** | Functional, desk in power position | Friendly, open feeling; walls may have posters/slogans | Organized, work-oriented; achievements on walls | Neat with personal stuff; open contact with people |
| **Written** | Succinct, clear | Informal, dramatic | Detailed, precise | Warm, friendly |
| **Leisure** | Competitive, aggressive | Spontaneous, playful | Structured, by the rules | Casual, non-assertive |
| **Pace** | Fast | Fast | Deliberate | Deliberate |

### 8.5 How you should adjust (You × Other)

Read as: **"If YOU are [column] and you're working with an OTHER person who is [row], do this."** Each cell = three tips.

> **Note to builder:** the source slide's table header is ambiguous in text extraction. This layout was reconstructed and cross-checked against each type's traits (e.g., Directors want options and practical solutions → tips for people dealing with Directors say "Give options," "More practical"). **Flag for client confirmation** that "rows = other person, columns = you" matches the original slide.

#### When working with a DIRECTOR
| You are a… | Tips |
|---|---|
| Director | Don't impose view · Give control · Be receptive |
| Motivator | Less personal · More practical · Give options |
| Defender | Be more direct · Stay private · Not too much detail |
| Teammate | Be more direct · Be less personal · Get to the point |

#### When working with a MOTIVATOR
| You are a… | Tips |
|---|---|
| Director | Stay direct · More open · More "show" |
| Motivator | Be disciplined · Give structure · Written summary |
| Defender | Be more direct · Be more open · More style |
| Teammate | Be more direct · Stay personal · Add flare |

#### When working with a DEFENDER
| You are a… | Tips |
|---|---|
| Director | Less direct · Stay private · More detail/facts |
| Motivator | Less direct · Less open · More process |
| Defender | Control process · Let client decide · Accept imperfection |
| Teammate | Less personal · Factual and detail oriented |

*(Teammate→Defender has two tips in the source; render two.)*

#### When working with a TEAMMATE
| You are a… | Tips |
|---|---|
| Director | More personal · Less direct · Assure low risk |
| Motivator | Stay personal · Less direct · Assure low risk |
| Defender | Stay indirect · More personal · Informal |
| Teammate | Not too much small talk · Initiate action · Set deadlines |

> Preserve the source spellings ("flare," "show") unless the client approves copy edits; tips are terse by design. Optionally add a one-sentence plain-English elaboration under each tip, marked "Draft — needs review."

### 8.6 Guiding principle (verbatim)
"The Platinum Rule is what works. 'Do unto others exactly as they would like to be done unto.' It's not about you. It's about them."

### 8.7 Attribution
Credit "Chemistry by Design" to Bink Inc. in the footer/About unless the client has the right to white-label it (see Section 14, risk R1).

---

## 9. Data model (client-side JSON + minimal server)

```ts
type TypeId = "director" | "motivator" | "defender" | "teammate";
type Axis = "focus" | "style";

interface Question { id: string; axis: Axis; poleA: string; poleB: string; } // A=0, B=1
interface Result {
  version: string;          // question bank version
  focus: number;            // 0–100 (0=Task/Private, 100=People/Open)
  style: number;            // 0–100 (0=Ask/Indirect, 100=Tell/Direct)
  primary: TypeId;
  secondary?: TypeId;
  focusStrength: "slight" | "moderate" | "strong";
  styleStrength: "slight" | "moderate" | "strong";
  name?: string;            // optional
  completedAt: string;
}
interface TypeContent {
  id: TypeId; label: string; code: "ST"|"NT"|"SF"|"NF";
  headline: string;         // draft copy
  traits: string[];         // 8.2 verbatim
  spot: { telephone: string; appearance: string; office: string; written: string; leisure: string; pace: string; };
}
interface AdjustCell { other: TypeId; you: TypeId; tips: string[]; } // 16 cells (8.5)
interface Lead { email: string; name?: string; type: TypeId; focus: number; style: number; consent: true; source: string; createdAt: string; }
```

Server storage is **only** for leads (and optional anonymous analytics). Results are stateless (encoded in share code + localStorage).

Share code: `[P][S?]-[style]-[focus]` where P/S ∈ {D,M,F(Defender),T(Teammate)}. **[ASSUMPTION]** Use unambiguous letters: Director=`DI`, Motivator=`MO`, Defender=`DE`, Teammate=`TE`. Example: `DI-MO-78-41`.

---

## 10. UX and visual requirements

- **NFR-10 Theme tokens:** All colors, fonts, radii, spacing in a single theme file. Provide light and dark schemes. The four types each get an accent color token (`--type-director`, etc.); pick distinct, color-blind-safe hues and never rely on color alone (always show type name/icon).
- **Tone:** confident, warm, practical; plain language; second person. Avoid clinical claims.
- **Fiveprint card:** rounded card, "V5"-style badge from current site, type name, code, two labeled bars, small 2×2 with dot, F5 wordmark. Must render legibly at 1080×1080 (share image) and on a 360px-wide phone.
- **Motion:** subtle transitions between questions; respect `prefers-reduced-motion`.
- **Question screen:** large touch targets (≥ 48px), one decision per screen, no scrolling needed on a 667px-high viewport.
- **Empty/error states:** invalid share code, storage disabled, failed email submit — each has a friendly message and a way forward.

---

## 11. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-1 | Mobile-first responsive design; supports latest 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari and Android Chrome |
| NFR-2 | Performance: Lighthouse ≥ 90 Performance/Best Practices/SEO on mobile for landing and result pages; LCP < 2.5s on a mid-tier phone |
| NFR-3 | Accessibility: WCAG 2.2 AA — keyboard-only usable, visible focus, semantic landmarks, alt text, ≥ 4.5:1 text contrast, screen-reader friendly progress announcements, respects reduced motion |
| NFR-4 | SEO: unique titles/descriptions, OG/Twitter tags, sitemap, `robots.txt`; result pages `noindex` |
| NFR-5 | Content editable via data files; no redeploy of code logic needed for copy change (redeploy of content is fine) |
| NFR-6 | Test coverage: unit tests for scoring/strength/secondary/share-code encode-decode; e2e test for full flow |
| NFR-7 | Privacy: collect minimum data; explicit consent for email; no third-party tracking before consent where required (GDPR/CCPA); privacy policy linked in footer and on email form; data deletion contact |
| NFR-8 | Security: input validation and rate limiting on lead endpoint, CSRF/honeypot, no secrets in client bundle, HTTPS only |
| NFR-9 | Availability: static-first hosting (CDN) with serverless functions for the lead endpoint |
| NFR-11 | Internationalization-ready: all strings in a locale file (English only in MVP) |

### 11.1 Recommended stack **[ASSUMPTION — override freely]**
Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel; serverless route for leads; Vitest + Playwright; PostHog or GA4 for analytics (consent-gated). If the client prefers WordPress continuity, the fallback is a static React build embedded on a WordPress page, but the route/share-link design above assumes a standalone app.

---

## 12. Legal, disclaimers, and copy guardrails

- **Disclaimer (results page + footer):** "The F5 Test is for self-reflection and workplace communication only. It is not a clinical, psychological, or hiring assessment and shouldn't be used to make employment decisions."
- Do not reference **MBTI®** or **Myers-Briggs®** in marketing copy without legal review — they are trademarks. The deck's use of ST/NT/SF/NF and T/F terminology is presented as the deck's own framework.
- Do not claim scientific validity, accuracy percentages, or "the world's most powerful assessment" as fact without support. **[ASSUMPTION]** Keep the current hero headline only if the client accepts the risk; otherwise soften to "A smarter way to understand how you work with people."
- No real-person imagery or likenesses in MVP (Famous Five deferred).
- Images: use only client-owned or licensed assets; the deck's photos are excluded.

---

## 13. Acceptance criteria

**Assessment & scoring**
1. A user can complete all 22 questions on a 375px-wide phone without horizontal scrolling.
2. Answering all "A" → Focus 0, Style 0 → **Defender**; all "B" → 100/100 → **Motivator**; A on Focus + B on Style → **Director**; B on Focus + A on Style → **Teammate**.
3. Refreshing mid-test restores progress; "Back" changes a prior answer and rescoring is correct.
4. Axis score for 6 of 11 B answers = 55; strength label = "Slight."
5. Unit tests cover every quadrant, boundaries at 14/15 and 34/35 for strength, and the secondary-type rules (including the tie-break).

**Results**
6. Result page shows: Fiveprint card, 2×2 map with correctly placed dot, full trait list (verbatim per 8.2), decision-style explainer (8.3), six spot cues (8.4), four "work with" cards with the correct 3 tips each (8.5), Platinum Rule callout.
7. All 16 playbook cells match Section 8.5 exactly, including the two-tip Teammate→Defender cell.
8. Result page is fully readable and operable with keyboard only and passes automated axe checks with zero critical issues.

**Sharing**
9. Share link opens a valid public result page in a logged-out browser; tampering with the code (invalid characters/values) redirects to `/`.
10. Shared page's OG title/image reflect the type; a "Take the test" CTA is visible above the fold on mobile.

**Leads**
11. Email cannot be submitted without consent; invalid emails are rejected; duplicate rapid submits create one lead; success state appears; server stores the fields listed in FR-62.

**Content integrity**
12. Nothing from Section 3.2 (Mohegan Sun, kbp, named people, cars, national stereotypes) appears anywhere in the built site or repo assets.
13. Coming-soon items (Famous Five, F2, F3, F5) are clearly labeled and are not presented as available.

**Non-functional**
14. Lighthouse mobile scores meet NFR-2 on landing and results.
15. `/debug/scoring` is not reachable in production builds.

---

## 14. Risks, open questions, and decisions needed from the client

| # | Item | Why it matters | Default if unanswered |
|---|------|----------------|-----------------------|
| R1 | **IP/licensing of the Bink Inc. deck** ("Chemistry by Design," type names, tips) | The deck is a third-party facilitation asset; public commercial reuse may need permission or attribution | Attribute to Bink Inc.; get written confirmation before launch |
| R2 | **Psychometric validity** of the draft 22 questions | Questions are derived, not validated; claims must be modest | Ship as "self-reflection tool" with disclaimer |
| R3 | **Ask/Tell axis vs. S/N** letters in the deck | Deck's ST/NT/SF/NF codes imply MBTI-like axes, but the deck only defines T/F explicitly | Show codes as small secondary labels |
| R4 | **You × Other matrix orientation** | Table headers were garbled in extraction | Rows = other, columns = you (cross-checked by content) |
| R5 | **Deck inconsistency:** Teammate is "People/Open" but also "Keep emotions hidden," "Quiet" | Could confuse users on the result page | Keep verbatim; consider a footnote that people vary across cues |
| R6 | **Famous Five / real people** | Likeness, defamation, and licensing risk; no source data | Teaser only |
| R7 | **Brand/visual identity** | Only text of the current site was available | Use theme tokens; client supplies brand kit |
| R8 | **Email provider / CRM** | Determines lead endpoint integration | Stub + adapter |
| R9 | **Client name & audience** ("new MVP for our client") | Affects white-labeling, copy, and whether to keep "F5" branding | Keep F5 branding; make brand name/logo configurable |
| R10 | **Comparison table claims** vs. competitors | Legal/accuracy exposure | Generic "traditional type tests," only rows we deliver |
| R11 | **National stereotypes slide** | Reputational risk | Excluded |

---

## 15. Suggested build order (for the builder)
1. Project scaffold, theme tokens, data files (Section 8) and types (Section 9).
2. Scoring engine + unit tests (Section 7) — before any UI.
3. Assessment flow (`/test`) with persistence.
4. Result page and Fiveprint card; 2×2 map.
5. Playbook + Types pages.
6. Share links, OG images, public result page.
7. Landing page adaptation (Sections 2 and 6.2).
8. Email capture endpoint + adapter.
9. Analytics, consent, privacy, disclaimers.
10. Accessibility and performance pass; e2e tests.
11. (Flagged) Team Map.

**Definition of done:** all Section 13 criteria pass, content matches Section 8, no excluded content (3.2), and the client can edit questions/copy from the data files alone.
