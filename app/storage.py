import os
import time
import shutil
from pathlib import Path
from typing import List, Dict, Any

DOWNLOADS_DIR = Path("/home/dev/SE/P2_Warpsync/downloads")

def ensure_downloads_dir() -> Path:
    """Ensures the downloads directory exists."""
    DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
    return DOWNLOADS_DIR

def format_file_size(size_in_bytes: int) -> str:
    """Formats file size into human readable string (KB, MB, GB)."""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_in_bytes < 1024.0:
            return f"{size_in_bytes:.1f} {unit}"
        size_in_bytes /= 1024.0
    return f"{size_in_bytes:.1f} PB"

def save_uploaded_file(file_obj, filename: str) -> Dict[str, Any]:
    """
    Saves an incoming file object securely to the downloads directory.
    Uses chunked streaming for memory efficiency.
    """
    ensure_downloads_dir()
    # Sanitize filename
    safe_filename = Path(filename).name
    if not safe_filename:
        safe_filename = f"file_{int(time.time())}.bin"
        
    target_path = DOWNLOADS_DIR / safe_filename
    
    # Handle duplicate filenames
    if target_path.exists():
        stem = target_path.stem
        suffix = target_path.suffix
        timestamp = int(time.time())
        target_path = DOWNLOADS_DIR / f"{stem}_{timestamp}{suffix}"

    size = 0
    with open(target_path, "wb") as buffer:
        while True:
            chunk = file_obj.file.read(1024 * 1024)  # 1MB chunks
            if not chunk:
                break
            buffer.write(chunk)
            size += len(chunk)
            
    return {
        "filename": target_path.name,
        "path": str(target_path),
        "size": size,
        "formatted_size": format_file_size(size),
        "timestamp": time.time(),
        "time_str": time.strftime("%Y-%m-%d %H:%M:%S")
    }

def get_shared_files() -> List[Dict[str, Any]]:
    """Returns metadata for all files in the downloads directory."""
    ensure_downloads_dir()
    files_list = []
    for item in DOWNLOADS_DIR.iterdir():
        if item.is_file():
            stat = item.stat()
            files_list.append({
                "filename": item.name,
                "size": stat.st_size,
                "formatted_size": format_file_size(stat.st_size),
                "modified": stat.st_mtime,
                "modified_str": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(stat.st_mtime))
            })
    return sorted(files_list, key=lambda x: x["modified"], reverse=True)
