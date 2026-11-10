// Structures Hub · web pública. Sin dependencias.
// - Tarjetas desde herramientas.json; versiones en vivo desde catalogo() del servicio.
// - «Descargar» pide a enlace-descarga un enlace temporal al StructuresHub.exe de la última Release estable.
// - Español / inglés (por defecto el del navegador), revelado al hacer scroll y la demo animada del lanzador.
"use strict";

const SERVICIO = "https://tnehufhvczbvaihbhizi.supabase.co";
const CLAVE = "sb_publishable_HGyxZLsy_CSmGiydRlllnQ_HkEHG_uG"; // publishable: pública por diseño
const ID_LANZADOR = "structures-hub";

const EN = {
  nav_herr: "Tools", nav_empezar: "Get started", nav_guia: "Guide", nav_descargar: "Download",
  hero_eti: "Structural suite · SAP2000 · ETABS · Grasshopper",
  hero_titulo: 'Your structural tools, <span class="resalte">all in one place</span>.',
  hero_entrada: "Structures Hub installs, updates and opens the team's apps and plugins. Download it once: the rest arrives on its own.",
  hero_descargar: "Download for Windows", hero_ver: "See the tools",
  hero_meta2: "Windows 10 and 11 · for the AECOM structures team",
  demo_franja: "available · release notes", demo_actualizar: "Update", demo_no: "Not installed",
  demo_instalar: "Install", demo_abrir: "Open", demo_al_dia: "Up to date", demo_instalada: "Installed",
  herr_eti: "01 · Tools", herr_titulo: "From Excel to the model, without typing loads by hand",
  herr_entrada: "Each tool takes care of one part of the daily work and sends the result straight to SAP2000, ETABS or Revit.",
  pasos_eti: "02 · Get started", pasos_titulo: "Up and running in three steps",
  pasos_entrada: "No installers, no admin rights. Five minutes, coffee included.",
  p1_t: "Download", p1_d: "Click “Download for Windows”. It's a single file: <code>StructuresHub.exe</code>.",
  p2_t: "Open it", p2_d: "It installs itself in your user profile and shows up in the Start menu. From then on it updates itself.",
  p3_t: "Sign in", p3_d: "With your AECOM email and the 6-digit code you receive. Then install whatever you need.",
  ven_eti: "03 · Built for everyday work", ven_titulo: "So you only have to think about the structure",
  v1_t: "Updates itself", v1_d: "When a new version is out, a banner tells you. One click and done; if something breaks, roll back.",
  v2_t: "No admin rights", v2_d: "Everything installs in your user profile. No special permissions, no changes to the computer's settings.",
  v3_t: "Works offline", v3_d: "The licence lasts 14 days without internet. Handy on site, or when the VPN won't cooperate.",
  v4_t: "A code, not a password", v4_d: "Sign in with your AECOM email and a one-time code. Nothing to remember.",
  v5_t: "Spanish and English", v5_d: "The whole suite speaks both and follows your Windows language. Switch whenever you like.",
  v6_t: "Light and dark", v6_d: "One design line, Steel, across every tool. With light and dark themes.",
  guia_eti: "04 · Guide", guia_titulo: "Frequently asked questions", guia_entrada: "What people usually ask in their first week.",
  q1: "Who can use the suite?",
  r1: "<p>The AECOM structures team. Anyone can download Structures Hub, but opening the tools requires being on the member list: if you're not, ask a team administrator for access.</p>",
  q2: "My code doesn't arrive",
  r2: "<ol><li>Wait 1 to 3 minutes: it sometimes takes a while.</li><li>Check “Other” or junk mail. It comes from a sender Outlook doesn't know: click <b>“Trust sender”</b> so next time it lands in your inbox.</li><li>After 10 minutes the code expires: request a new one.</li></ol>",
  q3: "Windows says it “protected your PC”",
  r3: "<p>That's SmartScreen: the file isn't digitally signed yet. Click <b>“More info”</b> and then <b>“Run anyway”</b>. It only happens the first time; updates come through Structures Hub itself.</p>",
  q4: "What do the labels on each card mean?",
  r4: "<ul><li><b>Up to date</b>: you have the latest version.</li><li><b>New version</b>: an update is available; the banner at the top lets you install it.</li><li><b>Test</b>: a test version, only shown if you turn it on in ⚙.</li><li><b>Not installed</b>: click “Install”.</li></ul>",
  q5: "On how many computers can I use it?",
  r5: "<p>On 2 computers per tool. If you change laptops, release the old one from your account panel (your name, top right). A computer unused for 90 days is released automatically.</p>",
  q6: "What if I have no internet?",
  r6: "<p>The tools keep opening for 14 days after the last connection. AECOM computers get 7 extra days. The very first time does need a connection.</p>",
  q7: "How do I open Pórticos GH?",
  r7: "<p>Install it from the <b>Plugins</b> section and use <b>“Open ▾”</b>: pick the definition (buildings, sheds or the Revit export) and it opens in Rhino 8 or in the Dynamo folder.</p>",
  final_t: "Fewer repetitive steps. More engineering.", final_d: "Download Structures Hub and have the whole suite one click away.",
  pie_d: "Made by and for the structures team.",
};
const TEXTOS = {
  es: { preparando: "Preparando la descarga…", descargando: (a, mb) => `Descargando ${a} (${mb} MB). Ábrelo cuando termine.`,
        fallo: "No se pudo preparar la descarga. Inténtalo de nuevo en un momento o pide el archivo al equipo.",
        pruebas: "Pruebas", app: "App", plugin: "Plugin" },
  en: { preparando: "Preparing the download…", descargando: (a, mb) => `Downloading ${a} (${mb} MB). Open it when it's done.`,
        fallo: "The download couldn't be prepared. Try again in a moment or ask the team for the file.",
        pruebas: "Test", app: "App", plugin: "Plugin" },
};

let idioma = "es";
let herramientas = [];
let versiones = {}; // id → {version, pruebas}
const ES = new Map(); // texto original en español de cada [data-t]

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const t = (k) => TEXTOS[idioma][k];

function guardar(clave, valor) { try { localStorage.setItem(clave, valor); } catch (_) { /* sin almacenamiento */ } }
function leer(clave) { try { return localStorage.getItem(clave); } catch (_) { return null; } }

// ---------- Idioma ----------
function aplicarIdioma(nuevo) {
  idioma = nuevo === "en" ? "en" : "es";
  document.documentElement.lang = idioma;
  $$("[data-t]").forEach((el) => {
    const k = el.dataset.t;
    if (!ES.has(el)) ES.set(el, el.innerHTML);
    el.innerHTML = idioma === "en" && EN[k] ? EN[k] : ES.get(el);
  });
  $$("[data-idioma]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.idioma === idioma)));
  pintarHerramientas();
  pintarVersiones();
}

// ---------- Herramientas ----------
function pintarHerramientas() {
  const lista = $("#lista-herramientas");
  if (!lista || !herramientas.length) return;
  lista.innerHTML = herramientas.map((h) => {
    const txt = h[idioma] || h.es;
    return `<article class="herramienta revelar" style="--c: ${esc(h.color)}">
      <div class="herramienta-cab"><img class="mono-svg" src="monogramas/${esc(h.id)}_128.png" alt="">
        <div><h3>${esc(h.nombre)}</h3><div class="plataforma">${esc(h.plataforma)}</div></div></div>
      <p>${esc(txt.descripcion)}</p>
      <ul>${txt.puntos.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      <div class="pie-tarjeta"><span class="chip ok" data-v="${esc(h.id)}" data-pref="v">v${esc(h.version)}</span><span class="chip">${esc(t(h.tipo) || h.tipo)}</span></div>
    </article>`;
  }).join("");
  observar($$(".revelar", lista));
}

function pintarVersiones() {
  $$("[data-v]").forEach((el) => {
    const v = versiones[el.dataset.v];
    if (!v) return;
    el.textContent = (el.dataset.pref || "") + v.version + (v.pruebas ? ` · ${t("pruebas")}` : "");
    if (el.classList.contains("chip")) el.classList.toggle("ok", !v.pruebas);
  });
  const hub = versiones[ID_LANZADOR];
  if (hub) $$('[data-v="hub"]').forEach((el) => { el.textContent = "v" + hub.version; });
}

async function cargarDatos() {
  try {
    const r = await fetch("herramientas.json", { cache: "no-cache" });
    herramientas = (await r.json()).herramientas || [];
    pintarHerramientas();
  } catch (_) { /* sin tarjetas: el resto de la página sigue */ }
  try {
    const r = await fetch(`${SERVICIO}/rest/v1/rpc/catalogo`, {
      method: "POST", headers: { apikey: CLAVE, "Content-Type": "application/json" }, body: "{}",
    });
    if (!r.ok) return;
    for (const h of await r.json()) {
      if (h.ultima && h.ultima.version) versiones[h.id] = { version: h.ultima.version, pruebas: false };
      else if (h.ultima_pruebas && h.ultima_pruebas.version) versiones[h.id] = { version: h.ultima_pruebas.version, pruebas: true };
    }
    versiones.hub = versiones[ID_LANZADOR];
    pintarVersiones();
  } catch (_) { /* sin servicio: quedan las versiones escritas en los datos */ }
}

// ---------- Descarga ----------
async function descargar(boton) {
  const aviso = $("#aviso");
  $$(".descargar").forEach((b) => b.setAttribute("aria-busy", "true"));
  aviso.textContent = t("preparando");
  if (boton.closest(".final") || boton.closest(".nav")) $("#inicio").scrollIntoView({ behavior: "smooth" });
  try {
    const r = await fetch(`${SERVICIO}/functions/v1/enlace-descarga`, {
      method: "POST", headers: { apikey: CLAVE, "Content-Type": "application/json" },
      body: JSON.stringify({ herramienta: ID_LANZADOR }),
    });
    const datos = await r.json();
    if (!r.ok || !String(datos.url || "").startsWith("https://")) throw new Error(datos.error || r.status);
    aviso.textContent = t("descargando")(datos.archivo, (datos.tamano / 1048576).toFixed(0));
    window.location.href = datos.url;
  } catch (_) {
    aviso.textContent = t("fallo");
  } finally {
    setTimeout(() => $$(".descargar").forEach((b) => b.removeAttribute("aria-busy")), 1500);
  }
}

// ---------- Revelado al hacer scroll ----------
const observador = "IntersectionObserver" in window
  ? new IntersectionObserver((entradas) => entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); observador.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" })
  : null;
function observar(elementos) {
  elementos.forEach((el) => (observador ? observador.observe(el) : el.classList.add("visible")));
}

// ---------- Demo del lanzador ----------
const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
function texto(clave) { return idioma === "en" && EN[clave] ? EN[clave] : ({ demo_instalada: "Instalada", demo_abrir: "Abrir", demo_instalar: "Instalar", demo_no: "No instalada" })[clave]; }

async function demo() {
  const caja = $("#demo"), cursor = $("#demo-cursor"), boton = $("#demo-boton"), chip = $("#demo-chip");
  const progreso = $("#demo-progreso"), barra = $("#demo-barra"), pct = $("#demo-pct"), franja = $("#demo-franja");
  if (!caja || quieto) { if (cursor) cursor.hidden = true; return; }
  const ir = (el, dx = 0.5, dy = 0.5) => {
    const a = caja.getBoundingClientRect(), b = el.getBoundingClientRect();
    cursor.style.left = `${b.left - a.left + b.width * dx}px`;
    cursor.style.top = `${b.top - a.top + b.height * dy}px`;
  };
  const clic = async () => { cursor.classList.add("clic"); await pausa(160); cursor.classList.remove("clic"); };
  cursor.style.left = "92%"; cursor.style.top = "105%";
  for (;;) {
    // Estado inicial: Cargas CSI sin instalar.
    franja.hidden = true; progreso.hidden = true; boton.hidden = false;
    chip.className = "demo-chip"; chip.dataset.t = "demo_no"; chip.textContent = texto("demo_no");
    boton.dataset.t = "demo_instalar"; boton.textContent = texto("demo_instalar");
    await pausa(1400);
    ir(boton); await pausa(1100); await clic();
    boton.hidden = true; progreso.hidden = false;
    for (let p = 0; p <= 100; p += 4) { barra.style.width = p + "%"; pct.textContent = p + " %"; await pausa(55); }
    await pausa(250);
    progreso.hidden = true; boton.hidden = false;
    chip.className = "demo-chip ok"; chip.dataset.t = "demo_instalada"; chip.textContent = texto("demo_instalada");
    boton.dataset.t = "demo_abrir"; boton.textContent = texto("demo_abrir");
    await pausa(900);
    franja.hidden = false; // «versión nueva»: la franja baja con su animación
    ir(boton, 0.5, 0.5); await pausa(1200); await clic();
    cursor.style.left = "92%"; cursor.style.top = "105%";
    await pausa(3600);
  }
}

// ---------- Arranque ----------
document.addEventListener("DOMContentLoaded", () => {
  const guardado = leer("idioma");
  aplicarIdioma(guardado || ((navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en"));
  $$("[data-idioma]").forEach((b) => b.addEventListener("click", () => { aplicarIdioma(b.dataset.idioma); guardar("idioma", idioma); }));
  $$(".descargar").forEach((b) => b.addEventListener("click", () => descargar(b)));
  observar($$(".revelar"));
  observar([$("#demo"), $("#pasos")].filter(Boolean));
  const nav = $("#nav");
  const sombra = () => nav.classList.toggle("con-sombra", window.scrollY > 8);
  window.addEventListener("scroll", sombra, { passive: true }); sombra();
  cargarDatos();
  demo();
});
