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

# Let's inspect along diagonal at 45 degrees:
tooth_edge_r = 0
for r in range(50, 250):
    x = int(cx + r * math.cos(math.radians(225))) # towards bottom-left
    y = int(cy + r * math.sin(math.radians(225)))
    pr, pg, pb = pixels[y][x*bpp], pixels[y][x*bpp+1], pixels[y][x*bpp+2]
    # Check if this pixel is gear body or teeth
    # Background is white/cream
    if pr < 200 or pg < 200 or pb < 200:
        tooth_edge_r = max(tooth_edge_r, r)

print(f"Gear teeth outer radius at 225 deg: {tooth_edge_r} px (diameter: {tooth_edge_r*2} px)")

# Along 135 degrees (towards bottom-right, over rectangle strip)
for r in range(50, 250):
    x = int(cx + r * math.cos(math.radians(315))) # towards top-right
    y = int(cy + r * math.sin(math.radians(315)))
    pr, pg, pb = pixels[y][x*bpp], pixels[y][x*bpp+1], pixels[y][x*bpp+2]
    print(f"r={r}: ({x},{y}) -> RGB({pr},{pg},{pb})", end=" ")
    if r % 10 == 0: print()
print()
