from find_true_wheel_center import read_png_full
import zlib
import struct

wr, hr, bpp, pr = read_png_full('public/assets/Building and grass/extracted_ref.png')
wb, hb, _, pb = read_png_full('public/assets/Building and grass/extracted_building.png')

print(f"Ref: {wr}x{hr}, Building: {wb}x{hb}")

# Let's create trees_layer:
# In Reference, everything below the tree crown skyline that is foliage:
# Let's extract trees_rows (wr x hr) where pixels belonging to trees are kept,
# and sky / upper buildings are transparent!
# Let's inspect tree colors vs building colors:
# Tree colors in Reference:
# Foliage is organic green, olive, dark moss, amber-lit tree tops.
# Buildings are cool concrete gray, light beige, glass with orange windows.

# Notice that the trees crown starts between y=918 and y=1100.
# Above y=900, there are NO trees at all (only buildings, dish, birds, sky)!
# Below y=1200, it is almost entirely trees across the bottom!
# Between y=900 and 1250, trees overlap the buildings.

tree_rows = []
building_rows = []

# We can create a mask:
# For each pixel, determine if it's tree foliage:
for y in range(hr):
    t_row = bytearray(wr * 4)
    b_row = bytearray(wr * 4)
    for x in range(wr):
        a = pr[y][x*4 + 3]
        if a > 10:
            r = pr[y][x*4]
            g = pr[y][x*4 + 1]
            b = pr[y][x*4 + 2]
            
            # Check if this pixel is tree foliage:
            # Tree foliage features:
            # 1. Must be in lower region y >= 900
            # 2. Foliage color: olive/green (g >= b and g > 25) or deep foliage shadow
            # 3. Satellite dish building is at x < 600, y between 900 and 1400 (concrete wall, dish)
            # In satellite dish building: gray wall r,g,b are close: |r-g|<8 and |g-b|<8 and not greenish
            
            is_building = False
            # Satellite dish facility walls on the left:
            if x < 720 and y < 1400:
                # concrete building floors and railings
                if abs(r - g) < 10 and abs(g - b) < 10 and g < 160:
                    is_building = True
                # dish itself
                if y < 1250 and x < 500:
                    is_building = True
            # High skyscraper towers:
            if y < 1200 and not (g > b + 15):
                is_building = True
                
            is_tree = (y >= 900) and not is_building
            
            if is_tree:
                for c in range(4):
                    t_row[x*4 + c] = pr[y][x*4 + c]
            else:
                for c in range(4):
                    b_row[x*4 + c] = pr[y][x*4 + c]
                    
    tree_rows.append(t_row)
    building_rows.append(b_row)

from separate_building_trees import write_png

write_png('src/assets/trees_animated.png', wr, hr, tree_rows)
write_png('src/assets/building_static.png', wr, hr, building_rows)
write_png('public/assets/Building and grass/trees_animated.png', wr, hr, tree_rows)
write_png('public/assets/Building and grass/building_static.png', wr, hr, building_rows)
print("Successfully generated separated trees_animated.png and building_static.png!")
