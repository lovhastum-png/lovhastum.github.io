param([string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot))

$ErrorActionPreference = "Stop"
$checks = [System.Collections.Generic.List[object]]::new()

function Add-Check([string]$Name, [bool]$Passed, [string]$Detail) {
  $checks.Add([pscustomobject]@{ Check = $Name; Passed = $Passed; Detail = $Detail })
}

$indexPath = Join-Path $ProjectRoot "index.html"
$scriptPath = Join-Path $ProjectRoot "src/js/main.js"
$cssPaths = @("src/css/base.css", "src/css/layout.css", "src/css/components.css", "src/css/pages.css", "src/css/animations.css") | ForEach-Object { Join-Path $ProjectRoot $_ }
$index = Get-Content -Raw -Encoding UTF8 $indexPath
$script = Get-Content -Raw -Encoding UTF8 $scriptPath
$css = ($cssPaths | ForEach-Object { Get-Content -Raw -Encoding UTF8 $_ }) -join "`n"

$navBlock = [regex]::Match($index, '<nav class="nav-list"[\s\S]*?</nav>').Value
$navCount = ([regex]::Matches($navBlock, '<button')).Count
Add-Check "Five primary nav items" ($navCount -eq 5) "found $navCount"

$entryMarkers = @('data-panel="feeling"', 'data-go="lab"', 'data-panel="inspiration"')
$missingEntries = $entryMarkers | Where-Object { $script -notmatch [regex]::Escape($_) }
Add-Check "Three home entry paths" ($missingEntries.Count -eq 0) "feeling / lab / index"

$knowledgeBlock = [regex]::Match($script, 'const knowledgeRows = \[([\s\S]*?)\];\s*\n\s*const articles').Groups[1].Value
$knowledgeCount = ([regex]::Matches($knowledgeBlock, '^\s*\["', [Text.RegularExpressions.RegexOptions]::Multiline)).Count
Add-Check "At least 50 knowledge entries" ($knowledgeCount -ge 50) "found $knowledgeCount"

$emotionBlock = [regex]::Match($script, 'const emotions = \[([\s\S]*?)\];\s*\n\s*const supplyItems').Groups[1].Value
$emotionCount = ([regex]::Matches($emotionBlock, 'name:')).Count
Add-Check "Eight emotion reagents" ($emotionCount -eq 8) "found $emotionCount"

Add-Check "No range-based lab" ($index -notmatch 'type="range"' -and $script -notmatch 'type="range"') "no range input"
Add-Check "No click-to-auto-recycle" ($script -notmatch 'addEventListener\("click"[^\n]*recycleLabel') "pointer drop only"
Add-Check "No full rerender on interactions" (([regex]::Matches($script, '\brender\(\)')).Count -le 2) "definition plus initialization only"
Add-Check "Background preloading" ($index -match 'rel="preload"' -and $script -match 'preloadCache\.set') "HTML and JS preload"
$sceneFunction = [regex]::Match($script, 'function scene\([\s\S]*?\n  \}').Value
$sceneBuffers = ([regex]::Matches($index, 'data-scene-buffer=')).Count
Add-Check "Persistent background outside page templates" ($sceneBuffers -eq 2 -and $sceneFunction -notmatch 'scene-background') "two buffers; page template has no background image"
Add-Check "Background source changes only on route switch" (([regex]::Matches($script, '\.src\s*=\s*backgrounds\[')).Count -eq 1) "one guarded route-level source write"
Add-Check "Old attendant UI removed" ($script -notmatch 'obj-attendant' -and $script -match 'window-note-panel') "window note scene enabled"
Add-Check "Animation cleanup" ($script -match 'cancelAnimationFrame' -and $script -match 'cleanup\.push') "route cleanup present"
Add-Check "Balanced CSS braces" (([regex]::Matches($css, '\{')).Count -eq ([regex]::Matches($css, '\}')).Count) "brace counts match"

$requiredAssets = @(
  "src/assets/backgrounds/bg-home-night-creek.webp",
  "src/assets/backgrounds/bg-breath-water.webp",
  "src/assets/backgrounds/bg-card-tabletop.webp",
  "src/assets/backgrounds/bg-desk-courtyard.webp",
  "src/assets/backgrounds/bg-explore-stream.webp",
  "src/assets/backgrounds/bg-lab-night-studio.webp",
  "src/assets/backgrounds/bg-labels-wall.webp",
  "src/assets/backgrounds/bg-release-room.webp",
  "src/assets/backgrounds/bg-supply-environment.webp",
  "src/assets/backgrounds/bg-window-lakeside.webp",
  "src/assets/objects/obj-vial-fear.png"
)
$missingAssets = $requiredAssets | Where-Object { -not (Test-Path -LiteralPath (Join-Path $ProjectRoot $_)) }
Add-Check "Core assets exist" ($missingAssets.Count -eq 0) "missing $($missingAssets.Count)"

$nodeCheck = & node --check $scriptPath 2>&1
Add-Check "JavaScript syntax" ($LASTEXITCODE -eq 0) ($(if ($LASTEXITCODE -eq 0) { "passed" } else { $nodeCheck -join " " }))

$checks | Format-Table -AutoSize
$failed = @($checks | Where-Object { -not $_.Passed })
if ($failed.Count) {
  Write-Error "Self-check failed: $($failed.Count)"
  exit 1
}

Write-Host "All $($checks.Count) static checks passed."
