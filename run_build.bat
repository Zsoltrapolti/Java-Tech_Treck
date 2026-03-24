@echo off

set APP_VERSION=
set BUILD_NUMBER=

echo ===================================================


powershell -Command "$file='.env'; $v='1.0.0'; $b=0; if(Test-Path $file){ foreach($l in Get-Content $file){ if($l -match '^APP_VERSION=(.*)'){ $v=$matches[1].Trim() }; if($l -match '^BUILD_NUMBER=(.*)'){ $val=$matches[1].Trim(); if($val -ne ''){ $b=[int]$val } } } }; $b++; Set-Content $file -Value \"APP_VERSION=$v`nBUILD_NUMBER=$b\"; Write-Host \"  Pornim build-ul pentru: $v-b$b\" -ForegroundColor Cyan"

echo ===================================================


docker-compose up --build -d