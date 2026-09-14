#!/bin/bash
set -e
echo "Installing Titan Production Suite..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    curl -L -o "$HOME/Downloads/Titan-Production-Suite.dmg" "https://github.com/263titan/titan-installer/releases/latest/download/Titan-Production-Suite-x.x.x.dmg"
    hdiutil attach "$HOME/Downloads/Titan-Production-Suite.dmg"
    cp -R "/Volumes/Titan Production Suite/Titan Production Suite.app" "/Applications/"
    hdiutil detach "/Volumes/Titan Production Suite"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    curl -L -o "$HOME/Downloads/Titan-Production-Suite.AppImage" "https://github.com/263titan/titan-installer/releases/latest/download/Titan-Production-Suite-x.x.x.AppImage"
    chmod +x "$HOME/Downloads/Titan-Production-Suite.AppImage"
    sudo mv "$HOME/Downloads/Titan-Production-Suite.AppImage" /opt/titan-production-suite/
fi
echo "Installation complete!"
