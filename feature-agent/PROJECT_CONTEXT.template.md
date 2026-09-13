# Project Context Template

Copy this file into the **consuming project** as:

```text
docs/PROJECT_CONTEXT.md
```

Feature Agent **will not run** `/feature-agent` without this file. Fill every section that applies; mark N/A explicitly when not relevant.

---

# Project Context

> Last updated: {ISO date}  
> Owner: {name / team}

## 1. Product overview

- **Product name:** …
- **One-liner:** What it is in one sentence
- **Problem it solves:** …
- **Who it is for (primary users):** …
- **Who it is not for:** …
- **Business model:** (e.g. B2B SaaS, marketplace, consumer app, internal tool)
- **Current stage:** (idea / MVP / growth / mature)

## 2. Requirements & constraints

### Must-have product requirements
- …

### Non-negotiable constraints
- Legal / compliance: …
- Security / privacy: …
- Performance / SLAs: …
- Platforms / devices: …
- Localization / languages: …
- Accessibility: …

### Explicit non-goals
- …

## 3. Users, roles & permissions

List every role the agent should use in plans (do not invent roles beyond this list).

| Role | Description | Typical permissions |
|------|-------------|---------------------|
| … | … | view / create / update / delete / configure |

## 4. Product surfaces (apps & UIs)

List every app, site, or console the agent may touch.

| Surface | Path / repo area | Audience | Notes |
|---------|------------------|----------|-------|
| … | … | … | … |

## 5. Domain & terminology

| Term | Meaning in this product |
|------|-------------------------|
| … | … |

## 6. Tech stack & architecture

- **Frontend:** …
- **Backend:** …
- **Database:** …
- **Infra / hosting:** …
- **Auth:** …
- **Integrations / third parties:** …
- **Feature flags / config:** …
- **Monorepo apps / packages:** …

### Architecture notes (short)
…

## 7. Subscription, pricing & gating (if any)

- Plans: …
- How features are gated: …
- Usage limits / quotas: …
- Pricing / marketing docs location: …

If none: write `N/A — no subscription model`.

## 8. Analytics & success metrics

- North Star / primary KPI: …
- Event tracking conventions: …
- Dashboards / tools: …

## 9. Delivery conventions

- Default base branch: (e.g. `dev` / `main`)
- Feature branch pattern: (e.g. `feature/[name]`)
- PR target: …
- Environments: (local / staging / prod)
- Rollout / feature-flag practice: …

## 10. Doc locations (canonical)

| Artifact | Path |
|----------|------|
| This file | `docs/PROJECT_CONTEXT.md` |
| Feature index | `docs/features/ALL_FEATURES.md` |
| Feature evaluations | `docs/features/feature_descriptions/{slug}/{slug}.md` |
| Implementation plans | `docs/features/feature_descriptions/{slug}/FEAT-{slug}.md` |
| Pipeline handoff | `docs/features/feature_descriptions/{slug}/HANDOFF.md` |
| Other product docs | … |

## 11. Calibration anchors (estimation)

Optional but useful for realistic estimates:

| Example past work | Rough effort | Notes |
|-------------------|--------------|-------|
| … | … person-days | … |

---

## Agent rules for this file

When Feature Agent runs:

1. Treat this document as the **project source of truth** for product intent, roles, surfaces, stack, and constraints.
2. Prefer **Reuse → Extend → New** against what exists in this repo and this context.
3. Do **not** assume domain roles, apps, or billing models that are not listed here.
4. If a section is missing or outdated and blocks planning, stop and ask the user to update this file.
