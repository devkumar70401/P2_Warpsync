// WarpSync Frontend Logic

let ws;

function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log("⚡ Connected to WarpSync WebSocket stream");
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "peer_count") {
            const peerStatus = document.getElementById("peer-status");
            if (peerStatus) {
                peerStatus.textContent = `Connected (${data.count} Device${data.count > 1 ? 's' : ''})`;
            }
        } else if (data.type === "file_received") {
            loadFilesList();
            showNotification(`📥 File received: ${data.file.filename}`);
        } else if (data.type === "clipboard_added") {
            loadClipboards();
            showNotification(`📋 New text shared`);
        }
    };

    ws.onclose = () => {
        console.log("WebSocket disconnected, reconnecting in 3s...");
        setTimeout(initWebSocket, 3000);
    };
}

// Drag & Drop Setup
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");

if (dropzone && fileInput) {
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.add("dragover");
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.remove("dragover");
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadFiles(files);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length > 0) {
            uploadFiles(fileInput.files);
        }
    });
}

function uploadFiles(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const uploadStatus = document.getElementById("upload-status");

    progressContainer.style.display = "block";
    uploadStatus.style.display = "block";
    uploadStatus.textContent = "Uploading file(s)...";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);

    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = percent + "%";
            uploadStatus.textContent = `Uploading: ${percent}%`;
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            uploadStatus.textContent = "✅ Upload completed successfully!";
            setTimeout(() => {
                progressContainer.style.display = "none";
                uploadStatus.style.display = "none";
                progressBar.style.width = "0%";
            }, 3000);
            loadFilesList();
        } else {
            uploadStatus.textContent = "❌ Upload failed!";
        }
    };

    xhr.send(formData);
}

function loadFilesList() {
    fetch("/api/files")
        .then(res => res.json())
        .then(files => {
            const fileListEl = document.getElementById("file-list");
            if (!files || files.length === 0) {
                fileListEl.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No files uploaded yet. Drag & drop files above to start sharing!</p>`;
                return;
            }

            fileListEl.innerHTML = files.map(file => `
                <div class="file-item">
                    <div class="file-info">
                        <span class="file-icon">📄</span>
                        <div>
                            <div class="file-name">${escapeHtml(file.filename)}</div>
                            <div class="file-meta">${file.formatted_size} • ${file.modified_str}</div>
                        </div>
                    </div>
                    <a href="/api/download/${encodeURIComponent(file.filename)}" class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.85rem; text-decoration: none;">
                        📥 Download
                    </a>
                </div>
            `).join('');
        })
        .catch(err => console.error("Error loading files:", err));
}

function sendClipboard() {
    const input = document.getElementById("clip-input");
    const text = input.value.trim();
    if (!text) return;

    const formData = new FormData();
    formData.append("content", text);

    fetch("/api/clipboard", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        input.value = "";
        loadClipboards();
    });
}

function loadClipboards() {
    fetch("/api/clipboard")
        .then(res => res.json())
        .then(items => {
            const clipListEl = document.getElementById("clip-list");
            if (!items || items.length === 0) {
                clipListEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No text snippets shared yet.</p>`;
                return;
            }

            clipListEl.innerHTML = items.map(item => `
                <div class="clip-item">
                    <div>
                        <span style="font-size: 0.9rem; font-weight: 500;">${escapeHtml(item.content)}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.5rem;">(${item.timestamp})</span>
                    </div>
                    <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="navigator.clipboard.writeText('${escapeHtml(item.content)}')">
                        📋 Copy
                    </button>
                </div>
            `).join('');
        });
}

function copyAccessUrl() {
    const urlText = document.getElementById("url-text").textContent;
    navigator.clipboard.writeText(urlText).then(() => {
        showNotification("📋 Copied Local URL to clipboard!");
    });
}

function showNotification(msg) {
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "linear-gradient(135deg, #00f2fe, #4facfe)";
    toast.style.color = "#000";
    toast.style.fontWeight = "bold";
    toast.style.padding = "0.75rem 1.25rem";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 5px 20px rgba(0,242,254,0.4)";
    toast.style.zIndex = "9999";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    initWebSocket();
    loadFilesList();
    loadClipboards();
});
