
const state = {
  currentPage:'home',
  user: JSON.parse(localStorage.getItem('somangUser') || 'null') || {
    name:'Harry Sohn',
    title:'최고관리자',
    part:'Tenor',
    phone:'',
    status:'approved',
    role:'superadmin',
    permissions:['all']
  },
  songs:[
    {date:'2026-09-13', title:'주 하나님 지으신 모든 세계', special:'주일', live:'#'},
    {date:'2026-09-20', title:'은혜 아니면', special:'주일', live:''},
    {date:'2026-09-27', title:'내 영혼이 은총 입어', special:'주일', live:''},
    {date:'2026-10-04', title:'찬양곡 예정', special:'주일', live:''}
  ],
  prayers:[
    {date:'2026-09-17 / 09-20', thuStart:'김○○', thuEnd:'이○○', sunStart:'박○○', sunEnd:'최○○'}
  ],
  notices:[
    {scope:'전체',title:'목요일 정기연습 안내',date:'2026-09-10'},
    {scope:'Tenor',title:'테너 파트 사전연습 안내',date:'2026-09-09'}
  ],
  members:[
    {name:'김○○',title:'장로',part:'Soprano'},
    {name:'이○○',title:'권사',part:'Alto'},
    {name:'박○○',title:'집사',part:'Tenor'},
    {name:'최○○',title:'집사',part:'Bass'}
  ]
};

function isSuperAdmin(){
  return state.user && (state.user.role === 'superadmin' || (state.user.permissions||[]).includes('all'));
}
function adminBadge(){
  return isSuperAdmin() ? '<span class="tag" style="background:#fff3d9;color:#7a4f00">SUPER ADMIN</span>' : '';
}

const main = document.getElementById('main');
const nav = document.getElementById('bottomNav');

function render(){
  [...nav.querySelectorAll('button')].forEach(b=>b.classList.toggle('active',b.dataset.page===state.currentPage));
  if(state.currentPage==='home') renderHome();
  if(state.currentPage==='songs') renderSongs();
  if(state.currentPage==='notices') renderNotices();
  if(state.currentPage==='members') renderMembers();
  if(state.currentPage==='more') renderMore();
}

function renderHome(){
  const userBox = state.user
    ? `<span class="status">${state.user.status === 'approved' ? '승인 완료' : '가입 승인 대기중'}</span> ${adminBadge()}`
    : `<button class="primary" onclick="openJoin()">대원 가입 신청</button>`;

  main.innerHTML = `
    <section class="hero">
      <h1>소망 찬양대</h1>
      <p>한 마음으로 하나님을 찬양하는 공동체</p>
      <div style="margin-top:14px">${userBox}</div>
    </section>

    <section class="card">
      <div class="list-head"><h3>이번 주 찬양</h3><span class="tag">9월 13일 주일</span></div>
      <div style="font-size:20px;font-weight:800;margin-bottom:12px">주 하나님 지으신 모든 세계</div>
      <div class="grid4">
        <div class="pill">전체 합창</div><div class="pill">S</div><div class="pill">A</div><div class="pill">T / B</div>
      </div>
    </section>

    <section class="card">
      <h3>정기 연습</h3>
      <div class="row"><span>목요일</span><b>19:30–21:00</b></div>
      <div class="row"><span>주일 예배 전</span><b>08:00–08:45</b></div>
      <div class="row"><span>주일 예배 후</span><b>10:40–12:00</b></div>
    </section>

    <section class="card">
      <h3>이번 주 기도 담당</h3>
      <div class="grid2">
        <div class="pill">목 시작<br><b>김○○</b></div>
        <div class="pill">목 마침<br><b>이○○</b></div>
        <div class="pill">주일 시작<br><b>박○○</b></div>
        <div class="pill">주일 마침<br><b>최○○</b></div>
      </div>
    </section>

    <section class="card">
      <h3>공지사항</h3>
      ${state.notices.map(n=>`<div class="row"><div><span class="tag">${n.scope}</span> ${n.title}</div><span class="muted">${n.date}</span></div>`).join('')}
    </section>

    <section class="card">
      <h3>지난 주 실제 찬양</h3>
      <div class="row"><div>소망 찬양대 주일찬양</div><button class="secondary">YouTube 보기</button></div>
    </section>
  `;
}

function renderSongs(){
  main.innerHTML = `
    <div class="list-head">
      <div><h2 style="margin:0">2026 연간 주일별 찬양곡</h2><div class="muted">곡을 누르면 악보·파트연습·실제영상을 연결</div></div>
      <button class="secondary">검색</button>
    </div>
    <div class="month">9월</div>
    ${state.songs.slice(0,3).map(song=>songRow(song)).join('')}
    <div class="month">10월</div>
    ${state.songs.slice(3).map(song=>songRow(song)).join('')}
  `;
}
function songRow(song){
  return `<section class="card">
    <div class="row">
      <div><div class="muted">${song.date} · ${song.special}</div><b>${song.title}</b></div>
      <span>›</span>
    </div>
    <div class="grid4" style="margin-top:10px">
      <div class="pill small">전체</div><div class="pill small">S</div><div class="pill small">A</div><div class="pill small">T/B</div>
    </div>
  </section>`;
}

function renderNotices(){
  main.innerHTML = `
    <h2>공지사항</h2>
    <div class="grid4">
      <div class="pill">전체</div><div class="pill">S</div><div class="pill">A</div><div class="pill">T / B</div>
    </div>
    ${state.notices.map(n=>`<section class="card">
      <span class="tag notice-tag">${n.scope}</span>
      <h3 style="margin-top:10px">${n.title}</h3>
      <div class="muted">${n.date}</div>
    </section>`).join('')}
  `;
}

function renderMembers(){
  main.innerHTML = `
    <div class="list-head"><div><h2 style="margin:0">대원명단</h2><div class="muted">승인된 대원만 열람</div></div></div>
    <div class="grid4">
      <div class="pill">전체</div><div class="pill">S</div><div class="pill">A</div><div class="pill">T / B</div>
    </div>
    <section class="card">
      ${state.members.map(m=>`<div class="member">
        <div class="avatar">${m.name[0]}</div>
        <div><b>${m.name}</b> <span class="muted">${m.title}</span><div class="muted">${m.part}</div></div>
      </div>`).join('')}
    </section>
  `;
}

function renderMore(){
  main.innerHTML = `
    <h2>더보기</h2>
    <section class="card">
      <h3>소망 찬양대 소개</h3>
      <p class="muted">찬양대 소개, 정기연습, 섬기는 분들, 연혁 및 비전</p>
      <div class="row"><span>찬양대장</span><b>○○○</b></div>
      <div class="row"><span>지휘자</span><b>○○○</b></div>
      <div class="row"><span>반주자</span><b>○○○ / ○○○</b></div>
      <div class="row"><span>총무 / 회계</span><b>○○○ / ○○○</b></div>
      <div class="row"><span>파트장</span><b>S / A / T / B</b></div>
    </section>

    <section class="card">
      <h3>기도당번</h3>
      <table class="table">
        <tr><th>주간</th><th>목 시작</th><th>목 마침</th><th>주 시작</th><th>주 마침</th></tr>
        ${state.prayers.map(p=>`<tr><td>${p.date}</td><td>${p.thuStart}</td><td>${p.thuEnd}</td><td>${p.sunStart}</td><td>${p.sunEnd}</td></tr>`).join('')}
      </table>
    </section>

    <section class="card">
      <h3>갤러리</h3>
      <div class="gallery">
        <div class="gallery-item">찬양제</div>
        <div class="gallery-item">부활절 찬양</div>
        <div class="gallery-item">성탄절 찬양</div>
        <div class="gallery-item">연습 / 행사</div>
      </div>
    </section>

    <section class="admin-box">
      <h3 style="margin-top:0">최고관리자 센터 ${adminBadge()}</h3>
      <p class="muted">현재 계정은 모든 데이터와 사용자 권한을 관리할 수 있습니다.</p>
      <div class="grid2" style="margin-bottom:12px">
        <button class="primary">가입 승인 관리</button>
        <button class="primary">사용자 권한 관리</button>
        <button class="primary">전체 공지 관리</button>
        <button class="primary">연간 찬양곡 관리</button>
        <button class="primary">기도당번 관리</button>
        <button class="primary">영상/악보 관리</button>
        <button class="primary">대원명단 관리</button>
        <button class="primary">갤러리 관리</button>
      </div>
      <h3>권한별 관리 구조</h3>
      <p class="muted">최고관리자 · 총무 · 음악담당 · 파트장 · 영상담당 · 일반대원</p>
      <div class="row"><span>일반대원</span><span>본인 사진·연락처 수정</span></div>
      <div class="row"><span>총무</span><span>공지·일정·기도당번</span></div>
      <div class="row"><span>음악담당</span><span>연간 찬양곡·악보</span></div>
      <div class="row"><span>파트장</span><span>자기 파트 공지·연습영상</span></div>
      <div class="row"><span>영상담당</span><span>실제 찬양 YouTube</span></div>
    </section>
  `;
}

function openJoin(){ document.getElementById('joinDialog').showModal(); }

document.getElementById('joinForm').addEventListener('submit', e=>{
  const fd = new FormData(e.target);
  if(e.submitter && e.submitter.value==='cancel') return;
  const user = {
    name:fd.get('name'), title:fd.get('title'), part:fd.get('part'),
    phone:fd.get('phone'), status:'pending'
  };
  localStorage.setItem('somangUser',JSON.stringify(user));
  state.user=user;
  setTimeout(render,50);
});

document.getElementById('profileBtn').addEventListener('click',()=>{
  const c=document.getElementById('profileContent');
  if(!state.user){
    c.innerHTML='<p>아직 가입 정보가 없습니다.</p><button class="primary" onclick="document.getElementById(\'profileDialog\').close();openJoin()">가입 신청</button>';
  }else{
    c.innerHTML=`
      <div class="row"><span>이름</span><b>${state.user.name}</b></div>
      <div class="row"><span>직분</span><b>${state.user.title||'-'}</b></div>
      <div class="row"><span>파트</span><b>${state.user.part}</b></div>
      <div class="row"><span>연락처</span><b>${state.user.phone||'-'}</b></div>
      <div class="row"><span>상태</span><b>${state.user.status==='approved'?'승인 완료':'총무 승인 대기'}</b></div>
      <div class="row"><span>권한</span><b>${isSuperAdmin()?'최고관리자 · 모든 권한':'일반대원'}</b></div>`;
  }
  document.getElementById('profileDialog').showModal();
});

nav.addEventListener('click',e=>{
  const b=e.target.closest('button[data-page]'); if(!b) return;
  state.currentPage=b.dataset.page; render();
});

render();
