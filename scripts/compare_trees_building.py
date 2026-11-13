from find_true_wheel_center import read_png_full

wb, hb, _, pb = read_png_full('public/assets/Building and grass/extracted_building.png')
wr, hr, _, pr = read_png_full('public/assets/Building and grass/extracted_ref.png')

print(f"Building: {wb}x{hb}")
print(f"Reference: {wr}x{hr}")

# In extracted_building.png (1536x864):
# Does it have trees at the bottom or are they buildings down to the bottom?
# Let's inspect along y = hb - 50:
for x in range(100, wb, 200):
    a = pb[hb - 50][x*4 + 3]
    r = pb[hb - 50][x*4]
    g = pb[hb - 50][x*4+1]
    b = pb[hb - 50][x*4+2]
    print(f"Building bottom x={x}: a={a}, RGB=({r},{g},{b})")

# In extracted_ref.png (2919x1642):
# Let's check difference: (Reference - Building)
# In Reference, the trees are at the bottom.
