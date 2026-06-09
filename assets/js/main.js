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
    var play=reel.querySelector('.reel-play');
    var time=reel.querySelector('.reel-time');
    var vid=reel.querySelector('video');
    function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
    if(reduce){ reel.style.setProperty('--p','1'); return; }

    // If a real video source is wired up, let it autoplay as ambient footage.
    if(vid && vid.querySelector('source')){
      vid.muted=true;
      var io=new IntersectionObserver(function(es){ es.forEach(function(en){
        if(en.isIntersecting){ vid.play().catch(function(){}); } else { vid.pause(); }
      }); }, {threshold:.15});
      io.observe(reel);
    }

    var ticking=false;
    function update(){
      ticking=false;
      var total=reel.offsetHeight-innerHeight;
      var p=total>0 ? clamp(-reel.getBoundingClientRect().top/total,0,1) : 0;
      reel.style.setProperty('--p',p.toFixed(4));
      if(play) play.style.opacity=Math.max(0,1-p*2.4);
      if(time){ var t=Math.round(p*100); time.textContent='00:'+(t<10?'0'+t:t); }
    }
    function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(update); } }
    addEventListener('scroll',onScroll,{passive:true});
    addEventListener('resize',onScroll);
    update();
  })();

  /* ── BOOKING: compose request as an email (book.html) ── */
  (function(){
    var form=document.getElementById('bookForm'); if(!form) return;
    var EMAIL='aaryanpanchal270@gmail.com';

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

  /* ── YEAR ── */
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
})();
