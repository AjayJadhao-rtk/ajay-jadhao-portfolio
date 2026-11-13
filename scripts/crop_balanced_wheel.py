from find_true_wheel_center import read_png_full
import zlib
import struct
import math

w, h, bpp, pixels = read_png_full('public/assets/Wheel/extracted_base_image.png')

# True center of Wheel 1:
cx = 388
cy = 370

print(f"Centering wheel on exact axle: ({cx}, {cy})")

# Measure maximum extent of visible pixels from (cx, cy)
max_dist = 0
for y in range(0, 750):
    for x in range(0, 780):
        a = pixels[y][x*4 + 3]
        if a > 15:
            d = math.hypot(x - cx, y - cy)
            if d > max_dist:
                max_dist = d

print(f"Maximum radius from axle: {max_dist:.2f} px")

# Set crop radius with safe margin
crop_r = int(math.ceil(max_dist)) + 6
crop_size = crop_r * 2
print(f"New crop size: {crop_size}x{crop_size}, radius: {crop_r}")

# In the new crop_size x crop_size image, the axle (cx, cy) will be EXACTLY at (crop_r, crop_r)!
# Exactly at width/2 and height/2!

def write_png(path, w, h, data_rows):
    raw_bytes = bytearray()
    for row in data_rows:
        raw_bytes.append(0)
        raw_bytes.extend(row)
    compressed = zlib.compress(raw_bytes, 9)
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr_data = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', len(ihdr_data)))
    png.extend(b'IHDR')
    png.extend(ihdr_data)
    png.extend(struct.pack('>I', ihdr_crc))
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png.extend(struct.pack('>I', len(compressed)))
    png.extend(b'IDAT')
    png.extend(compressed)
    png.extend(struct.pack('>I', idat_crc))
    iend_crc = zlib.crc32(b'IEND')
    png.extend(struct.pack('>I', 0))
    png.extend(b'IEND')
    png.extend(struct.pack('>I', iend_crc))
    with open(path, 'wb') as f:
        f.write(png)
    print(f"Saved {path} ({w}x{h}, {len(png)} bytes)")

cropped_rows = []
for y in range(cy - crop_r, cy + crop_r):
    row = bytearray(crop_size * 4)
    if 0 <= y < h:
        for x_idx, x in enumerate(range(cx - crop_r, cx + crop_r)):
            if 0 <= x < w:
                for c in range(4):
                    row[x_idx * 4 + c] = pixels[y][x * 4 + c]
    cropped_rows.append(row)

# Save to both public and src assets
write_png('src/assets/wheel_isolated.png', crop_size, crop_size, cropped_rows)
write_png('public/assets/Wheel/wheel_isolated.png', crop_size, crop_size, cropped_rows)
