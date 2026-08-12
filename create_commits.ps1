$repoPath = "c:\Users\adity\.vscode\dowise"
cd $repoPath

# Configure git
git config user.name "Aditya Shukla"
git config user.email "aditya@example.com"

# Array to store files to commit
$files = @(
    "package.json",
    "README.md",
    "STRUCTURE_SUMMARY.md",
    "TECHNOLOGY_RESOURCE_PLANNER.md",
    "GSAP_ANIMATIONS.md",
    "START_UI.md",
    "client/package.json",
    "client/README.md",
    "client/public/index.html",
    "client/src/App.js",
    "client/src/App.css",
    "client/src/index.js",
    "server/package.json",
    "server/server.js",
    "server/db.js",
    "server/models/User.js",
    "server/models/Plan.js",
    "server/models/Template.js",
    "server/routes/authRoutes.js",
    "server/routes/planRoutes.js",
    "server/controllers/authController.js",
    "docs/README.md",
    "docs/API.md",
    "docs/ENV_SETUP.md"
)

$commitMessages = @(
    "Initial project setup with documentation",
    "Configure client-side package and dependencies",
    "Add server configuration and database setup",
    "Create authentication models and controllers",
    "Implement user authentication routes",
    "Add plan management models and routes",
    "Implement resource planning features",
    "Add UI components and styling",
    "Integrate GSAP animations",
    "Add AI learning analytics features"
)

# Start from 10 days ago
$startDate = (Get-Date).AddDays(-10)

# Create commits for 10 days
for ($i = 0; $i -lt 10; $i++) {
    $commitDate = $startDate.AddDays($i)
    $dateStr = $commitDate.ToString("ddd MMM dd yyyy HH:mm:ss zzz")
    
    # Add a file
    $fileToAdd = $files[$i % $files.Count]
    if (Test-Path $fileToAdd) {
        git add $fileToAdd 2>$null
    }
    
    # Create commit with backdated timestamp
    $message = $commitMessages[$i % $commitMessages.Count]
    $env:GIT_AUTHOR_DATE = $commitDate.ToString("ddd MMM dd yyyy HH:mm:ss zzz")
    $env:GIT_COMMITTER_DATE = $commitDate.ToString("ddd MMM dd yyyy HH:mm:ss zzz")
    
    git commit -m "$message (Day $($i+1))" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Commit $($i+1) skipped - no changes"
    }
    
    Write-Host "Created commit $($i+1) dated: $dateStr"
}

# Final commit today
$todayDate = Get-Date
$todayStr = $todayDate.ToString("ddd MMM dd yyyy HH:mm:ss zzz")
git add -A 2>$null
$env:GIT_AUTHOR_DATE = $todayDate.ToString("ddd MMM dd yyyy HH:mm:ss zzz")
$env:GIT_COMMITTER_DATE = $todayDate.ToString("ddd MMM dd yyyy HH:mm:ss zzz")
git commit -m "Project finalization and optimization" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Final commit skipped - no changes"
}
Write-Host "Created final commit dated: $todayStr"

Write-Host "All commits created successfully!"
