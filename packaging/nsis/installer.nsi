; NSIS script to create a single EXE that extracts to temp and runs the app
!define APPNAME "OfflineApp"
!define COMPANY "YourCompany"
!define VERSION "1.0.0"
!define EXENAME "OfflineApp.exe"

OutFile "..\OfflineApp.exe"
Name "${APPNAME} ${VERSION}"
RequestExecutionLevel user
ShowInstDetails nevershow
AutoCloseWindow true
SilentInstall silent

Var StartMenuFolder

Section "Main"
  SetOutPath "$TEMP\${APPNAME}"
  File /r "..\App\*.*"

  ; Run the launcher
  Exec '"$TEMP\${APPNAME}\runtime\run\start.bat"'

  ; Keep running; exit the installer quietly.
SectionEnd
