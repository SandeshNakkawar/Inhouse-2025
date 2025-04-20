# Test API endpoints
$apiUrl = "http://localhost:3000/api"

# Login
$loginBody = @{
    email = "bob@example.com"
    password = "teacher123"
} | ConvertTo-Json

Write-Host "Logging in..."
$loginResponse = Invoke-WebRequest -Uri "$apiUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.data.token

if (-not $token) {
    Write-Host "Login failed: No token received"
    exit 1
}

Write-Host "Login successful, got token"

# Create assessment
$assessmentBody = @{
    studentRollNo = "23101"
    experimentNo = 1
    rppMarks = 4
    spoMarks = 3
    assignmentMarks = 8
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Creating assessment..."
try {
    $createResponse = Invoke-WebRequest -Uri "$apiUrl/assessments" -Method Post -Headers $headers -Body $assessmentBody
    $createData = $createResponse.Content | ConvertFrom-Json
    Write-Host "Assessment created successfully:"
    Write-Host ($createData | ConvertTo-Json)
} catch {
    Write-Host "Error creating assessment:"
    Write-Host $_.Exception.Response.StatusCode.value__
    Write-Host $_.Exception.Response.StatusDescription
    Write-Host $_.ErrorDetails.Message
}

# Get student assessments
Write-Host "`nFetching student assessments..."
try {
    $studentResponse = Invoke-WebRequest -Uri "$apiUrl/assessments/student/23101" -Method Get -Headers $headers
    $studentData = $studentResponse.Content | ConvertFrom-Json
    Write-Host "Student assessments:"
    Write-Host ($studentData | ConvertTo-Json)
} catch {
    Write-Host "Error fetching student assessments:"
    Write-Host $_.Exception.Response.StatusCode.value__
    Write-Host $_.Exception.Response.StatusDescription
    Write-Host $_.ErrorDetails.Message
}

# Get batch assessments
Write-Host "`nFetching batch assessments..."
try {
    $batchResponse = Invoke-WebRequest -Uri "$apiUrl/assessments/batch/1" -Method Get -Headers $headers
    $batchData = $batchResponse.Content | ConvertFrom-Json
    Write-Host "Batch assessments:"
    Write-Host ($batchData | ConvertTo-Json)
} catch {
    Write-Host "Error fetching batch assessments:"
    Write-Host $_.Exception.Response.StatusCode.value__
    Write-Host $_.Exception.Response.StatusDescription
    Write-Host $_.ErrorDetails.Message
} 