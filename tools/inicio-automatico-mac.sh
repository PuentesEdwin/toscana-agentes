#!/usr/bin/env bash
# Hace que el motor de agentes arranque solo al iniciar sesión en macOS (LaunchAgent).
# Para quitarlo: launchctl unload ~/Library/LaunchAgents/com.agentesia3d.motor.plist && rm ese archivo
set -e
MOTOR="$(cd "$(dirname "$0")/../motor" && pwd)"
NODE="$(command -v node)"
PLIST="$HOME/Library/LaunchAgents/com.agentesia3d.motor.plist"
mkdir -p "$HOME/Library/LaunchAgents"
cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.agentesia3d.motor</string>
  <key>ProgramArguments</key><array><string>$NODE</string><string>$MOTOR/worker.mjs</string></array>
  <key>WorkingDirectory</key><string>$MOTOR</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>$MOTOR/logs/launchd.log</string>
  <key>StandardErrorPath</key><string>$MOTOR/logs/launchd.log</string>
</dict>
</plist>
EOF
mkdir -p "$MOTOR/logs"
launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
echo "Inicio automático configurado: $PLIST"
