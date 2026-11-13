import zlib
import struct

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

# The top-left wheel is in region x in [0, 800], y in [0, 850]
# Find bounding box of non-transparent pixels in this region
min_x, max_x = 9999, -1
min_y, max_y = 9999, -1
for y in range(50, 750):
    for x in range(50, 750):
        alpha = pixels[y][x*4 + 3]
        if alpha > 20: # Visible pixel
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

print(f"Top-left wheel (0 deg) bbox: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")
cx = (min_x + max_x) // 2
cy = (min_y + max_y) // 2
print(f"Approx center: ({cx}, {cy}), width={max_x - min_x + 1}, height={max_y - min_y + 1}")

# Let's verify central hub in this bbox:
hub_dark_points = []
for y in range(cy - 40, cy + 40):
    for x in range(cx - 40, cx + 40):
        r = pixels[y][x*4]
        g = pixels[y][x*4+1]
        b = pixels[y][x*4+2]
        a = pixels[y][x*4+3]
        if a > 100 and r < 80 and g < 80 and b < 80:
            hub_dark_points.append((x, y))

if hub_dark_points:
    hub_cx = sum(p[0] for p in hub_dark_points) // len(hub_dark_points)
    hub_cy = sum(p[1] for p in hub_dark_points) // len(hub_dark_points)
    print(f"Hub refined center: ({hub_cx}, {hub_cy})")
    cx, cy = hub_cx, hub_cy

# We want a perfectly centered square crop of radius R
radius = max(cx - min_x, max_x - cx, cy - min_y, max_y - cy) + 10
print(f"Crop radius: {radius}, diameter: {radius * 2}")

crop_w = radius * 2
crop_h = radius * 2

def write_png(path, w, h, data_rows):
    # data_rows is list of bytearrays each of length w*4
    raw_bytes = bytearray()
    for row in data_rows:
        raw_bytes.append(0) # filter type 0
        raw_bytes.extend(row)
    compressed = zlib.compress(raw_bytes, 9)
    
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', len(ihdr_data)))
    png.extend(b'IHDR')
    png.extend(ihdr_data)
    png.extend(struct.pack('>I', ihdr_crc))
    # IDAT
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png.extend(struct.pack('>I', len(compressed)))
    png.extend(b'IDAT')
    png.extend(compressed)
    png.extend(struct.pack('>I', idat_crc))
    # IEND
    iend_crc = zlib.crc32(b'IEND')
    png.extend(struct.pack('>I', 0))
    png.extend(b'IEND')
    png.extend(struct.pack('>I', iend_crc))
    
    with open(path, 'wb') as f:
        f.write(png)
    print(f"Saved {path} ({w}x{h}, {len(png)} bytes)")

cropped_rows = []
for y in range(cy - radius, cy + radius):
    row = bytearray(crop_w * 4)
    if 0 <= y < h:
        for x_idx, x in enumerate(range(cx - radius, cx + radius)):
            if 0 <= x < w:
                for c in range(4):
                    row[x_idx * 4 + c] = pixels[y][x * 4 + c]
    cropped_rows.append(row)

write_png('public/assets/Wheel/wheel_isolated.png', crop_w, crop_h, cropped_rows)
