/* ═══════════════════════════════════════════════════════════════
   THE PLAYGROUND — play.html interactions
   Generative hero field · Beat Lab (Web Audio step sequencer) ·
   Drone Run · Reflex Lab · Polaroid wall · dossier reveals.
   Dependency-free. Respects prefers-reduced-motion.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* Suppress the sitewide icon trail over interactive zones (it would
     fight the games / sequencer / draggable photos for attention). */
  document.querySelectorAll('[data-no-trail]').forEach(function (el) {
    el.addEventListener('pointerenter', function () { document.body.classList.add('trail-off'); });
    el.addEventListener('pointerleave', function () { document.body.classList.remove('trail-off'); });
  });

  /* ── SHARED AUDIO (lazy — created on first user gesture) ── */
  var AC = null, master = null, analyser = null, noiseBuf = null;
  function audio() {
    if (AC) { if (AC.state === 'suspended') AC.resume(); return AC; }
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    AC = new Ctor();
    master = AC.createGain(); master.gain.value = 0.85;
    analyser = AC.createAnalyser(); analyser.fftSize = 2048;
    master.connect(analyser); analyser.connect(AC.destination);
    var len = AC.sampleRate, buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noiseBuf = buf;
    return AC;
  }
  function env(t, peak, dur) {
    var g = AC.createGain();
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    g.connect(master); return g;
  }
  var sfx = {
    kick: function (t) {
      var o = AC.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(35, t + 0.12);
      o.connect(env(t, 1, 0.26)); o.start(t); o.stop(t + 0.3);
    },
    snare: function (t) {
      var s = AC.createBufferSource(); s.buffer = noiseBuf;
      var bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 0.9;
      s.connect(bp); bp.connect(env(t, 0.7, 0.18)); s.start(t); s.stop(t + 0.2);
      var o = AC.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(190, t);
      o.connect(env(t, 0.35, 0.12)); o.start(t); o.stop(t + 0.14);
    },
    hat: function (t) {
      var s = AC.createBufferSource(); s.buffer = noiseBuf;
      var hp = AC.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7400;
      s.connect(hp); hp.connect(env(t, 0.32, 0.055)); s.start(t); s.stop(t + 0.08);
    },
    bass: function (t, freq) {
      var o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, t);
      var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t);
      lp.frequency.exponentialRampToValueAtTime(220, t + 0.22);
      o.connect(lp); lp.connect(env(t, 0.55, 0.24)); o.start(t); o.stop(t + 0.28);
    },
    blip: function (freq) {
      if (!audio()) return; var t = AC.currentTime;
      var o = AC.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(freq || 880, t);
      o.connect(env(t, 0.18, 0.07)); o.start(t); o.stop(t + 0.09);
    },
    crash: function () {
      if (!audio()) return; var t = AC.currentTime;
      var s = AC.createBufferSource(); s.buffer = noiseBuf;
      var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(2800, t);
      lp.frequency.exponentialRampToValueAtTime(160, t + 0.35);
      s.connect(lp); lp.connect(env(t, 0.6, 0.4)); s.start(t); s.stop(t + 0.45);
    }
  };

  /* ── HERO: generative flow field ── */
  (function () {
    var cv = document.getElementById('field'); if (!cv) return;
    var ctx = cv.getContext('2d'); if (!ctx) return;
    var DPR = Math.min(devicePixelRatio || 1, 2);
    var W = 0, H = 0, ps = [], sparks = [], t = 0;
    var PAL = ['#9b5cff', '#f08a20', '#5bb0ff', '#ff4fa3'];
    var mx = -9999, my = -9999, mdown = false;
    var running = true, visible = true;

    function size() {
      var r = cv.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var n = clamp(Math.round(W * H / 9000), 70, 190);
      ps.length = 0;
      for (var i = 0; i < n; i++) ps.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: 0, vy: 0, c: PAL[i % PAL.length], r: 0.8 + Math.random() * 1.5
      });
      ctx.fillStyle = '#0a0810'; ctx.fillRect(0, 0, W, H);
    }
    size(); addEventListener('resize', size);

    cv.parentElement.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
    });
    cv.parentElement.addEventListener('pointerleave', function () { mx = -9999; my = -9999; });
    cv.addEventListener('pointerdown', function (e) {
      var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      mdown = true;
      for (var i = 0; i < 26; i++) {
        var a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 5;
        sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: PAL[i % PAL.length] });
      }
      ps.forEach(function (p) {
        var dx = p.x - x, dy = p.y - y, d = Math.hypot(dx, dy);
        if (d < 240 && d > 0.01) { var f = (240 - d) / 240 * 7; p.vx += dx / d * f; p.vy += dy / d * f; }
      });
      sfx.blip(220 + Math.random() * 440);
    });
    addEventListener('pointerup', function () { mdown = false; });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(cv);
    }
    document.addEventListener('visibilitychange', function () { running = !document.hidden; });

    function frame() {
      requestAnimationFrame(frame);
      if (!running || !visible) return;
      t++;
      ctx.fillStyle = 'rgba(10,8,16,0.16)'; ctx.fillRect(0, 0, W, H);

      var i, p, speed = reduce ? 0.012 : 0.055;
      for (i = 0; i < ps.length; i++) {
        p = ps[i];
        var a = (Math.sin(p.x * 0.0016 + t * 0.004) + Math.cos(p.y * 0.0019 - t * 0.0032)) * Math.PI;
        p.vx += Math.cos(a) * speed; p.vy += Math.sin(a) * speed;
        var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 19600 && d2 > 1) { // 140px halo: gently repel
          var d = Math.sqrt(d2), f = (140 - d) / 140 * 0.5;
          p.vx += dx / d * f; p.vy += dy / d * f;
        }
        p.vx *= 0.96; p.vy *= 0.96;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -12) p.x = W + 12; if (p.x > W + 12) p.x = -12;
        if (p.y < -12) p.y = H + 12; if (p.y > H + 12) p.y = -12;
      }
      // constellation lines (sampled pairs to stay cheap)
      ctx.lineWidth = 1;
      for (i = 0; i < ps.length; i++) {
        p = ps[i];
        for (var j = i + 1; j < Math.min(i + 7, ps.length); j++) {
          var q = ps[j], ddx = p.x - q.x, ddy = p.y - q.y, dd = ddx * ddx + ddy * ddy;
          if (dd < 8100) {
            ctx.strokeStyle = 'rgba(190,170,255,' + (0.16 * (1 - dd / 8100)).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      for (i = sparks.length - 1; i >= 0; i--) {
        var s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vx *= 0.96; s.vy *= 0.96; s.life -= 0.02;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = s.life; ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2.4 * s.life + 0.6, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    requestAnimationFrame(frame);
  })();

  /* ── BEAT LAB: 4×16 step sequencer ── */
  (function () {
    var seq = document.getElementById('seq'); if (!seq) return;
    var rowsEl = seq.querySelector('.seq-rows');
    var playBtn = seq.querySelector('.seq-play');
    var bpmIn = seq.querySelector('#bpm');
    var bpmOut = seq.querySelector('#bpmOut');
    var scope = seq.querySelector('.seq-scope');
    var STEPS = 16;
    var ROWS = [
      { name: 'Kick', color: '#f08a20', play: function (t) { sfx.kick(t); } },
      { name: 'Snare', color: '#ff4fa3', play: function (t) { sfx.snare(t); } },
      { name: 'Hat', color: '#5bb0ff', play: function (t) { sfx.hat(t); } },
      { name: 'Bass', color: '#9b5cff', play: function (t, col) { sfx.bass(t, SCALE[(col * 3) % SCALE.length]); } }
    ];
    var SCALE = [55, 65.41, 73.42, 82.41, 98, 110, 130.81, 146.83]; // A minor pentatonic-ish
    var grid = ROWS.map(function () { return new Array(STEPS).fill(false); });
    var cells = [];

    ROWS.forEach(function (row, r) {
      var line = document.createElement('div'); line.className = 'seq-row';
      var lab = document.createElement('div'); lab.className = 'seq-label';
      lab.innerHTML = '<i style="--row:' + row.color + ';background:' + row.color + '"></i>' + row.name;
      line.appendChild(lab);
      cells[r] = [];
      for (var c = 0; c < STEPS; c++) (function (r, c) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'seq-cell'; b.style.setProperty('--row', row.color);
        b.setAttribute('aria-label', row.name + ' step ' + (c + 1));
        b.addEventListener('click', function () {
          grid[r][c] = !grid[r][c];
          b.classList.toggle('on', grid[r][c]);
          if (grid[r][c] && audio()) row.play(AC.currentTime, c); // audition
        });
        cells[r][c] = b; line.appendChild(b);
      })(r, c);
      rowsEl.appendChild(line);
    });

    function setPattern(p) {
      for (var r = 0; r < ROWS.length; r++) for (var c = 0; c < STEPS; c++) {
        grid[r][c] = p ? p[r].indexOf(c) > -1 : false;
        cells[r][c].classList.toggle('on', grid[r][c]);
      }
    }
    var PRESETS = {
      boombap: [[0, 7, 10], [4, 12], [0, 2, 4, 6, 8, 10, 12, 14], [0, 7, 10, 14]],
      house: [[0, 4, 8, 12], [4, 12], [2, 6, 10, 14], [0, 3, 8, 11]]
    };
    seq.querySelectorAll('[data-preset]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-preset');
        setPattern(k === 'clear' ? null : PRESETS[k]);
      });
    });
    setPattern(PRESETS.boombap); // load something that already slaps

    var playing = false, timer = null, nextT = 0, step = 0, queue = [];
    var bpm = parseInt(bpmIn.value, 10) || 92;
    bpmIn.addEventListener('input', function () {
      bpm = parseInt(bpmIn.value, 10);
      bpmOut.textContent = bpm + ' BPM';
    });

    function schedule() {
      while (nextT < AC.currentTime + 0.12) {
        for (var r = 0; r < ROWS.length; r++) if (grid[r][step]) ROWS[r].play(nextT, step);
        queue.push({ step: step, t: nextT });
        nextT += 60 / bpm / 4;
        step = (step + 1) % STEPS;
      }
    }
    var lastVis = -1;
    function paintPlayhead() {
      if (!playing) return;
      requestAnimationFrame(paintPlayhead);
      var now = AC.currentTime, cur = lastVis;
      while (queue.length && queue[0].t <= now) cur = queue.shift().step;
      if (cur !== lastVis && cur > -1) {
        for (var r = 0; r < ROWS.length; r++) {
          if (lastVis > -1) cells[r][lastVis].classList.remove('ph');
          cells[r][cur].classList.add('ph');
        }
        lastVis = cur;
      }
      drawScope();
    }
    var sctx = scope.getContext('2d'), sw = 0, sh = 0;
    function sizeScope() {
      var r = scope.getBoundingClientRect();
      sw = scope.width = Math.max(1, Math.round(r.width * 2));
      sh = scope.height = Math.max(1, Math.round(r.height * 2));
    }
    sizeScope(); addEventListener('resize', sizeScope);
    var wave = new Uint8Array(2048);
    function drawScope() {
      if (!analyser || !sctx) return;
      analyser.getByteTimeDomainData(wave);
      sctx.clearRect(0, 0, sw, sh);
      sctx.lineWidth = 2.5; sctx.strokeStyle = '#9b5cff'; sctx.beginPath();
      for (var i = 0; i < wave.length; i += 4) {
        var x = i / wave.length * sw, y = wave[i] / 255 * sh;
        i === 0 ? sctx.moveTo(x, y) : sctx.lineTo(x, y);
      }
      sctx.stroke();
    }

    playBtn.addEventListener('click', function () {
      if (!audio()) return;
      playing = !playing;
      seq.classList.toggle('playing', playing);
      if (playing) {
        step = 0; nextT = AC.currentTime + 0.06; queue.length = 0;
        timer = setInterval(schedule, 25);
        requestAnimationFrame(paintPlayhead);
      } else {
        clearInterval(timer); queue.length = 0;
        if (lastVis > -1) for (var r = 0; r < ROWS.length; r++) cells[r][lastVis].classList.remove('ph');
        lastVis = -1;
        if (sctx) sctx.clearRect(0, 0, sw, sh);
      }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && playing) playBtn.click(); // stop politely in background
    });
  })();

  /* ── ARCADE: DRONE RUN ── */
  (function () {
    var cv = document.getElementById('droneCanvas'); if (!cv) return;
    var ctx = cv.getContext('2d');
    var overlay = document.getElementById('droneOverlay');
    var big = overlay.querySelector('.go-big'), sub = overlay.querySelector('.go-sub');
    var scoreEl = document.getElementById('droneScore'), bestEl = document.getElementById('droneBest');
    var W = 720, H = 450; cv.width = W; cv.height = H;
    var best = parseInt(localStorage.getItem('ap_droneBest') || '0', 10);
    bestEl.textContent = best;

    var state = 'idle', drone, towers, score, tPrev, spawnAcc, shake, prop;
    var stars = [];
    for (var i = 0; i < 60; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, z: 0.3 + Math.random() * 0.7 });
    var inView = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: 0.25 }).observe(cv);
    }

    function reset() {
      drone = { x: 150, y: H / 2, vy: 0 };
      towers = []; score = 0; spawnAcc = 1.2; shake = 0; prop = 0;
      scoreEl.textContent = '0';
    }
    reset();

    function flap() {
      if (state === 'run') { drone.vy = -330; sfx.blip(660); }
      else if (state === 'idle' || state === 'dead') {
        reset(); state = 'run'; overlay.classList.add('hidden'); tPrev = performance.now();
        requestAnimationFrame(loop);
      }
    }
    cv.addEventListener('pointerdown', function (e) { e.preventDefault(); audio(); flap(); });
    addEventListener('keydown', function (e) {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && inView && state === 'run') { e.preventDefault(); flap(); }
    });

    function die() {
      state = 'dead'; shake = 14; sfx.crash();
      if (score > best) { best = score; localStorage.setItem('ap_droneBest', '' + best); }
      bestEl.textContent = best;
      big.textContent = 'Crashed at ' + score;
      sub.textContent = (score >= best && score > 0 ? 'New record · ' : '') + 'Tap to fly again';
      overlay.classList.remove('hidden');
    }

    function loop(now) {
      if (state !== 'run') return;
      if (!inView || document.hidden) { tPrev = now; requestAnimationFrame(loop); return; }
      var dt = Math.min((now - tPrev) / 1000, 1 / 30); tPrev = now;
      requestAnimationFrame(loop);

      // physics
      drone.vy += 1150 * dt; drone.y += drone.vy * dt; prop += dt * 40;
      spawnAcc += dt;
      var interval = Math.max(1.25, 1.9 - score * 0.02);
      if (spawnAcc >= interval) {
        spawnAcc = 0;
        var gap = Math.max(132, 178 - score * 1.5);
        var gy = 70 + Math.random() * (H - 140 - gap);
        towers.push({ x: W + 40, w: 62, top: gy, bot: gy + gap, passed: false });
      }
      var speed = 235 + score * 2.5;
      for (var i = towers.length - 1; i >= 0; i--) {
        var tw = towers[i]; tw.x -= speed * dt;
        if (!tw.passed && tw.x + tw.w < drone.x) { tw.passed = true; score++; scoreEl.textContent = score; sfx.blip(990); }
        if (tw.x + tw.w < -60) towers.splice(i, 1);
      }
      // collisions (16px radius vs tower rects + bounds)
      if (drone.y < 14 || drone.y > H - 14) return die();
      for (i = 0; i < towers.length; i++) {
        var t2 = towers[i];
        if (drone.x + 16 > t2.x && drone.x - 16 < t2.x + t2.w &&
            (drone.y - 13 < t2.top || drone.y + 13 > t2.bot)) return die();
      }
      draw();
    }

    function draw() {
      ctx.save();
      if (shake > 0) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= 0.86; }
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b0a16'); g.addColorStop(1, '#141021');
      ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
      // stars
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.x -= s.z * 0.7; if (s.x < 0) s.x = W;
        ctx.globalAlpha = s.z * 0.6; ctx.fillStyle = '#cfc4ff';
        ctx.fillRect(s.x, s.y, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;
      // towers
      for (i = 0; i < towers.length; i++) {
        var t2 = towers[i];
        ctx.fillStyle = '#1d1830';
        ctx.strokeStyle = 'rgba(155,92,255,.5)'; ctx.lineWidth = 2;
        rRect(t2.x, -8, t2.w, t2.top + 8, 7); rRect(t2.x, t2.bot, t2.w, H - t2.bot + 8, 7);
        // windows
        ctx.fillStyle = 'rgba(240,138,32,.35)';
        for (var wy = 16; wy < t2.top - 10; wy += 26)
          for (var wx = t2.x + 12; wx < t2.x + t2.w - 10; wx += 20) ctx.fillRect(wx, wy, 7, 9);
        for (wy = t2.bot + 14; wy < H - 12; wy += 26)
          for (wx = t2.x + 12; wx < t2.x + t2.w - 10; wx += 20) ctx.fillRect(wx, wy, 7, 9);
        // gap beacons
        ctx.fillStyle = '#9b5cff';
        ctx.fillRect(t2.x, t2.top - 4, t2.w, 4); ctx.fillRect(t2.x, t2.bot, t2.w, 4);
      }
      // drone
      var d = drone, tilt = clamp(d.vy / 700, -0.4, 0.55);
      ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(tilt);
      ctx.strokeStyle = '#8b86a0'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-16, -6); ctx.lineTo(-26, -12); ctx.moveTo(16, -6); ctx.lineTo(26, -12); ctx.stroke();
      var pl = 10 * Math.abs(Math.sin(prop)); // spinning props
      ctx.strokeStyle = '#cfc4ff'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-26 - pl, -13); ctx.lineTo(-26 + pl, -13); ctx.moveTo(26 - pl, -13); ctx.lineTo(26 + pl, -13); ctx.stroke();
      ctx.fillStyle = '#e9e8ef';
      ctx.beginPath(); ctx.ellipse(0, 0, 17, 10, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#9b5cff';
      ctx.beginPath(); ctx.ellipse(6, -2, 5, 4, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#f08a20'; ctx.fillRect(-19, 7, 4, 3); ctx.fillRect(15, 7, 4, 3);
      ctx.restore();
      ctx.restore();
    }
    function rRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    draw(); // idle backdrop
  })();

  /* ── ARCADE: REFLEX LAB ── */
  (function () {
    var zone = document.getElementById('reflexZone'); if (!zone) return;
    var stateEl = zone.querySelector('.rx-state'), bigEl = zone.querySelector('.rx-big'), noteEl = zone.querySelector('.rx-note');
    var bestEl = document.getElementById('reflexBest'), avgEl = document.getElementById('reflexAvg');
    var best = parseInt(localStorage.getItem('ap_reflexBest') || '0', 10);
    var hist = [];
    if (best) bestEl.textContent = best + 'ms';
    var state = 'idle', timer = null, t0 = 0;

    function set(s, st, b, n) { state = s; stateEl.textContent = st; bigEl.textContent = b; noteEl.textContent = n; zone.className = ''; zone.id = 'reflexZone'; if (s === 'arming') zone.classList.add('arming'); if (s === 'go') zone.classList.add('go'); }
    function rating(ms) {
      if (ms < 180) return 'Inhuman. We’re going to need a drug test.';
      if (ms < 230) return 'Esports material.';
      if (ms < 290) return 'Certified gamer.';
      if (ms < 350) return 'Caffeinated human.';
      return 'Were you checking your email?';
    }
    zone.addEventListener('pointerdown', function () {
      audio();
      if (state === 'idle' || state === 'result') {
        set('arming', 'Wait for it…', '● ● ●', 'Click the instant this panel lights up.');
        timer = setTimeout(function () {
          set('go', 'NOW', 'CLICK!', '');
          t0 = performance.now();
          sfx.blip(1320);
        }, 1200 + Math.random() * 2200);
      } else if (state === 'arming') {
        clearTimeout(timer);
        set('result', 'Too soon', 'Jumped the gun.', 'Patience, engineer. Click to retry.');
      } else if (state === 'go') {
        var ms = Math.round(performance.now() - t0);
        hist.push(ms); if (hist.length > 5) hist.shift();
        if (!best || ms < best) { best = ms; localStorage.setItem('ap_reflexBest', '' + best); }
        bestEl.textContent = best + 'ms';
        avgEl.textContent = Math.round(hist.reduce(function (a, b) { return a + b; }, 0) / hist.length) + 'ms';
        set('result', 'Your time', ms + ' ms', rating(ms) + ' Click to go again.');
      }
    });
  })();

  /* ── DARKROOM: throwable polaroid wall ── */
  (function () {
    var wall = document.getElementById('wall'); if (!wall) return;
    var PHOTOS = [
      { src: 'assets/img/aerial-tower.jpg', cap: 'Golden hour · 400 ft', note: 'Launched the drone before sunrise for this one. Zero regrets.' },
      { src: 'assets/img/aerial-hero.jpg', cap: 'New England, from above', note: 'Fall foliage hits different at altitude.' },
      { src: 'assets/img/wpi-gameday.jpg', cap: 'Game day · WPI', note: 'Running sideline media for WPI Athletics.' },
      { src: 'assets/img/lab.jpg', cap: 'Lab nights', note: '2 a.m. in the WPI lab. The prototype didn’t care what time it was.' },
      { src: 'assets/img/demoday.jpg', cap: 'Demo Day 2025', note: 'The room where EpiSafe stopped being a sketch.' },
      { src: 'assets/img/event-cover.jpg', cap: 'On location', note: 'Somewhere between setups.' },
      { src: 'assets/img/team-2025.jpg', cap: 'The team + Gompei', note: 'Five engineers and one goat.' },
      { src: 'assets/img/img_4589.jpg', cap: 'Prototype, on the bench', note: 'The internal mechanism — real parts, real springs.' },
      { src: 'assets/img/product-macro.jpg', cap: 'Macro test shot', note: 'Product photography practice on our own device.' },
      { src: 'assets/img/aaryan-sga.jpg', cap: 'Office hours', note: 'Co-Marketing Chair duties: look approachable.' }
    ];
    var z = 10, pols = [];

    PHOTOS.forEach(function (ph, i) {
      var el = document.createElement('figure'); el.className = 'pol';
      el.innerHTML =
        '<div class="pol-inner">' +
          '<div class="pol-face"><img loading="lazy" decoding="async" draggable="false" src="' + ph.src + '" alt="' + ph.cap + '" /><figcaption>' + ph.cap + '</figcaption></div>' +
          '<div class="pol-face pol-back"><p>' + ph.note + '</p><p class="stamp">© shot by aaryan</p></div>' +
        '</div>';
      wall.appendChild(el);
      pols.push(el);
      makeDraggable(el);
    });

    function scatter(animate) {
      var W = wall.clientWidth, H = wall.clientHeight;
      pols.forEach(function (el) {
        var w = el.offsetWidth || 180, h = el.offsetHeight || 220;
        var x = 14 + Math.random() * Math.max(20, W - w - 28);
        var y = 14 + Math.random() * Math.max(20, H - h - 28);
        if (animate && !reduce) {
          el.classList.add('settling');
          setTimeout(function () { el.classList.remove('settling'); }, 750);
        }
        el.style.left = x + 'px'; el.style.top = y + 'px';
        el.style.transform = 'rotate(' + (Math.random() * 16 - 8).toFixed(1) + 'deg)';
      });
    }
    // scatter once the first image gives the elements real dimensions
    var firstImg = wall.querySelector('img');
    if (firstImg && !firstImg.complete) firstImg.addEventListener('load', function () { scatter(false); });
    scatter(false);
    addEventListener('resize', function () { scatter(false); });
    var shuffleBtn = document.getElementById('wallShuffle');
    if (shuffleBtn) shuffleBtn.addEventListener('click', function () { scatter(true); sfx.blip(520); });

    function makeDraggable(el) {
      var sx, sy, ox, oy, vx = 0, vy = 0, lx, ly, lt, moved = 0, raf = null;
      el.addEventListener('pointerdown', function (e) {
        if (e.button > 0) return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        el.classList.add('grabbed'); el.classList.remove('settling');
        el.style.zIndex = ++z;
        sx = e.clientX; sy = e.clientY;
        ox = parseFloat(el.style.left) || 0; oy = parseFloat(el.style.top) || 0;
        lx = e.clientX; ly = e.clientY; lt = performance.now(); vx = vy = 0; moved = 0;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
      el.addEventListener('pointermove', function (e) {
        if (!el.classList.contains('grabbed')) return;
        var now = performance.now(), dt = Math.max(now - lt, 1);
        vx = (e.clientX - lx) / dt * 16; vy = (e.clientY - ly) / dt * 16;
        lx = e.clientX; ly = e.clientY; lt = now;
        moved += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);
        el.style.left = (ox + e.clientX - sx) + 'px';
        el.style.top = (oy + e.clientY - sy) + 'px';
      });
      el.addEventListener('pointerup', function (e) {
        if (!el.classList.contains('grabbed')) return;
        el.classList.remove('grabbed');
        if (moved < 7) { // a click, not a throw → flip it over
          el.classList.toggle('flipped');
          sfx.blip(el.classList.contains('flipped') ? 392 : 660);
          return;
        }
        if (reduce) return;
        // momentum throw with soft wall bounces
        (function fling() {
          var x = parseFloat(el.style.left), y = parseFloat(el.style.top);
          x += vx; y += vy; vx *= 0.93; vy *= 0.93;
          var maxX = wall.clientWidth - el.offsetWidth - 4, maxY = wall.clientHeight - el.offsetHeight - 4;
          if (x < 4) { x = 4; vx = -vx * 0.45; } if (x > maxX) { x = maxX; vx = -vx * 0.45; }
          if (y < 4) { y = 4; vy = -vy * 0.45; } if (y > maxY) { y = maxY; vy = -vy * 0.45; }
          el.style.left = x + 'px'; el.style.top = y + 'px';
          if (Math.abs(vx) > 0.3 || Math.abs(vy) > 0.3) raf = requestAnimationFrame(fling);
        })();
      });
    }
  })();

  /* ── DOSSIER: tap to de-redact (hover handles fine pointers) ── */
  document.querySelectorAll('.dos').forEach(function (d) {
    d.addEventListener('click', function () { d.classList.toggle('show'); });
  });
})();
