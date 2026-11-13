from find_true_wheel_center import read_png_full
from separate_building_trees import write_png
import zlib
import struct

wr, hr, _, pr = read_png_full('public/assets/Building and grass/extracted_ref.png')
wb, hb, _, pb = read_png_full('public/assets/Building and grass/extracted_building.png')

print(f"Ref: {wr}x{hr}, Building: {wb}x{hb}")

# Building is 1536x864, Ref is 2919x1642.
# Notice: 2919 / 1536 = 1.90039, 1642 / 864 = 1.90046!
# Exactly 1.90x scale!
scale = wr / wb

# Let's upscale Building to wr x hr:
# So that each pixel in upscaled building matches Reference exactly!
building_full_rows = []
for y in range(hr):
    row = bytearray(wr * 4)
    orig_y = min(hb - 1, int(y / scale))
    for x in range(wr):
        orig_x = min(wb - 1, int(x / scale))
        for c in range(4):
            row[x*4 + c] = pb[orig_y][orig_x*4 + c]
    building_full_rows.append(row)

# Save building_static at full 2919x1642 resolution!
write_png('src/assets/building_static_clean.png', wr, hr, building_full_rows)
write_png('public/assets/Building and grass/building_static_clean.png', wr, hr, building_full_rows)

# Now, pure trees canopy:
# In Reference, trees are located at the bottom (y > 900).
# A pixel belongs to trees if:
# - In Reference, it has color (alpha > 30)
# - AND it's either in the tree region (y > 950) where building has no pixels or where reference has green/amber tree foliage!
tree_rows = []
for y in range(hr):
    row = bytearray(wr * 4)
    if y >= 900:
        for x in range(wr):
            a_ref = pr[y][x*4 + 3]
            if a_ref > 20:
                r_ref = pr[y][x*4]
                g_ref = pr[y][x*4 + 1]
                b_ref = pr[y][x*4 + 2]
                
                # Check upscaled building at (x, y):
                a_bldg = building_full_rows[y][x*4 + 3]
                
                # If building is transparent here, or if reference is tree foliage:
                is_tree = False
                if a_bldg < 50:
                    is_tree = True
                else:
                    # In building area: check if this pixel is foliage covering building
                    # Tree foliage is noticeably darker or greener than building concrete
                    r_b = building_full_rows[y][x*4]
                    g_b = building_full_rows[y][x*4+1]
                    b_b = building_full_rows[y][x*4+2]
                    # If reference is much darker than building (shadow foliage) or different color:
                    diff = abs(r_ref - r_b) + abs(g_ref - g_b) + abs(b_ref - b_b)
                    if diff > 35 and (g_ref > b_ref or (r_ref < 90 and g_ref < 90)):
                        is_tree = True
                
                # Exclude satellite dish and upper building walls:
                if x < 480 and y < 1300:
                    is_tree = False
                    
                if is_tree:
                    for c in range(4):
                        row[x*4 + c] = pr[y][x*4 + c]
    tree_rows.append(row)

write_png('src/assets/trees_clean.png', wr, hr, tree_rows)
write_png('public/assets/Building and grass/trees_clean.png', wr, hr, tree_rows)
print("Finished creating clean building and trees assets!")
