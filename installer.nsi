Name "Backend Installer"
OutFile "backend-installer.exe"
InstallDir "$PROGRAMFILES\YourAppName"

Section
SetOutPath $INSTDIR
File /r "path\to\your\backend\project\*"
SectionEnd
