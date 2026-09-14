# Titan Installer

Distribution hub, bootstrap installers, and package manager manifests for the Titan Production Suite.

## Install

- **Windows**: `install.ps1` (PowerShell) | [WinGet](winget/titan.printsync.yaml)
- **macOS**: `install.sh` (bash) | [Homebrew](homebrew/Cask/titan-printsync.rb)
- **Linux**: `install.sh` | [Flatpak](flatpak/titan-printsync.yml) | AppImage / DEB / RPM

## Auto-Update

Signed update manifests live in `releases/`:
- `latest.json` — generic
- `latest-mac.json` — macOS

## Quick Start

```bash
# Windows
powershell -ExecutionPolicy Bypass -File install.ps1

# macOS / Linux
bash install.sh
```

## License

MIT
