#!/usr/bin/env python3
"""
WarpSync - Instant Local File Share
One-Click Launcher Script
"""

import os
import sys
import webbrowser
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
VENV_DIR = BASE_DIR / ".venv"
REQUIREMENTS_FILE = BASE_DIR / "requirements.txt"

def ensure_environment():
    """Ensures python virtual environment and requirements are ready."""
    if not VENV_DIR.exists():
        print("⚡ Creating Python Virtual Environment (.venv)...")
        subprocess.run([sys.executable, "-m", "venv", str(VENV_DIR)], check=True)
        
    python_bin = VENV_DIR / "bin" / "python"
    pip_bin = VENV_DIR / "bin" / "pip"
    
    print("📦 Checking & installing dependencies...")
    subprocess.run([str(pip_bin), "install", "-r", str(REQUIREMENTS_FILE)], check=True)
    return python_bin

def main():
    print("\n" + "🚀 " * 15)
    print("    WarpSync Local Peer-to-Peer File Transfer Server")
    print("🚀 " * 15 + "\n")

    # Add app to path
    sys.path.insert(0, str(BASE_DIR))
    
    from app.network import get_local_ip, print_terminal_qr
    import uvicorn

    host_ip = "0.0.0.0"
    port = 8000
    local_ip = get_local_ip()
    access_url = f"http://{local_ip}:{port}"

    print_terminal_qr(access_url)

    # Open local browser
    try:
        webbrowser.open(f"http://localhost:{port}")
    except Exception:
        pass

    # Launch Uvicorn Server
    uvicorn.run("app.main:app", host=host_ip, port=port, reload=False, log_level="info")

if __name__ == "__main__":
    main()
