/* ═══════════════════════════════════════════════════════════════
   AARYAN PANCHAL — combined interactions
   Design core (fly-down phone dock · per-role theme morph · reveal)
   + polish (cursor, magnetic, tilt, scroll progress, section rail,
   count-ups, scatter headlines, preloader).
   Dependency-free. Respects prefers-reduced-motion.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ── PRELOADER ── */
  var pre = document.getElementById('preloader');
  function dropPre(){ if(!pre) return; pre.classList.add('done'); document.body.style.overflow=''; setTimeout(function(){ if(pre&&pre.parentNode) pre.remove(); },800); }
  if (pre && !reduce){
    document.body.style.overflow='hidden';
    var cnt = pre.querySelector('.pl-count'); var n=0;
    var ti = setInterval(function(){ n=Math.min(100,n+Math.floor(Math.random()*16)+7); if(cnt) cnt.textContent=(''+n).padStart(3,'0')+' %'; if(n>=100) clearInterval(ti); },90);
    addEventListener('load', function(){ setTimeout(dropPre,900); }, {once:true});
    setTimeout(dropPre, 3000); // safety
  } else if (pre){ pre.remove(); }

  /* ── CUSTOM CURSOR + VIEW LABEL ── */
  if (fine && !reduce){
    var dot=document.getElementById('cur-dot'), ring=document.getElementById('cur-ring');
    if (dot && ring){
      document.body.classList.add('has-cursor');
      var mx=0,my=0,rx=0,ry=0;
      addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)'; }, {passive:true});
      (function loop(){ rx+=(mx-rx)*.14; ry+=(my-ry)*.14; ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
      document.querySelectorAll('a,button,.magnetic').forEach(function(el){
        el.addEventListener('mouseenter', function(){ document.body.classList.add('cur-link'); });
        el.addEventListener('mouseleave', function(){ document.body.classList.remove('cur-link'); });
      });
      document.querySelectorAll('[data-cursor]').forEach(function(el){
        el.addEventListener('mouseenter', function(){ document.body.classList.add('cur-view'); });
        el.addEventListener('mouseleave', function(){ document.body.classList.remove('cur-view'); });
      });
    }
  }

  /* ── MAGNETIC ── */
  if (fine && !reduce){
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){ var r=el.getBoundingClientRect(); el.style.transform='translate('+((e.clientX-(r.left+r.width/2))*.3)+'px,'+((e.clientY-(r.top+r.height/2))*.3)+'px)'; });
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  }

  /* ── 3D TILT ── */
  if (fine && !reduce){
    document.querySelectorAll('.tilt').forEach(function(el){
      el.addEventListener('mousemove', function(e){ var r=el.getBoundingClientRect(); var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5; el.style.transform='perspective(1000px) rotateX('+(-py*5)+'deg) rotateY('+(px*5)+'deg)'; });
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  }

  /* ── SCATTER → ASSEMBLE HEADLINES ── */
  function splitWords(el){
    var frag=document.createDocumentFragment(), i=0;
    function mk(content){
      var out=document.createElement('span'); out.className='w-out';
      var inn=document.createElement('span'); inn.className='w-in';
      if (typeof content==='string') inn.textContent=content; else inn.appendChild(content);
      var sign=(i%2)?1:-1;
      inn.style.setProperty('--dx',(sign*(14+(i%3)*12))+'px');
      inn.style.setProperty('--dr',(sign*(2+(i%2)*2))+'deg');
      inn.style.setProperty('--d',Math.min(i*0.04,0.8)+'s');
      out.appendChild(inn); i++; return out;
    }
    [].slice.call(el.childNodes).forEach(function(node){
      if (node.nodeType===3){
        node.textContent.split(/(\s+)/).forEach(function(tok){
          if (tok==='') return;
          if (/^\s+$/.test(tok)){ frag.appendChild(document.createTextNode(' ')); return; }
          frag.appendChild(mk(tok));
        });
      } else if (node.nodeName==='BR'){ frag.appendChild(document.createElement('br')); }
      else { frag.appendChild(mk(node.cloneNode(true))); }
    });
    el.innerHTML=''; el.appendChild(frag);
  }
  var splits=document.querySelectorAll('.split-words');
  if (!reduce) splits.forEach(splitWords);

  /* ── SCROLL REVEAL + SPLIT TRIGGER ── */
  (function(){
    var revs=document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)){
      revs.forEach(function(el){ el.classList.add('show'); });
      splits.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); }, {threshold:.12});
    revs.forEach(function(el){ io.observe(el); });
    var io2=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io2.unobserve(en.target); } }); }, {threshold:.2, rootMargin:'0px 0px -8% 0px'});
    splits.forEach(function(el){ io2.observe(el); });
    // safety net for paused-animation environments
    setInterval(function(){
      revs.forEach(function(el){ if(el.classList.contains('show'))return; var r=el.getBoundingClientRect(); if(r.top<innerHeight*0.92 && getComputedStyle(el).opacity<0.05){ el.classList.add('show'); } });
    },700);
  })();

  /* ── COUNT-UP STATS ── */
  (function(){
    var els=document.querySelectorAll('.count');
    if(!els.length) return;
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){
      var el=en.target; if(!en.isIntersecting||el._done) return; el._done=true;
      var to=parseFloat(el.dataset.to||'0'), dec=parseInt(el.dataset.dec||'0',10), pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
      if(reduce){ el.textContent=pre+to.toFixed(dec)+suf; return; }
      var t0=performance.now(), dur=1500;
      (function tick(now){ var p=Math.min((now-t0)/dur,1); var e=1-Math.pow(1-p,3); el.textContent=pre+(e*to).toFixed(dec)+suf; if(p<1) requestAnimationFrame(tick); })(performance.now());
    }); }, {threshold:.6});
    els.forEach(function(el){ io.observe(el); });
  })();

  /* ── SECTION INDEX RAIL (scroll-spy) ── */
  (function(){
    var links=document.querySelectorAll('#rail a');
    if(!links.length) return;
    var secs=[].slice.call(links).map(function(a){ return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ var id='#'+en.target.id; links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href')===id); }); } }); }, {threshold:.3, rootMargin:'-35% 0px -55% 0px'});
    secs.forEach(function(s){ io.observe(s); });
  })();

  /* ── SCROLL PROGRESS BAR ── */
  (function(){
    var bar=document.querySelector('#progress span');
    if(!bar) return;
    addEventListener('scroll', function(){ var max=document.documentElement.scrollHeight-innerHeight; bar.style.transform='scaleX('+(max>0?Math.min(scrollY/max,1):0)+')'; }, {passive:true});
  })();

  /* ── PHONE: scroll-driven dock from hero into the EpiSafe card ── */
  (function(){
    var phone=document.getElementById('heroPhone');
    var word=document.getElementById('heroWord');
    var hero=document.getElementById('top');
    var slot=document.getElementById('phoneSlot');
    var stage=document.getElementById('phoneStage');
    var work=document.getElementById('work');
    if(!phone||!slot||!work||!hero) return;

    var phw=0,phh=0,ready=false;
    function setup(){
      var h=Math.min(innerHeight*0.72, innerWidth*0.62, 700);
      phone.style.animation='none'; phone.style.position='fixed';
      phone.style.left='0'; phone.style.top='0'; phone.style.margin='0';
      phone.style.height=h+'px'; phone.style.width='auto'; phone.style.transformOrigin='center center';
      phw=phone.offsetWidth; phh=phone.offsetHeight; ready=phw>0;
    }
    if(phone.complete && phone.naturalWidth) setup();
    phone.addEventListener('load',setup);
    addEventListener('resize',setup);

    function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
    function easeIO(t){ return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }

    var px=0,py=0,cpx=0,cpy=0;
    if(!reduce){
      hero.addEventListener('pointermove',function(e){ var r=hero.getBoundingClientRect(); px=(e.clientX-r.left)/r.width-.5; py=(e.clientY-r.top)/r.height-.5; });
      hero.addEventListener('pointerleave',function(){ px=0;py=0; });
    }

    function frame(){
      if(ready){
        var sy=scrollY||pageYOffset;
        var start=innerHeight*0.10;
        var end=Math.max(work.offsetTop - innerHeight*0.30, start+1);
        var p=clamp((sy-start)/(end-start),0,1);
        var e=easeIO(p);
        var heroCx=innerWidth/2, heroCy=innerHeight*0.5 + phh*0.04;
        var s=slot.getBoundingClientRect();
        var slotCx=s.left+s.width/2, slotCy=s.top+s.height/2;
        var slotScale=Math.min(s.width/phw, s.height/phh);
        var jitter=reduce?0:(1-p)*Math.sin(Date.now()/900)*7;
        var cx=heroCx+(slotCx-heroCx)*e, cy=heroCy+(slotCy-heroCy)*e + jitter;
        var sc=1+(slotScale-1)*e;
        phone.style.transform='translate('+(cx-phw/2)+'px,'+(cy-phh/2)+'px) scale('+sc+')';
        // Lift the hero layer (and its fixed phone) above later sections while docking
        hero.style.zIndex = p>0.001 ? '40' : '';
        if(stage){ if(p>0.92) stage.classList.add('docked'); else stage.classList.remove('docked'); }
      }
      cpx+=(px-cpx)*.06; cpy+=(py-cpy)*.06;
      if(word) word.style.transform='translate('+(-cpx*14)+'px,'+(-cpy*8)+'px)';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ── THEME MORPH: switch palette to the role section nearest mid-viewport ── */
  (function(){
    var secs=document.querySelectorAll('[data-section-theme]');
    if(!secs.length) return;
    function pick(){
      var mid=innerHeight*0.42, best=null, bestD=1e9;
      secs.forEach(function(s){ var r=s.getBoundingClientRect(); if(r.top<innerHeight && r.bottom>0){ var d=Math.abs((r.top+r.bottom)/2 - mid); if(d<bestD){ bestD=d; best=s; } } });
      if(best){
        var t=best.getAttribute('data-section-theme');
        if(root.getAttribute('data-theme')!==t){
          root.setAttribute('data-theme',t);
          var pill=document.getElementById('statusPill');
          if(pill){
            var L={episafe:['Building EpiSafe','#work'],sga:['SGA Marketing','#sga'],neutral:['Open to work','#connect']}[t];
            var lbl=pill.querySelector('.pill-label');
            if(L&&lbl){ lbl.style.opacity='0'; setTimeout(function(){ lbl.textContent=L[0]; pill.setAttribute('href',L[1]); lbl.style.opacity='1'; },180); }
          }
        }
      }
    }
    addEventListener('scroll',pick,{passive:true});
    addEventListener('resize',pick);
    pick();
  })();

  /* ── BOOKING: scroll-driven cinematic reel (book.html) ── */
  (function(){
    var reel=document.getElementById('reel'); if(!reel) return;
    var canvas=document.getElementById('reelCanvas');
    var play=reel.querySelector('.reel-play');
    var time=reel.querySelector('.reel-time');
    function clamp(v,a,b){ return v<a?a:(v>b?b:v); }

    // Preloaded image sequence painted to a <canvas>. Scrubbing this way has
    // zero seek/decode latency (unlike video.currentTime), so the footage
    // advances perfectly smoothly with scroll position.
    var FRAMES=50;
    var ctx=(canvas&&canvas.getContext)?canvas.getContext('2d'):null;
    var imgs=new Array(FRAMES), ready=new Array(FRAMES), drawn=-1, target=0;
    function src(i){ return 'assets/reel/f_'+(''+(i+1)).padStart(3,'0')+'.webp'; }
    function draw(i){
      if(!ctx) return;
      if(!ready[i]){ // not loaded yet — paint the nearest frame we do have
        var j=i; while(j>=0&&!ready[j]) j--;
        if(j<0){ j=i; while(j<FRAMES&&!ready[j]) j++; }
        if(j<0||j>=FRAMES||!ready[j]) return; i=j;
      }
      if(i===drawn) return; drawn=i;
      ctx.drawImage(imgs[i],0,0,canvas.width,canvas.height);
    }
    if(ctx){
      for(var k=0;k<FRAMES;k++){ (function(k){
        var im=new Image(); im.decoding='async';
        im.onload=function(){ ready[k]=true; if(drawn===-1||k===target) draw(target); };
        im.src=src(k); imgs[k]=im;
      })(k); }
    }

    if(reduce){ reel.style.setProperty('--p','1'); return; }

    var ticking=false;
    function update(){
      ticking=false;
      var total=reel.offsetHeight-innerHeight;
      var p=total>0 ? clamp(-reel.getBoundingClientRect().top/total,0,1) : 0;
      reel.style.setProperty('--p',p.toFixed(4));
      if(play) play.style.opacity=Math.max(0,1-p*2.4);
      if(time){ var t=Math.round(p*10); time.textContent='00:'+(t<10?'0'+t:t); }
      target=Math.round(p*(FRAMES-1));
      draw(target);
    }
    function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(update); } }
    addEventListener('scroll',onScroll,{passive:true});
    addEventListener('resize',onScroll);
    update();
  })();

  /* ── BOOKING: compose request as an email (book.html) ── */
  (function(){
    var form=document.getElementById('bookForm'); if(!form) return;
    var EMAIL='aaryanpanchal@icloud.com';

    // Package buttons preselect a shoot type and jump to the form.
    document.querySelectorAll('[data-pick]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        var val=btn.getAttribute('data-pick');
        var input=form.querySelector('input[name="type"][value="'+val+'"]');
        if(input) input.checked=true;
      });
    });

    function val(name){ var el=form.elements[name]; return el ? (el.value||'').trim() : ''; }
    function typeVal(){ var c=form.querySelector('input[name="type"]:checked'); return c?c.value:'Not specified'; }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name=val('name'), email=val('email'), date=val('date'),
          loc=val('location'), budget=val('budget'), details=val('details'), type=typeVal();
      var subject='Shoot booking — '+type+(name?(' · '+name):'');
      var body=
        'Hi Aaryan — I\'d like to book a shoot.\n\n'+
        'Name: '+(name||'—')+'\n'+
        'Email: '+(email||'—')+'\n'+
        'Shoot type: '+type+'\n'+
        'Preferred date: '+(date||'Flexible')+'\n'+
        'Location: '+(loc||'—')+'\n'+
        'Budget: '+(budget||'—')+'\n\n'+
        'Details:\n'+(details||'—')+'\n';
      var sent=form.querySelector('.book-sent-link');
      if(sent) sent.href='mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      window.location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      form.classList.add('sent');
    });
  })();

  /* ── APP-ICON CURSOR TRAIL ──
     Icons of the tools/games Aaryan actually uses (Logic, Final Cut,
     Premiere, Photoshop, After Effects, Lightroom, Minecraft, games)
     spawn along the cursor path, pop in, drift and fade. */
  var spawnIconBurst=null;
  (function(){
    var SVGS=[
      // Logic Pro — waveform
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1c1c1f"/><g stroke="#f6a83c" stroke-width="4.5" stroke-linecap="round" fill="none"><path d="M13 27v10"/><path d="M22.5 19v26"/><path d="M32 13v38"/><path d="M41.5 21v22"/><path d="M51 27v10"/></g></svg>',
      // Final Cut Pro — gradient star
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9b5cff"/><stop offset="1" stop-color="#ff4fa3"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="#141417"/><path d="M32 9c2.6 12 11 20.4 23 23-12 2.6-20.4 11-23 23-2.6-12-11-20.4-23-23 12-2.6 20.4-11 23-23z" fill="url(#g)"/></svg>',
      // Premiere Pro
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#00005b"/><text x="32" y="42" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="27" font-weight="700" fill="#9999ff">Pr</text></svg>',
      // Photoshop
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#001e36"/><text x="32" y="42" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="27" font-weight="700" fill="#31a8ff">Ps</text></svg>',
      // After Effects
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1f0040"/><text x="32" y="42" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="27" font-weight="700" fill="#d291ff">Ae</text></svg>',
      // Lightroom
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#001e36"/><text x="32" y="42" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="27" font-weight="700" fill="#31a8ff">Lr</text></svg>',
      // Minecraft — grass block
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="c"><rect width="64" height="64" rx="14"/></clipPath></defs><g clip-path="url(#c)"><rect width="64" height="64" fill="#7a5535"/><rect x="6" y="34" width="7" height="7" fill="#6b4830"/><rect x="30" y="44" width="7" height="7" fill="#8a6442"/><rect x="48" y="30" width="7" height="7" fill="#6b4830"/><rect x="16" y="52" width="7" height="7" fill="#8a6442"/><rect x="44" y="52" width="7" height="7" fill="#6b4830"/><rect width="64" height="16" fill="#7cb84a"/><rect x="0" y="16" width="10" height="6" fill="#7cb84a"/><rect x="18" y="16" width="8" height="8" fill="#7cb84a"/><rect x="34" y="16" width="12" height="5" fill="#7cb84a"/><rect x="54" y="16" width="10" height="7" fill="#7cb84a"/><rect x="4" y="3" width="8" height="6" fill="#94d65e"/><rect x="40" y="6" width="9" height="6" fill="#94d65e"/><rect x="24" y="2" width="7" height="5" fill="#6aa33f"/></g></svg>',
      // Games — controller
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#17171b"/><path d="M22 21h20c8 0 13.5 6.4 13.5 14 0 6.6-4.3 11.5-10.4 11.5-4.3 0-6.8-2.4-9-5.5H27.9c-2.2 3.1-4.7 5.5-9 5.5C12.8 46.5 8.5 41.6 8.5 35c0-7.6 5.5-14 13.5-14z" fill="#e9e8ef"/><rect x="16" y="32" width="13" height="4.4" rx="1.4" fill="#17171b"/><rect x="20.3" y="27.7" width="4.4" height="13" rx="1.4" fill="#17171b"/><circle cx="42.5" cy="30.5" r="2.8" fill="#f08a20"/><circle cx="48.5" cy="36.5" r="2.8" fill="#d12a40"/></svg>'
    ];
    var urls=SVGS.map(function(s){ return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")'; });
    var layer=document.createElement('div');
    layer.id='icon-trail'; layer.setAttribute('aria-hidden','true');
    document.body.appendChild(layer);

    var idx=0, live=0, MAX=26;
    function spawn(x,y,burst,ang,dist){
      if(!burst && live>=MAX) return;
      var el=document.createElement('div'); el.className='cur-icon'+(burst?' burst':'');
      el.style.backgroundImage=urls[idx++ % urls.length];
      el.style.left=x+'px'; el.style.top=y+'px';
      var r0=Math.random()*30-15, r1=r0+(Math.random()*50-25);
      var tx=Math.random()*44-22, ty=34+Math.random()*40;
      if(burst){ tx=Math.cos(ang)*dist; ty=Math.sin(ang)*dist; r1=r0+(Math.random()*160-80); }
      el.style.setProperty('--r0',r0+'deg'); el.style.setProperty('--r1',r1+'deg');
      el.style.setProperty('--tx',tx+'px'); el.style.setProperty('--ty',ty+'px');
      live++;
      el.addEventListener('animationend',function(){ live--; el.remove(); });
      layer.appendChild(el);
    }
    spawnIconBurst=function(x,y){
      var n=12;
      for(var i=0;i<n;i++) spawn(x,y,true,(Math.PI*2*i)/n+Math.random()*.5,70+Math.random()*90);
    };
    if(fine && !reduce){
      var lastX=null,lastY=null,acc=0,GAP=72;
      addEventListener('mousemove',function(e){
        if(pre && pre.parentNode && !pre.classList.contains('done')) return;
        if(document.body.classList.contains('trail-off')) return; // games/sequencer own the pointer there
        if(lastX!==null) acc+=Math.hypot(e.clientX-lastX,e.clientY-lastY);
        lastX=e.clientX; lastY=e.clientY;
        if(acc>=GAP){ acc=0; spawn(e.clientX+(Math.random()*12-6),e.clientY+(Math.random()*12-6),false); }
      },{passive:true});
    }
  })();

  /* ── EMAIL: copy to clipboard + icon burst on click ── */
  (function(){
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
      a.addEventListener('click',function(e){
        var em=a.getAttribute('href').replace(/^mailto:/,'').split('?')[0];
        if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(em).catch(function(){});
        if(spawnIconBurst && !reduce) spawnIconBurst(e.clientX,e.clientY);
        var t=document.createElement('div'); t.className='copy-toast'; t.textContent='Email copied ✓';
        t.style.left=e.clientX+'px'; t.style.top=e.clientY+'px';
        document.body.appendChild(t);
        setTimeout(function(){ t.remove(); },1700);
      });
    });
  })();

  /* ── BIG FOOTER WORDMARK: cursor-lit, scrolls back to top ── */
  (function(){
    var bf=document.querySelector('.bigfoot'); if(!bf) return;
    var word=bf.querySelector('.bigfoot-word'); if(!word) return;
    bf.classList.add('bf-live');
    bf.addEventListener('click',function(){ scrollTo({top:0,behavior:reduce?'auto':'smooth'}); });
    if(fine && !reduce){
      var hint=document.createElement('div'); hint.className='bf-hint'; hint.textContent='↑ Back to top'; bf.appendChild(hint);
      bf.addEventListener('mousemove',function(e){
        var r=word.getBoundingClientRect();
        word.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(2)+'%');
      });
      bf.addEventListener('mouseenter',function(){ document.body.classList.add('cur-link'); });
      bf.addEventListener('mouseleave',function(){ document.body.classList.remove('cur-link'); });
    }
  })();

  /* ── MARQUEE: skews with scroll velocity ── */
  (function(){
    var track=document.querySelector('.marquee-track'); if(!track||reduce) return;
    var mq=track.parentElement, last=scrollY, v=0, cur=0, raf=null;
    function tick(){
      cur+=(v-cur)*.12; v*=.86;
      var s=Math.max(-8,Math.min(8,cur*.4));
      if(Math.abs(cur)>.05||Math.abs(v)>.05){ mq.style.transform='skewX('+s.toFixed(3)+'deg)'; raf=requestAnimationFrame(tick); }
      else { mq.style.transform=''; raf=null; }
    }
    addEventListener('scroll',function(){
      var yv=scrollY; v+=(yv-last)*.3; last=yv;
      if(!raf) raf=requestAnimationFrame(tick);
    },{passive:true});
  })();

  /* ── SECRETS: konami warp, logo barrel roll, console note ── */
  (function(){
    // ↑ ↑ ↓ ↓ ← → ← → B A  →  the void
    var SEQ=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
    var pos=0;
    addEventListener('keydown',function(e){
      pos = e.code===SEQ[pos] ? pos+1 : (e.code===SEQ[0] ? 1 : 0);
      if(pos===SEQ.length){
        pos=0;
        document.body.classList.add('warp');
        setTimeout(function(){ location.href='void.html'; }, reduce?0:620);
      }
    });

    // the logo can take five hits
    var logo=document.querySelector('.nav-logo'), taps=0, rolling=false;
    if(logo && logo.getAttribute('href')==='#top'){
      logo.addEventListener('click',function(){
        taps++;
        if(spawnIconBurst && !reduce){
          var r=logo.getBoundingClientRect();
          spawnIconBurst(r.left+r.width/2, r.top+r.height/2);
        }
        if(taps>=5 && !rolling && !reduce){
          taps=0; rolling=true;
          // pivot the roll on the current viewport center, not the page center
          document.body.style.transformOrigin='50% '+(scrollY+innerHeight/2)+'px';
          document.body.classList.add('roll');
          setTimeout(function(){
            document.body.classList.remove('roll');
            document.body.style.transformOrigin='';
            rolling=false;
          },1450);
        }
      });
    }

    try{
      console.log('%c▲ hello, curious one.','color:#f08a20;font-size:18px;font-weight:bold;');
      console.log('%cCuriosity gets rewarded around here.\nTry the old code on your keyboard: ↑ ↑ ↓ ↓ ← → ← → B A\n(or visit /void.html directly — but where’s the fun in that?)','color:#a3a2a8;font-size:12px;line-height:1.7;');
    }catch(err){}
  })();

  /* ── YEAR ── */
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
})();
