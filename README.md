# Nano-Banana-Pro-Comic

Nano Banana Pro Comic by Adv. Akash Sharma.

## Features

- Comic panel interface (`ComicPanel.tsx`) with watercolor effect styling (`WatercolorEffect.tsx`)
- Career suite component (`CareerSuite.tsx`)
- Interactive sandbox environment (`InteractiveSandbox.tsx`)
- Onboarding setup workflow (`OnboardingSetup.tsx`)
- Telemetry display HUD (`TelemetryHUD.tsx`)
- Modals for deep inspection (`DeepInspectorModal.tsx`), compliance verification (`ComplianceVerificationModal.tsx`), and spreadsheet export (`SpreadsheetExportModal.tsx`)
- Data processing and extraction utilities for chat, share, and script content

## Tech Stack

- **Framework / Runtime:** React, TypeScript, JavaScript
- **Build Tool:** Vite
- **Configuration:** `tsconfig.json`, `vite.config.ts`, `package.json`

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` if you need to set variables.
3. `npm run dev` (Vite on port 3000) or `npm run build` to produce `dist/`; `npm run lint` runs `tsc --noEmit`.

## Usage

Open http://localhost:3000 after `npm run dev`. The application entry point is configured via `index.html` and `src/main.tsx`.

## Project Structure

```text
.
├── .env.example
├── .gitignore
├── all_script_0.js ... all_script_14.js
├── assets/
│   └── .aistudio/
│       └── .gitignore
├── check_divs.ts
├── clean_temp.ts
├── dump_scripts.ts
├── extract_parsed_chat.ts
├── find_init_data.ts
├── find_share_id.ts
├── get_share.ts
├── index.html
├── large_script_0.js ... large_script_4.js
├── long_strings.json
├── metadata.json
├── package.json
├── parse_all_data.ts
├── parse_all_relevant.ts
├── parse_share.ts
├── parse_tsdtv.ts
├── parse_tsdtv_relaxed.ts
├── parse_wiz_global.ts
├── parsed_tsdtv.json
├── print_long_strings.ts
├── relevant_strings_all.txt
├── script_0.js
├── search_large_script.ts
├── search_text.ts
├── share_page.html
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── CareerSuite.tsx
│   │   ├── ComicPanel.tsx
│   │   ├── ComplianceVerificationModal.tsx
│   │   ├── DeepInspectorModal.tsx
│   │   ├── InteractiveSandbox.tsx
│   │   ├── OnboardingSetup.tsx
│   │   ├── SpreadsheetExportModal.tsx
│   │   ├── TelemetryHUD.tsx
│   │   └── WatercolorEffect.tsx
│   ├── data.ts
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── tsconfig.json
├── vite.config.ts
└── wiz_global_data.json

## Your API keys

No keys are committed. Open the MCP Hub panel in the app and paste your own key for each connector (e.g. `GEMINI_API_KEY`); it is saved only in your browser's `localStorage`. Optionally set `VITE_GEMINI_API_KEY` in a local `.env` (git-ignored; see `.env.example`). Note: the connectors in this demo are simulated; the UI does not send your keys anywhere.

> Earlier commits contained a placeholder-style key and scraped dump files. If any real Google key was ever committed, rotate it in the Google Cloud console, since git history keeps it.
