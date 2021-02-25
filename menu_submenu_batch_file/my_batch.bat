echo This is just an example and will NOT work in your case
echo This is just an example and will NOT work in your case
echo This is just an example and will NOT work in your case

echo It will call an URL and save the result in curl_log.log

@echo off
IF "%~1" == "" GOTO SETRED
c:\curl\bin\curl.exe -sS http://192.168.1.222:8087/set/0_userdata.0.VpinColor?value=%1 > c:\pinbally\scripts\curl_log.log
exit

:SETRED
c:\curl\bin\curl.exe -sS http://192.168.1.222:8087/set/0_userdata.0.VpinColor?value=red > c:\pinbally\scripts\curl_log.log
exit