# -*- coding: utf-8 -*-
import os
import sys
import time
import json
import random
import logging
import shutil
import threading

# ─── Windows UTF-8 console fix ────────────────────────────────────────────────
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager

# ─── ANSI COLORS (no pip needed, works in PowerShell & CMD) ───────────────────
if os.name == 'nt':
    os.system('')          # Unlock ANSI escape codes on Windows

R      = '\033[0m'
BOLD   = '\033[1m'
DIM    = '\033[2m'
CYAN   = '\033[96m'
GREEN  = '\033[92m'
YELLOW = '\033[93m'
MAGEN  = '\033[95m'
BLUE   = '\033[94m'
RED    = '\033[91m'
WHITE  = '\033[97m'
AQUA   = '\033[38;5;51m'
LIME   = '\033[38;5;46m'
PINK   = '\033[38;5;201m'
GOLD   = '\033[38;5;226m'
SKY    = '\033[38;5;45m'

# If launched by web_panel (multi-user), BOT_DATA_DIR points to user's data folder
_data_dir_env    = os.environ.get("BOT_DATA_DIR")
BASE_DIR         = os.path.abspath(_data_dir_env) if _data_dir_env else os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE_PATH = os.path.join(BASE_DIR, "config.json")

DEFAULT_CONFIG = {
    "PLATFORM": "youtube",
    "INTERVAL": 15,
    "RANDOM_DELAY": True,
    "MIN_DELAY": 10,
    "MAX_DELAY": 25,
    "MAX_TABS": 10,
    "LOG_LEVEL": "INFO",
    "ANTI_BAN_SETTINGS": {"HUMAN_SCROLL": True, "MOUSE_MOVE_EMULATION": True},
    "LOOP_SETTINGS": {"BATCH_SLEEP_DELAY": 30, "ALLOW_DUPLICATE_MESSAGES": False},
    "SYSTEM_SETTINGS": {"HEADLESS_MODE": False, "TERMINAL_COLOR": "cyan"}
}

# ══════════════════════════════════════════════════════════════════════════════
#  LIVE RAIN SECTION  (top of terminal, always running)
# ══════════════════════════════════════════════════════════════════════════════

RAIN_HEIGHT = 9               # How many rows at top stay as rain (taller = more rain)
_io_lock    = threading.Lock()  # Protects ALL stdout writes
_rain_stop  = threading.Event()  # Signal thread to quit


def generate_rain_line(width):
    """One row of random rain/bubble characters"""
    rain_chars   = list("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*!?><^~+-=")
    bubble_chars = list("○◎●◉◯⊙◆◇▲△")
    stream_chars = list("│╎╏║|")
    rain_palette = [AQUA, LIME, PINK, GOLD, SKY, CYAN, GREEN, MAGEN]

    chars = []
    for _ in range(width):
        r = random.random()
        if r < 0.07:
            chars.append(BOLD + LIME + random.choice(stream_chars))
        elif r < 0.15:
            chars.append(BOLD + random.choice(rain_palette) + random.choice(rain_chars))
        elif r < 0.22:
            chars.append(AQUA + random.choice(bubble_chars))
        elif r < 0.32:
            chars.append(DIM + '\033[38;5;30m' + random.choice(rain_chars))
        else:
            chars.append(' ')
    return ''.join(chars) + R


def show_rain_animation():
    """One-time intro: full-screen scrolling rain"""
    if not sys.stdout.isatty() or os.environ.get("BOT_DATA_DIR"):
        return
    width = min(shutil.get_terminal_size((80, 24)).columns, 110)
    sys.stdout.write('\033[2J\033[H')
    sys.stdout.flush()
    for _ in range(28):
        sys.stdout.write(generate_rain_line(width) + '\n')
        sys.stdout.flush()
        time.sleep(0.05)


def show_banner():
    """Startup banner (shown once after intro rain)"""
    W   = 66
    bar = '═' * (W - 2)

    def row(text, color=WHITE, bold=True):
        padded = text.center(W - 2)
        b = BOLD if bold else ''
        return f"{BOLD}{AQUA}║{R}{b}{color}{padded}{R}{BOLD}{AQUA}║{R}"

    def divider():
        return f"{BOLD}{AQUA}║{DIM}{CYAN}{'─' * (W - 2)}{R}{BOLD}{AQUA}║{R}"

    lines = [
        f"\n{BOLD}{AQUA}╔{bar}╗{R}",
        row(""),
        row("A S I F  T E C H  —  Y T  L I V E  B O T", CYAN),
        row("v 3 . 0  U L T R A  E D I T I O N", AQUA),
        row(""),
        divider(),
        row(""),
        row("[ AUTO-RESTART ]  [ ANTI-BAN ]  [ MULTI-TAB ]", GREEN),
        row("YouTube Live Chat Automation System", YELLOW),
        row(""),
        divider(),
        row(""),
        row("Config: config.json  |  URLs: urls.txt", MAGEN),
        row("Messages: messages.txt  |  Log: send_log.txt", MAGEN),
        row(""),
        f"{BOLD}{AQUA}╚{bar}╝{R}\n",
    ]
    for line in lines:
        print(line)
        time.sleep(0.03)


def init_rain_zone():
    """Clear screen, draw top rain section, lock it with scroll region"""
    if not sys.stdout.isatty() or os.environ.get("BOT_DATA_DIR"):
        return
    term  = shutil.get_terminal_size((80, 24))
    width = min(term.columns, 110)
    rows  = term.lines

    with _io_lock:
        sys.stdout.write('\033[2J\033[H')          # Clear + home
        for _ in range(RAIN_HEIGHT):
            sys.stdout.write(generate_rain_line(width) + '\n')
        # Dim separator line between rain and logs
        sys.stdout.write(DIM + '\033[38;5;240m' + '─' * min(term.columns, 110) + R + '\n')
        # Set terminal scroll region: lines below rain+separator scroll, top stays fixed
        sys.stdout.write(f'\033[{RAIN_HEIGHT + 2};{rows}r')
        # Move cursor to top of log area
        sys.stdout.write(f'\033[{RAIN_HEIGHT + 2};1H')
        sys.stdout.flush()


def rain_updater_thread():
    if not sys.stdout.isatty() or os.environ.get("BOT_DATA_DIR"):
        return
    """
    Live rain engine — runs for entire session:
    - Column-based falling drops (bright head → fading trail)
    - Bubble columns float independently
    - Color palette rotates automatically (cyan→green→magenta→gold→...)
    - Unlimited drops reset when they exit bottom
    - ~12 FPS continuous update
    """
    MATRIX  = list("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*!?><^~+-=")
    BUBBLES = list("○◎●◉◯⊙◆◇▲△")
    STREAMS = list("│╎╏║|")

    # Palettes that cycle one-by-one (each lasts ~6.4 s at 80 frames each)
    PALETTES = [
        [AQUA,  SKY,    CYAN,   BLUE],
        [LIME,  GREEN,  '\033[38;5;40m',  '\033[38;5;35m'],
        [PINK,  MAGEN,  '\033[38;5;177m', '\033[38;5;171m'],
        [GOLD,  YELLOW, '\033[38;5;214m', '\033[38;5;208m'],
        [AQUA,  LIME,   PINK,   GOLD],
        [SKY,   LIME,   MAGEN,  CYAN],
    ]

    col_phase = {}   # col -> float (drop head row position)
    col_speed = {}   # col -> float (rows advanced per frame)
    col_type  = {}   # col -> 'matrix' | 'bubble' | 'stream'

    def reset_col(col):
        col_phase[col] = random.uniform(-RAIN_HEIGHT * 1.2, 0)
        col_speed[col] = random.uniform(0.10, 0.38)
        col_type[col]  = random.choices(
            ['matrix', 'bubble', 'stream'],
            weights=[60, 28, 12]
        )[0]

    pal_idx   = 0
    pal_frame = 0

    while not _rain_stop.is_set():
        term  = shutil.get_terminal_size((80, 24))
        width = min(term.columns, 110)

        # Slowly cycle color palette
        pal_frame += 1
        if pal_frame >= 80:
            pal_frame = 0
            pal_idx   = (pal_idx + 1) % len(PALETTES)
        pal = PALETTES[pal_idx]

        # Advance every column's drop
        for col in range(width):
            if col not in col_phase:
                reset_col(col)
            col_phase[col] += col_speed[col]
            if col_phase[col] > RAIN_HEIGHT + 5:
                reset_col(col)

        # Build full canvas for all RAIN_HEIGHT rows
        canvas = [[' '] * width for _ in range(RAIN_HEIGHT)]

        for col in range(width):
            phase    = col_phase[col]
            ctype    = col_type[col]
            chars    = BUBBLES if ctype == 'bubble' else (STREAMS if ctype == 'stream' else MATRIX)

            for row in range(RAIN_HEIGHT):
                dist = phase - row   # 0 = head is exactly here; +ve = this row is in the trail

                if dist < 0:
                    canvas[row][col] = ' '                                              # Not yet
                elif dist < 0.7:
                    canvas[row][col] = f"{BOLD}{WHITE}{random.choice(chars)}{R}"       # Bright head
                elif dist < 1.8:
                    canvas[row][col] = f"{BOLD}{pal[0]}{random.choice(chars)}{R}"      # Hot near-head
                elif dist < 3.2:
                    canvas[row][col] = f"{pal[1 % len(pal)]}{random.choice(chars)}{R}"# Mid trail
                elif dist < 5.0:
                    canvas[row][col] = f"{DIM}{pal[-1]}{random.choice(MATRIX)}{R}"    # Fading tail
                else:
                    canvas[row][col] = ' '                                              # Tail ended

        # Write entire canvas in one atomic stdout burst
        out = ['\033[s']                              # Save cursor once
        for row_idx in range(RAIN_HEIGHT):
            out.append(f'\033[{row_idx + 1};1H')      # Jump to row
            out.append('\033[2K')                     # Clear line
            out.append(''.join(canvas[row_idx]))
        out.append('\033[u')                          # Restore cursor once

        with _io_lock:
            sys.stdout.write(''.join(out))
            sys.stdout.flush()

        time.sleep(0.08)   # ~12 FPS


# ══════════════════════════════════════════════════════════════════════════════
#  COLORED LOGGER
# ══════════════════════════════════════════════════════════════════════════════

class ColoredFormatter(logging.Formatter):
    _FMT = "%(asctime)s  %(levelname)s  %(message)s"
    _COLORS = {
        logging.DEBUG:    DIM + WHITE,
        logging.INFO:     BOLD + CYAN,
        logging.WARNING:  BOLD + YELLOW,
        logging.ERROR:    BOLD + RED,
        logging.CRITICAL: BOLD + RED,
    }

    def format(self, record):
        color = self._COLORS.get(record.levelno, R)
        orig  = record.levelname
        record.levelname = f"{color}[{record.levelname:8}]{R}"
        result = logging.Formatter(self._FMT, datefmt="%H:%M:%S").format(record)
        record.levelname = orig
        return result


class LockedStreamHandler(logging.StreamHandler):
    """Console handler that syncs with the live rain thread via _io_lock"""
    def emit(self, record):
        with _io_lock:
            try:
                msg = self.format(record)
                self.stream.write(msg + self.terminator)
                self.stream.flush()
            except Exception:
                self.handleError(record)


def tprint(text):
    """Thread-safe print (for crash/restart messages in main)"""
    with _io_lock:
        sys.stdout.write(str(text) + '\n')
        sys.stdout.flush()


# ══════════════════════════════════════════════════════════════════════════════
#  HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def load_live_config(logger=None):
    if not os.path.exists(CONFIG_FILE_PATH):
        with open(CONFIG_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_CONFIG, f, indent=4)
        return DEFAULT_CONFIG.copy()
    try:
        with open(CONFIG_FILE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        if logger:
            logger.warning(f"config.json read failed: {e} — using defaults")
        return DEFAULT_CONFIG.copy()


def get_data(filename):
    path = os.path.join(BASE_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def setup_logger(log_file):
    logger = logging.getLogger("yt_bot")
    logger.setLevel(logging.INFO)
    if logger.hasHandlers():
        logger.handlers.clear()
    # File handler — plain text
    fh = logging.FileHandler(os.path.join(BASE_DIR, log_file), encoding="utf-8")
    fh.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(message)s", datefmt="%H:%M:%S"))
    logger.addHandler(fh)
    # Console handler — colored + thread-safe (won't interfere with rain)
    ch = LockedStreamHandler(sys.stdout)
    ch.setFormatter(ColoredFormatter())
    logger.addHandler(ch)
    return logger


def choose_message(messages, sent_history, allow_duplicates):
    if not messages:
        return None
    candidates = messages if allow_duplicates else [m for m in messages if m not in sent_history]
    if not candidates:
        sent_history.clear()
        candidates = messages
    return random.choice(candidates) if candidates else None


def cleanup_chrome_locks(profile_path):
    """Delete stale Chrome lock files and terminate orphaned processes so profile can always be reused"""
    try:
        import psutil
        for p in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                cmd = ' '.join(p.info['cmdline'] or [])
                name = (p.info['name'] or '').lower()
                if 'Saved_YT_Session' in cmd and 'chrome' in name:
                    p.kill()
            except Exception:
                pass
    except Exception:
        pass

    if os.path.exists(profile_path):
        for root, dirs, files in os.walk(profile_path):
            for f in files:
                f_lower = f.lower()
                if (f_lower in ("lock", "lockfile", "singletonlock", "singletoncookie", "singletonsocket", "devtoolsactiveport")
                    or f_lower.endswith("-journal")
                    or f_lower.endswith(".lock")):
                    fp = os.path.join(root, f)
                    try:
                        os.remove(fp)
                    except Exception:
                        pass


def emulate_human_behavior(driver, config, logger=None):
    try:
        anti_ban = config.get("ANTI_BAN_SETTINGS", {})
        if anti_ban.get("MOUSE_MOVE_EMULATION", True):
            ActionChains(driver).move_by_offset(
                random.randint(5, 25), random.randint(5, 25)
            ).perform()
            time.sleep(0.3)
        if anti_ban.get("HUMAN_SCROLL", True):
            driver.execute_script(f"window.scrollBy(0, {random.randint(50, 150)});")
            time.sleep(0.5)
            driver.execute_script(f"window.scrollBy(0, -{random.randint(30, 80)});")
    except Exception:
        pass


def normalize_youtube_url(url):
    """Normalize any YouTube live / share URL to standard watch format"""
    if not url:
        return ""
    u = str(url).strip()
    if "youtu.be/" in u:
        vid_id = u.split("youtu.be/")[1].split("?")[0].split("&")[0].split("/")[0]
        return f"https://www.youtube.com/watch?v={vid_id}"
    if "/live/" in u:
        vid_id = u.split("/live/")[1].split("?")[0].split("&")[0].split("/")[0]
        return f"https://www.youtube.com/watch?v={vid_id}"
    if "/shorts/" in u:
        vid_id = u.split("/shorts/")[1].split("?")[0].split("&")[0].split("/")[0]
        return f"https://www.youtube.com/watch?v={vid_id}"
    if "/embed/" in u:
        vid_id = u.split("/embed/")[1].split("?")[0].split("&")[0].split("/")[0]
        return f"https://www.youtube.com/watch?v={vid_id}"
    return u


def force_chrome_to_front(driver):
    """Forcibly bring Chrome window to the absolute front/top of the screen on Windows"""
    try:
        driver.switch_to.window(driver.current_window_handle)
        driver.execute_script("window.focus();")
    except Exception:
        pass

    if os.name == 'nt':
        try:
            import ctypes
            from ctypes import wintypes
            user32 = ctypes.windll.user32
            
            # Unlock Windows foreground restrictions
            try:
                user32.AllowSetForegroundWindow(-1)
                user32.keybd_event(0x12, 0, 0, 0) # VK_MENU (Alt) down
                user32.keybd_event(0x12, 0, 2, 0) # VK_MENU (Alt) up
            except Exception:
                pass

            def enum_proc(hwnd, lparam):
                if user32.IsWindowVisible(hwnd):
                    length = user32.GetWindowTextLengthW(hwnd)
                    if length > 0:
                        buff = ctypes.create_unicode_buffer(length + 1)
                        user32.GetWindowTextW(hwnd, buff, length + 1)
                        title = buff.value
                        if any(kw in title for kw in ["YouTube", "Chrome", "Google Chrome", "bot"]):
                            user32.ShowWindow(hwnd, 9)  # SW_RESTORE
                            user32.ShowWindow(hwnd, 3)  # SW_MAXIMIZE
                            user32.BringWindowToTop(hwnd)
                            user32.SetForegroundWindow(hwnd)
                            user32.SetWindowPos(hwnd, -1, 0, 0, 0, 0, 0x0001 | 0x0002)  # HWND_TOPMOST
                            user32.SetWindowPos(hwnd, -2, 0, 0, 0, 0, 0x0001 | 0x0002)  # HWND_NOTOPMOST
                return True

            WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
            user32.EnumWindows(WNDENUMPROC(enum_proc), 0)
        except Exception:
            pass


def get_speed_delays(live_config):
    premium = live_config.get("PREMIUM", {})
    speed_mode = str(premium.get("SPEED_MODE", "normal")).lower()
    speed_settings = premium.get("SPEED_SETTINGS", {}).get(speed_mode, {})
    
    interval = speed_settings.get("INTERVAL", live_config.get("INTERVAL", 15))
    min_delay = speed_settings.get("MIN_DELAY", live_config.get("MIN_DELAY", 10))
    max_delay = speed_settings.get("MAX_DELAY", live_config.get("MAX_DELAY", 25))
    batch_delay = speed_settings.get("BATCH_SLEEP_DELAY", live_config.get("LOOP_SETTINGS", {}).get("BATCH_SLEEP_DELAY", 30))
    random_delay = live_config.get("RANDOM_DELAY", True)
    
    if random_delay:
        low = min(int(min_delay), int(max_delay))
        high = max(int(min_delay), int(max_delay))
        delay = random.randint(low, high)
    else:
        delay = int(interval)
    return max(1, delay), max(1, int(batch_delay))


def find_and_activate_chat_input(driver, logger=None):
    """Locate and ensure the YouTube chat text input is focused/activated"""
    # 1. Try finding visible contenteditable input
    input_selectors = [
        "div#input.yt-live-chat-text-input-field-renderer[contenteditable='true']",
        "div#input[contenteditable='true']",
        "div[contenteditable='true']",
        "#input.yt-live-chat-text-input-field-renderer",
        "div#input",
        "textarea#input",
        "textarea"
    ]
    
    for sel in input_selectors:
        try:
            for el in driver.find_elements(By.CSS_SELECTOR, sel):
                if el.is_displayed():
                    return el
        except Exception:
            continue

    # 2. If not found or collapsed, click the placeholder container / input button
    placeholder_selectors = [
        "#input-button",
        "ytd-button-renderer#input-button",
        "yt-live-chat-message-input-renderer #input-button",
        "tp-yt-paper-input-container",
        "yt-live-chat-message-input-renderer",
        "#chat-messages #input"
    ]
    for p_sel in placeholder_selectors:
        try:
            for btn in driver.find_elements(By.CSS_SELECTOR, p_sel):
                if btn.is_displayed():
                    driver.execute_script("arguments[0].click();", btn)
                    time.sleep(0.5)
                    break
        except Exception:
            pass

    # 3. Re-check for activated input
    for sel in input_selectors:
        try:
            for el in driver.find_elements(By.CSS_SELECTOR, sel):
                if el.is_displayed():
                    return el
        except Exception:
            continue

    return None


def safe_send_text(chat_input, text, driver, logger):
    try:
        # Focus and scroll into view
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", chat_input)
        time.sleep(0.2)
        try:
            chat_input.click()
        except Exception:
            driver.execute_script("arguments[0].click(); arguments[0].focus();", chat_input)
        time.sleep(0.3)

        # Clear existing text
        try:
            chat_input.send_keys(Keys.CONTROL, "a")
            chat_input.send_keys(Keys.BACKSPACE)
        except Exception:
            pass
        driver.execute_script("""
            var el = arguments[0];
            el.innerText = '';
            el.textContent = '';
        """, chat_input)
        time.sleep(0.2)
        
        # Method 1: Selenium send_keys
        sent_keys_ok = False
        try:
            chat_input.send_keys(str(text))
            sent_keys_ok = True
            time.sleep(0.3)
        except Exception:
            pass

        # Method 2: JS execCommand & Input Event fallback if not populated
        val = driver.execute_script("return (arguments[0].innerText || arguments[0].textContent || arguments[0].value || '').trim();", chat_input)
        if not val:
            driver.execute_script("""
                var el = arguments[0];
                var val = arguments[1];
                el.focus();
                try {
                    document.execCommand('selectAll', false, null);
                    document.execCommand('insertText', false, val);
                } catch(e) {}
                if (!(el.innerText || el.textContent || '').trim()) {
                    el.innerText = val;
                    el.textContent = val;
                }
                el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: ' ' }));
            """, chat_input, str(text))
            time.sleep(0.4)

        # Method 3: Click Send Button
        send_selectors = [
            "#send-button yt-button-shape button",
            "#send-button button",
            "yt-button-shape#send-button button",
            "ytd-button-renderer#send-button button",
            "yt-icon-button#send-button button",
            "button[aria-label*='Send']",
            "button[aria-label*='भेजें']",
            "button[aria-label*='Enviar']",
            "button[aria-label*='Envoyer']",
            "#send-button",
            "yt-live-chat-message-input-renderer #send-button button",
            "yt-live-chat-message-input-renderer #send-button"
        ]
        
        sent = False
        for sel in send_selectors:
            try:
                for btn in driver.find_elements(By.CSS_SELECTOR, sel):
                    if btn.is_displayed():
                        driver.execute_script("arguments[0].click();", btn)
                        sent = True
                        break
            except Exception:
                pass
            if sent:
                break

        # Method 4: Press Enter
        if not sent:
            try:
                chat_input.send_keys(Keys.ENTER)
            except Exception:
                pass
            driver.execute_script("""
                var ev = new KeyboardEvent('keydown', {bubbles: true, cancelable: true, keyCode: 13, which: 13, key: 'Enter'});
                arguments[0].dispatchEvent(ev);
            """, chat_input)

        time.sleep(0.6)
        return True
    except Exception as e:
        if logger:
            logger.error(f"Send failed: {e}")
        return False


def is_live_chat_ready(driver, logger=None):
    try:
        driver.switch_to.default_content()
        time.sleep(0.8)

        # 1. Expand chat if collapsed with Open or Show chat button
        open_selectors = [
            "//button[contains(., 'Open')]",
            "//button[contains(., 'Show chat')]",
            "//button[contains(., 'Live chat')]",
            "//ytd-button-renderer[contains(., 'Open')]",
            "//ytd-button-renderer[contains(., 'Show chat')]"
        ]
        for xpath in open_selectors:
            try:
                for b in driver.find_elements(By.XPATH, xpath):
                    if b.is_displayed():
                        driver.execute_script("arguments[0].click();", b)
                        time.sleep(1.5)
                        break
            except Exception:
                pass

        # 2. Switch to chat frame if present
        frames = driver.find_elements(By.CSS_SELECTOR, "iframe#chatframe, iframe[src*='live_chat']")
        if frames:
            driver.switch_to.frame(frames[0])
            time.sleep(0.8)

        # 3. Check for genuine sign-in button (Strict check: do NOT treat #input-button as sign-in)
        sign_in_selectors = [
            "ytd-button-renderer#sign-in-button a",
            "#sign-in-button a",
            "a[href*='accounts.google.com/ServiceLogin']",
            "a[href*='ServiceLogin?service=youtube']"
        ]
        
        # Check if any genuine sign-in prompt is visible
        for s_sel in sign_in_selectors:
            try:
                for s in driver.find_elements(By.CSS_SELECTOR, s_sel):
                    if s.is_displayed():
                        # Verify whether chat input also exists (if input exists, sign-in is not required)
                        existing_inputs = driver.find_elements(By.CSS_SELECTOR, "div#input, div[contenteditable='true'], textarea#input")
                        if not any(i.is_displayed() for i in existing_inputs):
                            if logger:
                                logger.warning("[LOGIN REQUIRED] Google/YouTube account sign-in required! In Web Console, click 'Sign In (Chrome)' to log in.")
                            return False
            except Exception:
                pass

        # 4. Check for chat input or placeholder
        chat_box = find_and_activate_chat_input(driver, logger)
        if chat_box:
            return True

        # Check for stream restrictions (members only, slow mode, subscriber only)
        sub_only = driver.find_elements(By.CSS_SELECTOR, "#input-subscribers-only, yt-live-chat-restricted-participation-renderer")
        if sub_only and any(so.is_displayed() for so in sub_only):
            if logger:
                logger.warning("[STREAM RESTRICTION] Live chat is restricted to subscribers or channel members by stream host.")
            return False

        if logger:
            logger.debug("Chat input not ready yet on this tab.")
        return False
    except Exception as e:
        if logger:
            logger.debug(f"is_live_chat_ready check: {e}")
        return False


def get_driver(options, logger):
    """Start ChromeDriver with Selenium 4 native manager and graceful fallback"""
    # 1. First attempt: Use SeleniumManager binary paths
    try:
        from selenium.webdriver.common.selenium_manager import SeleniumManager
        paths = SeleniumManager().binary_paths(["--browser", "chrome"])
        driver_path = paths.get("driver_path")
        if driver_path and os.path.exists(driver_path):
            service = Service(executable_path=driver_path)
            return webdriver.Chrome(service=service, options=options)
    except Exception as sm_err:
        logger.warning(f"Direct SeleniumManager lookup failed: {sm_err}")

    # 2. Second attempt: Native webdriver.Chrome
    for attempt in range(1, 4):
        try:
            return webdriver.Chrome(options=options)
        except Exception as e1:
            logger.warning(f"Native Chrome start attempt {attempt} failed: {e1}")
            try:
                driver_path = ChromeDriverManager().install()
                return webdriver.Chrome(service=Service(driver_path), options=options)
            except Exception as e2:
                logger.warning(f"ChromeDriverManager attempt {attempt}/3 failed: {e2}")
                if attempt < 3:
                    time.sleep(2)
    raise RuntimeError("Could not start ChromeDriver after multiple attempts")


# ══════════════════════════════════════════════════════════════════════════════
#  CORE BOT
# ══════════════════════════════════════════════════════════════════════════════

def start_bot():
    logger = setup_logger("send_log.txt")

    tracked_urls = get_data("urls.txt")
    tracked_urls = [normalize_youtube_url(u) for u in tracked_urls if u.strip()]
    if not tracked_urls:
        logger.error("urls.txt is empty — add YouTube live stream URLs first.")
        return

    live_config  = load_live_config(logger)
    sys_settings = live_config.get("SYSTEM_SETTINGS", DEFAULT_CONFIG["SYSTEM_SETTINGS"])
    profile_path = os.path.join(BASE_DIR, "Saved_YT_Session")

    cleanup_chrome_locks(profile_path)

    options = webdriver.ChromeOptions()
    options.add_argument(f"--user-data-dir={profile_path}")
    options.add_argument("--profile-directory=Default")
    options.add_argument("--new-window")
    options.add_argument("--no-first-run")
    options.add_argument("--no-default-browser-check")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--remote-allow-origins=*")
    options.add_argument("--start-maximized")
    options.add_argument("--window-position=0,0")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.page_load_strategy = "eager"

    logger.info("Visible Foreground Mode — Opening Chrome Window in front of screen...")

    logger.info("Starting Chrome...")
    driver = get_driver(options, logger)
    try:
        driver.maximize_window()
    except Exception:
        pass

    # Remove navigator.webdriver fingerprint
    try:
        driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
            "source": """
                Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
                window.navigator.chrome = { runtime: {} };
            """
        })
    except Exception:
        pass

    sent_history = set()
    active_tabs  = {}

    try:
        max_tabs     = live_config.get("MAX_TABS", 10)
        urls_to_open = tracked_urls[:max_tabs]

        logger.info(f"Opening {len(urls_to_open)} URL(s)...")
        driver.get(urls_to_open[0])
        active_tabs[urls_to_open[0]] = driver.current_window_handle
        force_chrome_to_front(driver)
        time.sleep(3)

        for url in urls_to_open[1:]:
            driver.execute_script(f"window.open('{url}', '_blank');")
            time.sleep(1)
            try:
                new_handle = next(h for h in driver.window_handles if h not in active_tabs.values())
                active_tabs[url] = new_handle
            except StopIteration:
                logger.warning(f"Could not get handle for: {url}")

        # ── MAIN LOOP ──────────────────────────────────────────────────────────
        while True:
            current_urls = [normalize_youtube_url(u) for u in get_data("urls.txt") if u.strip()]
            live_config  = load_live_config(logger)
            max_tabs     = live_config.get("MAX_TABS", 10)

            # Close tabs whose URLs were removed from file (only if more than 1 tab)
            for url in list(active_tabs):
                if url not in current_urls:
                    if len(active_tabs) > 1:
                        logger.info(f"Closing removed URL tab: {url}")
                        try:
                            driver.switch_to.window(active_tabs[url])
                            driver.close()
                            # Immediately switch to a remaining valid window handle
                            remaining = [h for h in driver.window_handles if h != active_tabs[url]]
                            if remaining:
                                driver.switch_to.window(remaining[0])
                        except Exception:
                            pass
                        del active_tabs[url]
                        time.sleep(0.5)
                    elif current_urls:
                        # Only 1 tab exists, navigate it to new URL instead of closing
                        new_target = current_urls[0]
                        if new_target != url:
                            logger.info(f"Navigating single tab to new URL: {new_target}")
                            try:
                                driver.switch_to.window(active_tabs[url])
                                driver.get(new_target)
                                active_tabs[new_target] = active_tabs.pop(url)
                            except Exception:
                                pass

            # Open tabs for newly added URLs
            for url in current_urls:
                if url not in active_tabs and len(active_tabs) < max_tabs:
                    logger.info(f"New URL — opening tab: {url}")
                    try:
                        driver.execute_script(f"window.open('{url}', '_blank');")
                        time.sleep(1)
                        new_handle = next(h for h in driver.window_handles if h not in active_tabs.values())
                        active_tabs[url] = new_handle
                    except Exception:
                        pass

            # Re-sync active_tabs with current browser window handles
            try:
                real_handles = set(driver.window_handles)
            except Exception:
                real_handles = set()

            if not real_handles:
                logger.info("Re-opening primary browser tab...")
                try:
                    primary_url = current_urls[0] if current_urls else "https://www.youtube.com"
                    driver.get(primary_url)
                    active_tabs = {primary_url: driver.current_window_handle}
                except Exception as e:
                    logger.error(f"Browser recovery failed: {e}")
                    raise
            else:
                # Remove stale handles that no longer exist in browser
                for u, h in list(active_tabs.items()):
                    if h not in real_handles:
                        active_tabs.pop(u, None)

                if not active_tabs and real_handles:
                    first_handle = list(real_handles)[0]
                    driver.switch_to.window(first_handle)
                    primary_url = current_urls[0] if current_urls else driver.current_url
                    active_tabs[primary_url] = first_handle

            # Process each tab
            for idx, (url, tab_handle) in enumerate(list(active_tabs.items())):
                live_config   = load_live_config(logger)
                loop_settings = live_config.get("LOOP_SETTINGS", {})

                logger.info(f"Tab [{idx + 1}/{len(active_tabs)}] Processing: {url}")
                try:
                    driver.switch_to.window(tab_handle)
                    force_chrome_to_front(driver)
                except Exception:
                    continue

                time.sleep(1.5)
                emulate_human_behavior(driver, live_config, logger)

                messages = get_data("messages.txt")
                if not messages:
                    logger.warning("messages.txt is empty — add some comments in Web Console!")
                    time.sleep(4)
                    continue

                if is_live_chat_ready(driver, logger):
                    msg = choose_message(
                        messages, sent_history,
                        loop_settings.get("ALLOW_DUPLICATE_MESSAGES", False)
                    )
                    if msg:
                        chat_box = find_and_activate_chat_input(driver, logger)
                        if chat_box:
                            if safe_send_text(chat_box, msg, driver, logger):
                                logger.info(f"[LIVE SENT] Tab {idx + 1}: {msg}")
                                sent_history.add(msg)
                            else:
                                logger.warning(f"Could not dispatch message text to chat box on Tab {idx + 1}")
                        else:
                            logger.warning(f"Chat box element not found on Tab {idx + 1}")
                else:
                    logger.warning(f"Live chat not ready on Tab {idx + 1} (checking stream/chat state)")

                try:
                    driver.switch_to.default_content()
                except Exception:
                    pass

                delay, _ = get_speed_delays(live_config)
                logger.info(f"Waiting {delay}s...")
                time.sleep(delay)

            _, batch_delay = get_speed_delays(live_config)
            logger.info(f"Round done | Active tabs: {len(active_tabs)} | Sleeping {batch_delay}s...")
            time.sleep(batch_delay)

    except KeyboardInterrupt:
        logger.info("Stopped by user.")
        raise
    finally:
        try:
            driver.quit()
        except Exception:
            pass


# ══════════════════════════════════════════════════════════════════════════════
#  AUTO-RESTART WRAPPER
# ══════════════════════════════════════════════════════════════════════════════

def main():
    is_tty = sys.stdout.isatty()
    if is_tty:
        show_rain_animation()
        show_banner()
        init_rain_zone()
        rain_thread = threading.Thread(target=rain_updater_thread, daemon=True)
        rain_thread.start()
    else:
        print("[ATG-BOT] YouTube Live Automation Engine Initialized.")

    attempt = 0
    try:
        while True:
            attempt += 1
            try:
                start_bot()
                break   # clean exit
            except KeyboardInterrupt:
                raise
            except Exception as e:
                wait = min(60, 10 * attempt)
                if is_tty:
                    tprint(f"\n{BOLD}{RED}  [CRASH #{attempt}] {e}{R}")
                    tprint(f"{BOLD}{YELLOW}  Auto-restarting in {wait}s...{R}\n")
                else:
                    print(f"[ATG-BOT] Error: {e}. Auto-restarting in {wait}s...")
                time.sleep(wait)
    except KeyboardInterrupt:
        pass
    finally:
        _rain_stop.set()
        if is_tty:
            with _io_lock:
                sys.stdout.write('\033[r')      # Reset scroll region to full screen
                sys.stdout.write('\033[?25h')   # Ensure cursor is visible
                sys.stdout.flush()
            tprint(f"\n{BOLD}{RED}  Stopped. Bye!{R}\n")
        else:
            print("[ATG-BOT] Engine stopped cleanly.")


if __name__ == "__main__":
    main()