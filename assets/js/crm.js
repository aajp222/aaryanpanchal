/* ═══════════════════════════════════════════════════════════════
   PERSONAL CRM (crm.html) — Fitchburg outreach pipeline.
   Ported from the standalone dashboard into the site's design
   system. Data lives in this browser only (localStorage); use
   Export to back it up. Dependency-free.
═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     LOCK SCREEN ("get in")
     NOTE: this is a soft gate for a public static site — the code
     lives in the page source, so it's obscurity, not real security.
     ▶ To change your passcode, edit the one line below.
  ───────────────────────────────────────────────────────────── */
  var PASSCODE   = 'gompei';               // ▶ your passcode — change me
  var UNLOCK_KEY = 'ap_crm_unlocked';

  var lockScreen = document.getElementById('lockScreen');
  var lockForm   = document.getElementById('lockForm');
  var lockInput  = document.getElementById('lockInput');
  var lockErr    = document.getElementById('lockErr');
  var lockCard   = document.getElementById('lockCard');
  var crmRoot    = document.getElementById('crmRoot');
  var lockBtn    = document.getElementById('lockBtn');
  var booted     = false;

  function reveal(){
    if (lockScreen) lockScreen.hidden = true;
    if (crmRoot) crmRoot.hidden = false;
    if (!booted){ booted = true; init(); }
  }
  function denyShake(){
    if (lockErr) lockErr.classList.add('show');
    if (lockCard){ lockCard.classList.remove('shake'); void lockCard.offsetWidth; lockCard.classList.add('shake'); }
    if (lockInput){ lockInput.value = ''; lockInput.focus(); }
  }
  if (lockForm){
    lockForm.addEventListener('submit', function(e){
      e.preventDefault();
      if ((lockInput.value || '').trim() === PASSCODE){
        try { localStorage.setItem(UNLOCK_KEY, '1'); } catch(err){}
        reveal();
      } else { denyShake(); }
    });
    lockInput.addEventListener('input', function(){ lockErr && lockErr.classList.remove('show'); });
  }
  if (lockBtn){
    lockBtn.addEventListener('click', function(){
      try { localStorage.removeItem(UNLOCK_KEY); } catch(err){}
      location.reload();
    });
  }
  // already unlocked this browser? go straight in.
  var already = false;
  try { already = localStorage.getItem(UNLOCK_KEY) === '1'; } catch(err){}
  if (already) reveal();
  else if (lockInput) setTimeout(function(){ lockInput.focus(); }, 60);

  /* ─────────────────────────────────────────────────────────────
     SEED DATA (from the Local Prospecting Report, in ranked order)
  ───────────────────────────────────────────────────────────── */
  var SEED = [
    {rank:1,name:"Place-Ma Park",category:"Restaurant",town:"Fitchburg",address:"19 Airport Rd, Fitchburg, MA 01420",phone:"(978) 696-5680",website:"placemapark.localsearch.com",presence:"Directory microsite",priority:"High"},
    {rank:2,name:"Fitchburg Airport Restaurant",category:"Restaurant",town:"Fitchburg",address:"565 Crawford St, Fitchburg, MA 01420",phone:"(978) 343-0287",website:"fitchburgairportrestaurant.localsearch.com",presence:"Directory microsite",priority:"High"},
    {rank:3,name:"Singapore Restaurant",category:"Restaurant",town:"Fitchburg",address:"170 Whalon St, Fitchburg, MA 01420",phone:"(978) 345-0132",website:"",presence:"No website",priority:"High"},
    {rank:4,name:"Dario's Ristorante",category:"Restaurant",town:"Fitchburg",address:"187 River St, Fitchburg, MA 01420",phone:"(978) 627-3974",website:"facebook.com",presence:"Facebook only",priority:"High"},
    {rank:5,name:"TKO Round 2",category:"Restaurant",town:"Fitchburg",address:"436 Mechanic St, Fitchburg, MA 01420",phone:"(978) 696-3212",website:"facebook.com",presence:"Facebook only",priority:"High"},
    {rank:6,name:"Summer Street Cafe",category:"Restaurant",town:"Fitchburg",address:"400 Summer St, Fitchburg, MA 01420",phone:"(978) 516-6919",website:"",presence:"No website",priority:"High"},
    {rank:7,name:"North End Diner",category:"Restaurant",town:"Leominster",address:"59 Nashua St, Leominster, MA 01453",phone:"(978) 534-0600",website:"facebook.com",presence:"Facebook only",priority:"High"},
    {rank:8,name:"Changes Restaurant",category:"Restaurant",town:"Leominster",address:"192 4th St, Leominster, MA 01453",phone:"(978) 534-7200",website:"",presence:"No website",priority:"High"},
    {rank:9,name:"Tim's",category:"Restaurant",town:"Leominster",address:"14 Water St, Leominster, MA 01453",phone:"(978) 537-6868",website:"",presence:"No website",priority:"High"},
    {rank:10,name:"Centre Pizza",category:"Restaurant",town:"Fitchburg",address:"245 River St, Fitchburg, MA 01420",phone:"(978) 342-3350",website:"",presence:"No website",priority:"High"},
    {rank:11,name:"Jade Lee Kitchen",category:"Restaurant",town:"Fitchburg",address:"96 Franklin Rd, Fitchburg, MA 01420",phone:"(978) 343-8249",website:"jadeleekitchen4091597.localsearch.com",presence:"Directory microsite",priority:"Medium"},
    {rank:12,name:"Kiki's Kitchen",category:"Restaurant",town:"Fitchburg",address:"35 Airport Rd, Fitchburg, MA 01420",phone:"(978) 343-5788",website:"kikiskitchenma.localsearch.com",presence:"Directory microsite",priority:"Medium"},
    {rank:13,name:"River City Diner",category:"Restaurant",town:"Fitchburg",address:"68 Airport Rd Ste 1, Fitchburg, MA 01420",phone:"(978) 343-0500",website:"rivercitydiner.food83.com",presence:"Directory microsite",priority:"Medium"},
    {rank:14,name:"El Bohio Restaurant",category:"Restaurant",town:"Fitchburg",address:"362 Main St, Fitchburg, MA 01420",phone:"(978) 342-7510",website:"diningguide.com",presence:"Directory microsite",priority:"Medium"},
    {rank:15,name:"La Bella Ristorante",category:"Restaurant",town:"Fitchburg",address:"1460 John Fitch Hwy, Fitchburg, MA 01420",phone:"(978) 345-6999",website:"menulizard.com",presence:"Directory microsite",priority:"Medium"},
    {rank:16,name:"Tikki Tikki Restaurant",category:"Restaurant",town:"Fitchburg",address:"335 Main St, Fitchburg, MA 01420",phone:"(978) 348-1038",website:"tikkitikkirestaurant.localsearch.com",presence:"Directory microsite",priority:"Medium"},
    {rank:17,name:"Elvis's Hot Dog Palace",category:"Restaurant",town:"Leominster",address:"134 Mechanic St, Leominster, MA 01453",phone:"(978) 534-2300",website:"elvisshotdogpalace.localsearch.com",presence:"Directory microsite",priority:"Medium"},
    {rank:18,name:"El Coqui Restaurant",category:"Restaurant",town:"Leominster",address:"185 Central St, Leominster, MA 01453",phone:"(978) 751-8043",website:"elcoquirestaurantma.localsearch.com",presence:"Directory microsite",priority:"Medium"},
    {rank:19,name:"Lucca's",category:"Restaurant",town:"Leominster",address:"428 Lancaster St, Leominster, MA 01453",phone:"(978) 537-7100",website:"luccas.localsearch.com",presence:"Directory microsite",priority:"Medium"},
    {rank:20,name:"Gold Bowl Chinese Restaurant",category:"Restaurant",town:"Leominster",address:"749 Central St, Leominster, MA 01453",phone:"(978) 534-8877",website:"",presence:"No website",priority:"Medium"},
    {rank:21,name:"Vincent's Florist",category:"Nursery",town:"Fitchburg",address:"497 Electric Ave, Fitchburg, MA 01420",phone:"(978) 343-7522",website:"vincentsflorist.localsearch.com",presence:"Directory microsite",priority:"Medium"},
    {rank:22,name:"Emerald City Indoor Garden Supply",category:"Nursery",town:"Westminster",address:"51 Main St, Westminster, MA 01473",phone:"(978) 668-5393",website:"",presence:"No website",priority:"Medium"},
    {rank:23,name:"A.J.'s Evergreen Nursery",category:"Nursery",town:"Westminster",address:"10 Old Town Farm Rd, Westminster, MA 01473",phone:"(978) 489-2214",website:"ajsevergreennursery.myshopify.com",presence:"Has site",priority:"Low"},
    {rank:24,name:"Brook Bound Nursery",category:"Nursery",town:"Westminster",address:"170 State Rd E, Westminster, MA 01473",phone:"(978) 874-2500",website:"brookboundnursery.com",presence:"Has site (split brand)",priority:"Low"},
    {rank:25,name:"Cauley's Garden Center",category:"Nursery",town:"Fitchburg",address:"649 South St, Fitchburg, MA 01420",phone:"(978) 342-2300",website:"cauleysfloristandgardencenter.com",presence:"Has site (split brand)",priority:"Low"}
  ];

  var STAGES = ["New","Contacted","Interested","Proposal","Won","Lost"];
  var STAGE_COLOR = {New:"#8a8f9a",Contacted:"#5bb0ff",Interested:"#9b5cff",Proposal:"#f0b45c",Won:"#5fd39b",Lost:"#6a6970"};
  var STORE_KEY = "fitchburg_crm_v1";

  // pricing + pitch defaults by priority/category
  function defaultsFor(p){
    var pitch = p.category === "Nursery"
      ? "Seasonal pages • workshop signups • product categories • map-pack cleanup"
      : "Mobile menu • click-to-call • online ordering link • hours • GBP photos";
    var setup=1200, monthly=129, action="Verify by phone, then email + mini-audit", due="2026-07-07";
    if (p.priority === "High"){ setup=900; monthly=99; action="Build mini-audit + door-drop (lunch–dinner)"; due="2026-07-02"; }
    else if (p.priority === "Low"){ setup=2000; monthly=149; action="Email modernization/SEO pitch, then call"; due="2026-07-13"; }
    return {pitch:pitch,setup:setup,monthly:monthly,action:action,due:due};
  }

  function seedLeads(){
    return SEED.map(function(p){
      var d = defaultsFor(p);
      return {
        id: uid(), rank:p.rank, name:p.name, category:p.category, town:p.town, address:p.address,
        phone:p.phone, website:p.website, presence:p.presence, priority:p.priority,
        stage:"New", setup:d.setup, monthly:d.monthly, wonSetup:0, wonMonthly:0,
        contact:"", email:"", pitch:d.pitch, action:d.action, due:d.due, notes:""
      };
    });
  }

  /* ── helpers ── */
  function uid(){ return Math.random().toString(36).slice(2,9); }
  function money(n){ return "$" + (Number(n)||0).toLocaleString(); }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
  function telHref(p){ return "tel:" + String(p||"").replace(/[^0-9+]/g,""); }
  function load(){ try { var r = localStorage.getItem(STORE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; } }
  function save(){ try { localStorage.setItem(STORE_KEY, JSON.stringify(leads)); } catch(e){} }
  function todayStr(){ return new Date().toISOString().slice(0,10); }
  function $(id){ return document.getElementById(id); }

  var leads = load() || seedLeads();
  var view = "board";
  var editingId = null;

  /* ── KPIs ── */
  function isOpen(l){ return l.stage !== "Won" && l.stage !== "Lost"; }
  function renderKPIs(){
    var open = leads.filter(isOpen);
    var won = leads.filter(function(l){ return l.stage === "Won"; });
    var pipeline = open.reduce(function(s,l){ return s + (Number(l.setup)||0) + (Number(l.monthly)||0)*12; }, 0);
    var mrr = won.reduce(function(s,l){ return s + (Number(l.wonMonthly)||Number(l.monthly)||0); }, 0);
    var oneTime = won.reduce(function(s,l){ return s + (Number(l.wonSetup)||Number(l.setup)||0); }, 0);
    var cards = [
      {label:"Prospects", val:leads.length, sub:"in your list"},
      {label:"Active", val:open.length, sub:"being worked"},
      {label:"Won", val:won.length, sub:"clients closed"},
      {label:"Pipeline value", val:money(pipeline), sub:"open, annualized"},
      {label:"MRR (won)", val:money(mrr), sub:"recurring / mo"},
      {label:"Closed setup", val:money(oneTime), sub:"one-time won"}
    ];
    $("kpis").innerHTML = cards.map(function(c){
      return '<div class="kpi"><div class="label">'+c.label+'</div><div class="val">'+c.val+'</div><div class="sub">'+esc(c.sub)+'</div></div>';
    }).join("");
  }

  /* ── filtering ── */
  function filtered(){
    var q = $("search").value.trim().toLowerCase();
    var cat = $("fCat").value;
    var prio = $("fPrio").value;
    var stage = $("fStage").value;
    return leads.filter(function(l){
      if (cat && l.category !== cat) return false;
      if (prio && l.priority !== prio) return false;
      if (stage && l.stage !== stage) return false;
      if (q){
        var hay = (l.name+" "+l.town+" "+l.address+" "+l.category+" "+l.presence).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }
  function dueClass(due){
    if (!due) return "";
    var t = todayStr();
    if (due < t) return "due-soon";
    var soon = new Date(Date.now()+2*864e5).toISOString().slice(0,10);
    return due <= soon ? "due-soon" : "";
  }

  /* ── Board ── */
  function renderBoard(){
    var data = filtered();
    var el = $("boardView");
    el.className = "board";
    el.innerHTML = STAGES.map(function(stage){
      var items = data.filter(function(l){ return l.stage === stage; }).sort(function(a,b){ return (a.rank||999)-(b.rank||999); });
      var cards = items.map(function(l){ return ''+
        '<div class="lead-card" draggable="true" data-id="'+l.id+'">'+
          '<div class="name">'+esc(l.name)+'</div>'+
          '<div class="meta">'+esc(l.town)+' &middot; '+esc(l.presence)+'</div>'+
          '<div class="tags">'+
            '<span class="tag cat-'+l.category+'">'+esc(l.category)+'</span>'+
            '<span class="tag prio-'+l.priority+'">'+esc(l.priority)+'</span>'+
          '</div>'+
          '<div class="val">'+money(l.setup)+' setup &middot; '+money(l.monthly)+'/mo</div>'+
          (l.action ? '<div class="task '+dueClass(l.due)+'">⏱ '+esc(l.due||"")+' — '+esc(l.action)+'</div>' : "")+
          '<div class="card-row">'+
            (l.phone ? '<a class="mini" href="'+telHref(l.phone)+'" data-stop="1">📞 Call</a>' : "")+
            '<span class="mini" data-edit="'+l.id+'">Open</span>'+
          '</div>'+
        '</div>'; }).join("");
      return '<div class="col" data-stage="'+stage+'">'+
        '<h3><span style="color:'+STAGE_COLOR[stage]+'">'+stage+'</span><span class="count">'+items.length+'</span></h3>'+
        (cards || '<div class="crm-muted" style="padding:.4rem .4rem .6rem">—</div>')+
      '</div>';
    }).join("");

    el.querySelectorAll(".lead-card").forEach(function(card){
      var id = card.getAttribute("data-id");
      card.addEventListener("click", function(e){
        if (e.target.closest("[data-stop]")) return;
        openEdit(id);
      });
      card.addEventListener("dragstart", function(e){ e.dataTransfer.setData("text/plain", id); card.style.opacity=".5"; });
      card.addEventListener("dragend", function(){ card.style.opacity="1"; });
    });
    el.querySelectorAll(".col").forEach(function(col){
      col.addEventListener("dragover", function(e){ e.preventDefault(); col.classList.add("drop-hover"); });
      col.addEventListener("dragleave", function(){ col.classList.remove("drop-hover"); });
      col.addEventListener("drop", function(e){
        e.preventDefault(); col.classList.remove("drop-hover");
        var id = e.dataTransfer.getData("text/plain");
        var l = leads.find(function(x){ return x.id === id; });
        if (l){ l.stage = col.getAttribute("data-stage"); save(); render(); }
      });
    });
  }

  /* ── Table ── */
  var sortKey = "rank", sortDir = 1;
  function renderTable(){
    var data = filtered().slice().sort(function(a,b){
      var av=a[sortKey], bv=b[sortKey];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return (av>bv?1:av<bv?-1:0)*sortDir;
    });
    var cols = [["rank","#"],["name","Business"],["category","Cat"],["town","Town"],["presence","Presence"],["priority","Priority"],["stage","Stage"],["setup","Setup"],["monthly","Mo"],["action","Next action"],["due","Due"]];
    var el = $("tableView");
    el.innerHTML = '<div class="crm-table-wrap"><table class="crm"><thead><tr>'+cols.map(function(c){ return '<th data-k="'+c[0]+'">'+c[1]+'</th>'; }).join("")+'</tr></thead>'+
      '<tbody>'+data.map(function(l){ return '<tr data-id="'+l.id+'">'+
        '<td>'+(l.rank||"")+'</td><td><b>'+esc(l.name)+'</b></td><td>'+esc(l.category)+'</td><td>'+esc(l.town)+'</td>'+
        '<td>'+esc(l.presence)+'</td><td><span class="tag prio-'+l.priority+'">'+esc(l.priority)+'</span></td>'+
        '<td><span class="dot" style="background:'+STAGE_COLOR[l.stage]+'"></span>'+esc(l.stage)+'</td>'+
        '<td>'+money(l.setup)+'</td><td>'+money(l.monthly)+'</td>'+
        '<td>'+esc(l.action||"")+'</td><td class="'+dueClass(l.due)+'">'+esc(l.due||"")+'</td>'+
      '</tr>'; }).join("")+'</tbody></table></div>';
    el.querySelectorAll("th").forEach(function(th){ th.addEventListener("click", function(){
      var k = th.getAttribute("data-k");
      if (sortKey === k) sortDir *= -1; else { sortKey = k; sortDir = 1; }
      renderTable();
    }); });
    el.querySelectorAll("tr[data-id]").forEach(function(tr){ tr.addEventListener("click", function(){ openEdit(tr.getAttribute("data-id")); }); });
  }

  /* ── Tasks ── */
  function renderTasks(){
    var data = filtered().filter(function(l){ return isOpen(l) && l.action; }).sort(function(a,b){ return (a.due||"9999").localeCompare(b.due||"9999"); });
    var el = $("tasksView");
    if (!data.length){ el.innerHTML = '<div class="tasks"><div class="trow"><span class="what">No open tasks. Nice. Add a next action to any lead.</span></div></div>'; return; }
    el.innerHTML = '<div class="tasks">'+data.map(function(l){
      var overdue = l.due && l.due < todayStr();
      return '<div class="trow">'+
        '<span class="when '+(overdue?'overdue':'')+'">'+esc(l.due||"—")+'</span>'+
        '<span><span class="who">'+esc(l.name)+'</span> &middot; <span class="what">'+esc(l.action)+'</span>'+
          '<span class="tag prio-'+l.priority+'" style="margin-left:.4rem">'+esc(l.priority)+'</span></span>'+
        '<span class="spacer"></span>'+
        (l.phone?'<a class="mini" href="'+telHref(l.phone)+'">📞</a>':"")+
        '<span class="mini" data-open="'+l.id+'">Open</span>'+
        '<span class="mini" data-done="'+l.id+'">✓ Done</span>'+
      '</div>';
    }).join("")+'</div>';
    el.querySelectorAll("[data-open]").forEach(function(b){ b.addEventListener("click", function(){ openEdit(b.getAttribute("data-open")); }); });
    el.querySelectorAll("[data-done]").forEach(function(b){ b.addEventListener("click", function(){
      var l = leads.find(function(x){ return x.id===b.getAttribute("data-done"); });
      if (l){ l.action=""; save(); render(); }
    }); });
  }

  /* ── render dispatch ── */
  function render(){
    renderKPIs();
    $("boardView").style.display = view==="board" ? "" : "none";
    $("tableView").style.display = view==="table" ? "" : "none";
    $("tasksView").style.display = view==="tasks" ? "" : "none";
    if (view==="board") renderBoard();
    else if (view==="table") renderTable();
    else renderTasks();
  }

  /* ── Edit modal ── */
  function openEdit(id){
    editingId = id;
    var l = id ? leads.find(function(x){ return x.id===id; }) : {name:"",category:"Restaurant",town:"",address:"",phone:"",presence:"No website",priority:"High",stage:"New",setup:900,monthly:99,contact:"",email:"",pitch:"",action:"",due:todayStr(),notes:""};
    $("editTitle").textContent = id ? "Edit lead" : "Add lead";
    $("deleteBtn").style.display = id ? "" : "none";
    var set=function(k,v){ $(k).value = v==null?"":v; };
    set("e_name",l.name); set("e_category",l.category); set("e_town",l.town); set("e_phone",l.phone);
    set("e_address",l.address); set("e_presence",l.presence); set("e_priority",l.priority); set("e_stage",l.stage);
    set("e_setup",l.setup); set("e_monthly",l.monthly); set("e_contact",l.contact); set("e_email",l.email);
    set("e_action",l.action); set("e_due",l.due); set("e_pitch",l.pitch); set("e_notes",l.notes);
    $("editOverlay").classList.add("open");
  }
  function saveEdit(){
    var g=function(k){ return $(k).value; };
    var obj = {
      name:g("e_name"), category:g("e_category"), town:g("e_town"), phone:g("e_phone"), address:g("e_address"),
      presence:g("e_presence"), priority:g("e_priority"), stage:g("e_stage"),
      setup:Number(g("e_setup"))||0, monthly:Number(g("e_monthly"))||0,
      contact:g("e_contact"), email:g("e_email"), action:g("e_action"), due:g("e_due"),
      pitch:g("e_pitch"), notes:g("e_notes")
    };
    if (!obj.name.trim()){ alert("Add a business name."); return; }
    if (editingId){
      var l = leads.find(function(x){ return x.id===editingId; });
      Object.assign(l, obj);
      if (obj.stage==="Won"){ if(!l.wonSetup) l.wonSetup=obj.setup; if(!l.wonMonthly) l.wonMonthly=obj.monthly; }
    } else {
      var maxRank = leads.reduce(function(m,x){ return Math.max(m, x.rank||0); }, 0);
      leads.push(Object.assign({id:uid(), rank:maxRank+1, wonSetup:0, wonMonthly:0}, obj));
    }
    save(); closeEdit(); render();
  }
  function closeEdit(){ $("editOverlay").classList.remove("open"); editingId=null; }
  function deleteLead(){
    if (!editingId) return;
    if (!confirm("Delete this lead?")) return;
    leads = leads.filter(function(x){ return x.id!==editingId; }); save(); closeEdit(); render();
  }

  /* ── Templates ── */
  var TEMPLATES = [
    {title:"Email", body:"Subject: quick idea for improving your online presence\n\n"+
      "Hi {{Business name}},\n\n"+
      "I'm a local web designer working with nearby small businesses. I noticed your online presence relies mainly on {{presence}}, which can make it harder for customers to find your hours, menu, ordering options, and photos quickly.\n\n"+
      "A simple idea for you:\n• a fast mobile-friendly page\n• clearer menu / service info\n• click-to-call and directions\n• Google Business Profile cleanup\n• better photos and stronger local search\n\n"+
      "If helpful, I can send a one-page mockup or a short audit tailored to {{Business name}}.\n\nBest,\nAaryan\n{{phone}}"},
    {title:"SMS (use only with consent / existing relationship)", body:"Hi, this is Aaryan. I'm local and help nearby {{category}}s improve their website + Google presence. I had one quick idea for {{Business name}} around {{pitch}}. If helpful, I can text or email a short mockup."},
    {title:"Door-drop card", body:"FRONT: Local website help for local businesses\nMenus. Ordering links. Google profile cleanup. Better photos. Faster mobile sites.\n\n"+
      "BACK: I looked up {{Business name}} and saw a few quick wins:\n• {{presence}} — customers can't act fast\n• no obvious order/booking link\n• could rank better for nearby searches\nIf you want, I can show you a 10-minute before/after plan."}
  ];
  function fillTemplate(text, l){
    var map = {
      "{{Business name}}": l?l.name:"{{Business name}}",
      "{{presence}}": l?l.presence.toLowerCase():"{{presence}}",
      "{{category}}": l?l.category.toLowerCase():"{{category}}",
      "{{pitch}}": l?(l.pitch||"your menu/photos/hours"):"{{pitch}}",
      "{{phone}}": "your phone"
    };
    return text.replace(/\{\{[^}]+\}\}/g, function(m){ return map[m]!=null?map[m]:m; });
  }
  function renderTemplates(){
    var sel = $("tmplLead").value;
    var l = sel ? leads.find(function(x){ return x.id===sel; }) : null;
    $("tmplBody").innerHTML = TEMPLATES.map(function(t,i){ return ''+
      '<div class="tmpl">'+
        '<h4>'+esc(t.title)+'</h4>'+
        '<textarea id="tmpl_'+i+'" readonly>'+esc(fillTemplate(t.body,l))+'</textarea>'+
        '<div style="margin-top:.6rem"><button class="crm-btn solid" data-copy="'+i+'">Copy</button></div>'+
      '</div>'; }).join("");
    document.querySelectorAll("[data-copy]").forEach(function(b){ b.addEventListener("click", function(){
      var ta = $("tmpl_"+b.getAttribute("data-copy"));
      ta.select(); if (navigator.clipboard) navigator.clipboard.writeText(ta.value);
      b.textContent="Copied ✓"; setTimeout(function(){ b.textContent="Copy"; },1200);
    }); });
  }

  /* ── Plan ── */
  function renderPlan(){
    var steps = [
      "Days 1–3: verify the top 10 by phone or a quick walk-in (SMB data goes stale). Screenshot each one's current issue — no menu, no hours, no order button, Facebook-only.",
      "Days 4–7: door-drop cards or short emails to the top 10. Log every touch here and stack a follow-up task.",
      "Week 2: send a specific visual to your 2–3 warmest — a mock homepage, a cleaner menu page, or a GBP cleanup checklist.",
      "Close ONE restaurant Starter from the no-site / Facebook-only group. That's your wedge.",
      "Turn that win into a before/after case study, then approach the nurseries with a trust + seasonal-discovery pitch."
    ];
    $("planSteps").innerHTML = steps.map(function(s,i){
      return '<div class="plan-step"><div class="n">'+(i+1)+'</div><div class="txt">'+esc(s)+'</div></div>';
    }).join("");
    $("planNote").innerHTML =
      "<b>Channels:</b> restaurants → in-person door-drop between lunch &amp; dinner, then follow up. Nurseries → weekday-morning email + phone, tied to seasonal merchandising. " +
      "<b>Compliance:</b> SMS only with prior consent or an existing relationship (TCPA); emails need a real mailing address + working opt-out (CAN-SPAM).";
  }

  /* ── export / import ── */
  function exportData(){
    var blob = new Blob([JSON.stringify(leads,null,2)], {type:"application/json"});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "fitchburg-crm-backup.json"; a.click();
  }
  function importData(file){
    var r = new FileReader();
    r.onload = function(){ try { var d = JSON.parse(r.result); if (Array.isArray(d)){ leads = d; save(); render(); alert("Imported "+d.length+" leads."); } else alert("That file doesn't look like a CRM backup."); } catch(e){ alert("Could not read that file."); } };
    r.readAsText(file);
  }

  /* ── init / wiring ── */
  function fillSelect(id, items){
    var s = $(id);
    s.innerHTML = items.map(function(x){ return '<option>'+x+'</option>'; }).join("");
  }
  function init(){
    fillSelect("e_stage", STAGES);
    $("fStage").innerHTML = '<option value="">All stages</option>' + STAGES.map(function(s){ return '<option>'+s+'</option>'; }).join("");
    $("tmplLead").innerHTML = '<option value="">— pick a business (optional) —</option>' +
      leads.slice().sort(function(a,b){ return (a.rank||999)-(b.rank||999); }).map(function(l){ return '<option value="'+l.id+'">'+esc(l.name)+'</option>'; }).join("");

    document.querySelectorAll(".views button").forEach(function(b){ b.addEventListener("click", function(){
      document.querySelectorAll(".views button").forEach(function(x){ x.classList.remove("active"); });
      b.classList.add("active"); view = b.getAttribute("data-view"); render();
    }); });
    ["search","fCat","fPrio","fStage"].forEach(function(id){ $(id).addEventListener("input", render); });

    $("addBtn").addEventListener("click", function(){ openEdit(null); });
    $("saveEdit").addEventListener("click", saveEdit);
    $("cancelEdit").addEventListener("click", closeEdit);
    $("deleteBtn").addEventListener("click", deleteLead);
    $("editOverlay").addEventListener("click", function(e){ if(e.target.id==="editOverlay") closeEdit(); });

    $("tmplBtn").addEventListener("click", function(){ renderTemplates(); $("tmplOverlay").classList.add("open"); });
    $("tmplLead").addEventListener("change", renderTemplates);
    $("closeTmpl").addEventListener("click", function(){ $("tmplOverlay").classList.remove("open"); });
    $("tmplOverlay").addEventListener("click", function(e){ if(e.target.id==="tmplOverlay") e.currentTarget.classList.remove("open"); });

    $("planBtn").addEventListener("click", function(){ renderPlan(); $("planOverlay").classList.add("open"); });
    $("closePlan").addEventListener("click", function(){ $("planOverlay").classList.remove("open"); });
    $("planOverlay").addEventListener("click", function(e){ if(e.target.id==="planOverlay") e.currentTarget.classList.remove("open"); });

    $("exportBtn").addEventListener("click", exportData);
    $("importBtn").addEventListener("click", function(){ $("importFile").click(); });
    $("importFile").addEventListener("change", function(e){ if(e.target.files[0]) importData(e.target.files[0]); });

    render();
  }
})();
