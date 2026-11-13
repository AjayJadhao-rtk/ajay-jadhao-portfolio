from find_true_wheel_center import read_png_full
import math

w, h, bpp, pixels = read_png_full('public/assets/Wheel/extracted_base_image.png')

# 8 wheels arranged in 4 columns x 2 rows
# Cols: 0, 1, 2, 3 -> approximate x: 387, 1155, 1923, 2691
# Rows: 0, 1 -> approximate y: 378, 1242

col_xs = [387, 1155, 1923, 2691]
row_ys = [378, 1242]

angles = [0, 45, 90, 135, 180, 225, 270, 315]

wheel_centers = []

for idx, angle in enumerate(angles):
    approx_x = col_xs[idx % 4]
    approx_y = row_ys[idx // 4]
    
    # Search dark central axle points within 30px
    dark_pts = []
    for y in range(approx_y - 25, approx_y + 25):
        for x in range(approx_x - 25, approx_x + 25):
            r = pixels[y][x*4]
            g = pixels[y][x*4+1]
            b = pixels[y][x*4+2]
            lum = 0.299*r + 0.587*g + 0.114*b
            if lum < 55:
                dark_pts.append((x, y))
                
    if dark_pts:
        cx = sum(p[0] for p in dark_pts) / len(dark_pts)
        cy = sum(p[1] for p in dark_pts) / len(dark_pts)
        print(f"Wheel {idx+1} ({angle} deg): center = ({cx:.2f}, {cy:.2f})")
        wheel_centers.append((angle, cx, cy))
    else:
        print(f"Wheel {idx+1} ({angle} deg): not found near ({approx_x}, {approx_y})")
