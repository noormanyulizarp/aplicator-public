# Pipeline Strategy — Greenhouse Apply

Where to run what, and why. This document is referenced from `skills/greenhouse-apply/SKILL.md` section 5/6 and `Known limitations` item 5.

## TL;DR

| Step | GitHub Actions (CI) | z.ai sandbox | Local laptop |
|---|---|---|---|
| Inspect a Greenhouse form (read-only) | ✅ daily smoke test | ✅ | ✅ |
| Fill form fields programmatically | ❌ (no browser state benefit) | ✅ primary | ✅ |
| Upload CV + Cover Letter PDFs | ❌ (files not in CI env) | ✅ primary | ✅ |
| Click Submit (automation: trips bot detection + email challenge; real human: usually fine) | ❌ will trip bot fingerprint | ✅ (human may skip challenge) | ✅ (human rarely hits challenge) |
| Read 8-char code from applicant email (only if challenge fires) | ❌ no inbox access | ✅ if challenge fires | ✅ if challenge fires |
| Type code + final Submit | ❌ no human mid-run | ✅ if needed | ✅ if needed |

**Rule of thumb**: GitHub Actions is for **source control + read-only regression tests**. The sandbox (or Bang's laptop) is for **live apply execution**. Don't run a *scripted* live apply inside a GitHub Actions runner — the script's bot fingerprint scores low, Greenhouse fires the email verification challenge, and the CI runner has no inbox + no way to pause for a human. A *human* applying manually from their laptop is a different story — they typically score high and never see the challenge at all (see "Important nuance" below).

**Important nuance — the email challenge is conditional, not universal**: Greenhouse's email verification challenge only fires when reCAPTCHA Enterprise scores the submitter below the auto-accept threshold (HTTP 428). A real human applying manually from their own Chrome on a laptop with residential IP and real cookie history almost always scores high — they click Submit, see the "Thank you" page, done, **no email code ever needed**. The challenge bites automation: headless Playwright, fresh CI runner profiles, datacenter IPs all score low. So the "human reads 8-char code from inbox" step is a cost of *automation*, not a cost of *applying to Greenhouse*. If Bang applies manually from their laptop, this whole document is moot — they just fill the form and submit.

## Why GitHub Actions can't do live apply

### Constraint 1 — reCAPTCHA Enterprise bot fingerprint

Greenhouse forms use `reCAPTCHA Enterprise` in invisible mode (`size=invisible`). The score is a function of:
- Browser fingerprint (headless Playwright on ubuntu-latest = obviously bot)
- Mouse movement entropy (CI has no real mouse)
- Cookie history (fresh container each run = zero history)
- IP reputation (GitHub Actions IP ranges are well-known datacenter IPs)

Even with `playwright-extra` + `stealth` plugin, CI-driven fills score ~0.1–0.3. The threshold for auto-accept is ≥0.7. **Result: HTTP 428 every time.**

### Constraint 2 — Email verification challenge

When score < threshold, Greenhouse sends an 8-char code to the applicant email and disables Submit until the code is typed. A CI runner has:
- No IMAP/POP3 credentials (and you should NOT put Gmail app passwords in GitHub Secrets if the repo is public — even encrypted secrets are at risk of leak via workflow log mistake)
- No way to pause for human input mid-job
- A 6-hour hard timeout (private repo)

Even if you grant IMAP access, the email can take 30–90 seconds to arrive and the challenge expires in 10–30 min — tight but feasible in the sandbox, very fragile in CI.

### Constraint 3 — File artifacts

The CV + Cover Letter PDFs live in `download/noormanyulizarp@gmail.com/`. These are NOT in the public repo (correctly — they contain personal contact details). CI would need to either:
- Re-generate them from `download/...` source (but those aren't committed)
- Fetch from a private S3 bucket (needs credentials)
- Receive via artifact upload (manual step that defeats automation)

In the sandbox they're already on disk. Done.

### Constraint 4 — Persistent browser state

The sandbox keeps a persistent Chrome profile across tool calls within a turn. This means cookies, localStorage, and the partially-filled form survive between commands. In CI, every step runs in a fresh container — no way to "fill now, submit later" if the submit has to wait for an email.

## What DOES belong in CI

### Smoke test: inspect-only, no submit

A daily (or on-push) workflow that:
1. Checks out the repo
2. Installs Python deps
3. Runs `scripts/greenhouse_mcp_server.py inspect` against a small set of known Greenhouse job URLs (FxPro, Supercell, BVNK — read-only, no submit, no captcha trigger)
4. Asserts the JSON schema is stable (same field IDs, same maxLength, same react-select pattern)
5. Fails the build if the inspect tool breaks or Greenhouse changes their form schema

This catches regressions in the inspect tool and detects when Greenhouse ships a breaking change to their form structure. **Cost: ~2 min/run, free tier covers it easily.**

See `.github/workflows/inspect-smoke-test.yml`.

### Lint + syntax check

A workflow that runs `python -m py_compile` on every script in `scripts/` to catch syntax errors before they hit the sandbox. Cheap, fast, no secrets.

### Static site deploy (already exists)

`deploy-public-mirror.yml` already deploys the job suggestions JSON to GitHub Pages. No changes needed.

## What does NOT belong in CI

- Live apply (any company)
- reCAPTCHA solving (any service, paid or free)
- Email code retrieval (needs inbox credentials)
- CV/CL upload to a real job posting (needs the files, which aren't in the repo)

## Recommended pipeline shape

```
┌─────────────────────────┐         ┌──────────────────────────┐
│  GitHub Actions (CI)     │         │  z.ai sandbox            │
│  - inspect smoke test   │  push   │  - live apply execution  │
│  - lint + syntax check  │  ────►  │  - human-in-the-loop for │
│  - static site deploy   │         │    email code            │
└─────────────────────────┘         │  - artifacts in download/│
                                     └──────────────────────────┘
                                                │
                                                ▼
                                    ┌──────────────────────────┐
                                    │  Local laptop (fallback)  │
                                    │  - same scripts           │
                                    │  - manual submit if       │
                                    │    sandbox unavailable    │
                                    └──────────────────────────┘
```

## Triggering a sandbox apply from GitHub

If Bang wants to fire an apply from a GitHub trigger (e.g. a new job appears in the daily scan → kick off apply), the realistic pattern is:

1. **GitHub Actions detects a new matching job** (existing `scan-jobs-daily.yml` already does this)
2. **GitHub Actions commits the new job URL** to `data/job_suggestions.json` (already happens)
3. **Bang opens the sandbox** (z.ai chat) and tells the agent: "apply to the new jobs in data/job_suggestions.json"
4. **Sandbox runs the live apply** with human-in-the-loop for the email code

There is no clean way to auto-trigger the sandbox from GitHub — the sandbox is a chat session, not a webhook receiver. The human-in-the-loop step is the irreducible minimum.

If Bang later wants a fully headless nightly apply (no human), the path is:
1. Stand up a small VPS with a persistent Chrome profile + IMAP credentials in env vars
2. Run the apply script there (same scripts/ repo)
3. NOT in GitHub Actions

That's a future engineering project, not a CI workflow.
