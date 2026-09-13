# Feature Agent — Handoff Contract

All sub-agents read and append to one file per feature:

```text
docs/features/feature_descriptions/{feature-slug}/HANDOFF.md
```

**Sibling artifacts:**

| File | Owner | Phase |
|------|-------|-------|
| `{slug}.md` | product | 1 — feature evaluation |
| `FEAT-{slug}.md` | planner | 2 — implementation plan |
| `HANDOFF.md` | orchestrator | pipeline status |

**Rules:**

1. **Append only** — never delete a prior phase section.
2. **Reference by path** — e.g. "per `{slug}.md` § Acceptance Criteria".
3. **Block Phase 2** if Phase 1 has unresolved `Decision Required` items.
4. **Status line** — update frontmatter after each phase.
5. **Project context required** — every phase reads `docs/PROJECT_CONTEXT.md` first. Roles, surfaces, and stack come from that file only.

---

## File template

```markdown
---
feature: {feature-slug}
title: {Human Title}
scope: new | enhancement | bugfix
status: in-progress | ready-for-build | blocked
mode: lightweight | full
updated: {ISO date}
---

# Feature Handoff: {Human Title}

## Context
- **Request:** …
- **Project context:** docs/PROJECT_CONTEXT.md
- **Surfaces affected:** {from PROJECT_CONTEXT § Product surfaces}
- **Feature doc:** docs/features/feature_descriptions/{slug}/{slug}.md
- **FEAT doc:** docs/features/feature_descriptions/{slug}/FEAT-{slug}.md

---

## Phase 1 — Feature Evaluation
<!-- product writes below -->

### Framework used
feature-evaluation

### Summary
…

### Open questions / Decision Required
| Item | Owner | Blocks Phase 2? |
|------|-------|-----------------|
| … | user / product | yes / no |

### Phase 1 gate
**Pass** / **Blocked**

---

## Phase 2 — Implementation Plan
<!-- planner writes below -->

### Plan mode
Lightweight | Full

### Effort estimate
≈ X person-days

### Task table (summary)
| # | Task | Owner | MoSCoW | Effort |
|---|------|-------|--------|--------|
| 1 | … | @frontend | Must | 1d |

### Conflicts resolved
…

### Phase 2 gate
**Ready for /build** / **Blocked**
```

---

## Cross-reference map

```text
/plan (orchestrator)
       │
       ▼
read docs/PROJECT_CONTEXT.md  (hard gate)
       │
       ▼
product  ──writes──▶  {slug}.md + HANDOFF § Phase 1
       │
       ▼ (gate: Pass)
planner  ──reads {slug}.md, writes──▶  FEAT-{slug}.md + HANDOFF § Phase 2
       │
       ▼
/build | /ui | /api  ──reads FEAT doc──▶  implementation
```

---

## Canonical paths

Use these paths consistently (fix legacy typos like `features_description`):

| Artifact | Path |
|----------|------|
| Project context (required) | `docs/PROJECT_CONTEXT.md` |
| Context template (agent repo) | [PROJECT_CONTEXT.template.md](PROJECT_CONTEXT.template.md) |
| Feature evaluation | `docs/features/feature_descriptions/{slug}/{slug}.md` |
| Implementation plan | `docs/features/feature_descriptions/{slug}/FEAT-{slug}.md` |
| Pipeline handoff | `docs/features/feature_descriptions/{slug}/HANDOFF.md` |
| Feature index | `docs/features/ALL_FEATURES.md` |

---

## Downstream agents

| Next command | Reads |
|--------------|-------|
| `/build` | `FEAT-{slug}.md` task table |
| `/ui` | `FEAT-{slug}.md` UI tasks + `{slug}.md` AC |
| `/api` | `FEAT-{slug}.md` API tasks + `{slug}.md` workflow |
| `/review` | Implementation vs `{slug}.md` AC |
| `/ship` | FEAT DoD + HANDOFF status |
