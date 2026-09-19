import os
import sys
import shutil
import psutil
import time

def import_session():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    target_dir = os.path.join(base_dir, "Saved_YT_Session")
    source_dir = os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\User Data")
    
    if not os.path.exists(source_dir):
        print("[ERROR] Chrome User Data directory not found!")
        return False

    print("Closing Chrome processes to safely read session cookies...")
    for p in psutil.process_iter(['pid', 'name']):
        try:
            if 'chrome' in (p.info['name'] or '').lower():
                p.kill()
        except Exception:
            pass
    time.sleep(1)

    os.makedirs(target_dir, exist_ok=True)
    os.makedirs(os.path.join(target_dir, "Default"), exist_ok=True)

    # 1. Copy Local State (contains OS crypt key)
    local_state_src = os.path.join(source_dir, "Local State")
    local_state_dst = os.path.join(target_dir, "Local State")
    if os.path.exists(local_state_src):
        shutil.copy2(local_state_src, local_state_dst)
        print("Copied Local State.")

    # 2. Copy Default folder essentials
    src_default = os.path.join(source_dir, "Default")
    dst_default = os.path.join(target_dir, "Default")
    
    essential_files = [
        "Preferences", "Secure Preferences", "Login Data", "Web Data", "Favicons", "History"
    ]
    for f in essential_files:
        sf = os.path.join(src_default, f)
        df = os.path.join(dst_default, f)
        if os.path.exists(sf):
            try:
                shutil.copy2(sf, df)
            except Exception:
                pass

    # 3. Copy Network folder (where modern Chrome stores Cookies SQLite db)
    src_network = os.path.join(src_default, "Network")
    dst_network = os.path.join(dst_default, "Network")
    if os.path.exists(src_network):
        os.makedirs(dst_network, exist_ok=True)
        for item in os.listdir(src_network):
            s_item = os.path.join(src_network, item)
            d_item = os.path.join(dst_network, item)
            if os.path.isfile(s_item) and not s_item.endswith(".lock"):
                try:
                    shutil.copy2(s_item, d_item)
                except Exception:
                    pass
        print("Copied Network & Cookies database.")

    # 4. Copy legacy Cookies if present
    src_cookies = os.path.join(src_default, "Cookies")
    if os.path.exists(src_cookies):
        try:
            shutil.copy2(src_cookies, os.path.join(dst_default, "Cookies"))
        except Exception:
            pass

    # 5. Copy Storage & Session Storage
    for folder in ["Storage", "Session Storage", "Local Storage", "IndexedDB"]:
        s_folder = os.path.join(src_default, folder)
        d_folder = os.path.join(dst_default, folder)
        if os.path.exists(s_folder):
            try:
                if os.path.exists(d_folder):
                    shutil.rmtree(d_folder, ignore_errors=True)
                shutil.copytree(s_folder, d_folder, dirs_exist_ok=True)
                print(f"Copied {folder}.")
            except Exception as e:
                print(f"Could not copy {folder}: {e}")

    print("\n[SUCCESS] Existing Chrome login session successfully imported into YouTube Bot!")
    return True

if __name__ == "__main__":
    import_session()
