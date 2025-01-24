## 로그인 관리자 초기화 지연
sudo systemctl edit lightdm.service 실행 후 아래 항목 추가

```
[Service]
ExecStartPre=/bin/sleep 5
```
