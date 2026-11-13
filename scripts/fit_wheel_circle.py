from find_true_wheel_center import read_png_full
import math

w, h, bpp, pixels = read_png_full('public/assets/Wheel/extracted_base_image.png')

# The main circular ring:
# The wheel has a main circular torus/ring of radius around 200px.
# Let's find the inner edge and outer edge of this main ring across all angles!

ring_edge_points = []
for deg in range(0, 360, 2):
    rad = math.radians(deg)
    # Search along ray from (387, 377) from r=150 to r=280
    # Find strong edges: gradient of brightness or alpha
    ray_samples = []
    for r in range(150, 260):
        x = int(387 + r * math.cos(rad))
        y = int(377 + r * math.sin(rad))
        if 0 <= x < 800 and 0 <= y < 800:
            a = pixels[y][x*4 + 3]
            lum = 0.299*pixels[y][x*4] + 0.587*pixels[y][x*4+1] + 0.114*pixels[y][x*4+2] if a > 20 else 0
            ray_samples.append((r, x, y, a, lum))
            
    # Find outer edge of the solid rim (before teeth/antennas or where alpha drops)
    # The rim inner radius is ~165px, outer radius is ~215px
    for i in range(len(ray_samples)-2, 1, -1):
        r, x, y, a, lum = ray_samples[i]
        prev_a = ray_samples[i-1][3]
        if a > 100 and prev_a > 100 and 190 <= r <= 230:
            ring_edge_points.append((x, y))
            break

print(f"Collected {len(ring_edge_points)} rim edge points")

# Circle fit using Pratt / Kasa method:
# (x - xc)^2 + (y - yc)^2 = R^2
# Let's solve with basic python without numpy if needed
pts = ring_edge_points
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

# Linear equations for (xc, yc):
# (sum_x2 - sum_x^2/n) * 2*xc + (sum_xy - sum_x*sum_y/n) * 2*yc = (sum_x3 + sum_xy2) - sum_x*(sum_x2 + sum_y2)/n
# (sum_xy - sum_x*sum_y/n) * 2*xc + (sum_y2 - sum_y^2/n) * 2*yc = (sum_x2y + sum_y3) - sum_y*(sum_x2 + sum_y2)/n

a11 = 2 * (sum_x2 - sum_x**2 / n)
a12 = 2 * (sum_xy - sum_x * sum_y / n)
b1 = (sum_x3 + sum_xy2) - sum_x * (sum_x2 + sum_y2) / n

a21 = 2 * (sum_xy - sum_x * sum_y / n)
a22 = 2 * (sum_y2 - sum_y**2 / n)
b2 = (sum_x2y + sum_y3) - sum_y * (sum_x2 + sum_y2) / n

det = a11 * a22 - a12 * a21
true_cx = (b1 * a22 - b2 * a12) / det
true_cy = (a11 * b2 - a21 * b1) / det

radii = [math.hypot(p[0] - true_cx, p[1] - true_cy) for p in pts]
mean_r = sum(radii) / len(radii)
std_r = math.sqrt(sum((r - mean_r)**2 for r in radii) / len(radii))

print(f"BEST FIT CIRCLE:")
print(f"  Center: ({true_cx:.2f}, {true_cy:.2f})")
print(f"  Radius: {mean_r:.2f} px (std dev: {std_r:.2f} px)")
