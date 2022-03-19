## install fonts
- sudo pacman -S noto-fonts-cjk (구글의 Noto 한중일 통합 폰트 최근에는 한글 Serif체도 포함되어 더욱 좋아졌다)
- sudo yaourt -S ttf-nanum (가장 유명한 네이버의 나눔 폰트)
- terminal - dejavu sans mono for powerline

## 한글 입력
- fcitx 설치
- kde application 에서는 kcm-fcitx 를 추가로 설치해야 한글을 입력할 수 있음.
==> kde 버전인 경우 이것만 설치해도 된다.
- kime 라는 한국 개발자가 만든 ime 를 설치해봤는데 아주 간단하게 설정이 가능하다.(https://github.com/Riey/kime)
- 놀랍게도 아무리 해도 해결할 수 없었던 jetbrains projector 를 이용한 리모트 개발도구에서도 한글 띄어쓰기가 아주 정확하게 동작한다!
- fcitx 는 이제 안써도 될듯 ㅎㅎ

## 키크론 fn 키 관련 이슈
- k3 를 사용중인데 fn 키가 동작하지 않는다.
> 임시방편(재시작시 초기화) `echo 0 >> /sys/module/hid_apple/parameters/fnmode`  

> 영구적용 `/etc/modprobe.d/hid_apple.conf` 에 `options hid_apple fnmode=0` 추가
> sudo mkinitcpio -P 실행 후 재시작

## tmux zsh 설정
- .tmux.conf 에 다음 라인 추가
- set -g default-command "/usr/bin/zsh"

## 저장소 업데이트
- sudo pacman-mirrors --country all

## 기본 컴파일을 위한 도구 설치
- sudo pacman -S base-devel
