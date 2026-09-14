param([string]$Version = "latest")
Write-Host "Installing Titan Production Suite v$Version..."
if ($IsWindows) {
    Invoke-WebRequest -Uri "https://github.com/263titan/titan-installer/releases/latest/download/Titan-Production-Suite-setup-x.x.x.exe" -OutFile "$env:TEMP\titan-installer.exe"
    Start-Process "$env:TEMP\titan-installer.exe" -ArgumentList "/S", "/D=$env:ProgramFiles\Titan Production Suite" -Wait
}
Write-Host "Installation complete!"
