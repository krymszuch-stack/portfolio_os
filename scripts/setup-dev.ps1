<# PowerShell setup script for Windows developers #>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "Starting setup-dev.ps1..."
# Check node
$node = & node -v 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Node not found in PATH. Please install Node 18+ (nvm recommended)." -ForegroundColor Yellow
  exit 1
}
Write-Host "Found Node version: $node"

# Install dependencies reproducibly
if (Test-Path package-lock.json) {
  Write-Host "Installing dependencies via npm ci..."
  npm ci
} else {
  Write-Host "No package-lock.json found — running npm install..."
  npm install
}

# Run lint and tests if available (non-fatal)
try {
  if (Get-Command npm -ErrorAction SilentlyContinue) {
    if ((npm run | Out-String) -match "lint") {
      Write-Host "Running lint..."
      npm run lint
    }
    if ((npm run | Out-String) -match "test") {
      Write-Host "Running tests..."
      npm run test
    }
  }
} catch {
  Write-Warning "Lint or tests failed locally; continue if you want to iterate. Error: $_"
}

Write-Host "Setup complete. Start the dev server with: npm run dev" -ForegroundColor Green
