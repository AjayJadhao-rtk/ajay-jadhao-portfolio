from find_true_wheel_center import read_png_full
import zlib
import struct

wr, hr, _, pr = read_png_full('public/assets/Building and grass/extracted_ref.png')
print(f"Reference: {wr}x{hr}")

# Find where the trees start vertically in extracted_ref.png:
# Trees are predominantly green/olive/dark foliage in the bottom half
# Let's inspect rows from y=900 to 1642:
tree_top_y = 9999
for y in range(900, hr):
    for x in range(0, wr):
        a = pr[y][x*4 + 3]
        if a > 50:
            r = pr[y][x*4]
            g = pr[y][x*4+1]
            b = pr[y][x*4+2]
            # Tree colors: green > blue + 5, or dark olive (g > b and r < 140)
            is_tree = (g > b + 3 and g > 30 and r < 160) or (r < 70 and g < 70 and b < 60 and y > 1100)
            if is_tree:
                if y < tree_top_y:
                    tree_top_y = y
                    print(f"First tree pixel at y={tree_top_y}, x={x}, RGB=({r},{g},{b})")
                break
    if tree_top_y < 9999 and y > tree_top_y + 10:
        break

print(f"Trees start around y = {tree_top_y} in {wr}x{hr}")
