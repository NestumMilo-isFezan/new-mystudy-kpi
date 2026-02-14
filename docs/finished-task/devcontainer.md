# Devcontainer Setup (Current Project)

This document describes the devcontainer setup currently used in this monorepo and how to use it on any machine.

## Overview

- Devcontainer config file: `.devcontainer/devcontainer.json`
- Compose files used by devcontainer:
  - `compose.yaml`
  - `compose.dev.yaml`
- Main devcontainer service: `backend`
- Services started automatically: `db`, `backend`, `frontend`, `caddy`
- Workspace inside container: `/workspace`

## Runtime and tooling

- `remoteUser` is `root` for smoother file operations across the monorepo.
- Devcontainer features enabled:
  - `ghcr.io/devcontainers/features/common-utils:1`
  - `ghcr.io/devcontainers/features/node:1` (Node 20)
  - `ghcr.io/devcontainers/features/github-cli:1`
- Post-create bootstrap command installs dependencies for:
  - frontend (`bun install` in `mystudy-kpi-frontend`)
  - backend (`composer install` in `mystudy-kpi-backend`)

## Ports

- `80` (HTTP via Caddy)
- `443` (HTTPS via Caddy)
- `4321` (frontend dev server)
- `8080` (backend app)
- `5433` (Postgres mapped from container `5432`)

## VS Code extensions preconfigured

- `bmewburn.vscode-intelephense-client`
- `astro-build.astro-vscode`
- `alpinejs.alpine-js-intellisense`
- `ecmel.vscode-html-css`
- `mikestead.dotenv`
- `dbaeumer.vscode-eslint`
- `esbenp.prettier-vscode`

## How to open this project in devcontainer

1. Open project root in VS Code.
2. Run `Dev Containers: Rebuild and Reopen in Container`.
3. Wait for post-create dependency installation to finish.
4. Verify services are up:

```bash
docker compose -f compose.yaml -f compose.dev.yaml ps
```

## Reproduce on another machine

1. Install Docker and VS Code Dev Containers extension.
2. Clone this repository.
3. Open in VS Code and rebuild/reopen in container.
4. If using HTTPS custom domain, follow `docs/finished-task/dev-https-ssl.md`.
