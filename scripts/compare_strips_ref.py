import zlib
import struct

# Compare Wheel placement reference image.png strips with 01_strip.svg strips
w, h, bpp, pixels = None, None, None, None
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

# In Wheel placement reference image.png:
# Strip 1:
# Let's find columns where strip 1, 2, 3 are located:
strip_cols = []
for x in range(0, 1000):
    # check row y = 500
    pr = pixels[500][x*bpp]
    pg = pixels[500][x*bpp+1]
    pb = pixels[500][x*bpp+2]
    # strip color is greenish/cyan: pg > 120 and pb > 120 and pr < 120
    if pg > 100 and pb > 100 and (pg > pr + 20 or pb > pr + 20):
        strip_cols.append(x)

if strip_cols:
    print(f"Strips in Wheel placement reference image.png at y=500: x from {min(strip_cols)} to {max(strip_cols)}")
    # Find breaks
    ranges = []
    start = strip_cols[0]
    for i in range(1, len(strip_cols)):
        if strip_cols[i] > strip_cols[i-1] + 5:
            ranges.append((start, strip_cols[i-1]))
            start = strip_cols[i]
    ranges.append((start, strip_cols[-1]))
    print("Strip X ranges in reference image:", ranges)
