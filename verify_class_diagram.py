import subprocess
import time
import json
import urllib.request
import socket
import re
import base64
import os
from PIL import Image

def capture_class_screenshot():
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    user_data_dir = r"C:\Users\lenovo\AppData\Local\Temp\edge_screenshot_class_profile_new"
    port = 9223
    
    cmd = [
        edge_path,
        "--headless=new",
        f"--remote-debugging-port={port}",
        f"--user-data-dir={user_data_dir}",
        "--no-first-run",
        "--no-default-browser-check",
        "--window-size=2400,2400",
        "--disable-gpu",
        "file:///c:/Users/lenovo/Desktop/SAD/index.html"
    ]
    
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(3.5)

    ws = None
    try:
        req = urllib.request.urlopen(f"http://127.0.0.1:{port}/json")
        targets = json.loads(req.read().decode())
        page_target = next(t for t in targets if t.get("type") == "page")
        ws_url = page_target["webSocketDebuggerUrl"]

        m = re.match(r"ws://127.0.0.1:(\d+)/(.+)", ws_url)
        path = "/" + m.group(2)
        
        ws = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        ws.connect(("127.0.0.1", port))
        
        handshake = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: 127.0.0.1:{port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        ws.sendall(handshake.encode())
        resp = ws.recv(4096)

        msg_counter = [1]
        def cdp_send(method, params=None):
            mid = msg_counter[0]
            msg_counter[0] += 1
            payload = json.dumps({"id": mid, "method": method, "params": params or {}})
            payload_bytes = payload.encode()
            frame = bytearray([0x81])
            length = len(payload_bytes)
            mask = b"\x12\x34\x56\x78"
            if length < 126:
                frame.append(0x80 | length)
            else:
                frame.append(0x80 | 126)
                frame.extend(length.to_bytes(2, "big"))
            frame.extend(mask)
            masked = bytearray(payload_bytes)
            for i in range(len(masked)):
                masked[i] ^= mask[i % 4]
            frame.extend(masked)
            ws.sendall(frame)

            buf = bytearray()
            while True:
                chunk = ws.recv(131072)
                if not chunk:
                    break
                buf.extend(chunk)
                s = buf.decode("utf-8", "ignore")
                target_str = f'{{"id":{mid},'
                idx = s.find(target_str)
                if idx >= 0:
                    depth = 0
                    in_s = False
                    esc = False
                    end = -1
                    for ci, c in enumerate(s[idx:]):
                        if esc:
                            esc = False
                            continue
                        if c == '\\':
                            esc = True
                            continue
                        if c == '"':
                            in_s = not in_s
                            continue
                        if not in_s:
                            if c == '{':
                                depth += 1
                            elif c == '}':
                                depth -= 1
                                if depth == 0:
                                    end = idx + ci + 1
                                    break
                    if end > 0:
                        return json.loads(s[idx:end])

        # Wait until loaded
        for attempt in range(30):
            chk = cdp_send("Runtime.evaluate", {
                "expression": "typeof window.diagramStudioInstance !== 'undefined' && typeof window.DIAGRAMS_DATA !== 'undefined' ? window.diagramStudioInstance.currentDiagramId : ''",
                "returnByValue": True
            })
            val = chk.get("result", {}).get("result", {}).get("value")
            if val:
                print(f"Loaded on attempt {attempt+1}: currentDiagramId = {val}")
                break
            time.sleep(0.5)
        
        time.sleep(1.0)
        eval_res = cdp_send("Runtime.evaluate", {
            "expression": """
                (() => {
                    const el = document.getElementById('diagramStudioCard');
                    if (el) {
                        window.scrollTo(0, el.offsetTop - 50);
                    }
                    window.diagramStudioInstance.switchDiagram('class_diagram');
                    window.diagramStudioInstance.fitToScreen();
                    const rect = el.getBoundingClientRect();
                    return { x: rect.x, y: rect.y + window.scrollY, width: rect.width, height: rect.height };
                })()
            """,
            "returnByValue": True
        })
        time.sleep(1.2)
        rect = eval_res.get("result", {}).get("result", {}).get("value")
        print("rect:", rect)

        shot = cdp_send("Page.captureScreenshot", {
            "format": "png",
            "clip": {
                "x": rect["x"],
                "y": rect["y"],
                "width": rect["width"],
                "height": rect["height"],
                "scale": 1
            },
            "captureBeyondViewport": True
        })
        img_b64 = shot["result"]["data"]
        out_path = r"C:\Users\lenovo\.gemini\antigravity\brain\c1d49ba4-ae9f-4fb0-863a-80b6581fa716\user_aligned_class_diagram_v2.png"
        with open(out_path, "wb") as f:
            f.write(base64.b64decode(img_b64))
        print("SUCCESS: Saved user_aligned_class_diagram_v2.png!")

        # Now let's crop the 4 problem areas for visual confirmation
        full_img = Image.open(out_path)
        fw, fh = full_img.size
        print(f"Full rendered image size: {fw}x{fh}")

        # Area 1: PurchaseOrder bottom + POLineItem (Problem 1)
        # PurchaseOrder is around x: 25-45%, y: 20-40% of viewer
        crop1 = full_img.crop((int(fw * 0.22), int(fh * 0.18), int(fw * 0.58), int(fh * 0.48)))
        crop1.save(r"C:\Users\lenovo\.gemini\antigravity\brain\c1d49ba4-ae9f-4fb0-863a-80b6581fa716\verify_prob1_purchase_order.png")
        print("Saved verify_prob1_purchase_order.png")

        # Area 2: ThresholdAlertController + Supplier + sendStockAlert (Problem 2)
        crop2 = full_img.crop((int(fw * 0.30), int(fh * 0.32), int(fw * 0.65), int(fh * 0.58)))
        crop2.save(r"C:\Users\lenovo\.gemini\antigravity\brain\c1d49ba4-ae9f-4fb0-863a-80b6581fa716\verify_prob2_supplier_alert.png")
        print("Saved verify_prob2_supplier_alert.png")

        # Area 3: InventoryItem + 4 Subclasses + StorageLocation (Problem 3)
        crop3 = full_img.crop((int(fw * 0.05), int(fh * 0.45), int(fw * 0.55), int(fh * 0.85)))
        crop3.save(r"C:\Users\lenovo\.gemini\antigravity\brain\c1d49ba4-ae9f-4fb0-863a-80b6581fa716\verify_prob3_inventory_subclasses.png")
        print("Saved verify_prob3_inventory_subclasses.png")

        # Area 4: User + Subclasses (FarmWorker, FarmManager, FarmOwner) (Problem 4)
        crop4 = full_img.crop((int(fw * 0.55), int(fh * 0.32), int(fw * 0.98), int(fh * 0.65)))
        crop4.save(r"C:\Users\lenovo\.gemini\antigravity\brain\c1d49ba4-ae9f-4fb0-863a-80b6581fa716\verify_prob4_user_inheritance.png")
        print("Saved verify_prob4_user_inheritance.png")

    finally:
        if ws:
            ws.close()
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    capture_class_screenshot()

