import socket
import io
import base64
import qrcode

def get_local_ip() -> str:
    """
    Detects the primary local IP address of the device on the local Wi-Fi / LAN network.
    Returns '127.0.0.1' if disconnected from local networks.
    """
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Connecting to an external IP doesn't send data, but forces OS to pick local interface IP
        s.connect(('10.255.255.255', 1))
        local_ip = s.getsockname()[0]
    except Exception:
        try:
            local_ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            local_ip = '127.0.0.1'
    finally:
        s.close()
    return local_ip

def print_terminal_qr(url: str):
    """
    Prints an ASCII QR code directly into the terminal window.
    """
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=1,
            border=2,
        )
        qr.add_data(url)
        qr.make(fit=True)
        print("\n" + "=" * 55)
        print("⚡ WARPSYNC LOCAL FILE SHARE IS ACTIVE!")
        print(f"🔗 Mobile/Device Access URL: {url}")
        print("📱 Scan the QR Code below on any mobile phone or device:")
        print("=" * 55 + "\n")
        qr.print_ascii(invert=True)
        print("\n" + "=" * 55 + "\n")
    except Exception as e:
        print(f"⚡ WARPSYNC URL: {url} (QR render error: {e})")

def generate_qr_base64(url: str) -> str:
    """
    Generates a PNG QR code encoded as a Base64 Data URI string for rendering in HTML.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#00f2fe", back_color="#0b0f19")
    
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64_str}"
