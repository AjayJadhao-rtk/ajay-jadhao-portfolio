import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from find_true_wheel_center import read_png_full

print("Reading main design of hero section...")
w, h, _, p = read_png_full('IMAGES/Images/main design of hero section.png')
print(f"Main design: {w}x{h}")

# The character's face/hair is around x in [300, 700], y in [240, 600].
# Let's find dark pixels of hair (r < 70, g < 70, b < 70) and face (warm skin tones)
hair_pts = []
for y in range(240, 500, 2):
    for x in range(300, 700, 2):
        r = p[y][x*4]
        g = p[y][x*4+1]
        b = p[y][x*4+2]
        if r < 60 and g < 60 and b < 60:
            hair_pts.append((x, y))

min_x = min(pt[0] for pt in hair_pts)
max_x = max(pt[0] for pt in hair_pts)
min_y = min(pt[1] for pt in hair_pts)
max_y = max(pt[1] for pt in hair_pts)
print(f"Character hair bounding box in 1451x821: X in [{min_x}, {max_x}] (width: {max_x - min_x}), Y in [{min_y}, {max_y}] (height: {max_y - min_y})")

# Let's also check the bottom of the character's jacket
jacket_pts = []
for y in range(500, 821, 2):
    for x in range(200, 700, 2):
        r = p[y][x*4]
        g = p[y][x*4+1]
        b = p[y][x*4+2]
        # jacket is khaki/olive dark: r in [40, 110], g in [40, 100], b in [35, 90]
        if 30 < r < 120 and 30 < g < 110 and 25 < b < 95:
            jacket_pts.append((x, y))

j_min_x = min(pt[0] for pt in jacket_pts)
j_max_x = max(pt[0] for pt in jacket_pts)
j_min_y = min(pt[1] for pt in jacket_pts)
j_max_y = max(pt[1] for pt in jacket_pts)
print(f"Character jacket bounding box: X in [{j_min_x}, {j_max_x}], Y in [{j_min_y}, {j_max_y}]")
print(f"Full Character: X in [{min(min_x, j_min_x)}, {max(max_x, j_max_x)}], Y in [{min_y}, {j_max_y}]")
