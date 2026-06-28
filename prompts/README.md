# AVIATONLY Prompt Library

Copy-paste prompts for **dashboard UI work** in the merged monolith. For aviation marketplace product rules, use `.cursor/rules/aviatonly.mdc` and root `AGENTS.md`.

## How to use

1. Pick a prompt from the folders below.
2. Open the `.prompt.md` file and fill placeholders like `{{DASHBOARD_TITLE}}`.
3. Paste into Cursor chat (or reference the file path: `prompts/dashboard/dashboard-master.prompt.md`).
4. Generated code should land under the paths in root **`AGENTS.md`**.

## Categories

| Folder | Purpose |
|--------|---------|
| `apps/` | Scaffold or isolate dashboard app modules |
| `auth/` | Login/register page layouts |
| `branding/` | Logo and identity updates |
| `components/` | Data tables and reusable UI |
| `dashboard/` | Dashboard pages, KPIs, charts |
| `forms/` | Validated form components |
| `language/` | i18n add/remove languages |
| `navigation/` | Sidebar and menu changes |
| `theming/` | Colors, dark mode, RTL |

## Path conventions (post-merge)

All prompts assume the **single-app** layout:

- Dashboard pages → `src/app/(dashboard)/dashboard/`
- Dashboard components → `src/components/dashboard/`
- UI primitives → `src/components/ui/`
- Context → `src/app/context/`
- API routes → `src/app/api/`
- Public site → `src/app/(site)/` (not covered by most template prompts)

See **`AGENTS.md`** at the repo root for the full map.
