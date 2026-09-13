# Agents

Reusable **Cursor agent skills** you can install into any project — all together or one at a time.

**Repo:** https://github.com/realmowhamad/agents

## Requirements

- [Node.js](https://nodejs.org/) 18+
- [Cursor](https://cursor.com/) (skills load from `.cursor/skills/` or `~/.cursor/skills/`)

## Quick start

From the project where you want the skills installed:

```bash
# List agents
npx --yes github:realmowhamad/agents list

# Install every agent into the current project (.cursor/skills/)
npx --yes github:realmowhamad/agents install

# Install only feature-agent
npx --yes github:realmowhamad/agents install feature-agent

# Install globally (all projects on this machine)
npx --yes github:realmowhamad/agents install --global
npx --yes github:realmowhamad/agents install --global feature-agent
```

### Alternative: `npx skills` (ecosystem CLI)

```bash
# All skills discovered in the repo
npx skills add realmowhamad/agents --agent cursor -y

# One skill by name
npx skills add realmowhamad/agents --agent cursor -s feature-agent -y

# Global
npx skills add realmowhamad/agents --agent cursor -g -s feature-agent -y
```

### Local path / clone

```bash
git clone https://github.com/realmowhamad/agents.git
cd your-app
npx --yes /path/to/agents install
# or
node /path/to/agents/bin/cli.mjs install feature-agent
```

## Available agents

| Agent ID | What it does |
|----------|----------------|
| `feature-agent` | Product evaluation → implementation plan (`/feature-agent`). Includes `feature-product` + `feature-planner`. |

More agents can be added later as top-level folders; register each entry in `agents.manifest.json`.

## After installing `feature-agent`

1. In your **project**, create:

   ```text
   docs/PROJECT_CONTEXT.md
   ```

2. Copy from the installed skill template:

   ```text
   .cursor/skills/feature-agent/PROJECT_CONTEXT.template.md
   ```

3. Fill in product overview, requirements, roles, surfaces, and stack. `/feature-agent` will not run without this file.

4. In Cursor chat, type **`/feature-agent`**.

## Uninstall

```bash
npx --yes github:realmowhamad/agents uninstall feature-agent
npx --yes github:realmowhamad/agents uninstall --global feature-agent
npx --yes github:realmowhamad/agents uninstall   # remove all agents listed in the manifest
```

## CLI reference

```text
npx cursor-agents list
npx cursor-agents install [agent...]
npx cursor-agents uninstall [agent...]

Options:
  -g, --global       Use ~/.cursor/skills instead of ./.cursor/skills
  -t, --target DIR   Custom install directory
  --dry-run          Show what would happen without writing files
  -h, --help         Help
```

Binary names: `agents` and `cursor-agents` (same CLI).

## Where files go

| Scope | Path |
|-------|------|
| Project (default) | `.cursor/skills/<agent-id>/` |
| Global (`--global`) | `~/.cursor/skills/<agent-id>/` |

Cursor discovers skills recursively under those folders. Agent folder names are unchanged (`feature-agent`, etc.).

## Repository layout

```text
agents/
├── README.md
├── package.json
├── agents.manifest.json
├── bin/cli.mjs
└── feature-agent/
    ├── SKILL.md
    ├── HANDOFF.md
    ├── PROJECT_CONTEXT.template.md
    ├── product/SKILL.md
    └── planner/SKILL.md
```

## Adding a new agent

1. Create a top-level folder with the same name as the skill (do not rename existing agents).
2. Add a `SKILL.md` with `name` + `description` frontmatter.
3. Register it in `agents.manifest.json`.
4. Include the folder in `package.json` → `files`.
