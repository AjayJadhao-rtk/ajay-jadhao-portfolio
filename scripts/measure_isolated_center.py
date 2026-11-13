from find_true_wheel_center import read_png_full
import math

w, h, bpp, pixels = read_png_full('public/assets/Wheel/wheel_isolated.png')
print(f"wheel_isolated.png: {w}x{h}")

# The image is 756x756. Its center is at (378, 378).
# Let's find the exact center of the axle hole in this 756x756 image:
# Search around (378, 378)
min_lum = 999
axle_points = []
for y in range(360, 396):
    for x in range(360, 396):
        r = pixels[y][x*4]
        g = pixels[y][x*4+1]
        b = pixels[y][x*4+2]
        lum = 0.299*r + 0.587*g + 0.114*b
        # The central hole is very dark / black
        if lum < 50:
            axle_points.append((x, y))

if axle_points:
    axle_cx = sum(p[0] for p in axle_points) / len(axle_points)
    axle_cy = sum(p[1] for p in axle_points) / len(axle_points)
    print(f"Axle hole center in 756x756: ({axle_cx:.2f}, {axle_cy:.2f})")
    print(f"Offset from image center (378, 378): dx = {axle_cx - 378:.2f} px, dy = {axle_cy - 378:.2f} px")

# Now let's detect the circular rim in 756x756:
rim_pts = []
for deg in range(0, 360, 2):
    rad = math.radians(deg)
    for r in range(180, 280):
        x = int(378 + r * math.cos(rad))
        y = int(378 + r * math.sin(rad))
        if 0 <= x < w and 0 <= y < h:
            a = pixels[y][x*4 + 3]
            # check outer edge of main rim
            if a > 100 and 210 <= r <= 245:
                rim_pts.append((x, y))
                break

if rim_pts:
    pts = rim_pts
    n = len(pts)
    sum_x = sum(p[0] for p in pts)
    sum_y = sum(p[1] for p in pts)
    sum_x2 = sum(p[0]**2 for p in pts)
    sum_y2 = sum(p[1]**2 for p in pts)
    sum_xy = sum(p[0]*p[1] for p in pts)
    sum_x3 = sum(p[0]**3 for p in pts)
    sum_y3 = sum(p[1]**3 for p in pts)
    sum_xy2 = sum(p[0]*(p[1]**2) for p in pts)
    sum_x2y = sum((p[0]**2)*p[1] for p in pts)
    a11 = 2 * (sum_x2 - sum_x**2 / n)
    a12 = 2 * (sum_xy - sum_x * sum_y / n)
    b1 = (sum_x3 + sum_xy2) - sum_x * (sum_x2 + sum_y2) / n
    a21 = 2 * (sum_xy - sum_x * sum_y / n)
    a22 = 2 * (sum_y2 - sum_y**2 / n)
    b2 = (sum_x2y + sum_y3) - sum_y * (sum_x2 + sum_y2) / n
    det = a11 * a22 - a12 * a21
    rcx = (b1 * a22 - b2 * a12) / det
    rcy = (a11 * b2 - a21 * b1) / det
    print(f"Rim circle center in 756x756: ({rcx:.2f}, {rcy:.2f})")
    print(f"Offset from image center (378, 378): dx = {rcx - 378:.2f} px, dy = {rcy - 378:.2f} px")
