$txt = [System.IO.File]::ReadAllText('diagrams/lvl0.drawio.svg')
# Find first <g data-cell-id
$idx = $txt.IndexOf('<g data-cell-id=')
if ($idx -ge 0) {
    Write-Output $txt.Substring($idx, [Math]::Min(2000, $txt.Length - $idx))
}

