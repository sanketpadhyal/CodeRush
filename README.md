# TS CLI Boilerplate

Professional TypeScript CLI starter template.

## Installation
```bash
npm install
```

## Development
Run the CLI in development mode:
```bash
npm run dev -- save-user 1
```

## Build & Production
Build the project and link the binary:
```bash
npm run build
npm link
my-cli save-user 1
```

## Architecture
- `src/cli.ts`: Entry point and command definitions.
- `src/commands/`: Orchestration logic.
- `src/services/`: Infrastructure (API/FileSystem) wrappers.
