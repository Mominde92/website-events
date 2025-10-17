const EVENTS = [
  {id:1, title:"ماراثون الربيع", date:"2025-10-05", place:"الواجهة البحرية", category:"رياضة", img:"assets/img/event-marathon.png", desc:"سباق جري مفتوح لكل الأعمار."},
  {id:2, title:"بطولة كرة السلة", date:"2025-11-10", place:"الصالة الرياضية", category:"رياضة", img:"assets/img/event-basketball.png", desc:"منافسات حماسية بين فرق محلية."},
  {id:3, title:"معرض الكتاب", date:"2025-10-20", place:"مركز المعارض", category:"ثقافة", img:"assets/img/event-book-fair.png", desc:"إصدارات جديدة وتوقيعات مؤلفين."},
  {id:4, title:"مهرجان العائلة", date:"2025-11-01", place:"الحديقة الكبرى", category:"عائلي", img:"assets/img/event-family-fest.png", desc:"ألعاب وأنشطة لجميع أفراد الأسرة."},
  {id:5, title:"ليلة الجاز", date:"2025-10-12", place:"دار الأوبرا", category:"موسيقى", img:"assets/img/event-jazz.png", desc:"أمسية جاز مع نجوم محليين."},
  {id:6, title:"أوركسترا المدينة", date:"2025-11-18", place:"قصر الثقافة", category:"موسيقى", img:"assets/img/event-orchestra.png", desc:"حفل موسيقي كلاسيكي."}
];

const EVENTS_EN = {
  1: { title:"Spring Marathon",      place:"Waterfront",      desc:"Open running race for all ages." },
  2: { title:"Basketball Championship", place:"Sports Hall",  desc:"Exciting competitions between local teams." },
  3: { title:"Book Fair",            place:"Expo Center",     desc:"New releases and author signings." },
  4: { title:"Family Festival",      place:"Grand Park",      desc:"Games and activities for the whole family." },
  5: { title:"Jazz Night",           place:"Opera House",     desc:"A jazz evening with local stars." },
  6: { title:"City Orchestra",       place:"Cultural Palace", desc:"A classical music concert." }
};

document.addEventListener("DOMContentLoaded", function () {
  initThemeToggle();
  initScrollTopBtn();
  setFooterYear();
  simpleRouter();
});

function initThemeToggle() {
  var toggle = document.getElementById("darkModeToggle");
  if (!toggle) return;
  var saved = localStorage.getItem("theme");
  if (saved) {
    document.body.setAttribute("data-theme", saved);
    toggle.checked = (saved === "dark");
  }
  toggle.addEventListener("change", function () {
    if (toggle.checked) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
}

function initScrollTopBtn() {
  var btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setFooterYear() {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

function simpleRouter() {
  var page = location.pathname.split("/").pop();
  if (page === "" || page === "index.html") {
    renderHomePage();
  } else if (page === "events.html") {
    renderEventsPage();
  } else if (page === "event.html") {
    renderEventPage();
  } else if (page === "contact.html") {
    renderContactPage();
  }
  initCategoryChips();
}

function renderHomePage() {
  var grid = document.getElementById("latest-grid");
  if (!grid) return;
  var latest = EVENTS.slice(-3);
  grid.innerHTML = "";
  for (var i = 0; i < latest.length; i++) {
    var e = latest[i];
    grid.innerHTML += createCardHTML(e);
  }
  var cards = grid.querySelectorAll(".card");
  for (var j = 0; j < cards.length; j++) {
    cards[j].style.animationDelay = (j * 100) + "ms";
    cards[j].classList.add("fade-in");
  }
}

function renderEventsPage() {
  var list = document.getElementById("events-list");
  var form = document.getElementById("filterForm");
  var sel = document.getElementById("filterCategory");
  var from = document.getElementById("filterFrom");
  var to = document.getElementById("filterTo");
  var resetBtn = document.getElementById("resetFilters");

  if (!list || !form || !sel) return;

  var params = new URLSearchParams(location.search);
  var initialCat = params.get("category") || localStorage.getItem("lastCategory") || "all";
  sel.value = initialCat;

  function strToDate(x) {
    return new Date(x + "T00:00:00");
  }

  function doFilter() {
    var cat = sel.value;
    localStorage.setItem("lastCategory", cat);

    var fromVal = from && from.value ? strToDate(from.value) : null;
    var toVal = to && to.value ? strToDate(to.value) : null;

    var filtered = EVENTS.slice();
    if (cat !== "all") {
      filtered = filtered.filter(function (ev) { return ev.category === cat; });
    }
    if (fromVal) {
      filtered = filtered.filter(function (ev) { return strToDate(ev.date) >= fromVal; });
    }
    if (toVal) {
      filtered = filtered.filter(function (ev) { return strToDate(ev.date) <= toVal; });
    }

    list.innerHTML = "";
    if (filtered.length === 0) {
      list.innerHTML = '<div class="text-muted">لا توجد فعاليات مطابقة.</div>';
    } else {
      for (var i = 0; i < filtered.length; i++) {
        list.innerHTML += createCardHTML(filtered[i]);
      }
    }

    var cards = list.querySelectorAll(".card");
    for (var k = 0; k < cards.length; k++) {
      cards[k].style.animationDelay = (k * 100) + "ms";
      cards[k].classList.add("fade-in");
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    doFilter();
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      sel.value = "all";
      if (from) from.value = "";
      if (to) to.value = "";
      localStorage.removeItem("lastCategory");
      doFilter();
    });
  }

  doFilter();
}

function renderEventPage() {
  var wrap = document.getElementById("event-detail");
  if (!wrap) return;

  var params = new URLSearchParams(location.search);
  var id = Number(params.get("id"));
  var e = EVENTS.find(function (x) { return x.id === id; });
  if (!e) e = EVENTS[0];

  var related = EVENTS.filter(function (x) {
    return x.category === e.category && x.id !== e.id;
  }).slice(0, 3);

  var lang = document.documentElement.lang || "ar";
  var ex = getEventLangData(e, lang);

  var html = '';
  html += '<div class="row g-4 fade-in">';
  html += '  <div class="col-lg-7">';
  html += '    <img class="rounded-3 shadow-sm w-100 mb-3" src="' + ex.img + '" alt="' + ex.title + '">';
  html += '    <h1 class="h3">' + ex.title + '</h1>';
  html += '    <p class="text-muted mb-1">' + ex.place + ' • ' + ex.date + '</p>';
  html += '    <p>' + ex.desc + '</p>';
  html += '    <div class="d-flex gap-2 my-3">';
  html += '      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookingModal" data-event-title="' + ex.title + '">حجز مكان</button>';
  html += '      <a class="btn btn-success" href="#" onclick="addToCalendar(\'' + ex.title + '\', \'" + ex.date + "\')">أضف إلى التقويم</a>';
  html += '      <button class="btn btn-outline-primary" onclick="shareEvent(\'' + ex.title + '\', \'" + location.href + "\')">شارك</button>';
  html += '    </div>';
  html += '  </div>';
  html += '  <div class="col-lg-5">';
  html += '    <div class="card mb-3"><div class="card-body">';
  html += '      <h2 class="h6 mb-3">فعاليات ذات صلة</h2>';
  for (var i = 0; i < related.length; i++) {
    var r = related[i];
    var rx = getEventLangData(r, lang);
    var thumb = rx.img;
    html += '      <a href="event.html?id=' + rx.id + '" class="text-decoration-none d-flex align-items-center gap-3 mb-2">';
    html += '        <img src="' + thumb + '" class="rounded" style="width:72px;height:56px;object-fit:cover" alt="' + rx.title + '">';
    html += '        <div><div class="fw-semibold text-dark">' + rx.title + '</div><div class="text-muted small">' + rx.date + '</div></div>';
    html += '      </a>';
  }
  html += '    </div></div>';
  html += '    <div class="card"><div class="card-body">';
  html += '      <h2 class="h6 mb-2">الموقع</h2>';
  html += '      <img class="rounded w-100" src="assets/img/map-stylized.png" alt="map">';
  html += '    </div></div>';
  html += '  </div>';
  html += '</div>';

  wrap.innerHTML = html;

  initBookingModalSimple();
}


function createCardHTML(e) {
  var lang = document.documentElement.lang || "ar";
  var ex = getEventLangData(e, lang);
  var catKey = (ex.category === "رياضة") ? "cat.sport"
              : (ex.category === "موسيقى") ? "cat.music"
              : (ex.category === "ثقافة") ? "cat.culture"
              : (ex.category === "عائلي") ? "cat.family"
              : "cat.all";
  var catLabel = (i18n[lang] && i18n[lang][catKey]) ? i18n[lang][catKey] : ex.category;
  var detailsLabel = (i18n[lang] && i18n[lang]["card.details"]) ? i18n[lang]["card.details"] : "التفاصيل";
  return '' +
  '<div class="col-sm-6 col-lg-4">' +
  '  <div class="card h-100">' +
  '    <img src="' + ex.img + '" class="card-img-top" alt="' + ex.title + '">' +
  '    <div class="card-body d-flex flex-column">' +
  '      <div class="d-flex justify-content-between align-items-start mb-2">' +
  '        <h3 class="h6 mb-0">' + ex.title + '</h3>' +
  '        <span class="badge bg-secondary">' + catLabel + '</span>' +
  '      </div>' +
  '      <p class="text-muted small mb-2">' + ex.place + ' • ' + ex.date + '</p>' +
  '      <p class="flex-grow-1">' + ex.desc + '</p>' +
  '      <a class="btn btn-primary mt-2" href="event.html?id=' + ex.id + '">' + detailsLabel + '</a>' +
  '    </div>' +
  '  </div>' +
  '</div>';
}

function initCategoryChips() {
  var chips = document.querySelectorAll(".category-chip");
  for (var i = 0; i < chips.length; i++) {
    chips[i].addEventListener("click", function () {
      var cat = this.getAttribute("data-category");
      localStorage.setItem("lastCategory", cat);
      location.href = "events.html?category=" + encodeURIComponent(cat);
    });
  }
}

function renderContactPage() {
  var form = document.getElementById("contactForm");
  var alertBox = document.getElementById("alertContainer");
  if (!form || !alertBox) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    alertBox.innerHTML = "";

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();

    var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message || !validEmail) {
      showSimpleAlert(alertBox, "الرجاء التحقق من الحقول وإدخال بريد صحيح.", "danger");
      return;
    }

    showSimpleAlert(alertBox, "تم إرسال رسالتك بنجاح! سنعاود التواصل قريباً.", "success");
    form.reset();
  });
}

function showSimpleAlert(container, text, type) {
  container.innerHTML =
    '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
    text +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    '</div>';
}

function initBookingModalSimple() {
  var bookingModal = document.getElementById("bookingModal");
  if (!bookingModal) return;

  bookingModal.addEventListener("show.bs.modal", function (event) {
    var btn = event.relatedTarget;
    var title = btn ? btn.getAttribute("data-event-title") : "";
    var titleEl = document.getElementById("modalEventTitle");
    if (titleEl) titleEl.textContent = title;
  });

  var confirmBtn = document.getElementById("confirmBookingBtn");
  if (!confirmBtn) return;

  confirmBtn.addEventListener("click", function () {
    var nameInput = document.getElementById("bookingName");
    var emailInput = document.getElementById("bookingEmail");
    var alertBox = document.getElementById("bookingAlertContainer");
    var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());

    if (!nameInput.value.trim() || !okEmail) {
      showSimpleAlert(alertBox, "الرجاء إدخال اسم وبريد إلكتروني صحيحين.", "danger");
    } else {
      var eventTitle = document.getElementById("modalEventTitle").textContent;
      showSimpleAlert(alertBox, "تم تأكيد حجزك لـ " + eventTitle + " بنجاح!", "success");
      var bookingForm = document.getElementById("bookingForm");
      if (bookingForm) bookingForm.reset();
    }
  });
}

function shareEvent(title, url) {
  if (navigator.share) {
    navigator.share({ title: title, url: url });
  } else {
    navigator.clipboard.writeText(url);
    alert("تم نسخ رابط الفعالية.");
  }
}

function addToCalendar(title, dateStr) {
  var dt = new Date(dateStr + "T00:00:00");
  var y = dt.getFullYear();
  var m = String(dt.getMonth() + 1).padStart(2, "0");
  var d = String(dt.getDate()).padStart(2, "0");

  var ics =
    "BEGIN:VCALENDAR\n" +
    "VERSION:2.0\n" +
    "BEGIN:VEVENT\n" +
    "DTSTART:" + y + m + d + "T090000Z\n" +
    "DTEND:" + y + m + d + "T110000Z\n" +
    "SUMMARY:" + title + "\n" +
    "END:VEVENT\n" +
    "END:VCALENDAR";

  var blob = new Blob([ics], { type: "text/calendar" });
  var link = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = link;
  a.download = "event.ics";
  a.click();
  URL.revokeObjectURL(link);
}

 function getEventLangData(e, lang) {
    var t = (lang === "en" && EVENTS_EN[e.id]) ? EVENTS_EN[e.id] : null;
    return {
      id: e.id,
      title: t ? t.title : e.title,
      date: e.date,
      place: t ? t.place : e.place,
      category: e.category,
      img: e.img,
      desc: t ? t.desc : e.desc
    };
  }

  var langNames = { ar: "AR", en: "EN" };

  var i18n = {
    ar: {
      "meta.title": "دليل فعاليات المدينة",
      "brand": "مشروع طالب - دليل الفعاليات",
      "nav.home": "الرئيسية",
      "nav.all": "كل الفعاليات",
      "nav.about": "عن الدليل",
      "nav.contact": "اتصل بنا",

      "hero.title": "مرحباً بكم في <span class='text-warning'>دليل فعاليات المدينة</span>",
      "hero.subtitle": "اكتشف أحدث الفعاليات: موسيقى، رياضة، ثقافة، وعائليات — كلها في مكان واحد.",
      "hero.cta": "استعرض جميع الفعاليات",

      "carousel.item1.title": "ماراثون الربيع",
      "carousel.item1.meta": "الواجهة البحرية • 2025-10-05",
      "carousel.item2.title": "بطولة كرة السلة",
      "carousel.item2.meta": "الصالة الرياضية • 2025-11-10",
      "carousel.item3.title": "معرض الكتاب",
      "carousel.item3.meta": "مركز المعارض • 2025-10-20",
      "carousel.details": "التفاصيل",
      "carousel.prev": "السابق",
      "carousel.next": "التالي",

      "section.participants": "المشاركون في المشروع",
      "section.quick": "تصنيفات سريعة",
      "label.name": "الاسم:",
      "label.role": "الدور:",

      "names.moamen": "مؤمن محمد نذير ديراني",
      "names.nada": "ندى وليد لوباني",
      "names.rawan": "روان احمد الحسن القدور",
      "names.malak": "ملاك يونس العوض",
      "names.asmaa": "أسماء أيمن جحى",

      "events.title": "جميع الفعاليات",
      "filters.category": "التصنيف",
      "filters.from": "من تاريخ",
      "filters.to": "إلى تاريخ",
      "filters.apply": "تصفية",
      "filters.reset": "إعادة تعيين",

      "cat.all": "الكل",
      "cat.sport": "رياضة",
      "cat.music": "موسيقى",
      "cat.culture": "ثقافة",
      "cat.family": "عائلي",

      "card.details": "التفاصيل",

      "about.title": "عن الدليل",
      "about.mission": "هدفنا ربط المجتمع بفعاليات المدينة القادمة وتعزيز المشاركة الثقافية والرياضية والفنية.",
      "about.team": "فريق العمل",
      "about.policy.title": "سياسة النشر",
      "about.policy.item1": "يتم مراجعة الفعاليات قبل النشر للتأكد من ملاءمتها.",
      "about.policy.item2": "المحتوى يجب أن يحترم القيم العامة والقوانين المحلية.",
      "about.policy.item3": "يمكن اقتراح فعالية عبر التواصل معنا.",
      "role.frontend": "Frontend Developer",
      "role.CSS": "CSS Developer",
      "role.jsdev": "JavaScript Developer",

      "contact.title": "اتصل بنا",
      "contact.name": "الاسم",
      "contact.email": "البريد الإلكتروني",
      "contact.message": "الرسالة",
      "contact.send": "إرسال",
      "contact.emailLabel": "بريد التواصل:",
      "contact.accounts": "حساباتنا:",

      "ph.name": "اكتب اسمك هنا",
      "ph.email": "example@email.com",
      "ph.message": "اكتب رسالتك هنا…",

      "booking.title": "حجز مكان في الفعالية",
      "booking.desc": "أنت على وشك حجز مكانك في: ",
      "booking.name": "الاسم الكامل",
      "booking.email": "البريد الإلكتروني",
      "booking.close": "إغلاق",
      "booking.confirm": "تأكيد الحجز",

      "footer.copy": "مشروع طالب — نسخة أولية",
      "btn.top": "للأعلى"
    },
    en: {
      "meta.title": "City Events Guide",
      "brand": "Student Project - Events Guide",
      "nav.home": "Home",
      "nav.all": "All Events",
      "nav.about": "About",
      "nav.contact": "Contact",

      "hero.title": "Welcome to <span class='text-warning'>City Events Guide</span>",
      "hero.subtitle": "Discover the latest events: Music, Sports, Culture, and Family — all in one place.",
      "hero.cta": "Browse all events",

      "carousel.item1.title": "Spring Marathon",
      "carousel.item1.meta": "Waterfront • 2025-10-05",
      "carousel.item2.title": "Basketball Championship",
      "carousel.item2.meta": "Sports Hall • 2025-11-10",
      "carousel.item3.title": "Book Fair",
      "carousel.item3.meta": "Expo Center • 2025-10-20",
      "carousel.details": "Details",
      "carousel.prev": "Previous",
      "carousel.next": "Next",

      "section.participants": "Project Participants",
      "section.quick": "Quick Categories",
      "label.name": "Name:",
      "label.role": "Role:",

      "names.moamen": "Moamen Mohammad Nazeer Dirani",
      "names.nada": "Nada Walid Loubani",
      "names.rawan": "Rawan Ahmad Al-Hassan Al-Qadur",
      "names.malak": "Malak Younes Al-Awad",
      "names.asmaa": "Asmaa Ayman Juha",

      "events.title": "All Events",
      "filters.category": "Category",
      "filters.from": "From date",
      "filters.to": "To date",
      "filters.apply": "Filter",
      "filters.reset": "Reset",

      "cat.all": "All",
      "cat.sport": "Sports",
      "cat.music": "Music",
      "cat.culture": "Culture",
      "cat.family": "Family",

      "card.details": "Details",

      "about.title": "About the Guide",
      "about.mission": "Our goal is to connect the community to upcoming city events and boost cultural, sports, and arts participation.",
      "about.team": "Team",
      "about.policy.title": "Publishing Policy",
      "about.policy.item1": "Events are reviewed before publishing to ensure suitability.",
      "about.policy.item2": "Content must respect public values and local regulations.",
      "about.policy.item3": "You can propose an event by contacting us.",
      "role.frontend": "Frontend Developer",
      "role.CSS": "CSS Developer",
      "role.jsdev": "JavaScript Developer",

      "contact.title": "Contact Us",
      "contact.name": "Name",
      "contact.email": "Email",
      "contact.message": "Message",
      "contact.send": "Send",
      "contact.emailLabel": "Contact Email:",
      "contact.accounts": "Our Accounts:",

      "ph.name": "Enter your name",
      "ph.email": "example@email.com",
      "ph.message": "Type your message…",

      "booking.title": "Book Your Spot",
      "booking.desc": "You are about to book your seat for: ",
      "booking.name": "Full Name",
      "booking.email": "Email",
      "booking.close": "Close",
      "booking.confirm": "Confirm Booking",

      "footer.copy": "Student Project — First version",
      "btn.top": "Top"
    }
  };

  function applyTranslations(lang) {
    var dict = i18n[lang] || i18n.ar;

    document.documentElement.lang = lang;
    document.documentElement.dir  = (lang === "ar") ? "rtl" : "ltr";

    var btn = document.getElementById("langBtn");
    if (btn) btn.textContent = (langNames[lang] || lang);

    var tEl = document.querySelector("title[data-i18n='meta.title']");
    if (tEl && dict["meta.title"]) tEl.textContent = dict["meta.title"];

    
    var htmlEls = document.querySelectorAll("[data-i18n-html]");
    htmlEls.forEach(function(el){
      var key = el.getAttribute("data-i18n-html");
      if (key && dict[key]) el.innerHTML = dict[key];
    });

    
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if (!key || !dict[key]) return;
      if (key === "booking.desc") {
        if (el.firstChild) { el.firstChild.nodeValue = dict[key]; }
      } else {
        el.textContent = dict[key];
      }
    });

    
    var ph = function(k){ return dict[k] || ""; };
    var nameEl = document.getElementById("name");
    if (nameEl) nameEl.setAttribute("placeholder", ph("ph.name"));
    var emailEl = document.getElementById("email");
    if (emailEl) emailEl.setAttribute("placeholder", ph("ph.email"));
    var msgEl = document.getElementById("message");
    if (msgEl) msgEl.setAttribute("placeholder", ph("ph.message"));
  }

  function setLang(lang) {
    localStorage.setItem("lang", lang);
    applyTranslations(lang);
  }

  
  document.querySelectorAll("[data-lang]").forEach(b => {
    b.addEventListener("click", () => setLang(b.getAttribute("data-lang")));
  });

  
  const initial = localStorage.getItem("lang") || "ar";
  applyTranslations(initial);

