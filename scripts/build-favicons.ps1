Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$srcPath = Join-Path $root "public\bn-mark.png"
if (-not (Test-Path $srcPath)) {
  throw "Kaynak yok: $srcPath"
}

$src = [System.Drawing.Image]::FromFile($srcPath)

function Save-Png([int]$size, [string]$dest) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Black)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.DrawImage($src, 0, 0, $size, $size)
  $dir = Split-Path -Parent $dest
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "yazildi $dest"
}

Save-Png 48 (Join-Path $root "public\favicon-48.png")
Save-Png 96 (Join-Path $root "public\favicon-96.png")
Save-Png 192 (Join-Path $root "public\favicon-192.png")
Save-Png 512 (Join-Path $root "public\favicon-512.png")
Save-Png 180 (Join-Path $root "public\apple-touch-icon.png")
Save-Png 192 (Join-Path $root "app\icon.png")
Save-Png 180 (Join-Path $root "app\apple-icon.png")

$src.Dispose()
