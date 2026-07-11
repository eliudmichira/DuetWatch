# build-firefox.ps1
# Produces DUET_FIREFOX.zip ready for submission to addons.mozilla.org (AMO).
#
# Usage (from repo root):
#   .\build-firefox.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot
$ExtDir   = Join-Path $RepoRoot "extension"
$BuildDir = Join-Path $RepoRoot ".build-firefox"
$OutZip   = Join-Path $RepoRoot "DUET_FIREFOX.zip"

Write-Host "==> Cleaning build dir..." -ForegroundColor Cyan
if (Test-Path $BuildDir) { Remove-Item $BuildDir -Recurse -Force }
New-Item -ItemType Directory -Path $BuildDir | Out-Null

Write-Host "==> Copying extension files..." -ForegroundColor Cyan
Copy-Item -Path "$ExtDir\*" -Destination $BuildDir -Recurse -Force

Write-Host "==> Swapping in Firefox manifest..." -ForegroundColor Cyan
Copy-Item -Path "$ExtDir\manifest.firefox.json" -Destination "$BuildDir\manifest.json" -Force

Write-Host "==> Removing Chrome-only files..." -ForegroundColor Cyan
# manifest.firefox.json was copied as manifest.json above; remove the extra copy
Remove-Item "$BuildDir\manifest.firefox.json" -Force -ErrorAction SilentlyContinue

Write-Host "==> Creating $OutZip with forward-slash paths (AMO requirement)..." -ForegroundColor Cyan
if (Test-Path $OutZip) { Remove-Item $OutZip -Force }

# AMO requires forward-slash paths inside the ZIP.
# PowerShell Compress-Archive uses backslashes on Windows and fails AMO validation.
# .NET ZipFile API always writes forward-slash paths — use that instead.
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipStream = [System.IO.File]::Open($OutZip, [System.IO.FileMode]::Create)
$archive   = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)

Get-ChildItem -Path $BuildDir -Recurse -File | ForEach-Object {
    $file        = $_.FullName
    $entryName   = $file.Substring($BuildDir.Length + 1).Replace('\', '/')
    $entry       = $archive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $fileStream  = [System.IO.File]::OpenRead($file)
    $fileStream.CopyTo($entryStream)
    $fileStream.Dispose()
    $entryStream.Dispose()
}

$archive.Dispose()
$zipStream.Dispose()

Write-Host ""
Write-Host "Done! Firefox ZIP: $OutZip" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Go to https://addons.mozilla.org/developers/"
Write-Host "  2. Submit New Add-on -> upload DUET_FIREFOX.zip"
Write-Host "  3. When asked for source code, upload the repo root (AMO requires it"
Write-Host "     if your extension contains any minified/vendor JS)"
Write-Host "  4. Privacy policy URL: https://pausepal-a4d71.web.app/privacy.html"
Write-Host ""
Write-Host "IMPORTANT: before submitting, lock the Firebase API key:" -ForegroundColor Red
Write-Host "  Cloud Console > APIs and Services > Credentials > your API key"
Write-Host "  Add HTTP referrer: moz-extension://*"
Write-Host "  (in addition to the existing chrome-extension://<id>/* referrer)"
