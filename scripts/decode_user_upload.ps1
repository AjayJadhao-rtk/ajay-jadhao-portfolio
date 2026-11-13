Add-Type -AssemblyName System.Drawing
$imgFile = "C:\Users\itsru\.gemini\antigravity\brain\ad378062-1b5d-42da-9fa6-664f5332545c\.user_uploaded\media_1794594434791_5fd11067.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($imgFile)
Write-Host "Width: $($bmp.Width) Height: $($bmp.Height)"

# Sample colors in the rotated shape area
$greenCount = 0
for ($y = 0; $y -lt $bmp.Height; $y += 5) {
    for ($x = 0; $x -lt $bmp.Width; $x += 5) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.G -gt ($c.R + 30) -and $c.G -gt ($c.B + 20) -and $c.G -gt 100) {
            $greenCount++
            if ($greenCount -le 5) {
                Write-Host "Green at ($x, $y): R=$($c.R), G=$($c.G), B=$($c.B)"
            }
        }
    }
}
Write-Host "Total green samples: $greenCount"

# Also save a converted PNG copy to artifacts folder so we can inspect it!
$bmp.Save("C:\Users\itsru\.gemini\antigravity\brain\ad378062-1b5d-42da-9fa6-664f5332545c\user_upload_decoded.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved user_upload_decoded.png"
$bmp.Dispose()
