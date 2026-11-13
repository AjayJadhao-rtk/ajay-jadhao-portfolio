import zlib
import struct

def check_bg(path):
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
            print(f"IHDR: {w}x{h}, color_type={color_type}")
        elif chunk_type == b'IDAT':
            idat_chunks.append(chunk_data)
        elif chunk_type == b'IEND':
            break
            
    raw = zlib.decompress(b''.join(idat_chunks))
    bpp = 4 if color_type == 6 else 3
    stride = 1 + w * bpp
    print("bpp:", bpp)
    # Check top-left pixel (0, 0)
    # Filter 0 or reconstruct first line
    line0 = raw[1:1+w*bpp]
    print("Pixel (0,0):", list(line0[:bpp]))

check_bg('public/assets/Wheel/extracted_base_image.png')
