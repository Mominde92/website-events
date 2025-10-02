/*
STUDENT HOMEWORK EDITION
File: main.js
Goal: Beginner-friendly JS with comments and small functions.
Last Prepared: 2025-10-02 17:12:14
*/

// --- Events dataset (you can edit freely) ---
const EVENTS = [
  {id:1, title:"ماراثون الربيع", date:"2025-10-05", place:"الواجهة البحرية", category:"رياضة", img:"assets/img/event-marathon.png", desc:"سباق جري مفتوح لكل الأعمار."},
  {id:2, title:"ليلة الجاز", date:"2025-10-12", place:"دار الأوبرا", category:"موسيقى", img:"assets/img/event-jazz.png", desc:"أمسية جاز مع نجوم محليين."},
  {id:3, title:"معرض الكتاب", date:"2025-10-20", place:"مركز المعارض", category:"ثقافة", img:"assets/img/event-book-fair.png", desc:"إصدارات جديدة وتوقيعات مؤلفين."},
  {id:4, title:"مهرجان العائلة", date:"2025-11-01", place:"الحديقة الكبرى", category:"عائلي", img:"assets/img/event-family-fest.png", desc:"ألعاب وأنشطة لجميع أفراد الأسرة."},
  {id:5, title:"بطولة كرة السلة", date:"2025-11-10", place:"الصالة الرياضية", category:"رياضة", img:"assets/img/event-basketball.png", desc:"منافسات حماسية بين فرق محلية."},
  {id:6, title:"أوركسترا المدينة", date:"2025-11-18", place:"قصر الثقافة", category:"موسيقى", img:"assets/img/event-orchestra.png", desc:"حفل موسيقي كلاسيكي."}
];

// --- Helpers ---
const $ = (s,scope=document)=>scope.querySelector(s);
const $$ = (s,scope=document)=>Array.from(scope.querySelectorAll(s));
const toDate = (d) => new Date(d+"T00:00:00");

// --- Main Initializer ---
document.addEventListener("DOMContentLoaded",()=>{
  initDarkMode();
  initScrollTop();
  initFooterYear();
  renderPage();
});

// --- Initialization Functions ---

function initDarkMode() {
    const toggle = $("#darkModeToggle");
    const body = document.body;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        body.dataset.theme = savedTheme;
        toggle.checked = savedTheme === "dark";
    }

    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            body.dataset.theme = "dark";
            localStorage.setItem("theme", "dark");
        } else {
            body.dataset.theme = "light";
            localStorage.setItem("theme", "light");
        }
    });
}

function initScrollTop() {
    const btn = $("#scrollTopBtn");
    if(btn){
        window.addEventListener("scroll", () =>{
            btn.style.display = window.scrollY > 300 ? "block" : "none";
        });
        btn.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));
    }
}

function initFooterYear() {
    const y = $("#year"); 
    if(y) y.textContent = new Date().getFullYear();
}

// --- Page Router ---

function renderPage(){
  const path = location.pathname.split("/").pop();
  if(path === "" || path === "index.html"){
    renderHome();
  }else if(path === "events.html"){
    renderEvents();
  }else if(path === "event.html"){
    renderEventDetail();
  }else if(path === "contact.html"){
    initContactForm();
  }
  initCategoryChips();
}

// --- Page Specific Renderers ---

function renderHome(){
  buildFeaturedCarousel();
  const grid = $("#latest-grid");
  if(!grid) return;
  const latest = EVENTS.slice(-3);
  grid.innerHTML = latest.map(cardHTML).join("");
  $$('#latest-grid .card').forEach((card, index) => {
      card.style.animationDelay = `${index * 100}ms`;
      card.classList.add('fade-in');
  });
}

function renderEvents(){
  const params = new URLSearchParams(location.search);
  const initialCat = params.get("category") || localStorage.getItem("lastCategory") || "all";
  const sel = $("#filterCategory");
  if(sel) sel.value = initialCat;

  const list = $("#events-list");
  const doFilter = () =>{
    const cat = $("#filterCategory").value;
    localStorage.setItem("lastCategory", cat);
    const from = $("#filterFrom").value ? toDate($("#filterFrom").value) : null;
    const to = $("#filterTo").value ? toDate($("#filterTo").value) : null;

    let filtered = EVENTS.slice();
    if(cat !== "all") filtered = filtered.filter(e=> e.category === cat);
    if(from) filtered = filtered.filter(e=> toDate(e.date) >= from);
    if(to) filtered = filtered.filter(e=> toDate(e.date) <= to);

    list.innerHTML = filtered.map(cardHTML).join("") || `<div class="text-muted">لا توجد فعاليات مطابقة.</div>`;
    $$('#events-list .card').forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
        card.classList.add('fade-in');
    });
  };

  $("#filterForm").addEventListener("submit", (ev)=>{
    ev.preventDefault(); doFilter();
  });
  $("#resetFilters").addEventListener("click", ()=>{
    $("#filterCategory").value = "all";
    $("#filterFrom").value = "";
    $("#filterTo").value = "";
    localStorage.removeItem("lastCategory");
    doFilter();
  });

  doFilter();
}

function renderEventDetail(){
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const e = EVENTS.find(x=>x.id===id) || EVENTS[0];
  const related = EVENTS.filter(x=> x.category===e.category && x.id!==e.id).slice(0,3);

  $("#event-detail").innerHTML = `
    <div class="row g-4 fade-in">
      <div class="col-lg-7">
        <img class="rounded-3 shadow-sm w-100 mb-3" src="${e.img}" alt="${e.title}">
        <h1 class="h3">${e.title}</h1>
        <p class="text-muted mb-1">${e.place} • ${e.date}</p>
        <p>${e.desc}</p>
        <div class="d-flex gap-2 my-3">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookingModal" data-event-title="${e.title}">حجز مكان</button>
          <a class="btn btn-success" href="#" onclick="addToCalendar('${e.title}','${e.date}')">أضف إلى التقويم</a>
          <button class="btn btn-outline-primary" onclick="shareEvent('${e.title}','${location.href}')">شارك</button>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card mb-3">
          <div class="card-body">
            <h2 class="h6 mb-3">فعاليات ذات صلة</h2>
            ${related.map(r=>`
              <a href="event.html?id=${r.id}" class="text-decoration-none d-flex align-items-center gap-3 mb-2">
                <img src="${r.img.replace('.png', '-thumb.png')}" class="rounded" style="width:72px;height:56px;object-fit:cover" alt="${r.title}">
                <div><div class="fw-semibold text-dark">${r.title}</div><div class="text-muted small">${r.date}</div></div>
              </a>
            `).join("")}
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h2 class="h6 mb-2">الموقع</h2>
            <img class="rounded w-100" src="assets/img/map-stylized.png" alt="map">
          </div>
        </div>
      </div>
    </div>
  `;
  initBookingModal();
}

// --- Component Builders ---

function buildFeaturedCarousel(){
  const inner = $("#featured-carousel-inner");
  if(!inner) return;
  const featured = EVENTS.slice(0,3);
  inner.innerHTML = featured.map((e,i)=>`
    <div class="carousel-item ${i===0?"active":""}">
      <img src="${e.img}" class="d-block w-100" alt="${e.title}">
      <div class="carousel-caption text-start">
        <h5 class="fw-bold">${e.title}</h5>
        <p class="mb-2">${e.place} • ${e.date}</p>
        <a class="btn btn-warning btn-sm" href="event.html?id=${e.id}">التفاصيل</a>
      </div>
    </div>
  `).join("");
}

function cardHTML(e){
  return `
  <div class="col-sm-6 col-lg-4">
    <div class="card h-100">
      <img src="${e.img}" class="card-img-top" alt="${e.title}">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h3 class="h6 mb-0">${e.title}</h3>
          <span class="badge bg-secondary">${e.category}</span>
        </div>
        <p class="text-muted small mb-2">${e.place} • ${e.date}</p>
        <p class="flex-grow-1">${e.desc}</p>
        <a class="btn btn-primary mt-2" href="event.html?id=${e.id}">التفاصيل</a>
      </div>
    </div>
  </div>`;
}

function initCategoryChips(){
  $$(".category-chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      const cat = chip.dataset.category;
      localStorage.setItem("lastCategory", cat);
      location.href = `events.html?category=${encodeURIComponent(cat)}`;
    });
  });
}

// --- Contact Form ---

function initContactForm(){
  const form = $("#contactForm");
  if (!form) return;
  const alertBox = $("#alertContainer");
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    alertBox.innerHTML = "";
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const message = $("#message").value.trim();
    if(!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      showAlert("الرجاء التحقق من الحقول وإدخال بريد صحيح.", "danger");
      return;
    }
    showAlert("تم إرسال رسالتك بنجاح! سنعاود التواصل قريباً.", "success");
    form.reset();
  });

  function showAlert(text, type){
    alertBox.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${text}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
}

// --- Booking Modal ---
function initBookingModal() {
    const bookingModal = $('#bookingModal');
    if (!bookingModal) return;

    bookingModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const eventTitle = button.getAttribute('data-event-title');
        const modalTitle = $('#modalEventTitle');
        modalTitle.textContent = eventTitle;
    });

    const confirmBtn = $('#confirmBookingBtn');
    confirmBtn.addEventListener('click', function () {
        const name = $('#bookingName').value.trim();
        const email = $('#bookingEmail').value.trim();
        const alertContainer = $('#bookingAlertContainer');

        if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showAlert('الرجاء إدخال اسم وبريد إلكتروني صحيحين.', 'danger', alertContainer);
        } else {
            showAlert(`تم تأكيد حجزك لـ ${$('#modalEventTitle').textContent} بنجاح!`, 'success', alertContainer);
            $('#bookingForm').reset();
        }
    });

    function showAlert(text, type, container) {
        container.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${text}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
    }
}


// --- Utility Helpers ---

function shareEvent(title, url){
  if(navigator.share){
    navigator.share({title, url});
  }else{
    navigator.clipboard.writeText(url);
    alert("تم نسخ رابط الفعالية.");
  }
}

function addToCalendar(title, dateStr){
  const dt = new Date(dateStr+"T00:00:00");
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,"0");
  const d = String(dt.getDate()).padStart(2,"0");
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${y}${m}${d}T090000Z\nDTEND:${y}${m}${d}T110000Z\nSUMMARY:${title}\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], {type:"text/calendar"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "event.ics"; a.click();
  URL.revokeObjectURL(url);
}