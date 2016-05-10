
@Echo Off
chcp 866
for /r web %%i in (*.*) do (
	echo %%i
	tftp.exe -i 192.168.1.4 put %%i
)
cmd.exe
