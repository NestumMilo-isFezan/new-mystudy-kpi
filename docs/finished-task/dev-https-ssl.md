# Dev HTTPS / SSL (How This Project Works)

This document explains the HTTPS setup used in this project and how to reproduce it on another machine.

## Domain and routing

- Frontend URL: `https://mystudykpi.test`
- API URL: `https://mystudykpi.test/api`
- Routing rules:
  - `/api*` -> `backend:8080`
  - everything else -> `frontend:4321`

## Where config lives

- Caddy config: `.devcontainer/Caddyfile`
- Compose service: `compose.dev.yaml` (`caddy` service)
- Devcontainer ports/services: `.devcontainer/devcontainer.json`
- Frontend host allowlist: `mystudy-kpi-frontend/astro.config.mjs`

## How HTTPS is terminated

- TLS is terminated by Caddy.
- Caddy uses `tls internal` (local CA) for local development certificates.
- Backend and frontend services stay on internal HTTP inside Docker network.

## Reproduce on a new machine

1. Start stack:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up -d
```

2. Add local domain mapping:

```bash
echo "127.0.0.1 mystudykpi.test" | sudo tee -a /etc/hosts
```

3. Export Caddy root cert from container:

```bash
docker compose -f compose.yaml -f compose.dev.yaml cp caddy:/data/caddy/pki/authorities/local/root.crt ./.devcontainer/mystudykpi-root.crt
```

4. Trust cert on host OS.

Bluefin/Fedora:

```bash
sudo install -m 0644 ./.devcontainer/mystudykpi-root.crt /etc/pki/ca-trust/source/anchors/mystudykpi-root.crt
sudo update-ca-trust extract
```

Debian/Ubuntu:

```bash
sudo install -m 0644 ./.devcontainer/mystudykpi-root.crt /usr/local/share/ca-certificates/mystudykpi-root.crt
sudo update-ca-certificates
```

5. Verify:

```bash
curl -I https://mystudykpi.test
curl -I https://mystudykpi.test/api
```

## Browser compatibility note

- System/AppImage browsers and Firefox worked with proper trust setup.
- Brave Flatpak may still reject local CA in some environments even after import/trust.
- If Brave Flatpak fails, use Firefox or non-Flatpak browser for local HTTPS development.
