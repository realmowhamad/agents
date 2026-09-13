#!/usr/bin/env node
/**
 * Install Cursor agent skills from this repository.
 *
 * Usage:
 *   npx agents install                 # all agents → project .cursor/skills
 *   npx agents install feature-agent   # one agent
 *   npx agents install --global        # user-level ~/.cursor/skills
 *   npx agents list
 *   npx agents uninstall feature-agent
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "agents.manifest.json");

const HELP = `
cursor-agents — install Cursor agent skills from this repo

Commands:
  list                              List available agents
  install [agent...]                Install all agents, or only the named ones
  uninstall [agent...]              Remove installed agents (all if none named)

Options:
  -g, --global                      Install/uninstall under ~/.cursor/skills
  -t, --target <dir>                Custom destination directory
  --dry-run                         Print actions without writing files
  -h, --help                        Show help

Examples:
  npx cursor-agents install
  npx cursor-agents install feature-agent
  npx cursor-agents install --global feature-agent
  npx cursor-agents uninstall feature-agent
  npx cursor-agents list

After feature-agent install, create docs/PROJECT_CONTEXT.md in your project
from feature-agent/PROJECT_CONTEXT.template.md (required before /feature-agent).

After install, in Cursor chat type: /feature-agent
`.trim();

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    fail(`Missing manifest: ${MANIFEST_PATH}`);
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {
    command: null,
    agents: [],
    global: false,
    target: null,
    dryRun: false,
    help: false,
  };

  const tokens = [...argv];
  while (tokens.length) {
    const t = tokens.shift();
    if (t === "-h" || t === "--help") {
      args.help = true;
    } else if (t === "-g" || t === "--global") {
      args.global = true;
    } else if (t === "--dry-run") {
      args.dryRun = true;
    } else if (t === "-t" || t === "--target") {
      const value = tokens.shift();
      if (!value) fail("--target requires a directory path");
      args.target = value;
    } else if (!args.command && !t.startsWith("-")) {
      args.command = t;
    } else if (!t.startsWith("-")) {
      args.agents.push(t);
    } else {
      fail(`Unknown option: ${t}\n\n${HELP}`);
    }
  }

  return args;
}

function resolveAgents(manifest, names) {
  const byId = new Map(manifest.agents.map((a) => [a.id, a]));
  if (!names.length) return [...manifest.agents];

  const selected = [];
  for (const name of names) {
    const agent = byId.get(name);
    if (!agent) {
      const known = [...byId.keys()].join(", ");
      fail(`Unknown agent "${name}". Available: ${known}`);
    }
    selected.push(agent);
  }
  return selected;
}

function defaultInstallRoot(isGlobal) {
  if (isGlobal) {
    return path.join(os.homedir(), ".cursor", "skills");
  }
  return path.join(process.cwd(), ".cursor", "skills");
}

function copyDir(src, dest, dryRun) {
  if (dryRun) {
    console.log(`  [dry-run] copy ${src} → ${dest}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
}

function removeDir(dest, dryRun) {
  if (!fs.existsSync(dest)) {
    console.log(`  skip (not found): ${dest}`);
    return false;
  }
  if (dryRun) {
    console.log(`  [dry-run] remove ${dest}`);
    return true;
  }
  fs.rmSync(dest, { recursive: true, force: true });
  return true;
}

function installAgents(agents, installRoot, dryRun) {
  if (dryRun) {
    if (!fs.existsSync(installRoot)) {
      console.log(`  [dry-run] mkdir ${installRoot}`);
    }
  } else {
    fs.mkdirSync(installRoot, { recursive: true });
  }

  for (const agent of agents) {
    const src = path.join(ROOT, agent.path);
    const dest = path.join(installRoot, agent.id);

    if (!fs.existsSync(src) || !fs.existsSync(path.join(src, "SKILL.md"))) {
      fail(`Agent source missing or invalid: ${src}`);
    }

    console.log(`Installing ${agent.id}…`);
    if (fs.existsSync(dest) && !dryRun) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    copyDir(src, dest, dryRun);
    console.log(`  → ${dest}`);

    if (agent.requires?.length) {
      console.log(`  Required after install:`);
      for (const req of agent.requires) {
        console.log(`    - ${req}`);
      }
    }
    if (agent.id === "feature-agent") {
      console.log(`  In Cursor chat, run: /feature-agent`);
    }
  }
}

function uninstallAgents(agents, installRoot, dryRun) {
  for (const agent of agents) {
    const dest = path.join(installRoot, agent.id);
    console.log(`Uninstalling ${agent.id}…`);
    const removed = removeDir(dest, dryRun);
    if (removed && !dryRun) console.log(`  removed ${dest}`);
  }
}

function listAgents(manifest) {
  console.log("Available agents:\n");
  for (const agent of manifest.agents) {
    console.log(`  ${agent.id}`);
    console.log(`    ${agent.description}`);
    if (agent.includes?.length) {
      console.log(`    skills: ${agent.includes.join(", ")}`);
    }
    console.log("");
  }
  console.log("Install all:   npx cursor-agents install");
  console.log("Install one:   npx cursor-agents install <agent-id>");
  console.log("Global:        npx cursor-agents install --global [agent-id]");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.command) {
    console.log(HELP);
    process.exit(args.help || !args.command ? 0 : 1);
  }

  const manifest = loadManifest();
  const installRoot = args.target
    ? path.resolve(args.target)
    : defaultInstallRoot(args.global);

  switch (args.command) {
    case "list":
      listAgents(manifest);
      break;
    case "install": {
      const agents = resolveAgents(manifest, args.agents);
      console.log(
        `Destination: ${installRoot}${args.global ? " (global)" : " (project)"}`,
      );
      installAgents(agents, installRoot, args.dryRun);
      console.log("\nDone. Restart Cursor or reopen the project if skills do not appear.");
      console.log("Then type /feature-agent in chat (after creating docs/PROJECT_CONTEXT.md).");
      break;
    }
    case "uninstall":
    case "remove": {
      const agents = resolveAgents(manifest, args.agents);
      console.log(
        `Destination: ${installRoot}${args.global ? " (global)" : " (project)"}`,
      );
      uninstallAgents(agents, installRoot, args.dryRun);
      console.log("\nDone.");
      break;
    }
    default:
      fail(`Unknown command "${args.command}"\n\n${HELP}`);
  }
}

main();
