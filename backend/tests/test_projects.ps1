# ----------------------------
# Configuration
# ----------------------------
$baseUrl  = "http://localhost:8000"
$email    = "asma.test3@gmail.com"
$password = "TestPass123!"

# ----------------------------
# 1️⃣ Login
# ----------------------------
Write-Host "🔐 Logging in..." -ForegroundColor Cyan

$loginBody = @{
    email    = $email
    password = $password
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod `
    -Uri "$baseUrl/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = $loginResponse.access_token
Write-Host "✅ Login successful! Token: $($token.Substring(0, 20))..." -ForegroundColor Green

# ----------------------------
# 2️⃣ Create a new project
# ----------------------------
Write-Host "`n📝 Creating a new project..." -ForegroundColor Cyan

$projectBody = @{
    name        = "Test Project $(Get-Date -Format 'yyyyMMdd_HHmmss')"
    description = "Testing multiple endpoints"
} | ConvertTo-Json

$createdProject = Invoke-RestMethod `
    -Uri "$baseUrl/api/projects/" `
    -Method POST `
    -Body $projectBody `
    -ContentType "application/json" `
    -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "✅ Project created!" -ForegroundColor Green
Write-Host ($createdProject | ConvertTo-Json -Depth 3)

# ----------------------------
# 3️⃣ List all projects
# ----------------------------
Write-Host "`n📋 Listing all projects..." -ForegroundColor Cyan

$projects = Invoke-RestMethod `
    -Uri "$baseUrl/api/projects/" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "✅ Found $($projects.Count) project(s):" -ForegroundColor Green
Write-Host ($projects | ConvertTo-Json -Depth 3)

# ----------------------------
# 4️⃣ Update a project
# ----------------------------
Write-Host "`n✏️ Updating the first project..." -ForegroundColor Cyan

$firstProjectId = $projects[0].id

$updateBody = @{
    name        = "Updated Project $(Get-Date -Format 'HHmmss')"
    description = "Updated via PowerShell"
} | ConvertTo-Json

$updatedProject = Invoke-RestMethod `
    -Uri "$baseUrl/api/projects/$firstProjectId" `
    -Method PUT `
    -Body $updateBody `
    -ContentType "application/json" `
    -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "✅ Project updated!" -ForegroundColor Green
Write-Host ($updatedProject | ConvertTo-Json -Depth 3)

# ----------------------------
# 5️⃣ Delete a project
# ----------------------------
Write-Host "`n🗑️ Deleting the first project..." -ForegroundColor Cyan

Invoke-RestMethod `
    -Uri "$baseUrl/api/projects/$firstProjectId" `
    -Method DELETE `
    -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "✅ Project deleted!" -ForegroundColor Green
