import zlib
import struct
import math

def read_png_full(path):
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

w, h, bpp, pixels = read_png_full('public/assets/Wheel/extracted_base_image.png')

# Let's inspect the central circular axle hole:
# The center hub of the wheel has an axle hole / central circular ring!
# Let's search in x in [350, 450], y in [350, 450]
# Find the exact center of the circular axle ring:
hub_pixels = []
for y in range(350, 420):
    for x in range(350, 420):
        a = pixels[y][x*4 + 3]
        r = pixels[y][x*4]
        g = pixels[y][x*4 + 1]
        b = pixels[y][x*4 + 2]
        # In the center there is a dark axle circle
        if a > 200:
            # brightness
            lum = 0.299*r + 0.587*g + 0.114*b
            hub_pixels.append((x, y, lum))

# Let's find the circular rim points:
# The wheel has a continuous circular rim.
# From rough center (387, 378), let's cast rays in 360 degrees:
rim_inner_points = []
rim_outer_points = []

rough_cx, rough_cy = 387, 378

for angle_deg in range(0, 360, 1):
    rad = math.radians(angle_deg)
    # Check for rim between r=180 and r=300
    for r in range(180, 260):
        x = int(rough_cx + r * math.cos(rad))
        y = int(rough_cy + r * math.sin(rad))
        if 0 <= x < 800 and 0 <= y < 850:
            a = pixels[y][x*4 + 3]
            # transition from transparent to opaque (outer rim edge)
            # or check edge of the circular ring
            pass

# Let's inspect the central axle ring specifically:
# The central hub has a small circular ring (radius ~ 20px).
# Let's print out a 20x20 ASCII map around (387, 378)
print("ASCII map around (387, 378):")
for y in range(368, 389):
    row = ""
    for x in range(377, 398):
        if x == 387 and y == 378:
            row += "+"
        else:
            a = pixels[y][x*4 + 3]
            r = pixels[y][x*4]
            g = pixels[y][x*4+1]
            b = pixels[y][x*4+2]
            lum = int(0.299*r + 0.587*g + 0.114*b)
            if a < 50: row += " "
            elif lum < 80: row += "#"
            elif lum < 140: row += "="
            elif lum < 200: row += "-"
            else: row += "."
    print(f"y={y}: {row}")
