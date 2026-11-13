from find_true_wheel_center import read_png_full

# Let's check dimensions of extracted_building.png and extracted_ref.png
w_b, h_b, _, _ = read_png_full('public/assets/Building and grass/extracted_building.png')
w_r, h_r, _, _ = read_png_full('public/assets/Building and grass/extracted_ref.png')
w_g, h_g, _, _ = read_png_full('public/assets/Building and grass/extracted_grass.png')

print(f"extracted_building.png: {w_b}x{h_b}")
print(f"extracted_ref.png: {w_r}x{h_r}")
print(f"extracted_grass.png: {w_g}x{h_g}")
