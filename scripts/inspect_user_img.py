from detect_compass import read_png

w, h, bpp, pixels = read_png('C:/Users/itsru/.gemini/antigravity/brain/ad378062-1b5d-42da-9fa6-664f5332545c/.user_uploaded/media_1794594434791_5fd11067.jpg')
print(f"User image: {w}x{h}")

# The user image shows the rotated square at roughly x in [100, 500], y in [100, 500]
# Let's inspect what is at the center of that rotated square:
# In the user image, let's find pixels with green:
green_pixels = []
for y in range(h):
    for x in range(w):
        r = pixels[y][x*bpp]
        g = pixels[y][x*bpp+1]
        b = pixels[y][x*bpp+2]
        # vibrant green: g > r + 30 and g > b + 20
        if g > r + 30 and g > b + 20 and g > 100:
            green_pixels.append((x, y, r, g, b))

print(f"Found {len(green_pixels)} green pixels in user screenshot!")
if green_pixels:
    xs = [p[0] for p in green_pixels]
    ys = [p[1] for p in green_pixels]
    print(f"Green region: x in [{min(xs)}, {max(xs)}], y in [{min(ys)}, {max(ys)}]")
