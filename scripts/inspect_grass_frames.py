from find_true_wheel_center import read_png_full

# Compare extracted_ref.png and extracted_building.png
# Let's inspect extracted_grass.png to locate:
# 1. Row 2: Wind animation frames 1 to 6
# 2. Row 1: Tree clusters
# 3. How Reference.svg composes the buildings and trees

w_g, h_g, bpp_g, pixels_g = read_png_full('public/assets/Building and grass/extracted_grass.png')
print(f"Grass sheet: {w_g}x{h_g}")

# In extracted_grass.png, let's find the vertical bounds of the rows:
# The sheet has headers like "1. TREE CLUSTERS", "2. WIND ANIMATION", etc.
# Let's sample along horizontal lines to find empty/separator regions between rows
row_activity = []
for y in range(0, h_g, 10):
    active_count = 0
    for x in range(0, w_g, 10):
        a = pixels_g[y][x*4 + 3]
        if a > 20:
            active_count += 1
    row_activity.append((y, active_count))

print("Sampling row activity:")
for y, c in row_activity:
    if y % 100 == 0:
        print(f"y={y}: active={c}")
