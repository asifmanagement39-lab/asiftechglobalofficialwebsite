# -*- coding: utf-8 -*-
"""
AsifTechGlobal — Bot Automation Server API
Lightweight Flask REST + SSE service connecting the web frontend to bot.py
Zero emojis. Standards-compliant code.
"""

import os
import sys
import json
import time
import subprocess
import threading
from pathlib import Path
from flask import Flask, request, jsonify, Response

BASE_DIR = Path(__file__).parent.resolve()
CONFIG_FILE = BASE_DIR / "config.json"
URLS_FILE = BASE_DIR / "urls.txt"
MESSAGES_FILE = BASE_DIR / "messages.txt"
LOG_FILE = BASE_DIR / "send_log.txt"

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False

_bot_process = None
_bot_start_time = None
_lock = threading.Lock()

# CORS Header Injector for local frontend (port 5173 / file://)
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

def _is_running():
    global _bot_process
    if _bot_process is None:
        return False
    return _bot_process.poll() is None

def _read_lines(file_path):
    if not file_path.exists():
        return []
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return [line.strip() for line in f if line.strip()]
    except Exception:
        return []

def _write_lines(file_path, lines):
    with open(file_path, "w", encoding="utf-8") as f:
        for line in lines:
            f.write(f"{line.strip()}\n")

def _load_config():
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def _save_config(data):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

@app.route("/api/status", methods=["GET"])
def get_status():
    running = _is_running()
    uptime = int(time.time() - _bot_start_time) if (running and _bot_start_time) else 0
    urls = _read_lines(URLS_FILE)
    target = urls[0] if urls else "None configured"
    
    return jsonify({
        "running": running,
        "pid": _bot_process.pid if running else None,
        "uptime": uptime,
        "target_url": target,
        "urls_count": len(urls),
        "messages_count": len(_read_lines(MESSAGES_FILE))
    })

@app.route("/api/config", methods=["GET"])
def get_config():
    return jsonify({
        "urls": _read_lines(URLS_FILE),
        "messages": _read_lines(MESSAGES_FILE),
        "config": _load_config()
    })

@app.route("/api/config", methods=["POST"])
def update_config():
    data = request.get_json() or {}
    if "urls" in data:
        _write_lines(URLS_FILE, data["urls"])
    if "messages" in data:
        _write_lines(MESSAGES_FILE, data["messages"])
    if "config" in data:
        _save_config(data["config"])
    return jsonify({"ok": True, "msg": "Configuration updated"})

@app.route("/api/start", methods=["POST"])
def start_bot_process():
    global _bot_process, _bot_start_time
    with _lock:
        if _is_running():
            return jsonify({"ok": False, "status": "running", "msg": "Bot is already running", "pid": _bot_process.pid})
        
        data = request.get_json() or {}
        
        # Update target URL if provided (supports target_url or url)
        target_url = data.get("target_url") or data.get("url")
        if target_url:
            _write_lines(URLS_FILE, [str(target_url).strip()])
            
        # Update messages if provided
        messages = data.get("messages")
        if messages and isinstance(messages, list):
            _write_lines(MESSAGES_FILE, messages)
            
        # Update settings if provided
        cfg = _load_config()
        if "headless" in data:
            if "SYSTEM_SETTINGS" not in cfg:
                cfg["SYSTEM_SETTINGS"] = {}
            val = data["headless"]
            cfg["SYSTEM_SETTINGS"]["HEADLESS_MODE"] = (val == 1 or val is True or str(val).lower() == "true")
            
        speed_mode = data.get("speed_mode") or data.get("speed")
        if speed_mode and str(speed_mode).lower() in ("fast", "slow", "normal"):
            if "PREMIUM" not in cfg:
                cfg["PREMIUM"] = {}
            cfg["PREMIUM"]["SPEED_MODE"] = str(speed_mode).lower()
            
        _save_config(cfg)
        
        # Prepare log file for live output streaming
        try:
            log_fh = open(LOG_FILE, "a", encoding="utf-8", buffering=1)
            log_fh.write(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] [ATG-SERVER] Starting Bot Engine...\n")
            log_fh.flush()
        except Exception:
            log_fh = subprocess.DEVNULL
        
        env = os.environ.copy()
        env["BOT_DATA_DIR"] = str(BASE_DIR)
        
        cmd = [sys.executable, str(BASE_DIR / "bot.py")]
        
        creationflags = subprocess.CREATE_NEW_PROCESS_GROUP if os.name == "nt" else 0
        
        try:
            _bot_process = subprocess.Popen(
                cmd,
                cwd=str(BASE_DIR),
                env=env,
                stdout=log_fh,
                stderr=subprocess.STDOUT,
                creationflags=creationflags
            )
            _bot_start_time = time.time()
            return jsonify({
                "ok": True,
                "status": "started",
                "msg": "Bot started successfully", 
                "pid": _bot_process.pid
            })
        except Exception as e:
            return jsonify({"ok": False, "status": "error", "msg": f"Failed to start bot: {str(e)}"})

@app.route("/api/stop", methods=["POST"])
def stop_bot_process():
    global _bot_process, _bot_start_time
    with _lock:
        if not _is_running():
            return jsonify({"ok": False, "status": "stopped", "msg": "Bot is not running"})
        
        pid = _bot_process.pid
        try:
            if os.name == "nt":
                subprocess.run(
                    ["taskkill", "/F", "/T", "/PID", str(pid)],
                    capture_output=True,
                    timeout=5
                )
            else:
                _bot_process.terminate()
                try:
                    _bot_process.wait(timeout=4)
                except subprocess.TimeoutExpired:
                    _bot_process.kill()
        except Exception:
            pass
        
        _bot_process = None
        _bot_start_time = None
        
        try:
            with open(LOG_FILE, "a", encoding="utf-8") as f:
                f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] [ATG-SERVER] Bot Process Stopped.\n")
        except Exception:
            pass
            
        return jsonify({"ok": True, "status": "stopped", "msg": "Bot stopped successfully"})

@app.route("/api/logs", methods=["GET"])
def stream_logs():
    def log_generator():
        if not LOG_FILE.exists():
            open(LOG_FILE, "w", encoding="utf-8").close()
            
        with open(LOG_FILE, "r", encoding="utf-8", errors="ignore") as f:
            # Yield last 40 lines
            lines = f.readlines()
            for line in lines[-40:]:
                clean = line.rstrip()
                if clean:
                    yield f"data: {clean}\n\n"
                    
            f.seek(0, 2)
            while True:
                line = f.readline()
                if line:
                    clean = line.rstrip()
                    if clean:
                        yield f"data: {clean}\n\n"
                else:
                    time.sleep(0.5)
                    yield ": ping\n\n"

    return Response(
        log_generator(),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )

@app.route("/api/login-browser", methods=["POST"])
def open_login_browser():
    with _lock:
        if _is_running():
            return jsonify({"ok": False, "msg": "Please stop the running bot first before opening sign-in window."})
            
        profile_path = os.path.join(BASE_DIR, "Saved_YT_Session")
        if os.path.exists(profile_path):
            for root, dirs, files in os.walk(profile_path):
                for f in files:
                    if f.lower() in ("lock", "lockfile", "singletonlock", "singletoncookie", "singletonsocket"):
                        try:
                            os.remove(os.path.join(root, f))
                        except Exception:
                            pass
        
        chrome_paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
        ]
        chosen = None
        for cp in chrome_paths:
            if os.path.exists(cp):
                chosen = cp
                break
                
        if not chosen:
            return jsonify({"ok": False, "msg": "Chrome executable not found on system."})
            
        cmd = [
            chosen,
            f"--user-data-dir={profile_path}",
            "--profile-directory=Default",
            "https://accounts.google.com/ServiceLogin?service=youtube&continue=https://www.youtube.com"
        ]
        try:
            subprocess.Popen(cmd)
            try:
                with open(LOG_FILE, "a", encoding="utf-8") as f:
                    f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] [AUTH] Chrome opened for YouTube sign-in. Sign in to your account, then close Chrome and click 'Start Live Bot'.\n")
            except Exception:
                pass
            return jsonify({"ok": True, "msg": "Chrome opened. Please sign in to your Google/YouTube account."})
        except Exception as e:
            return jsonify({"ok": False, "msg": str(e)})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting AsifTechGlobal Bot Server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
