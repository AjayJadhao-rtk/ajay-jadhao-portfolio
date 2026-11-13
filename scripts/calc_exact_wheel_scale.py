import zlib
import struct

# Compare wheel size in reference image vs wheel_isolated.png
# In reference image, let's find the radius of the outer gear ring
with open('public/assets/Wheel/Wheel placement reference image.png', 'rb') as f:
    data = f.read()

# Let's inspect gear teeth positions around cx=412, cy=283
# Specifically at y=283 - r (top vertical spoke)
# In reference image, top vertical spoke has an antenna tip at top
# Let's find highest pixel (min y) of the wheel in reference image at x=412
from detect_compass import read_png

w, h, bpp, pixels = read_png('public/assets/Wheel/Wheel placement reference image.png')
cx, cy = 412, 283

# Along column 412, find top pixel of the spoke:
spoke_top_y = None
for y in range(50, 283):
    pr, pg, pb = pixels[y][412*bpp], pixels[y][412*bpp+1], pixels[y][412*bpp+2]
    if pr < 180 and pg < 180 and pb < 180:
        spoke_top_y = y
        break

print(f"Top of spoke in reference image: y={spoke_top_y}, distance from cy={cy - spoke_top_y} px")

# Along column 412, find bottom of spoke:
spoke_bottom_y = None
for y in range(800, 283, -1):
    pr, pg, pb = pixels[y][412*bpp], pixels[y][412*bpp+1], pixels[y][412*bpp+2]
    if pr < 180 and pg < 180 and pb < 180:
        spoke_bottom_y = y
        break

print(f"Bottom of spoke in reference image: y={spoke_bottom_y}, distance from cy={spoke_bottom_y - cy} px")

# Now let's check wheel_isolated.png:
w_iso, h_iso, bpp_iso, pixels_iso = read_png('public/assets/Wheel/wheel_isolated.png')
cx_iso, cy_iso = w_iso // 2, h_iso // 2
iso_top_y = None
for y in range(0, cy_iso):
    a = pixels_iso[y][cx_iso*4 + 3]
    if a > 30:
        iso_top_y = y
        break

iso_bottom_y = None
for y in range(h_iso - 1, cy_iso, -1):
    a = pixels_iso[y][cx_iso*4 + 3]
    if a > 30:
        iso_bottom_y = y
        break

print(f"In wheel_isolated.png ({w_iso}x{h_iso}):")
print(f"  Top of spoke: y={iso_top_y}, distance from cy={cy_iso - iso_top_y} px")
print(f"  Bottom of spoke: y={iso_bottom_y}, distance from cy={iso_bottom_y - cy_iso} px")

# Desired radius in 1451x821 canvas:
ref_dist = (cy - spoke_top_y)
iso_dist = (cy_iso - iso_top_y)
scale = ref_dist / iso_dist
display_size = w_iso * scale
print(f"Scale factor: {scale:.4f}, Wheel display width/height: {display_size:.1f} px (half: {display_size/2:.1f} px)")
