import zlib
import struct

def read_png(path):
    with open(path, 'rb') as f:
        data = f.read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
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
            print(f"PNG: {w}x{h}, depth={depth}, color_type={color_type}")
        elif chunk_type == b'IDAT':
            idat_chunks.append(chunk_data)
        elif chunk_type == b'IEND':
            break
            
    raw = zlib.decompress(b''.join(idat_chunks))
    # Decode scanlines for RGBA or RGB
    bpp = 4 if color_type == 6 else 3
    stride = 1 + w * bpp
    pixels = []
    
    # We reconstruct scanlines with basic PNG filters
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

# Find center of the wheel:
# The center hub of the wheel is a dark circle with a dot in the middle.
# Let's search in the left region x in [200, 600], y in [200, 600] for dark pixels (R < 50, G < 50, B < 50)
dark_points = []
for y in range(150, 650):
    for x in range(200, 650):
        r = pixels[y][x*bpp]
        g = pixels[y][x*bpp+1]
        b = pixels[y][x*bpp+2]
        # Very dark pixel (hub center or black lines)
        if r < 40 and g < 40 and b < 40:
            dark_points.append((x, y))

print(f"Total dark points in box: {len(dark_points)}")

# Let's find horizontal line of the wheel crosshair:
# There is a horizontal line going through the center of the wheel!
# Let's count dark pixels along each horizontal row
row_counts = {}
for y in range(200, 500):
    cnt = 0
    for x in range(150, 750):
        if pixels[y][x*bpp] < 50 and pixels[y][x*bpp+1] < 50 and pixels[y][x*bpp+2] < 50:
            cnt += 1
    row_counts[y] = cnt

# Top 5 rows with highest count
sorted_rows = sorted(row_counts.items(), key=lambda x: x[1], reverse=True)[:5]
print("Rows with most dark pixels (horizontal crosshair):", sorted_rows)

# Let's count dark pixels along vertical columns
col_counts = {}
for x in range(250, 550):
    cnt = 0
    for y in range(150, 650):
        if pixels[y][x*bpp] < 50 and pixels[y][x*bpp+1] < 50 and pixels[y][x*bpp+2] < 50:
            cnt += 1
    col_counts[x] = cnt

sorted_cols = sorted(col_counts.items(), key=lambda x: x[1], reverse=True)[:5]
print("Cols with most dark pixels (vertical crosshair):", sorted_cols)
