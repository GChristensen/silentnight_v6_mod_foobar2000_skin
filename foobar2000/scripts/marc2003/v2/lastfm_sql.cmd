@echo off
color 97
cls
echo ***************IMPORTANT***************
echo ***************************************
echo YOU MUST NOW CLOSE FOOBAR MANUALLY 
echo BEFORE YOU...
pause
cls
echo working....
%1sqlite3.exe %2 <%3
start foobar2000