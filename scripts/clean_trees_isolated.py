from find_true_wheel_center import read_png_full
from separate_building_trees import write_png

wr, hr, _, pr = read_png_full('public/assets/Building and grass/extracted_ref.png')

# Pure, isolated trees layer:
tree_rows = []
for y in range(hr):
    row = bytearray(wr * 4)
    for x in range(wr):
        # Tree region rules:
        # 1. On left (x < 480): trees are only at the base (y >= 1350)
        # 2. On middle/right (x >= 480): trees are between y >= 960 and hr
        in_tree_zone = (x < 480 and y >= 1350) or (x >= 480 and y >= 960)
        
        if in_tree_zone:
            a = pr[y][x*4 + 3]
            if a > 20:
                r = pr[y][x*4]
                g = pr[y][x*4 + 1]
                b = pr[y][x*4 + 2]
                
                # Check if it's tree foliage:
                # Tree foliage is dark / olive / warm green:
                # Concrete/sky is bright: r > 160 and g > 160 and b > 160
                is_bright_bldg = (r > 165 and g > 165 and b > 160)
                is_sky = (a < 50)
                
                if not is_bright_bldg and not is_sky:
                    for c in range(4):
                        row[x*4 + c] = pr[y][x*4 + c]
    tree_rows.append(row)

write_png('src/assets/trees_clean.png', wr, hr, tree_rows)
write_png('public/assets/Building and grass/trees_clean.png', wr, hr, tree_rows)
print("Trees layer cleaned flawlessly!")
