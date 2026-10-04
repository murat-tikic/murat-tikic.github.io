(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var euro = function (n) { return n.toFixed(2).replace(".", ","); };

  // Mockup-Demo: Die Systemeinstellung "Bewegung reduzieren" wird bewusst ignoriert, damit die Effekte immer laufen.
  // Ruhige Fassung: Adresse mit ?ruhig aufrufen. Auf der Live-Seite die Systemeinstellung wieder beachten.
  var systemRuhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reduce = /[?&]ruhig/.test(location.search);
  var hatGsap = !!(window.gsap && window.ScrollTrigger && window.SplitText);
  var animiert = hatGsap && !reduce;
  if (!animiert) document.documentElement.classList.add("reduziert");
  var st = $("#status");
  if (st) st.textContent = !hatGsap ? "Effekte-Skripte nicht geladen." : reduce ? "Ruhige Fassung (?ruhig)." : systemRuhig ? "Effekte an (Systemeinstellung 'Animationen reduzieren' wird für die Demo ignoriert)." : "Effekte an.";

  /* ---------- Offen-Status ---------- */
  (function () {
    var d = new Date(), min = d.getHours() * 60 + d.getMinutes();
    var offen = min >= 11 * 60 && min < 22 * 60 + 30;
    var chip = $("#offen-chip"), t = $("#offen-text");
    chip.classList.toggle("zu", !offen);
    t.textContent = offen ? "Jetzt geöffnet · bis 22:30 Uhr" : (min < 11 * 60 ? "Heute ab 11:00 Uhr geöffnet" : "Heute geschlossen · morgen ab 11:00 Uhr");
  })();

  /* ---------- Speisekarte (Beispiel, Stand Flyer 2021) ---------- */
  var KARTE = {
    "Döner & Teller": [
      ["Hackfleischspieß im Fladenbrot", "", 5.00], ["Hähnchenfleisch im Fladenbrot", "", 5.50], ["Kalbfleisch im Fladenbrot", "", 6.00],
      ["Hackfleischspieß im Yufka", "", 5.50], ["Hähnchenfleisch im Yufka", "", 6.00], ["Kalbfleisch im Yufka", "", 6.50],
      ["Vegetarisch Kebap mit Käse", "", 4.00], ["Yufka vegetarisch mit Weichkäse", "", 4.50],
      ["Lahmacun mit Salat", "", 5.00], ["Lahmacun mit Hackfleischspieß", "", 6.00], ["Lahmacun mit Hähnchenfleisch", "", 6.50], ["Lahmacun mit Kalbfleisch", "", 7.00],
      ["Hackfleischspieß Teller mit Salat", "", 7.50], ["Hackfleischspieß mit Salat und Pommes", "", 8.50],
      ["Hähnchenfleisch Teller und Salat", "", 8.00], ["Hähnchenfleisch Teller, Salat und Pommes", "", 8.50],
      ["Kalbfleisch Teller und Salat", "", 9.00], ["Kalbfleisch Teller, Salat und Pommes", "", 9.50],
      ["Iskender Kebap", "", 10.00], ["Box mit Hackfleischspieß und Salat", "", 5.00], ["Box mit Hackfleischspieß, Pommes und Salat", "", 5.50], ["Box mit Kalbfleisch, Pommes und Salat", "", 6.00]
    ],
    "Pide": [
      ["Pide mit Weichkäse", "", 7.00], ["Pide mit Rinderhackfleisch", "", 7.50], ["Pide mit Spinat und Weichkäse", "", 7.50],
      ["Pide mit Hackfleischspieß und Weichkäse", "", 7.50], ["Pide mit Hähnchenfleisch", "", 8.00], ["Pide mit Kalbfleisch", "", 8.50], ["Pide mit Sucuk", "Die meistgenannte bei Google", 7.50]
    ],
    "Pizza": [
      ["Margherita", "Alle Pizzen 30 cm, mit Käse und Tomatensoße", 6.00], ["Putenschinken", "", 7.00], ["Rindersalami", "", 7.00], ["Champignon", "", 7.00],
      ["Hawaii", "Putenschinken, Ananas", 7.50], ["Tonno", "Thunfisch, Zwiebeln", 7.50], ["Grandiose", "Tomaten, Käse, Zwiebeln, Oliven", 7.50],
      ["Kebab Hackfleischspieß", "", 7.50], ["Kebab Hähnchen", "", 8.00], ["Kebab Kalbfleisch", "", 8.50],
      ["Gemisch", "Rindersalami, Putenschinken, Pilze, Paprika", 8.50], ["Spezial", "Rindersalami, Putenschinken, Paprika, Oliven", 9.00], ["Vegetarisch", "Pilze, Paprika, Oliven, Tomaten", 9.00],
      ["Burg mit Hackfleischspieß", "Frische Tomaten, Weichkäse, Peperoni", 8.50], ["Burg mit Hähnchenspieß", "", 9.00], ["Burg mit Kalbfleischspieß", "", 9.50],
      ["Sucuk", "mit türkischer Knoblauchwurst", 8.00], ["Seele mit Hackfleischspieß", "", 7.50], ["Seele mit Hähnchenspieß", "", 8.00], ["Seele mit Kalbfleischspieß", "", 8.50]
    ],
    "Suppen & Salate": [
      ["Linsensuppe (Mercimek)", "", 4.00], ["Kuttelsuppe (İşkembe)", "", 4.00], ["Gemischter Salat", "", 4.00], ["Thunfischsalat", "", 5.00],
      ["Falafel im Brot", "", 4.50], ["Falafel im Yufka", "", 5.00], ["Falafel Teller mit Salat und Pommes", "", 8.00],
      ["Chicken Nuggets, 6 Stück", "", 5.00], ["Chicken Nuggets, 9 Stück", "Teller mit Pommes und Salat", 8.00]
    ],
    "Getränke & Extras": [
      ["Coca-Cola, Fanta, Spezi", "0,33 l Dose", 1.50], ["Sprite, Uludağ Gazoz", "0,33 l Dose", 1.50], ["Mineralwasser", "0,5 l", 1.50],
      ["Red Bull", "0,25 l", 2.50], ["Tetrapack", "0,5 l", 1.50], ["Ayran", "", 1.00], ["Pommes", "", 2.50], ["Baklava", "1 Stück", 1.00]
    ]
  };
  var MENUES = [
    ["Menü 1", "Döner Kebap vom Rindshackfleischdrehspieß im Fladenbrot, Pommes und Getränk", 8.00],
    ["Menü 2", "Döner Kebap vom Rind im Yufka und Getränk", 8.50],
    ["Menü 3", "Lahmacun Spezial mit Hackfleischdrehspieß, Salat, Pommes und Getränk", 9.00],
    ["Menü 4", "Pizza mit zwei Beilagen, Salat und Getränk", 10.00]
  ];

  var tabs = $(".tabs"), liste = $("#karten-liste"), aktiv;
  function zeigeTab(name, animieren) {
    aktiv = name;
    $$("button", tabs).forEach(function (b) { b.setAttribute("aria-selected", b.dataset.t === name ? "true" : "false"); });
    liste.innerHTML = "";
    KARTE[name].forEach(function (z, i) {
      var li = document.createElement("li");
      if (animieren) { li.className = "neu"; li.style.animationDelay = (i * 18) + "ms"; }
      li.innerHTML = '<span>' + z[0] + (z[1] ? '<small>' + z[1] + '</small>' : '') + '</span><b>' + euro(z[2]) + ' €</b>';
      liste.appendChild(li);
    });
    // Handy: nur die ersten 8 Gerichte zeigen, Rest per Knopf (weniger überfüllt)
    var mehr = $("#mehr"), klein = window.matchMedia("(max-width:600px)").matches, alle = $$("li", liste);
    if (klein && alle.length > 8) {
      alle.slice(8).forEach(function (li) { li.classList.add("versteckt"); });
      mehr.textContent = "Alle " + alle.length + " Gerichte zeigen";
      mehr.hidden = false;
      mehr.onclick = function () { alle.forEach(function (li) { li.classList.remove("versteckt"); }); mehr.hidden = true; if (window.ScrollTrigger) setTimeout(ScrollTrigger.refresh, 50); };
    } else { mehr.hidden = true; }
  }
  Object.keys(KARTE).forEach(function (k, i) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.dataset.t = k; b.textContent = k;
    b.addEventListener("click", function () { zeigeTab(k, true); });
    tabs.appendChild(b);
  });
  zeigeTab("Döner & Teller", false);
  var mr = $("#menue-raster");
  MENUES.forEach(function (m) {
    var d = document.createElement("article"); d.className = "menue";
    d.innerHTML = '<h3>' + m[0] + '</h3><p>' + m[1] + '</p><b>' + euro(m[2]) + ' €</b>';
    mr.appendChild(d);
  });

  /* ---------- Döner-Baukasten ---------- */
  var PREISE = {
    hack:  { fladen: 5.00, yufka: 5.50, teller: 7.50, pommes: 8.50 },
    haehn: { fladen: 5.50, yufka: 6.00, teller: 8.00, pommes: 8.50 },
    kalb:  { fladen: 6.00, yufka: 6.50, teller: 9.00, pommes: 9.50 }
  };
  var NAMEN = { hack: "Hackfleisch", haehn: "Hähnchen", kalb: "Kalb", fladen: "im Fladenbrot", yufka: "im Yufka", teller: "als Teller mit Salat", pommes: "als Teller mit Salat und Pommes" };
  function bauAktualisieren() {
    var f = $("input[name=fleisch]:checked").value, g = $("input[name=form]:checked").value;
    $("#bau-name").textContent = NAMEN[f] + " " + NAMEN[g];
    var p = $("#bau-preis"); p.textContent = euro(PREISE[f][g]);
    var box = p.parentNode; box.classList.remove("tick"); void box.offsetWidth; box.classList.add("tick");
  }
  $$("input[name=fleisch],input[name=form]").forEach(function (i) { i.addEventListener("change", bauAktualisieren); });
  $("#bau-weiter").addEventListener("click", function () {
    var w = $("textarea[name=wunsch]");
    w.value = (w.value ? w.value + "\n" : "") + "1x " + $("#bau-name").textContent;
    var z = $("#anfrage"); if (window.__lenis) window.__lenis.scrollTo(z, { offset: -10 }); else z.scrollIntoView({ behavior: "smooth" });
    setTimeout(function () { w.focus({ preventScroll: true }); }, 700);
  });

  /* ---------- Formular (Demo) ---------- */
  $("#formular").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ["name", "tel"].forEach(function (n) {
      var el = $("[name=" + n + "]"); var leer = !el.value.trim();
      el.classList.toggle("fehler", leer); if (leer) ok = false;
    });
    var m = $("#form-meldung");
    if (!ok) { m.className = "form-hinweis"; m.textContent = "Bitte Name und Telefonnummer eintragen, damit wir zurückrufen können."; return; }
    m.className = "form-hinweis ok";
    m.textContent = "Danke, " + $("[name=name]").value.trim() + "! Wir melden uns kurz bei dir. (Demo: es wird nichts gesendet.)";
  });

  /* ---------- Glut-Funken ---------- */
  var cv = $("#glut"), ctx = cv.getContext("2d"), fk = [], W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function groesse() { var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  groesse(); window.addEventListener("resize", groesse);
  function neu(start) {
    return { x: Math.random() * W, y: start ? Math.random() * H : H + 10, r: .8 + Math.random() * 2.2, v: .3 + Math.random() * 1.1, dx: (Math.random() - .5) * .5, a: .3 + Math.random() * .7, ph: Math.random() * 6.28 };
  }
  for (var i = 0; i < 70; i++) fk.push(neu(true));
  var sichtbar = true;
  new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; }).observe(cv);
  function funken() {
    requestAnimationFrame(funken);
    if (!sichtbar || reduce) return;
    ctx.clearRect(0, 0, W, H);
    fk.forEach(function (p, i) {
      p.y -= p.v; p.x += p.dx + Math.sin(p.ph += .03) * .3;
      if (p.y < -10) fk[i] = neu(false);
      var f = Math.max(0, Math.min(1, p.y / H));
      ctx.beginPath(); ctx.fillStyle = "rgba(255," + Math.round(120 + 100 * (1 - f)) + ",30," + (p.a * (.35 + f * .65)) + ")";
      ctx.shadowColor = "rgba(255,120,20,.8)"; ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    });
  }
  funken();



  /* ---------- Drehspieß (SVG): Fleischlagen mit unregelmäßigem Rand, Kruste, Fettglanz, Stange und Standplatte ---------- */
  var Spiess = (function () {
    var host = $("#spiess-host"); if (!host) return { scroll: function () {} };
    var NS = "http://www.w3.org/2000/svg", seed = 7;
    function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
    function el(tag, at, par) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; }
    var svg = el("svg", { "class": "spiess-svg", viewBox: "0 0 300 540", preserveAspectRatio: "xMidYMid meet" });
    var defs = el("defs", {}, svg);

    // Fleisch-Texturen (drei Varianten, bewegen sich verschieden schnell = Tiefe beim Drehen)
    var PAL = [["#7d3b19", "#a2501f", "#6a2e14", "#b9672b", "#4e210e"], ["#8d4a22", "#b86a30", "#7a3a18", "#c98240", "#5a2a10"], ["#6f3416", "#964818", "#5b2810", "#ad5e26", "#431c0a"]];
    var pats = PAL.map(function (pal, i) {
      var p = el("pattern", { id: "tx" + i, width: 150, height: 110, patternUnits: "userSpaceOnUse" }, defs);
      el("rect", { width: 150, height: 110, fill: pal[0] }, p);
      for (var n = 0; n < 34; n++) {
        var w = 4 + rnd() * 20, x = rnd() * 150, y = rnd() * 110;
        el("rect", { x: x, y: y, width: w, height: 6 + rnd() * 26, rx: 3, fill: pal[Math.floor(rnd() * pal.length)], opacity: .55 + rnd() * .4 }, p);
        if (x + w > 150) el("rect", { x: x - 150, y: y, width: w, height: 14, rx: 3, fill: pal[1], opacity: .6 }, p);
      }
      for (var m = 0; m < 26; m++) el("circle", { cx: rnd() * 150, cy: rnd() * 110, r: .8 + rnd() * 2.2, fill: rnd() < .5 ? "#f2c58a" : "#2a0f05", opacity: .25 + rnd() * .35 }, p);
      return p;
    });

    // Zylinder-Schattierung und Metall
    var zyl = el("linearGradient", { id: "zyl", x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
    [[0, "#000", .82], [.16, "#000", .3], [.36, "#ffd9a0", .34], [.52, "#ffffff", .05], [.72, "#000", .22], [.9, "#000", .6], [1, "#000", .86]].forEach(function (s) { el("stop", { offset: s[0], "stop-color": s[1], "stop-opacity": s[2] }, zyl); });
    var met = el("linearGradient", { id: "met", x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
    [[0, "#6b6b6b"], [.35, "#f1f1f1"], [.6, "#9a9a9a"], [1, "#4d4d4d"]].forEach(function (s) { el("stop", { offset: s[0], "stop-color": s[1] }, met); });
    var kap = el("radialGradient", { id: "kap", cx: .5, cy: .4, r: .7 }, defs);
    [[0, "#f0b878"], [.6, "#c2763a"], [1, "#7d3b19"]].forEach(function (s) { el("stop", { offset: s[0], "stop-color": s[1] }, kap); });
    var clip = el("clipPath", { id: "meatClip" }, defs);

    // Stange
    el("rect", { x: 146, y: 0, width: 8, height: 540, rx: 4, fill: "url(#met)" }, svg);

    // Fleischlagen: oben breit, unten schmal, jede Lage mit eigener Kontur
    var Y0 = 54, Y1 = 478, y = Y0, i = 0, g = el("g", {}, svg), shine = [];
    function halb(yy) { var t = (yy - Y0) / (Y1 - Y0); return 128 - 62 * Math.pow(t, .9) + Math.sin(t * 9) * 3; }
    while (y < Y1 - 14) {
      var hgt = 26 + rnd() * 22, y2 = Math.min(Y1, y + hgt);
      var l1 = 150 - halb(y) - rnd() * 7, r1 = 150 + halb(y) + rnd() * 7, l2 = 150 - halb(y2) - rnd() * 8, r2 = 150 + halb(y2) + rnd() * 8;
      var d = "M" + l1 + "," + y + " Q150," + (y - 5) + " " + r1 + "," + y + " L" + r2 + "," + y2 + " Q150," + (y2 + 6) + " " + l2 + "," + y2 + " Z";
      el("path", { d: d, fill: "url(#tx" + (i % 3) + ")", stroke: "rgba(28,9,2,.7)", "stroke-width": 1.5 }, g);
      el("path", { d: d }, clip);
      // Kruste (dunkler Rand oben)
      el("path", { d: "M" + l1 + "," + y + " Q150," + (y - 5) + " " + r1 + "," + y, fill: "none", stroke: "rgba(22,6,0," + (.35 + rnd() * .3) + ")", "stroke-width": 3 + rnd() * 2 }, svg);
      if (rnd() < .65) shine.push([150 + (rnd() - .55) * 120, y + hgt * (.35 + rnd() * .3), 10 + rnd() * 20, 2 + rnd() * 2.5]);
      y = y2; i++;
    }
    el("rect", { x: 0, y: Y0 - 14, width: 300, height: Y1 - Y0 + 40, fill: "url(#zyl)", "clip-path": "url(#meatClip)" }, svg);
    shine.forEach(function (s) { el("ellipse", { cx: s[0], cy: s[1], rx: s[2], ry: s[3], fill: "#ffe2b0", opacity: .2, "clip-path": "url(#meatClip)" }, svg); });
    // Deckel (angeschnittene Oberseite) und Tropfen
    el("ellipse", { cx: 150, cy: Y0 - 2, rx: halb(Y0) + 5, ry: 13, fill: "url(#kap)", stroke: "rgba(28,9,2,.7)", "stroke-width": 1.5 }, svg);
    el("ellipse", { cx: 135, cy: Y0 - 4, rx: 30, ry: 4, fill: "#ffe2b0", opacity: .35 }, svg);
    [[118, 484, 4], [176, 490, 3.2], [150, 486, 3.6]].forEach(function (t) { el("path", { d: "M" + t[0] + "," + t[1] + " q-" + t[2] + ",8 0," + (t[2] * 3) + " q" + t[2] + ",-" + (t[2] * 2) + " 0,-" + (t[2] * 3) + "z", fill: "#e0a35a", opacity: .85 }, svg); });
    // Standplatte und Griff
    el("ellipse", { cx: 150, cy: 508, rx: 78, ry: 11, fill: "#3a3a3a" }, svg);
    el("ellipse", { cx: 150, cy: 504, rx: 78, ry: 11, fill: "url(#met)" }, svg);
    el("circle", { cx: 150, cy: 8, r: 9, fill: "url(#met)" }, svg);
    host.appendChild(svg);

    // Antrieb: Scroll (PC) oder Dauerdrehung (Handy), eine eigene Schleife, unabhängig von GSAP
    var K = [1, .72, 1.28], rot = 0, ziel = 0, sc = false, an = true;
    if (window.IntersectionObserver) new IntersectionObserver(function (e) { an = e[0].isIntersecting; }).observe(host);
    function tick(t) {
      requestAnimationFrame(tick);
      if (!an) return;
      if (sc) { rot += (ziel - rot) * .14; } else if (!reduce) { rot = -t * .035; }
      pats.forEach(function (p, n) { p.setAttribute("patternTransform", "translate(" + (rot * K[n]).toFixed(1) + " 0)"); });
    }
    requestAnimationFrame(tick);
    return { scroll: function (p) { sc = true; ziel = -p * 1500; } };
  })();

  if (!animiert) return;
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  fontsReady.then(function () {

  /* ---------- GSAP ---------- */
  gsap.registerPlugin(ScrollTrigger, SplitText);
  var lenis;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis", "lenis-smooth");
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var z = $(a.getAttribute("href")); if (!z) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(z, { offset: -50 }); else z.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Fortschrittsbalken
  gsap.to("#fortschritt", { width: "100%", ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.2 } });

  // Hero: Zeilen fahren ein, Rest folgt
  SplitText.create(".hero h1", {
    type: "lines", mask: "lines", autoSplit: true,
    onSplit: function (self) { return gsap.from(self.lines, { yPercent: 115, duration: 1.1, ease: "power4.out", stagger: 0.14, delay: 0.1 }); }
  });
  gsap.from([".status-chip", ".hero .lead", ".hero-knoepfe", ".bewertung"], { opacity: 0, y: 24, duration: 0.8, ease: "power3.out", stagger: 0.12, delay: 0.55 });
  gsap.from(".bogen", { scale: .86, opacity: 0, duration: 1.1, ease: "power3.out", delay: 0.3 });
  gsap.from(".siegel", { scale: 0, rotate: -120, duration: 1, ease: "back.out(1.5)", delay: 0.9 });
  gsap.to(".bogen img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".siegel", { yPercent: -30, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // Laufband: läuft immer, wird mit Scroll-Tempo schneller
  var spur = $(".spur"), halb = spur.scrollWidth / 2;
  var lauf = gsap.to(spur, { x: -halb, duration: 24, ease: "none", repeat: -1 });
  ScrollTrigger.create({ onUpdate: function (s) { lauf.timeScale(1 + Math.min(Math.abs(s.getVelocity()) / 400, 5)); gsap.to(lauf, { timeScale: 1, duration: .8, overwrite: true }); } });

  // Intro: Wort für Wort aufleuchten
  var iw = SplitText.create(".intro-satz", { type: "words", wordsClass: "wort" });
  gsap.to(iw.words, { opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: ".intro-satz", start: "top 80%", end: "bottom 45%", scrub: true } });

  // Reveal: Kreis öffnet sich zur Glut-Szene
  var gezaehlt = false;
  function zaehlen() {
    if (gezaehlt) return; gezaehlt = true;
    $$("[data-zaehl]").forEach(function (el) {
      var ziel = parseFloat(el.dataset.zaehl), dez = +el.dataset.dez || 0, o = { v: 0 };
      gsap.to(o, { v: ziel, duration: 1.4, ease: "power2.out", onUpdate: function () { el.textContent = o.v.toFixed(dez).replace(".", ","); } });
    });
  }
  var rv = gsap.timeline({ defaults: { ease: "none" } });
  rv.to(".reveal-dunkel h2", { scale: 1.5, opacity: 0, duration: .6 }, 0)
    .to(".reveal-hell", { clipPath: "circle(78% at 50% 50%)", duration: .8 }, 0.1)
    .from(".reveal-foto", { y: 80, opacity: 0, duration: .5 }, 0.55)
    .from(".zahlen > div", { y: 50, opacity: 0, stagger: .1, duration: .4 }, 0.65)
    .to({}, { duration: .35 });
  ScrollTrigger.create({ trigger: ".reveal", start: "top top", end: "+=170%", pin: true, scrub: .4, animation: rv, onUpdate: function (s) { if (s.progress > .6) zaehlen(); } });

  // Spieß: dreht sich beim Scrollen, Schritte leuchten der Reihe nach auf
  var mm = gsap.matchMedia();
  var schritte = $$(".schritte li");
  function setzeSchritt(i) { schritte.forEach(function (s, k) { s.classList.toggle("aktiv", k === i); }); }
  mm.add("(min-width: 901px)", function () {
    ScrollTrigger.create({
      trigger: ".spiess-szene", start: "top top", end: "+=260%", pin: ".spiess-pin", scrub: true,
      onUpdate: function (s) { Spiess.scroll(s.progress); setzeSchritt(Math.min(3, Math.floor(s.progress * 4))); }
    });
  });
  mm.add("(max-width: 900px)", function () {
    // Handy: Schritt leuchtet auf, sobald er in der Bildschirmmitte steht
    if (!window.IntersectionObserver) { schritte.forEach(function (s) { s.classList.add("aktiv"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) en.target.classList.add("aktiv"); });
    }, { rootMargin: "0px 0px -35% 0px" });
    schritte.forEach(function (s, k) { if (k > 0) s.classList.remove("aktiv"); io.observe(s); });
    return function () { io.disconnect(); };
  });

  // Überschriften der Abschnitte: Zeilen-Reveal
  $$(".gross, .firmen h2, .spiess-text h2").forEach(function (el) {
    SplitText.create(el, {
      type: "lines", mask: "lines", autoSplit: true,
      onSplit: function (self) { return gsap.from(self.lines, { yPercent: 110, duration: .9, ease: "power4.out", stagger: .1, scrollTrigger: { trigger: el, start: "top 88%", once: true } }); }
    });
  });

  // Vorher/Nachher: alte Karte wackelt rein, neue Karte schiebt sich daneben
  gsap.from(".vgl.alt", { x: -80, rotate: -4, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".vgl-raster", start: "top 80%", once: true } });
  gsap.from(".vgl.neu", { x: 80, rotate: 3, opacity: 0, duration: 1, delay: .2, ease: "power3.out", scrollTrigger: { trigger: ".vgl-raster", start: "top 80%", once: true } });
  gsap.from(".stempel", { scale: 2.4, opacity: 0, rotate: -12, duration: .5, delay: .9, ease: "power4.in", stagger: .25, scrollTrigger: { trigger: ".vgl-raster", start: "top 75%", once: true } });

  // Menüs und Stimmen: sanft einfahren
  gsap.from(".menue", { y: 60, opacity: 0, stagger: .1, duration: .7, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".menue-raster", start: "top 85%", once: true } });
  gsap.from(".zitate blockquote", { y: 40, opacity: 0, stagger: .12, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".zitate", start: "top 88%", once: true } });
  gsap.from(".gross-zahl", { scale: .6, opacity: 0, duration: .9, ease: "back.out(1.4)", scrollTrigger: { trigger: ".stimmen-kopf", start: "top 85%", once: true } });
  gsap.from(".gross-ic", { x: -140, rotate: -10, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".firmen", start: "top 85%", once: true } });

  // Magnetische Hauptknöpfe (nur mit Maus)
  if (window.matchMedia("(hover: hover)").matches) {
    $$(".hero .knopf, .bau-ergebnis .knopf").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3 });
      });
      b.addEventListener("pointerleave", function () { gsap.to(b, { x: 0, y: 0, duration: .5, ease: "elastic.out(1,.5)" }); });
    });
  }

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  ScrollTrigger.refresh();
  });
})();
