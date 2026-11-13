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

# Check central hub details
print(f"Hub center: ({cx}, {cy})")
# Measure distance to gear wheel edges and teeth:
# Along radial rays from (cx, cy)
rad_dist = []
for deg in range(0, 360, 5):
    rad = math.radians(deg)
    # Step out from center
    for r in range(10, 300):
        x = int(cx + r * math.cos(rad))
        y = int(cy + r * math.sin(rad))
        if 0 <= x < w and 0 <= y < h:
            # check grey/dark pixel belonging to gear
            # gear pixels are grey (r, g, b around 80-160, not blue/green)
            px_r = pixels[y][x*bpp]
            px_g = pixels[y][x*bpp+1]
            px_b = pixels[y][x*bpp+2]
            # detect if it is gear (grey/metallic)
            is_grey = abs(px_r - px_g) < 20 and abs(px_g - px_b) < 20 and px_r < 180 and px_r > 50
            if is_grey:
                rad_dist.append((deg, r))

# Find min and max radius of gear teeth
gear_radii = [r for deg, r in rad_dist]
if gear_radii:
    print(f"Gear inner body min radius: {min(gear_radii)}, max tooth radius: {max(gear_radii)}")

# Check outer compass circle radius:
# Compass circle is a thin dark/grey line around the wheel
compass_points = []
for r in range(100, 350):
    for deg in range(0, 360, 2):
        rad = math.radians(deg)
        x = int(cx + r * math.cos(rad))
        y = int(cy + r * math.sin(rad))
        if 0 <= x < w and 0 <= y < h:
            px_r = pixels[y][x*bpp]
            px_g = pixels[y][x*bpp+1]
            px_b = pixels[y][x*bpp+2]
            if px_r < 100 and px_g < 100 and px_b < 100 and abs(px_r - px_g) < 15:
                compass_points.append(r)

# Most common radius for outer circles:
from collections import Counter
counts = Counter(compass_points)
print("Top radii for circular lines around center:", counts.most_common(10))
