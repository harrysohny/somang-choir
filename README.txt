소망 찬양대 앱 관리자 V2

이번 버전에서 실제로 작동하는 기능(브라우저 localStorage 기반)
- 최고관리자 센터
- 가입 승인 / 거절
- 대원별 역할 및 세부권한 부여
- 연간 찬양곡 추가 / 수정 / 삭제
- 전체 / 파트 공지 추가 / 수정 / 삭제
- 기도당번 수정
- 승인된 대원명단 표시
- 최고관리자 바로가기

중요
- 현재는 서버 DB가 아니라 각 브라우저 내부 localStorage에 저장됩니다.
- 따라서 여러 대원이 서로 다른 휴대폰에서 입력한 내용이 공유되지는 않습니다.
- 실제 다중 사용자 운영을 위해 다음 단계에서 Supabase 또는 Firebase 연결이 필요합니다.

GitHub 반영
1. ZIP 압축 해제
2. index.html / style.css / app.js / manifest.json / README.txt 를 기존 저장소에 덮어쓰기
3. Commit changes
