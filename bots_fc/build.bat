@echo off
REM Genera bot1_futgg.exe y bot2_compras.exe en la carpeta dist\
REM Requisitos: Python 3.10+ en el PATH.
python -m pip install -r requirements.txt || goto :error

pyinstaller --noconfirm --clean --onefile --name bot1_futgg --collect-all playwright bot1_futgg.py || goto :error
pyinstaller --noconfirm --clean --onefile --name bot2_compras --collect-all playwright bot2_compras.py || goto :error

copy /Y config.json dist\config.json >nul
echo.
echo Listo. Los .exe y config.json estan en la carpeta dist\
exit /b 0

:error
echo.
echo Hubo un error en el build.
exit /b 1
