(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
$('#year').textContent=new Date().getFullYear();

/* Menu */
const mt=$('.menu-toggle'),nav=$('.nav-links');
mt.onclick=()=>{const o=nav.classList.toggle('open');mt.setAttribute('aria-expanded',o)};
$$('.nav-links a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));

/* Typing roles */
const roles=['Python Developer','Software Developer','Python Instructor','Data & AI Enthusiast','Problem Solver'];
const rr=$('#rotating-role');let ri=0,ci=0,del=false;
(function type(){const w=roles[ri];rr.textContent=w.slice(0,ci+=del?-1:1);let t=del?45:90;
if(!del&&ci===w.length){del=true;t=1400}else if(del&&!ci){del=false;ri=(ri+1)%roles.length;t=300}setTimeout(type,t)})();

/* Reveal with stagger */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
function observe(){$$('.reveal:not(.in)').forEach((el,i)=>{el.style.transitionDelay=(i%4)*90+'ms';io.observe(el)})}

/* Projects */
const grid=$('#projects-grid'),dlg=$('#project-dialog'),dc=$('#dialog-content');
grid.innerHTML=(window.PROJECTS||[]).map((p,i)=>`<article class="project-card tilt" data-cat="${p.cat}" data-i="${i}" tabindex="0" role="button" aria-label="Open ${p.title}">
<div class="project-art" style="--bgc:${p.color}">${p.icon}</div><span class="project-status">● ${p.status}</span><h3>${p.title}</h3><p>${p.desc}</p>
<div class="tag-list">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div></article>`).join('');
function openP(i){const p=PROJECTS[i];dc.innerHTML=`<p class="eyebrow">${p.cat.toUpperCase()}</p><h3>${p.title}</h3><p>${p.long}</p><div class="tag-list">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
<div class="dialog-links">${p.github?`<a class="button button-primary" href="${p.github}" target="_blank" rel="noopener">Source code ↗</a>`:''}${p.demo?`<a class="button button-glass" href="${p.demo}" target="_blank" rel="noopener">Live demo ↗</a>`:''}</div>`;dlg.showModal()}
grid.addEventListener('click',e=>{const c=e.target.closest('.project-card');if(c)openP(c.dataset.i)});
grid.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset.i)openP(e.target.dataset.i)});
$('.dialog-close').onclick=()=>dlg.close();dlg.onclick=e=>{if(e.target===dlg)dlg.close()};
$$('.filter-button').forEach(b=>b.onclick=()=>{$$('.filter-button').forEach(x=>x.classList.toggle('active',x===b));
$$('.project-card').forEach(c=>{c.classList.toggle('hide',b.dataset.filter!=='all'&&c.dataset.cat!==b.dataset.filter)})});

/* 3D tilt on cards */
$$('.glass-card,.skill-highlight').forEach(c=>c.classList.add('tilt'));
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.tilt');
if(c&&!reduce){const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*12+'deg');c.style.setProperty('--rx',(-((e.clientY-r.top)/r.height-.5))*12+'deg')}});
document.addEventListener('pointerout',e=>{const c=e.target.closest&&e.target.closest('.tilt');if(c){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}});

/* Scroll progress, active nav, cursor glow */
const bar=$('.scroll-progress'),glow=$('.cursor-glow'),links=$$('.nav-links a[href^="#"]');
let sy=0;
addEventListener('scroll',()=>{const m=document.documentElement.scrollHeight-innerHeight;sy=scrollY;bar.style.transform=`scaleX(${sy/m})`},{passive:true});
addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50%'});
$$('main section[id]').forEach(s=>so.observe(s));

/* Contact form -> mailto */
$('#contact-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);
location.href=`mailto:samiran.sirni@gmail.com?subject=${encodeURIComponent('Portfolio message from '+f.get('name'))}&body=${encodeURIComponent(f.get('message')+'\n\n— '+f.get('name')+' ('+f.get('email')+')')}`;
$('#form-status').textContent='Opening your email app…'};

observe();

/* Three.js 3D world */
if(!window.THREE||reduce)return;
document.body.classList.add('has-3d');
const cv=$('#bg3d'),R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.z=9;
const hero=new THREE.Group();S.add(hero);
const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7,1),new THREE.MeshStandardMaterial({color:0x6d4aff,flatShading:true,metalness:.6,roughness:.25,emissive:0x1b0b5e}));
const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(2.3,1),new THREE.MeshBasicMaterial({color:0x22d3ee,wireframe:true,transparent:true,opacity:.35}));
const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(3.1,.05,220,12,2,3),new THREE.MeshBasicMaterial({color:0xf472b6}));
const ring=new THREE.Mesh(new THREE.TorusGeometry(3.6,.02,8,120),new THREE.MeshBasicMaterial({color:0x8b5cf6}));ring.rotation.x=1.2;
hero.add(core,wire,knot,ring);
S.add(new THREE.AmbientLight(0x8888ff,.6));
const L1=new THREE.PointLight(0x22d3ee,2.2,30);L1.position.set(5,4,6);const L2=new THREE.PointLight(0xf472b6,2,30);L2.position.set(-6,-3,4);S.add(L1,L2);
const N=1600,pos=new Float32Array(N*3);for(let i=0;i<N*3;i++)pos[i]=(Math.random()-.5)*50;
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
const pts=new THREE.Points(pg,new THREE.PointsMaterial({size:.06,color:0x9aa3ff,transparent:true,opacity:.8}));S.add(pts);
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();hero.userData.x=w>900?3.4:0}
size();addEventListener('resize',size);
let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
const clk=new THREE.Clock();
(function loop(){const t=clk.getElapsedTime(),sp=sy/innerHeight;
core.rotation.set(t*.3,t*.4,0);wire.rotation.set(-t*.2,t*.25,0);knot.rotation.set(t*.15,-t*.2,t*.1);ring.rotation.z=t*.3;
const s=1+Math.sin(t*1.5)*.04;core.scale.setScalar(s);
const tx=hero.userData.x*Math.max(0,1-sp*1.2)+Math.sin(sp*2)*(hero.userData.x?2.5:0),ty=sp*1.5;
hero.position.x+=(tx-hero.position.x)*.06;hero.position.y+=(ty-hero.position.y)*.06;
hero.scale.setScalar(Math.max(.45,1-sp*.25));
pts.rotation.y=t*.02+sp*.4;pts.rotation.x=sp*.3;
cam.position.x+=(mx*2-cam.position.x)*.05;cam.position.y+=(-my*2-cam.position.y)*.05;cam.lookAt(0,0,0);
R.render(S,cam);requestAnimationFrame(loop)})();
})();
