from find_true_wheel_center import read_png_full
import zlib
import struct

wr, hr, bpp, pr = read_png_full('public/assets/Building and grass/extracted_ref.png')
print(f"Loaded Reference: {wr}x{hr}")

# Let's inspect the mask between the building/skyline and the trees:
# In extracted_ref.png, the trees are at the bottom.
# Let's create:
# 1. trees_layer: Contains all foliage pixels at the bottom
# 2. building_layer: Contains the buildings, dish, and skyline (with trees masked out or underneath)

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

# In extracted_building.png, we ALREADY have the isolated buildings and dish!
# Let's check: can we use extracted_building.png as building_layer.png?
# Let's inspect extracted_building.png size vs extracted_ref.png size!
