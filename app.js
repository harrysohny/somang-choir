
const seed = {
  users: [
    {id:'u1', name:'Harry Sohn', title:'최고관리자', part:'Tenor', phone:'', status:'approved', role:'superadmin', permissions:['all']},
    {id:'u2', name:'김○○', title:'집사', part:'Soprano', phone:'010-1111-1111', status:'pending', role:'member', permissions:[]},
    {id:'u3', name:'이○○', title:'권사', part:'Alto', phone:'010-2222-2222', status:'approved', role:'member', permissions:[]}
  ],
  songs: [
    {id:'s1', date:'2026-09-13', title:'주 하나님 지으신 모든 세계', special:'주일', full:'', s:'', a:'', t:'', b:'', live:''},
    {id:'s2', date:'2026-09-20', title:'은혜 아니면', special:'주일', full:'', s:'', a:'', t:'', b:'', live:''}
  ],
  prayers: [
    {id:'p1', thuDate:'2026-09-17', sunDate:'2026-09-20', thuStart:'김○○', thuEnd:'이○○', sunStart:'박○○', sunEnd:'최○○'}
  ],
  notices: [
    {id:'n1', scope:'전체', title:'목요일 정기연습 안내', body:'목요일 정기연습은 오후 7:30에 시작합니다.', date:'2026-09-10', important:true}
  ],
  choirIntro: {
    id:'intro1',
    name:'소망 찬양대',
    englishName:'SOMANG CHOIR',
    description:'한 마음으로 하나님을 찬양하는 공동체',
    founded:'',
    service:'',
    rehearsal:'목요일 19:30–21:00 / 주일 08:00–08:45 / 주일 10:40–12:00',
    history:'',
    vision:''
  },
  leaders: [
    {id:'l1', role:'찬양대장', name:'○○○', photo:''},
    {id:'l2', role:'지휘자', name:'○○○', photo:''},
    {id:'l3', role:'반주자 1', name:'○○○', photo:''},
    {id:'l4', role:'반주자 2', name:'○○○', photo:''},
    {id:'l5', role:'총무', name:'○○○', photo:''},
    {id:'l6', role:'회계', name:'○○○', photo:''},
    {id:'l7', role:'Soprano 파트장', name:'○○○', photo:''},
    {id:'l8', role:'Alto 파트장', name:'○○○', photo:''},
    {id:'l9', role:'Tenor 파트장', name:'○○○', photo:''},
    {id:'l10', role:'Bass 파트장', name:'○○○', photo:''}
  ],
  gallery: [
    {id:'g1', title:'찬양제', date:'2026-06-01', description:'특별 찬양제', imageUrl:''},
    {id:'g2', title:'부활절 찬양', date:'2026-04-05', description:'부활절 특별찬양', imageUrl:''}
  ]
};

function loadDB(){
  let db = JSON.parse(localStorage.getItem('somangChoirDBv3') || 'null');
  if(!db){ db = seed; localStorage.setItem('somangChoirDBv3', JSON.stringify(db)); }
  return db;
}
function saveDB(){ localStorage.setItem('somangChoirDBv3', JSON.stringify(db)); }

let db = loadDB();
let state = { currentPage:'home' };

function me(){ return db.users.find(u=>u.id==='u1') || db.users[0]; }
function isSuperAdmin(){ const u=me(); return u && (u.role==='superadmin' || (u.permissions||[]).includes('all')); }
function can(p){ const u=me(); return isSuperAdmin() || (u.permissions||[]).includes(p); }
function uid(prefix){ return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function v(id){ return document.getElementById(id)?.value?.trim()||'' }
function field(label,id,val,type='text'){return `<label>${label}<input id="${id}" type="${type}" value="${(val||'').replaceAll('"','&quot;')}"></label>`}
function textarea(label,id,val){return `<label>${label}<textarea id="${id}">${val||''}</textarea></label>`}
function badge(t){return `<span class="tag">${t}</span>`}
function adminBadge(){return isSuperAdmin()?'<span class="tag" style="background:#fff0cd;color:#7a4f00">SUPER ADMIN</span>':''}

const main=document.getElementById('main');
const nav=document.getElementById('bottomNav');

function render(){
  [...nav.querySelectorAll('button')].forEach(b=>b.classList.toggle('active',b.dataset.page===state.currentPage));
  const map={home:renderHome,songs:renderSongs,notices:renderNotices,members:renderMembers,more:renderMore,admin:renderAdmin};
  (map[state.currentPage]||renderHome)();
}

function renderHome(){
  const p=db.prayers[0];
  main.innerHTML=`
    <section class="hero"><h1>${db.choirIntro.name}</h1><p>${db.choirIntro.description}</p><div style="margin-top:14px">${adminBadge()}</div></section>
    <section class="card"><h3>이번 주 찬양</h3><div style="font-size:20px;font-weight:800">${db.songs[0]?.title||'미등록'}</div></section>
    <section class="card">
      <h3>정기 연습</h3>
      <div class="row"><span>목요일</span><b>19:30–21:00</b></div>
      <div class="row"><span>주일 예배 전</span><b>08:00–08:45</b></div>
      <div class="row"><span>주일 예배 후</span><b>10:40–12:00</b></div>
    </section>
    <section class="card"><h3>이번 주 기도 담당</h3>
      ${p?`<div class="row"><span>목요일 ${p.thuDate}</span><b>시작 ${p.thuStart} / 마침 ${p.thuEnd}</b></div>
      <div class="row"><span>주일 ${p.sunDate}</span><b>08:00 ${p.sunStart} / 마침 ${p.sunEnd}</b></div>`:'<div class="muted">미등록</div>'}
    </section>
    ${isSuperAdmin()?`<section class="admin-box"><button class="primary" onclick="state.currentPage='admin';render()">최고관리자 센터</button></section>`:''}
  `;
}

function renderSongs(){
  main.innerHTML=`<div class="list-head"><div><h2 style="margin:0">연간 주일별 찬양곡</h2></div>${can('songs')?'<button class="primary" onclick="openSongForm()">+ 추가</button>':''}</div>
  ${db.songs.sort((a,b)=>a.date.localeCompare(b.date)).map(song=>`<section class="card">
    <div class="row"><div><div class="muted">${song.date} · ${song.special}</div><b>${song.title}</b></div>${can('songs')?`<button class="secondary" onclick="openSongForm('${song.id}')">수정</button>`:''}</div>
    <div class="grid4" style="margin-top:10px"><div class="pill small">전체 ${song.full?'✓':''}</div><div class="pill small">S ${song.s?'✓':''}</div><div class="pill small">A ${song.a?'✓':''}</div><div class="pill small">T/B ${(song.t||song.b)?'✓':''}</div></div>
  </section>`).join('')}`;
}
function openSongForm(id=''){
  const x=db.songs.find(s=>s.id===id)||{date:'',title:'',special:'주일',full:'',s:'',a:'',t:'',b:'',live:''};
  main.innerHTML=`<h2>${id?'찬양곡 수정':'찬양곡 등록'}</h2><section class="card form-card">
    ${field('날짜','songDate',x.date,'date')}${field('구분','songSpecial',x.special)}${field('곡명','songTitle',x.title)}
    ${field('전체합창 URL','songFull',x.full)}${field('Soprano URL','songS',x.s)}${field('Alto URL','songA',x.a)}${field('Tenor URL','songT',x.t)}${field('Bass URL','songB',x.b)}${field('실제 찬양영상 URL','songLive',x.live)}
    <div class="dialog-actions"><button class="secondary" onclick="state.currentPage='songs';render()">취소</button>${id?`<button class="danger" onclick="delSong('${id}')">삭제</button>`:''}<button class="primary" onclick="saveSong('${id}')">저장</button></div>
  </section>`;
}
function saveSong(id){const o={id:id||uid('s'),date:v('songDate'),special:v('songSpecial'),title:v('songTitle'),full:v('songFull'),s:v('songS'),a:v('songA'),t:v('songT'),b:v('songB'),live:v('songLive')};db.songs=id?db.songs.map(x=>x.id===id?o:x):[...db.songs,o];saveDB();state.currentPage='songs';render();}
function delSong(id){if(confirm('삭제할까요?')){db.songs=db.songs.filter(x=>x.id!==id);saveDB();state.currentPage='songs';render();}}

function renderNotices(){
  main.innerHTML=`<div class="list-head"><h2 style="margin:0">공지사항</h2>${can('notices')?'<button class="primary" onclick="openNoticeForm()">+ 등록</button>':''}</div>
  ${db.notices.map(n=>`<section class="card">${badge(n.scope)} ${n.important?badge('중요'):''}<h3>${n.title}</h3><p>${n.body||''}</p><div class="row"><span class="muted">${n.date}</span>${can('notices')?`<button class="secondary" onclick="openNoticeForm('${n.id}')">수정</button>`:''}</div></section>`).join('')}`;
}
function openNoticeForm(id=''){const n=db.notices.find(x=>x.id===id)||{scope:'전체',title:'',body:'',date:new Date().toISOString().slice(0,10),important:false};main.innerHTML=`<h2>${id?'공지 수정':'공지 등록'}</h2><section class="card form-card">
<label>대상<select id="noticeScope"><option ${n.scope==='전체'?'selected':''}>전체</option><option ${n.scope==='Soprano'?'selected':''}>Soprano</option><option ${n.scope==='Alto'?'selected':''}>Alto</option><option ${n.scope==='Tenor'?'selected':''}>Tenor</option><option ${n.scope==='Bass'?'selected':''}>Bass</option></select></label>
${field('제목','noticeTitle',n.title)}${textarea('내용','noticeBody',n.body)}${field('게시일','noticeDate',n.date,'date')}<label><input type="checkbox" id="noticeImportant" ${n.important?'checked':''}> 중요공지</label>
<div class="dialog-actions"><button class="secondary" onclick="state.currentPage='notices';render()">취소</button>${id?`<button class="danger" onclick="delNotice('${id}')">삭제</button>`:''}<button class="primary" onclick="saveNotice('${id}')">저장</button></div></section>`}
function saveNotice(id){const o={id:id||uid('n'),scope:v('noticeScope'),title:v('noticeTitle'),body:v('noticeBody'),date:v('noticeDate'),important:document.getElementById('noticeImportant').checked};db.notices=id?db.notices.map(x=>x.id===id?o:x):[...db.notices,o];saveDB();state.currentPage='notices';render()}
function delNotice(id){if(confirm('삭제할까요?')){db.notices=db.notices.filter(x=>x.id!==id);saveDB();state.currentPage='notices';render()}}

function renderMembers(){
  main.innerHTML=`<div class="list-head"><h2 style="margin:0">대원명단</h2>${isSuperAdmin()?'<button class="primary" onclick="state.currentPage=\'admin\';render()">권한관리</button>':''}</div>
  <section class="card">${db.users.filter(u=>u.status==='approved').map(u=>`<div class="member"><div class="avatar">${u.name[0]}</div><div style="flex:1"><b>${u.name}</b><div class="muted">${u.title||''} · ${u.part||''}</div></div>${isSuperAdmin()?`<button class="secondary" onclick="editUser('${u.id}')">권한</button>`:''}</div>`).join('')}</section>`;
}

function renderMore(){
  main.innerHTML=`<h2>더보기</h2>
  <section class="card"><div class="list-head"><h3 style="margin:0">소망 찬양대 소개</h3>${can('intro')?'<button class="secondary" onclick="openIntroForm()">수정</button>':''}</div>
    <p>${db.choirIntro.description||''}</p><div class="muted">${db.choirIntro.rehearsal||''}</div></section>
  <section class="card"><div class="list-head"><h3 style="margin:0">섬기는 분들</h3>${can('leaders')?'<button class="secondary" onclick="openLeaderForm()">+ 등록</button>':''}</div>
    ${db.leaders.map(l=>`<div class="row"><span>${l.role}</span><b>${l.name}</b>${can('leaders')?`<button class="secondary" onclick="openLeaderForm('${l.id}')">수정</button>`:''}</div>`).join('')}</section>
  <section class="card"><div class="list-head"><h3 style="margin:0">기도당번</h3>${can('prayers')?'<button class="secondary" onclick="openPrayerForm()">+ 등록</button>':''}</div>
    ${db.prayers.map(p=>`<div class="row"><div><b>목 ${p.thuDate} / 주일 ${p.sunDate}</b><div class="muted">목: ${p.thuStart} / ${p.thuEnd} · 주일: ${p.sunStart} / ${p.sunEnd}</div></div>${can('prayers')?`<button class="secondary" onclick="openPrayerForm('${p.id}')">수정</button>`:''}</div>`).join('')}</section>
  <section class="card"><div class="list-head"><h3 style="margin:0">갤러리</h3>${can('gallery')?'<button class="secondary" onclick="openGalleryForm()">+ 등록</button>':''}</div>
    <div class="gallery">${db.gallery.map(g=>`<div class="gallery-item" onclick="${can('gallery')?`openGalleryForm('${g.id}')`:''}"><div>${g.title}<div class="small">${g.date}</div></div></div>`).join('')}</div></section>
  ${isSuperAdmin()?`<section class="admin-box"><button class="primary" onclick="state.currentPage='admin';render()">최고관리자 센터</button></section>`:''}`;
}

function openIntroForm(){
  const x=db.choirIntro;
  main.innerHTML=`<h2>찬양대 소개 수정</h2><section class="card form-card">
    ${field('찬양대명','introName',x.name)}${field('영문명','introEng',x.englishName)}${textarea('소개글','introDesc',x.description)}${field('창단연도','introFounded',x.founded)}${field('섬기는 예배','introService',x.service)}${textarea('정기연습','introRehearsal',x.rehearsal)}${textarea('연혁','introHistory',x.history)}${textarea('비전','introVision',x.vision)}
    <div class="dialog-actions"><button class="secondary" onclick="state.currentPage='more';render()">취소</button><button class="danger" onclick="clearIntro()">내용 초기화</button><button class="primary" onclick="saveIntro()">저장</button></div>
  </section>`;
}
function saveIntro(){db.choirIntro={id:'intro1',name:v('introName'),englishName:v('introEng'),description:v('introDesc'),founded:v('introFounded'),service:v('introService'),rehearsal:v('introRehearsal'),history:v('introHistory'),vision:v('introVision')};saveDB();state.currentPage='more';render();}
function clearIntro(){if(confirm('소개 내용을 초기화할까요?')){db.choirIntro={id:'intro1',name:'소망 찬양대',englishName:'SOMANG CHOIR',description:'',founded:'',service:'',rehearsal:'',history:'',vision:''};saveDB();state.currentPage='more';render();}}

function openLeaderForm(id=''){const x=db.leaders.find(l=>l.id===id)||{role:'',name:'',photo:''};main.innerHTML=`<h2>${id?'섬기는 분 수정':'섬기는 분 등록'}</h2><section class="card form-card">${field('역할','leaderRole',x.role)}${field('이름','leaderName',x.name)}${field('사진 URL','leaderPhoto',x.photo)}<div class="dialog-actions"><button class="secondary" onclick="state.currentPage='more';render()">취소</button>${id?`<button class="danger" onclick="delLeader('${id}')">삭제</button>`:''}<button class="primary" onclick="saveLeader('${id}')">저장</button></div></section>`}
function saveLeader(id){const o={id:id||uid('l'),role:v('leaderRole'),name:v('leaderName'),photo:v('leaderPhoto')};db.leaders=id?db.leaders.map(x=>x.id===id?o:x):[...db.leaders,o];saveDB();state.currentPage='more';render()}
function delLeader(id){if(confirm('삭제할까요?')){db.leaders=db.leaders.filter(x=>x.id!==id);saveDB();state.currentPage='more';render()}}

function openPrayerForm(id=''){const x=db.prayers.find(p=>p.id===id)||{thuDate:'',sunDate:'',thuStart:'',thuEnd:'',sunStart:'',sunEnd:''};main.innerHTML=`<h2>${id?'기도당번 수정':'기도당번 등록'}</h2><section class="card form-card">
${field('목요일 날짜','prayThuDate',x.thuDate,'date')}${field('주일 날짜','praySunDate',x.sunDate,'date')}${field('목요일 시작기도','prayThuStart',x.thuStart)}${field('목요일 마침기도','prayThuEnd',x.thuEnd)}${field('주일 08:00 시작기도','praySunStart',x.sunStart)}${field('주일 예배후 마침기도','praySunEnd',x.sunEnd)}
<div class="dialog-actions"><button class="secondary" onclick="state.currentPage='more';render()">취소</button>${id?`<button class="danger" onclick="delPrayer('${id}')">삭제</button>`:''}<button class="primary" onclick="savePrayer('${id}')">저장</button></div></section>`}
function savePrayer(id){const o={id:id||uid('p'),thuDate:v('prayThuDate'),sunDate:v('praySunDate'),thuStart:v('prayThuStart'),thuEnd:v('prayThuEnd'),sunStart:v('praySunStart'),sunEnd:v('praySunEnd')};db.prayers=id?db.prayers.map(x=>x.id===id?o:x):[...db.prayers,o];saveDB();state.currentPage='more';render()}
function delPrayer(id){if(confirm('삭제할까요?')){db.prayers=db.prayers.filter(x=>x.id!==id);saveDB();state.currentPage='more';render()}}

function openGalleryForm(id=''){const x=db.gallery.find(g=>g.id===id)||{title:'',date:'',description:'',imageUrl:''};main.innerHTML=`<h2>${id?'갤러리 수정':'갤러리 등록'}</h2><section class="card form-card">
${field('행사명','galleryTitle',x.title)}${field('날짜','galleryDate',x.date,'date')}${textarea('설명','galleryDesc',x.description)}${field('대표사진 URL','galleryImage',x.imageUrl)}
<div class="dialog-actions"><button class="secondary" onclick="state.currentPage='more';render()">취소</button>${id?`<button class="danger" onclick="delGallery('${id}')">삭제</button>`:''}<button class="primary" onclick="saveGallery('${id}')">저장</button></div></section>`}
function saveGallery(id){const o={id:id||uid('g'),title:v('galleryTitle'),date:v('galleryDate'),description:v('galleryDesc'),imageUrl:v('galleryImage')};db.gallery=id?db.gallery.map(x=>x.id===id?o:x):[...db.gallery,o];saveDB();state.currentPage='more';render()}
function delGallery(id){if(confirm('삭제할까요?')){db.gallery=db.gallery.filter(x=>x.id!==id);saveDB();state.currentPage='more';render()}}

function renderAdmin(){
  if(!isSuperAdmin()){main.innerHTML='<p>접근 권한이 없습니다.</p>';return}
  const pending=db.users.filter(u=>u.status==='pending');
  main.innerHTML=`<div class="list-head"><div><h2 style="margin:0">최고관리자 센터</h2><div class="muted">모든 콘텐츠와 권한을 관리합니다.</div></div>${adminBadge()}</div>
  <section class="card"><h3>가입 승인</h3>${pending.length?pending.map(u=>`<div class="member"><div class="avatar">${u.name[0]}</div><div style="flex:1"><b>${u.name}</b><div class="muted">${u.title||''} · ${u.part||''}</div></div><button class="primary" onclick="approveUser('${u.id}')">승인</button><button class="secondary" onclick="rejectUser('${u.id}')">거절</button></div>`).join(''):'<div class="muted">승인 대기자가 없습니다.</div>'}</section>
  <section class="card"><h3>대원 및 권한</h3>${db.users.filter(u=>u.status==='approved').map(u=>`<div class="member"><div class="avatar">${u.name[0]}</div><div style="flex:1"><b>${u.name}</b><div class="muted">${u.title||''} · ${u.part||''}</div></div><button class="secondary" onclick="editUser('${u.id}')">권한설정</button></div>`).join('')}</section>
  <section class="card"><h3>콘텐츠 관리</h3><div class="grid2">
    <button class="primary" onclick="state.currentPage='notices';render()">공지</button><button class="primary" onclick="state.currentPage='songs';render()">연간 찬양곡</button>
    <button class="primary" onclick="openPrayerForm()">기도당번</button><button class="primary" onclick="openIntroForm()">찬양대 소개</button>
    <button class="primary" onclick="openLeaderForm()">섬기는 분들</button><button class="primary" onclick="openGalleryForm()">갤러리</button>
  </div></section>`;
}
function approveUser(id){const u=db.users.find(x=>x.id===id);if(u){u.status='approved';saveDB();renderAdmin()}}
function rejectUser(id){if(confirm('거절할까요?')){db.users=db.users.filter(x=>x.id!==id);saveDB();renderAdmin()}}

function editUser(id){
  const u=db.users.find(x=>x.id===id);if(!u)return;
  main.innerHTML=`<h2>권한 설정</h2><section class="card form-card">
  <div class="row"><span>이름</span><b>${u.name}</b></div><div class="row"><span>파트</span><b>${u.part||'-'}</b></div>
  <label>역할<select id="userRole"><option value="member" ${u.role==='member'?'selected':''}>일반대원</option><option value="manager" ${u.role==='manager'?'selected':''}>운영담당</option><option value="superadmin" ${u.role==='superadmin'?'selected':''}>최고관리자</option></select></label>
  <h3>세부 권한</h3>
  ${permCheck('notices','공지 관리',u)}${permCheck('songs','연간 찬양곡/연습영상/실제영상 관리',u)}${permCheck('prayers','기도당번 관리',u)}${permCheck('intro','찬양대 소개 관리',u)}${permCheck('leaders','섬기는 분들 관리',u)}${permCheck('gallery','갤러리 관리',u)}${permCheck('members','대원명단 관리',u)}${permCheck('permissions','다른 대원 권한 부여',u)}
  <div class="dialog-actions"><button class="secondary" onclick="state.currentPage='admin';render()">취소</button><button class="primary" onclick="saveUserPerms('${id}')">저장</button></div></section>`;
}
function permCheck(code,label,u){const c=(u.permissions||[]).includes(code)||u.role==='superadmin'?'checked':'';return `<label><input type="checkbox" id="perm_${code}" ${c}> ${label}</label>`}
function saveUserPerms(id){const u=db.users.find(x=>x.id===id);if(!u)return;u.role=v('userRole');const perms=['notices','songs','prayers','intro','leaders','gallery','members','permissions'];u.permissions=u.role==='superadmin'?['all']:perms.filter(p=>document.getElementById('perm_'+p).checked);saveDB();state.currentPage='admin';render();}

document.getElementById('profileBtn').addEventListener('click',()=>{const u=me();document.getElementById('profileContent').innerHTML=`<div class="row"><span>이름</span><b>${u.name}</b></div><div class="row"><span>권한</span><b>${isSuperAdmin()?'최고관리자 · 모든 권한':u.role}</b></div>`;document.getElementById('profileDialog').showModal()});
document.getElementById('joinForm').addEventListener('submit',e=>{if(e.submitter&&e.submitter.value==='cancel')return;e.preventDefault();const fd=new FormData(e.target);db.users.push({id:uid('u'),name:fd.get('name'),title:fd.get('title'),part:fd.get('part'),phone:fd.get('phone'),status:'pending',role:'member',permissions:[]});saveDB();document.getElementById('joinDialog').close();alert('가입 신청이 접수되었습니다.')});
nav.addEventListener('click',e=>{const b=e.target.closest('button[data-page]');if(!b)return;state.currentPage=b.dataset.page;render()});
render();
