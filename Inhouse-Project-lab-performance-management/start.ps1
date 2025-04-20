# Start MySQL if not running
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService -and $mysqlService.Status -ne "Running") {
    Write-Host "Starting MySQL service..."
    Start-Service -Name "MySQL80"
    Start-Sleep -Seconds 5
}

# Function to start a process in a new window
function Start-ProcessInNewWindow {
    param(
        [string]$WorkingDirectory,
        [string]$Command
    )
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkingDirectory'; $Command"
}

# Start backend server
Write-Host "Starting backend server..."
Start-ProcessInNewWindow -WorkingDirectory "$PSScriptRoot\backend" -Command "npm start"

# Start frontend server
Write-Host "Starting frontend server..."
Start-ProcessInNewWindow -WorkingDirectory "$PSScriptRoot\frontend" -Command "npm run dev"

Write-Host "Both servers are starting..."
Write-Host "Frontend will be available at: http://localhost:5173"
Write-Host "Backend will be available at: http://localhost:3000" 