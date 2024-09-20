@echo off
for /d /r %%i in (migrations, __pycache__) do if exist "%%i" rd /s /q "%%i"
