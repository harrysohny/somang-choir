
const seed = {
  users: [
    {id:'u1', name:'Harry Sohn', title:'최고관리자', part:'Tenor', phone:'', status:'approved', role:'superadmin',
     permissions:['all']},
    {id:'u2', name:'김○○', title:'집사', part:'Soprano', phone:'010-1111-1111', status:'pending', role:'member', permissions:[]},
    {id:'u3', name:'이○○', title:'권사', part:'Alto', phone:'010-2222-2222', status:'approved', role:'member', permissions:[]}
  ],
  songs: [
    {id:'s1', date:'2026-09-13', title:'주 하나님 지으신 모든 세계', special:'주일', full:'', s:'', a:'', t:'', b:'', live:''},
    {id:'s2', date:'2026-09-20', title:'은혜 아니면', special:'주일', full:'', s:'', a:'', t:'', b:'', live:''},
    {id:'s3', date:'2026-09-27', title:'내 영혼이 은총 입어', special:'주일', full:'', s:'', a:'', t:'', b:'', live:''}
  ],
  prayers: [
    {id:'p1', week:'2026-09-17 / 09-20', thuStart:'김○○', thuEnd:'이○○', sunStart:'박○○', sunEnd:'최○○'}
  ],
  notices: [
    {id:'n1', scope:'전체', title:'목요일 정기연습 안내', body:'목요일 정기연습은 오후 7:30에 시작합니다.', date:'2026-09-10', important:true},
    {id:'n2', scope:'Tenor', title:'테너 파트 사전연습 안내', body:'테너 파트는 7:10까지 모여 주세요.', date:'2026-09-09', important:false}
  ],
  gallery: [
    {id:'g1', title:'찬양제', date:'2026', cover:''},
    {id:'g2', title:'부활절 찬양', date:'2026', cover:''}
  ]
};

function loadDB(){
  let db = JSON.parse(localStorage.getItem('somangChoirDB') || 'null');
  if(!db){ db = seed; localStorage.setItem('somangChoirDB', JSON.stringify(db)); }
  return db;
}
function saveDB(){ localStorage.setItem('somangChoirDB', JSON.stringify(db)); }

let db = loadDB();
let currentUserId = localStorage.getItem('somangCurrentUser') || 'u1';
let state = { currentPage:'home' };

function me(){ return db.users.find(u=>u.id===currentUserId) || db.users[0]; }
function isSuperAdmin(){ const u=me(); return u && (u.role==='superadmin' || (u.permissions||[]).includes('all')); }
function can(p){ const u=me(); return isSuperAdmin() || (u.permissions||[]).includes(p); }
function uid(prefix){ return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

const main = document.getElementById('main');
const nav = document.getElementById('bottomNav');

function render(){
  [...nav.querySelectorAll('button')].forEach(b=>b.classList.toggle('active',b.dataset.page===state.currentPage));
  if(state.currentPage==='home') renderHome();
  if(state.currentPage==='songs') renderSongs();
  if(state.currentPage==='notices') renderNotices();
  if(state.currentPage==='members') renderMembers();
  if(state.currentPage==='more') renderMore();
  if(state.currentPage==='admin') renderAdmin();
}

function badge(txt){ return `<span class="tag">${txt}</span>`; }
function adminBadge(){ return isSuperAdmin()?'<span class="tag" style="background:#fff0cd;color:#7a4f00">SUPER ADMIN</span>':''; }

function renderHome(){
  const u = me();
  main.innerHTML = `
    <section class="hero">
      <h1>소망 찬양대</h1>
      <p>한 마음으로 하나님을 찬양하는 공동체</p>
      <div style="margin-top:14px">${u.status==='approved'?'<span class="status">승인 완료</span>':'<span class="status">승인 대기</span>'} ${adminBadge()}</div>
    </section>

    <section class="card">
      <div class="list-head"><h3>이번 주 찬양</h3><span class="tag">주일</span></div>
      <div style="font-size:20px;font-weight:800;margin-bottom:12px">${db.songs[0]?.title || '미등록'}</div>
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
      ${db.prayers[0] ? `
      <div class="grid2">
        <div class="pill">목 시작<br><b>${db.prayers[0].thuStart}</b></div>
        <div class="pill">목 마침<br><b>${db.prayers[0].thuEnd}</b></div>
        <div class="pill">주일 시작<br><b>${db.prayers[0].sunStart}</b></div>
        <div class="pill">주일 마침<br><b>${db.prayers[0].sunEnd}</b></div>
      </div>` : '<div class="muted">기도당번 미등록</div>'}
    </section>

    <section class="card">
      <h3>공지사항</h3>
      ${db.notices.slice(0,3).map(n=>`<div class="row"><div>${badge(n.scope)} ${n.title}</div><span class="muted">${n.date}</span></div>`).join('')}
    </section>

    ${isSuperAdmin()?`<section class="admin-box"><h3 style="margin-top:0">최고관리자 바로가기</h3><button class="primary" onclick="state.currentPage='admin';render()">관리자 센터 열기</button></section>`:''}
  `;
}

function renderSongs(){
  main.innerHTML = `
    <div class="list-head">
      <div><h2 style="margin:0">2026 연간 주일별 찬양곡</h2><div class="muted">연습영상과 실제 찬양영상을 함께 관리합니다.</div></div>
      ${can('songs')?'<button class="primary" onclick="openSongForm()">+ 추가</button>':''}
    </div>
    ${db.songs.sort((a,b)=>a.date.localeCompare(b.date)).map(song=>`
      <section class="card">
        <div class="row">
          <div><div class="muted">${song.date} · ${song.special}</div><b>${song.title}</b></div>
          ${can('songs')?`<button class="secondary" onclick="openSongForm('${song.id}')">수정</button>`:'<span>›</span>'}
        </div>
        <div class="grid4" style="margin-top:10px">
          <div class="pill small">${song.full?'전체 ✓':'전체'}</div>
          <div class="pill small">${song.s?'S ✓':'S'}</div>
          <div class="pill small">${song.a?'A ✓':'A'}</div>
          <div class="pill small">${song.t||song.b?'T/B ✓':'T/B'}</div>
        </div>
        ${song.live?'<div class="muted" style="margin-top:10px">실제 찬양영상 등록됨</div>':''}
      </section>`).join('')}
  `;
}

function openSongForm(id=''){
  const song = db.songs.find(x=>x.id===id) || {id:'',date:'',title:'',special:'주일',full:'',s:'',a:'',t:'',b:'',live:''};
  main.innerHTML = `
    <h2>${id?'찬양곡 수정':'찬양곡 추가'}</h2>
    <section class="card form-card">
      ${field('날짜','songDate',song.date,'date')}
      ${field('구분','songSpecial',song.special)}
      ${field('곡명','songTitle',song.title)}
      ${field('전체 합창 YouTube','songFull',song.full)}
      ${field('Soprano YouTube','songS',song.s)}
      ${field('Alto YouTube','songA',song.a)}
      ${field('Tenor YouTube','songT',song.t)}
      ${field('Bass YouTube','songB',song.b)}
      ${field('실제 찬양 YouTube','songLive',song.live)}
      <div class="dialog-actions">
        <button class="secondary" onclick="state.currentPage='songs';render()">취소</button>
        ${id?`<button class="danger" onclick="deleteSong('${id}')">삭제</button>`:''}
        <button class="primary" onclick="saveSong('${id}')">저장</button>
      </div>
    </section>`;
}
function saveSong(id){
  const obj = {
    id:id||uid('s'), date:v('songDate'), special:v('songSpecial')||'주일', title:v('songTitle'),
    full:v('songFull'), s:v('songS'), a:v('songA'), t:v('songT'), b:v('songB'), live:v('songLive')
  };
  if(id) db.songs = db.songs.map(x=>x.id===id?obj:x); else db.songs.push(obj);
  saveDB(); state.currentPage='songs'; render();
}
function deleteSong(id){ if(confirm('이 찬양곡을 삭제할까요?')){ db.songs=db.songs.filter(x=>x.id!==id); saveDB(); state.currentPage='songs'; render(); } }

function renderNotices(){
  main.innerHTML = `
    <div class="list-head"><h2 style="margin:0">공지사항</h2>${can('notices')?'<button class="primary" onclick="openNoticeForm()">+ 공지</button>':''}</div>
    <div class="grid4"><div class="pill">전체</div><div class="pill">S</div><div class="pill">A</div><div class="pill">T / B</div></div>
    ${db.notices.sort((a,b)=>b.date.localeCompare(a.date)).map(n=>`
      <section class="card">
        ${badge(n.scope)} ${n.important?'<span class="tag" style="background:#fff0e8;color:#a04720">중요</span>':''}
        <h3 style="margin-top:10px">${n.title}</h3>
        <p>${n.body||''}</p>
        <div class="row"><span class="muted">${n.date}</span>${can('notices')?`<button class="secondary" onclick="openNoticeForm('${n.id}')">수정</button>`:''}</div>
      </section>`).join('')}
  `;
}
function openNoticeForm(id=''){
  const n = db.notices.find(x=>x.id===id) || {id:'',scope:'전체',title:'',body:'',date:new Date().toISOString().slice(0,10),important:false};
  main.innerHTML = `
    <h2>${id?'공지 수정':'공지 작성'}</h2>
    <section class="card form-card">
      <label>공개대상<select id="noticeScope"><option ${n.scope==='전체'?'selected':''}>전체</option><option ${n.scope==='Soprano'?'selected':''}>Soprano</option><option ${n.scope==='Alto'?'selected':''}>Alto</option><option ${n.scope==='Tenor'?'selected':''}>Tenor</option><option ${n.scope==='Bass'?'selected':''}>Bass</option></select></label>
      ${field('제목','noticeTitle',n.title)}
      <label>내용<textarea id="noticeBody">${n.body||''}</textarea></label>
      ${field('게시일','noticeDate',n.date,'date')}
      <label><input id="noticeImportant" type="checkbox" ${n.important?'checked':''}> 중요공지</label>
      <div class="dialog-actions">
        <button class="secondary" onclick="state.currentPage='notices';render()">취소</button>
        ${id?`<button class="danger" onclick="deleteNotice('${id}')">삭제</button>`:''}
        <button class="primary" onclick="saveNotice('${id}')">저장</button>
      </div>
    </section>`;
}
function saveNotice(id){
  const obj={id:id||uid('n'),scope:v('noticeScope'),title:v('noticeTitle'),body:v('noticeBody'),date:v('noticeDate'),important:document.getElementById('noticeImportant').checked};
  if(id) db.notices=db.notices.map(x=>x.id===id?obj:x); else db.notices.push(obj);
  saveDB(); state.currentPage='notices'; render();
}
function deleteNotice(id){ if(confirm('공지를 삭제할까요?')){db.notices=db.notices.filter(x=>x.id!==id);saveDB();state.currentPage='notices';render();} }

function renderMembers(){
  const approved = db.users.filter(u=>u.status==='approved');
  main.innerHTML = `
    <div class="list-head"><div><h2 style="margin:0">대원명단</h2><div class="muted">승인된 대원만 표시</div></div>${isSuperAdmin()?'<button class="primary" onclick="state.currentPage=\'admin\';render()">가입 승인</button>':''}</div>
    <section class="card">
      ${approved.map(m=>`<div class="member">
        <div class="avatar">${m.name?.[0]||'?'}</div>
        <div style="flex:1"><b>${m.name}</b> <span class="muted">${m.title||''}</span><div class="muted">${m.part||''}</div></div>
        ${isSuperAdmin()?`<button class="secondary" onclick="editUser('${m.id}')">권한</button>`:''}
      </div>`).join('')}
    </section>
  `;
}

function renderMore(){
  main.innerHTML = `
    <h2>더보기</h2>
    <section class="card">
      <h3>소망 찬양대 소개</h3>
      <p class="muted">정기연습, 섬기는 분들, 연혁 및 찬양대 소개</p>
      <div class="row"><span>찬양대장</span><b>○○○</b></div>
      <div class="row"><span>지휘자</span><b>○○○</b></div>
      <div class="row"><span>반주자</span><b>○○○ / ○○○</b></div>
      <div class="row"><span>총무 / 회계</span><b>○○○ / ○○○</b></div>
    </section>
    <section class="card">
      <h3>기도당번</h3>
      ${db.prayers.map(p=>`<div class="row"><div><b>${p.week}</b><div class="muted">목 ${p.thuStart}/${p.thuEnd} · 주 ${p.sunStart}/${p.sunEnd}</div></div></div>`).join('')}
      ${can('prayers')?'<button class="primary" style="margin-top:10px" onclick="openPrayerForm()">기도당번 관리</button>':''}
    </section>
    <section class="card">
      <h3>갤러리</h3>
      <div class="gallery">${db.gallery.map(g=>`<div class="gallery-item">${g.title}</div>`).join('')}</div>
    </section>
    ${isSuperAdmin()?`<section class="admin-box"><h3 style="margin-top:0">최고관리자 센터</h3><button class="primary" onclick="state.currentPage='admin';render()">관리자 센터 열기</button></section>`:''}
  `;
}

function renderAdmin(){
  if(!isSuperAdmin()){ main.innerHTML='<p>접근 권한이 없습니다.</p>'; return; }
  const pending = db.users.filter(u=>u.status==='pending');
  main.innerHTML = `
    <div class="list-head"><div><h2 style="margin:0">최고관리자 센터</h2><div class="muted">가입 승인과 역할별 권한을 관리합니다.</div></div>${adminBadge()}</div>

    <section class="card">
      <h3>가입 승인 대기 <span class="tag">${pending.length}명</span></h3>
      ${pending.length?pending.map(u=>`
        <div class="member">
          <div class="avatar">${u.name[0]}</div>
          <div style="flex:1"><b>${u.name}</b><div class="muted">${u.title||''} · ${u.part||''} · ${u.phone||''}</div></div>
          <button class="primary" onclick="approveUser('${u.id}')">승인</button>
          <button class="secondary" onclick="rejectUser('${u.id}')">거절</button>
        </div>`).join(''):'<div class="muted">승인 대기자가 없습니다.</div>'}
    </section>

    <section class="card">
      <h3>대원 및 권한 관리</h3>
      ${db.users.filter(u=>u.status==='approved').map(u=>`
        <div class="member">
          <div class="avatar">${u.name[0]}</div>
          <div style="flex:1"><b>${u.name}</b> ${u.role==='superadmin'?adminBadge():''}<div class="muted">${u.title||''} · ${u.part||''}</div></div>
          <button class="secondary" onclick="editUser('${u.id}')">권한 설정</button>
        </div>`).join('')}
    </section>

    <section class="card">
      <h3>콘텐츠 관리</h3>
      <div class="grid2">
        <button class="primary" onclick="state.currentPage='notices';render()">공지 관리</button>
        <button class="primary" onclick="state.currentPage='songs';render()">연간 찬양곡</button>
        <button class="primary" onclick="openPrayerForm()">기도당번</button>
        <button class="primary" onclick="state.currentPage='more';render()">소개/갤러리</button>
      </div>
    </section>

    <section class="admin-box">
      <h3 style="margin-top:0">운영 권한 기준</h3>
      <div class="row"><span>총무</span><span>공지·일정·기도</span></div>
      <div class="row"><span>음악담당</span><span>찬양곡·전체 연습영상</span></div>
      <div class="row"><span>파트장</span><span>자기 파트 공지·영상</span></div>
      <div class="row"><span>영상담당</span><span>실제 찬양영상</span></div>
      <div class="row"><span>일반대원</span><span>본인정보 수정</span></div>
    </section>
  `;
}
function approveUser(id){ const u=db.users.find(x=>x.id===id); if(u){u.status='approved';saveDB();renderAdmin();}}
function rejectUser(id){ if(confirm('가입 신청을 거절할까요?')){db.users=db.users.filter(x=>x.id!==id);saveDB();renderAdmin();}}

function editUser(id){
  const u=db.users.find(x=>x.id===id); if(!u) return;
  main.innerHTML=`
    <h2>사용자 권한 설정</h2>
    <section class="card form-card">
      <div class="row"><span>이름</span><b>${u.name}</b></div>
      <div class="row"><span>파트</span><b>${u.part||'-'}</b></div>
      <label>역할
        <select id="userRole">
          <option value="member" ${u.role==='member'?'selected':''}>일반대원</option>
          <option value="manager" ${u.role==='manager'?'selected':''}>운영담당</option>
          <option value="superadmin" ${u.role==='superadmin'?'selected':''}>최고관리자</option>
        </select>
      </label>
      <h3>세부 권한</h3>
      ${permCheck('notices','전체/파트 공지 관리',u)}
      ${permCheck('songs','연간 찬양곡 및 영상 관리',u)}
      ${permCheck('prayers','기도당번 관리',u)}
      ${permCheck('members','대원명단 관리',u)}
      ${permCheck('gallery','갤러리 관리',u)}
      <div class="dialog-actions">
        <button class="secondary" onclick="state.currentPage='admin';render()">취소</button>
        <button class="primary" onclick="saveUserPerms('${id}')">저장</button>
      </div>
    </section>`;
}
function permCheck(code,label,u){
  const checked=(u.permissions||[]).includes(code)||u.role==='superadmin'?'checked':'';
  return `<label><input type="checkbox" id="perm_${code}" ${checked}> ${label}</label>`;
}
function saveUserPerms(id){
  const u=db.users.find(x=>x.id===id); if(!u) return;
  u.role=v('userRole');
  if(u.role==='superadmin') u.permissions=['all'];
  else u.permissions=['notices','songs','prayers','members','gallery'].filter(p=>document.getElementById('perm_'+p).checked);
  saveDB(); state.currentPage='admin'; render();
}

function openPrayerForm(){
  if(!can('prayers')) return;
  const p=db.prayers[0] || {id:'',week:'',thuStart:'',thuEnd:'',sunStart:'',sunEnd:''};
  main.innerHTML=`
    <h2>기도당번 관리</h2>
    <section class="card form-card">
      ${field('주간','prayWeek',p.week)}
      ${field('목요일 시작기도','prayThuStart',p.thuStart)}
      ${field('목요일 마침기도','prayThuEnd',p.thuEnd)}
      ${field('주일 08:00 시작기도','praySunStart',p.sunStart)}
      ${field('주일 예배후 마침기도','praySunEnd',p.sunEnd)}
      <div class="dialog-actions">
        <button class="secondary" onclick="state.currentPage='more';render()">취소</button>
        <button class="primary" onclick="savePrayer('${p.id||''}')">저장</button>
      </div>
    </section>`;
}
function savePrayer(id){
  const obj={id:id||uid('p'),week:v('prayWeek'),thuStart:v('prayThuStart'),thuEnd:v('prayThuEnd'),sunStart:v('praySunStart'),sunEnd:v('praySunEnd')};
  if(id) db.prayers=db.prayers.map(x=>x.id===id?obj:x); else db.prayers.unshift(obj);
  saveDB(); state.currentPage='more';render();
}

function field(label,id,val,type='text'){return `<label>${label}<input id="${id}" type="${type}" value="${(val||'').replaceAll('"','&quot;')}"></label>`}
function v(id){return document.getElementById(id)?.value?.trim()||''}

document.getElementById('profileBtn').addEventListener('click',()=>{
  const u=me();
  document.getElementById('profileContent').innerHTML=`
    <div class="row"><span>이름</span><b>${u.name}</b></div>
    <div class="row"><span>직분</span><b>${u.title||'-'}</b></div>
    <div class="row"><span>파트</span><b>${u.part||'-'}</b></div>
    <div class="row"><span>연락처</span><b>${u.phone||'-'}</b></div>
    <div class="row"><span>권한</span><b>${isSuperAdmin()?'최고관리자 · 모든 권한':(u.role||'일반대원')}</b></div>`;
  document.getElementById('profileDialog').showModal();
});

document.getElementById('joinForm').addEventListener('submit', e=>{
  if(e.submitter && e.submitter.value==='cancel') return;
  e.preventDefault();
  const fd=new FormData(e.target);
  const user={id:uid('u'),name:fd.get('name'),title:fd.get('title'),part:fd.get('part'),phone:fd.get('phone'),status:'pending',role:'member',permissions:[]};
  db.users.push(user); saveDB();
  document.getElementById('joinDialog').close();
  alert('가입 신청이 접수되었습니다. 최고관리자 승인 후 이용할 수 있습니다.');
});

nav.addEventListener('click',e=>{
  const b=e.target.closest('button[data-page]'); if(!b) return;
  state.currentPage=b.dataset.page; render();
});

render();
