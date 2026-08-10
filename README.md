# ⚡ WarpSync (P2_Warpsync)

> **Instant Local Peer-to-Peer File Sharing Application (ShareIt / Quick Share Replica)**
> 
> WarpSync enables seamless, lightning-fast file and text transfer back and forth between any devices on your local network (laptop-mobile, mobile-mobile, laptop-laptop, Linux, Windows, macOS, Android, iOS) **without requiring internet access or app installation on mobile devices**.

---

## ✨ Features

- **🌐 Zero-Install Mobile Access**: Open WarpSync on any smartphone or tablet by simply scanning the automatically generated **QR Code** in your terminal or web browser.
- **⚡ High-Speed Local Transfer**: Operates strictly over Wi-Fi / Local Area Network (LAN) / Direct Mobile Hotspot. No cloud servers, no bandwidth throttling, no internet reliance.
- **📁 Drag & Drop Interface**: Ultra-sleek glassmorphism dark-mode web application featuring real-time upload progress bars and 1-click downloads.
- **📋 Live Clipboard & Text Share**: Instantly copy-paste text snippets, URLs, or authorization tokens between devices.
- **🔄 Live WebSockets & P2P**: Real-time peer connection status notifications and direct browser-to-browser WebRTC fallback.
- **🐳 Sandboxed & Containerized**: Ready for Docker deployment with `docker-compose.yml` or native Linux background system service (`systemd`).

---

## 🚀 Quick Start (1-Click Run)

### Method 1: Local Terminal Run (Linux / macOS / Windows)
```bash
# Navigate to WarpSync directory
cd /home/dev/SE/P2_Warpsync

# Run launcher (automatically creates .venv and installs dependencies)
./run.sh
# or
python3 start.py
```

### Method 2: Docker Container (Sandboxed Execution)
```bash
# Launch WarpSync using Docker Compose
docker compose up -d

# View server logs & terminal QR code
docker compose logs -f
```

---

## 📱 How to Transfer Files to Mobile

1. Run `python3 start.py` or `./run.sh` on your laptop.
2. The terminal will output an ASCII QR code along with your local access URL (e.g. `http://192.168.1.50:8000`).
3. Connect your mobile phone to the **same Wi-Fi or laptop hotspot**.
4. Scan the QR code with your phone camera -> The WarpSync web app opens instantly!
5. Select or drag files on either device to transfer them instantly across the local network.

---

## 📂 Project Architecture

```
P2_Warpsync/
├── app/
│   ├── main.py          # FastAPI REST endpoints, WebSockets, HTML routing
│   ├── network.py       # Local IP autodetect & QR code generation (ASCII/PNG)
│   ├── storage.py       # Streaming chunked file storage & safety checks
│   ├── templates/
│   │   └── index.html   # Responsive HTML UI with QR reader & progress bar
│   └── static/
│       ├── css/style.css# Modern Glassmorphism Design System
│       └── js/app.js    # WebSocket client, Drag-n-drop handler, Clipboard manager
├── downloads/           # Default local storage for incoming files
├── tests/
│   └── test_server.py   # Pytest suite for endpoints & uploads
├── Dockerfile           # Container definition
├── docker-compose.yml   # Multi-device host networking compose setup
├── P2_Warpsync.service  # Systemd daemon configuration
├── requirements.txt     # Python dependencies
├── run.sh               # Executable bash launcher
└── start.py             # One-click Python launcher script
```

---

## 🛠️ Running Unit Tests

```bash
source .venv/bin/activate
PYTHONPATH=. pytest -v
```

---

## 🛡️ License

MIT License - Developed as part of the `SE` Multi-Repository Workspace.
