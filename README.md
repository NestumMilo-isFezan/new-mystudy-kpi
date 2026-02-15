# MyStudy KPI Monorepo

This repository contains the modern MyStudy KPI platform and the legacy app preserved as a submodule.

## Stack

- Frontend: TanStack Start (`mystudy-kpi-frontend/`)
- Backend: Symfony (`mystudy-kpi-backend/`)
- Database: PostgreSQL
- Legacy app: Git submodule (`legacy-mystudy-kpi/`)

## Repository Structure

- `mystudy-kpi-frontend/` - TanStack Start frontend
- `mystudy-kpi-backend/` - Symfony backend
- `legacy-mystudy-kpi/` - legacy PHP application (Git submodule)
- `docs/` - plans and implementation notes
- `.devcontainer/` - local development container setup

## Clone

Use recursive clone so the legacy submodule is fetched automatically:

```bash
git clone --recurse-submodules git@github.com:NestumMilo-isFezan/new-mystudy-kpi.git
```

If already cloned without submodules:

```bash
git submodule update --init --recursive
```

## Run With Docker Compose (Dev)

From the repository root:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up --build
```

Local endpoints:

- Frontend app: `http://localhost:4321`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5433`
- HTTPS gateway (Caddy): `https://mystudykpi.test`

## Devcontainer Workflow

- Open the repo in VS Code
- Run `Dev Containers: Reopen in Container`
- Wait for post-create setup
- Develop frontend and backend inside the container

## Local HTTPS and Test Domain

1) Add local domain mapping:

```bash
echo "127.0.0.1 mystudykpi.test" | sudo tee -a /etc/hosts
```

2) Trust the local certificate:

- Linux (Fedora/Bluefin)

```bash
sudo install -m 0644 ./.devcontainer/mystudykpi-root.crt /etc/pki/ca-trust/source/anchors/mystudykpi-root.crt
sudo update-ca-trust extract
```

- Linux (Debian/Ubuntu)

```bash
sudo install -m 0644 ./.devcontainer/mystudykpi-root.crt /usr/local/share/ca-certificates/mystudykpi-root.crt
sudo update-ca-certificates
```

- macOS: import `.devcontainer/mystudykpi-root.crt` into Keychain Access and set it to `Always Trust`.

3) Verify:

```bash
curl -I https://mystudykpi.test
curl -I https://mystudykpi.test/api
```

If browser trust still fails, see `docs/finished-task/dev-https-ssl.md`.

## Submodule Notes

- `legacy-mystudy-kpi` tracks `git@github.com:NestumMilo-isFezan/mystudy-kpi.git`
- Mapping is defined in `.gitmodules`
- Pull latest submodule changes:

```bash
git submodule update --remote --merge
```
