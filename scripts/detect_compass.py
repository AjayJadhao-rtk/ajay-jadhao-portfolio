import zlib
import struct
import math

def read_png(path):
    with open(path, 'rb') as f:
        data = f.read()
    idx = 8
    idat_chunks = []
    w, h = 0, 0
    while idx < len(data):
        length, = struct.unpack('>I', data[idx:idx+4])
        chunk_type = data[idx+4:idx+8]
        chunk_data = data[idx+8:idx+8+length]
        idx += 12 + length
        if chunk_type == b'IHDR':
            w, h, depth, color_type = struct.unpack('>IIBB', chunk_data[:10])
        elif chunk_type == b'IDAT':
            idat_chunks.append(chunk_data)
        elif chunk_type == b'IEND':
            break
            
    raw = zlib.decompress(b''.join(idat_chunks))
    bpp = 4 if color_type == 6 else 3
    stride = 1 + w * bpp
    pixels = []
    prev_line = bytearray(w * bpp)
    for y in range(h):
        line_offset = y * stride
        filter_type = raw[line_offset]
        scanline = bytearray(raw[line_offset+1:line_offset+stride])
        recon = bytearray(w * bpp)
        for i in range(w * bpp):
            filt_val = scanline[i]
            a = recon[i - bpp] if i >= bpp else 0
            b = prev_line[i]
            c = prev_line[i - bpp] if i >= bpp else 0
            if filter_type == 0:
                recon[i] = filt_val
            elif filter_type == 1:
                recon[i] = (filt_val + a) & 0xff
            elif filter_type == 2:
                recon[i] = (filt_val + b) & 0xff
            elif filter_type == 3:
                recon[i] = (filt_val + (a + b) // 2) & 0xff
            elif filter_type == 4:
                pa = abs(b - c)
                pb = abs(a - c)
                pc = abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                recon[i] = (filt_val + pr) & 0xff
        prev_line = recon
        pixels.append(recon)
    return w, h, bpp, pixels

w, h, bpp, pixels = read_png('public/assets/Wheel/Wheel placement reference image.png')
cx, cy = 412, 283

# Let's inspect the lines:
# 1. Horizontal line:
# From x=? to x=? at y=283
h_min_x, h_max_x = cx, cx
for x in range(50, 1000):
    pr = pixels[283][x*bpp]
    pg = pixels[283][x*bpp+1]
    pb = pixels[283][x*bpp+2]
    if pr < 100 and pg < 100 and pb < 100:
        if x < h_min_x: h_min_x = x
        if x > h_max_x: h_max_x = x

print(f"Horizontal crosshair at y=283: x from {h_min_x} to {h_max_x}")

# 2. Vertical line:
# At x=412, from y=? to y=?
v_min_y, v_max_y = cy, cy
for y in range(50, 700):
    pr = pixels[y][412*bpp]
    pg = pixels[y][412*bpp+1]
    pb = pixels[y][412*bpp+2]
    if pr < 100 and pg < 100 and pb < 100:
        if y < v_min_y: v_min_y = y
        if y > v_max_y: v_max_y = y

print(f"Vertical crosshair at x=412: y from {v_min_y} to {v_max_y}")

# 3. Dots at ends of crosshair lines:
# Horizontal line ends with black dot at left and right
# Vertical line ends with black dot at bottom
print(f"Terminal dots: Left=({h_min_x}, 283), Right=({h_max_x}, 283), Bottom=(412, {v_max_y})")

# 4. Circles:
# Let's find radii of all circles centered at (cx, cy)
detected_circles = []
for r in range(50, 400):
    hits = 0
    total = 0
    for deg in range(0, 360, 4):
        # Avoid the crosshair axes (0, 90, 180, 270)
        if deg % 90 in (0, 88, 92, 176, 184, 268, 272): continue
        rad = math.radians(deg)
        x = int(cx + r * math.cos(rad))
        y = int(cy + r * math.sin(rad))
        if 0 <= x < w and 0 <= y < h:
            total += 1
            pr = pixels[y][x*bpp]
            pg = pixels[y][x*bpp+1]
            pb = pixels[y][x*bpp+2]
            # Grey or dark line pixel
            if pr < 180 and pg < 180 and pb < 180 and abs(pr - pg) < 25:
                hits += 1
    if total > 0 and hits / total > 0.35:
        detected_circles.append((r, round(hits / total, 2)))

print("Detected concentric circle radii:", detected_circles)
