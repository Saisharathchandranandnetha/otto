Get-ChildItem -Path apps\workflow-engine -Recurse -Filter package.json | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $new = [Text.RegularExpressions.Regex]::Replace($c, '"catalog:[^"]*"', '"*"')
    Set-Content $_.FullName $new
}
