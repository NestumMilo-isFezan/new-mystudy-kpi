# New MyStudy KPI Monorepo

This repository contains the modernized MyStudy KPI stack and the legacy app preserved as a Git submodule.

## Repository Structure

- `mystudy-kpi-frontend/` - Astro frontend
- `mystudy-kpi-backend/` - Symfony backend
- `legacy-mystudy-kpi/` - legacy PHP application (Git submodule)
- `docs/` - plans, research, and implementation notes
- `.devcontainer/` - local dev container configuration

## Clone

Use recursive clone so the legacy submodule is fetched automatically:

```bash
git clone --recurse-submodules git@github.com:NestumMilo-isFezan/new-mystudy-kpi.git
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

## Submodule Notes

- `legacy-mystudy-kpi` tracks: `git@github.com:NestumMilo-isFezan/mystudy-kpi.git`
- Submodule mapping is defined in `.gitmodules`
- To pull latest submodule changes:

```bash
git submodule update --remote --merge
```

## Development

This repository is designed to run in the Devcontainer workflow.

- Open the repository in VS Code
- Run `Dev Containers: Reopen in Container`
- Wait until post-create setup finishes
- Work inside the container for frontend and backend tasks

## Local HTTPS and Test Domain

After opening in Devcontainer, use this quick setup:

1. Add local domain mapping:

```bash
echo "127.0.0.1 mystudykpi.test" | sudo tee -a /etc/hosts
```

2. Trust the local certificate file from this repo:

- Linux (Fedora/Bluefin):

```bash
sudo install -m 0644 ./.devcontainer/mystudykpi-root.crt /etc/pki/ca-trust/source/anchors/mystudykpi-root.crt
sudo update-ca-trust extract
```

- Linux (Debian/Ubuntu):

```bash
sudo install -m 0644 ./.devcontainer/mystudykpi-root.crt /usr/local/share/ca-certificates/mystudykpi-root.crt
sudo update-ca-certificates
```

- macOS: import `.devcontainer/mystudykpi-root.crt` into Keychain Access and set it to `Always Trust`.

3. Open and verify:

- Frontend: `https://mystudykpi.test`
- API: `https://mystudykpi.test/api`

Optional CLI verify:

```bash
curl -I https://mystudykpi.test
curl -I https://mystudykpi.test/api
```

If browser trust still fails, see `docs/finished-task/dev-https-ssl.md` for full troubleshooting notes.

## Basic Git Workflow

```bash
git checkout -b feature/your-change
git add .
git commit -m "feat: describe change"
git push -u origin feature/your-change
```
