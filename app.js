// Structures Hub · web pública. Sin dependencias.
// - Tarjetas desde herramientas.json; versiones en vivo desde catalogo() del servicio.
// - «Descargar» pide a enlace-descarga un enlace temporal al StructuresHub.exe de la última Release estable.
// - Español / inglés (por defecto el del navegador), revelado al hacer scroll y la demo animada del lanzador
//   (cuatro escenas con los estados reales: instalar, actualizar, actualizarse solo y abrir).
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
  pintarDemo();
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
    // La demo toma las versiones publicadas; si aún no ha arrancado, se repinta con ellas.
    if (!generacion && ds.cartas.length) { if (quieto) fotoFija(ds.paso); else { estadoInicial(0); pintarDemo(); } }
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
// Cuatro escenas en bucle con los estados y textos reales de Structures Hub: instalar una app, actualizar otra
// («Actualizar todo»), el lanzador actualizándose solo (franja) y abrir. Todo se pinta desde un estado (ds), así
// que cambiar de idioma a media escena no deja textos viejos. Se pausa fuera de pantalla o con la pestaña oculta,
// los pasos de abajo saltan a cualquier escena y, con «reducir movimiento», queda una imagen fija por paso.
const DEMO = {
  es: {
    apps: "Apps", plugins: "Plugins", todas: "Todas", instaladas: "Instaladas", con_act: "Con actualización",
    no: "No instalada", al_dia: "Instalada · al día", act: "Actualización disponible", abierta: "Abierta",
    instalar: "Instalar", abrir: "Abrir", actualizar_a: "Actualizar a {v}", actualizar: "Actualizar",
    v_pub: "Versión {v}", v_act: "{inst} instalada → {nueva} publicada",
    desc: "Descargando · {pct} % · {de} de {total} MB", todo: "Actualizar todo ({n})", ok: "{app} {v} instalada.",
    hub_nueva: "Structures Hub {v} disponible.", hub_nov: "Ver novedades", hub_act: "Actualizar y reiniciar",
    hub_desc: "Descargando Structures Hub {v} · {pct} %", hub_rein: "Se reiniciará al terminar", hub_ok: "Structures Hub {v}: al día.",
    pie: "Catálogo al día", equipo: "Equipo AECOM", enviar: "Enviar a SAP2000", grupo: "Pasos de la demostración",
    pasos: [
      ["Instala", "Un clic en «Instalar»: se descarga y queda en tu usuario, sin pedir administrador."],
      ["Actualiza", "Cuando sale una versión, la tarjeta lo avisa y aparece «Actualizar todo». Un clic y al día."],
      ["Se actualiza solo", "Structures Hub también se renueva: la franja lo avisa, se descarga y se reinicia solo."],
      ["Abre", "«Abrir» lanza la herramienta, y la tarjeta la marca como abierta mientras trabajas."],
    ],
  },
  en: {
    apps: "Apps", plugins: "Plugins", todas: "All", instaladas: "Installed", con_act: "With update",
    no: "Not installed", al_dia: "Installed · up to date", act: "Update available", abierta: "Open",
    instalar: "Install", abrir: "Open", actualizar_a: "Update to {v}", actualizar: "Update",
    v_pub: "Version {v}", v_act: "{inst} installed → {nueva} published",
    desc: "Downloading · {pct} % · {de} of {total} MB", todo: "Update all ({n})", ok: "{app} {v} installed.",
    hub_nueva: "Structures Hub {v} is available.", hub_nov: "What's new", hub_act: "Update and restart",
    hub_desc: "Downloading Structures Hub {v} · {pct} %", hub_rein: "It will restart when finished", hub_ok: "Structures Hub {v}: up to date.",
    pie: "Catalogue up to date", equipo: "AECOM computer", enviar: "Send to SAP2000", grupo: "Demo steps",
    pasos: [
      ["Install", "One click on “Install”: it downloads into your user profile, no admin rights needed."],
      ["Update", "When a version is out, the card says so and “Update all” shows up. One click and you're current."],
      ["Updates itself", "Structures Hub renews itself too: the banner tells you, it downloads and restarts on its own."],
      ["Open", "“Open” launches the tool, and the card marks it as open while you work."],
    ],
  },
};
const VERSIONES_DEMO = { "cargas-csi": "1.10", "aferentes-csi": "1.7", "empujes-csi": "1.9", [ID_LANZADOR]: "0.7" };
const MB = { "cargas-csi": 41.2, "aferentes-csi": 39.8, "empujes-csi": 38.5, [ID_LANZADOR]: 24.6 };
const DURACION = [6200, 6400, 7600, 5600]; // ms aproximados de cada escena, para la barra de su paso

const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
const dt = (k, datos = {}) => {
  const v = DEMO[idioma][k] ?? DEMO.es[k];
  return typeof v === "string" ? v.replace(/\{(\w+)\}/g, (_, c) => datos[c] ?? "") : v;
};
function versionDe(id) {
  return (versiones[id] && versiones[id].version) || (herramientas.find((h) => h.id === id) || {}).version || VERSIONES_DEMO[id];
}
// La versión anterior a una publicada (1.10 → 1.9, 1.3.1 → 1.3, 1.0 → 0.9): la demo nunca inventa versiones futuras.
function anterior(v) {
  const p = String(v).split(".").map(Number);
  if (p.some(isNaN)) return v;
  let i = p.length - 1;
  while (i > 0 && p[i] === 0) { p[i] = 9; i -= 1; }
  p[i] = Math.max(0, p[i] - 1);
  while (p.length > 2 && p[p.length - 1] === 0) p.pop();
  return p.join(".");
}

const ds = { paso: 0, cartas: [], hub: {}, todo: 0, aviso: "", app: false, velo: false, hubNueva: false };
function estadoInicial(paso) {
  const v = (id) => versionDe(id);
  ds.paso = paso;
  ds.cartas = [
    { id: "cargas-csi", nombre: "Cargas CSI", estado: paso >= 1 ? "al_dia" : "no", inst: paso >= 1 ? v("cargas-csi") : "", ultima: v("cargas-csi") },
    { id: "aferentes-csi", nombre: "Aferentes CSI", estado: "al_dia", inst: paso >= 2 ? v("aferentes-csi") : anterior(v("aferentes-csi")), ultima: v("aferentes-csi") },
    { id: "empujes-csi", nombre: "Empujes CSI", estado: "al_dia", inst: v("empujes-csi"), ultima: v("empujes-csi") },
  ].map((c) => ({ ...c, pct: 0, foco: false, abierta: false }));
  ds.hub = { inst: paso >= 3 ? v(ID_LANZADOR) : anterior(v(ID_LANZADOR)), nueva: v(ID_LANZADOR), fase: null, pct: 0 };
  ds.todo = 0; ds.aviso = ""; ds.app = false; ds.velo = false; ds.hubNueva = false;
}

// ----- Pintado -----
const pintadas = []; // por tarjeta: clave del último contenido pintado y su estado
function accionesHTML(c) {
  const b = (clave, clase, texto) => `<span class="demo-accion ${clase}" data-b="${clave}">${esc(texto)}</span>`;
  if (c.estado === "no") return b("instalar", "", dt("instalar"));
  if (c.estado === "desc") return `<div class="demo-progreso"><div class="barra"><span></span></div><small></small></div>`;
  if (c.estado === "act") return b("abrir", "sec ancho", dt("abrir")) + b("actualizar", "", dt(estrecha() ? "actualizar" : "actualizar_a", { v: c.ultima })) + b("mas", "mas ancho", "⋯");
  return b("abrir", "sec", dt("abrir")) + b("mas", "mas", "⋯");
}
function cartaHTML(c, pop) {
  // Mientras se descarga, la tarjeta conserva su estado: «No instalada» si es una instalación, «Actualización» si no.
  const chip = { no: ["", "no"], desc: c.inst ? ["aviso", "act"] : ["", "no"], al_dia: ["ok", "al_dia"], act: ["aviso", "act"] }[c.estado];
  const version = c.estado === "act" ? dt("v_act", { inst: c.inst, nueva: c.ultima }) : dt("v_pub", { v: c.estado === "al_dia" ? c.inst : c.ultima });
  return `<div class="fila"><img class="mono-svg" src="monogramas/${c.id}_128.png" alt=""><b>${esc(c.nombre)}</b></div>
    <div class="demo-chips"><span class="demo-chip ${chip[0]}${pop ? " pop" : ""}">${esc(dt(chip[1]))}</span>${c.abierta ? `<span class="demo-chip borde pop">${esc(dt("abierta"))}</span>` : ""}</div>
    <span class="demo-version">${esc(version)}</span>
    <div class="demo-acciones">${accionesHTML(c)}</div>`;
}
const estrecha = () => matchMedia("(max-width: 900px)").matches;

function pintarDemo() {
  const caja = $("#demo");
  if (!caja || !ds.cartas.length) return;
  $("#demo-vhub").textContent = "v" + ds.hub.inst;
  $("#demo-vhub").classList.toggle("nueva", ds.hubNueva);
  $("#demo-seg-apps").innerHTML = `${esc(dt("apps"))} <i>3</i>`;
  $("#demo-seg-plugins").innerHTML = `${esc(dt("plugins"))} <i>1</i>`;
  $("#demo-titulo").textContent = `${dt("apps")} · 3`;
  $("#demo-filtros").innerHTML = `<i class="on">${esc(dt("todas"))}</i><i>${esc(dt("instaladas"))}</i><i>${esc(dt("con_act"))}</i>`;
  const todo = $("#demo-todo");
  todo.hidden = !ds.todo;
  todo.textContent = dt("todo", { n: ds.todo });
  pintarFranja();
  $$(".demo-tarjeta", $("#demo-tarjetas")).forEach((el, i) => {
    const c = ds.cartas[i];
    if (!c) return;
    el.style.setProperty("--c", `var(--${["cc", "ac", "ec"][i]})`);
    el.classList.toggle("gris", !c.inst);
    el.classList.toggle("foco", c.foco);
    const clave = [idioma, c.estado, c.inst, c.ultima, c.abierta, estrecha()].join("|");
    const previa = pintadas[i];
    if (!previa || previa.clave !== clave) {
      el.innerHTML = cartaHTML(c, previa && previa.estado !== c.estado && c.estado !== "desc");
      pintadas[i] = { clave, estado: c.estado };
    }
    if (c.estado === "desc") {
      el.querySelector(".barra span").style.width = c.pct + "%";
      el.querySelector("small").textContent = dt("desc", { pct: Math.round(c.pct), de: (MB[c.id] * c.pct / 100).toFixed(1), total: MB[c.id] });
    }
  });
  $("#demo-pie").textContent = dt("pie");
  const aviso = $("#demo-aviso");
  if (ds.aviso) aviso.textContent = ds.aviso;
  aviso.classList.toggle("ver", !!ds.aviso);
  $("#demo-velo").classList.toggle("ver", ds.velo);
  $("#demo-app").classList.toggle("ver", ds.app);
  $("#demo-app-v").textContent = "v" + ds.cartas[0].inst;
  $("#demo-app-boton").textContent = dt("enviar");
  pintarPasos();
}

let franjaPintada = "";
function pintarFranja() {
  const h = ds.hub, caja = $("#demo-franja"), txt = $("#demo-franja-txt");
  caja.classList.toggle("abierta", !!h.fase);
  if (!h.fase) return; // al plegarse conserva el contenido para que no salte
  const clave = idioma + h.fase;
  if (franjaPintada !== clave) {
    txt.innerHTML = h.fase === "aviso"
      ? `<b>${esc(dt("hub_nueva", { v: h.nueva }))}</b><span class="enlace">${esc(dt("hub_nov"))}</span><span class="hueco"></span><span class="mini" data-b="hub">${esc(dt("hub_act"))}</span>`
      : `<b id="demo-hub-txt"></b><span class="barra"><span></span></span><span class="hueco"></span><span class="nota">${esc(dt("hub_rein"))}</span>`;
    franjaPintada = clave;
  }
  if (h.fase === "desc") {
    $("#demo-hub-txt").textContent = dt("hub_desc", { v: h.nueva, pct: Math.round(h.pct) });
    txt.querySelector(".barra span").style.width = h.pct + "%";
  }
}

let pasosIdioma = "";
function pintarPasos() {
  const caja = $("#demo-pasos");
  if (pasosIdioma !== idioma) {
    caja.setAttribute("aria-label", dt("grupo"));
    caja.innerHTML = dt("pasos").map(([titulo], i) =>
      `<button type="button" class="demo-paso" data-paso="${i}"><i></i><b>0${i + 1}</b>${esc(titulo)}</button>`).join("");
    pasosIdioma = idioma;
  }
  $$(".demo-paso", caja).forEach((b, i) => {
    b.classList.toggle("activo", i === ds.paso);
    b.classList.toggle("hecho", i < ds.paso);
    b.setAttribute("aria-current", i === ds.paso ? "step" : "false");
    if (i !== ds.paso) b.querySelector("i").style.width = "";
  });
  const leyenda = $("#demo-leyenda"), texto = dt("pasos")[ds.paso][1];
  if (leyenda.dataset.texto !== texto) {
    leyenda.dataset.texto = texto;
    leyenda.classList.add("cambio");
    setTimeout(() => { leyenda.textContent = texto; leyenda.classList.remove("cambio"); }, quieto ? 0 : 250);
  }
}

// ----- Motor: escenas cancelables -----
let generacion = 0, enVista = false, transcurrido = 0;
const pausada = () => !enVista || document.hidden;
class Cancelada extends Error {}
async function espera(ms, g) {
  let resta = ms;
  while (resta > 0) {
    if (g !== generacion) throw new Cancelada();
    const tramo = Math.min(resta, 80);
    await new Promise((r) => setTimeout(r, tramo));
    if (!pausada()) {
      resta -= tramo;
      transcurrido += tramo;
      const barra = $(`.demo-paso[data-paso="${ds.paso}"] i`);
      if (barra) barra.style.width = Math.min(100, (100 * transcurrido) / DURACION[ds.paso]) + "%";
    }
  }
  if (g !== generacion) throw new Cancelada();
}

let objetivo = null;
function colocarCursor() {
  const cursor = $("#demo-cursor"), escena = $(".demo-escena");
  if (!objetivo || !objetivo.isConnected || !objetivo.offsetParent) { cursor.style.left = "94%"; cursor.style.top = "90%"; return; }
  const a = escena.getBoundingClientRect(), b = objetivo.getBoundingClientRect();
  cursor.style.left = `${b.left - a.left + b.width * 0.5}px`;
  cursor.style.top = `${b.top - a.top + b.height * 0.55}px`;
}
const boton = (sel) => [...$$(sel, $("#demo-ventana"))].find((el) => el.offsetParent !== null);
async function irA(sel, g, ms = 950) { objetivo = boton(sel); colocarCursor(); $("#demo-cursor").classList.add("ver"); await espera(ms, g); return objetivo; }
async function clic(g) {
  const cursor = $("#demo-cursor"), el = objetivo;
  cursor.classList.add("clic");
  if (el) el.classList.add("pulsada");
  const onda = document.createElement("span");
  onda.className = "demo-onda";
  onda.style.left = cursor.style.left; onda.style.top = cursor.style.top;
  $(".demo-escena").appendChild(onda);
  setTimeout(() => onda.remove(), 600);
  await espera(170, g);
  cursor.classList.remove("clic");
  if (el) el.classList.remove("pulsada");
}
// En reposo, el cursor se aparta hacia la esquina y se desvanece: no tapa la ventana ni los pasos.
function descansar() { objetivo = null; colocarCursor(); $("#demo-cursor").classList.remove("ver"); }
// Avance de una descarga: más rápido al principio, como la real, con pintado en el sitio (sin rehacer la tarjeta).
async function descargar(fijar, ms, g) {
  const pasos = Math.round(ms / 80);
  for (let k = 1; k <= pasos; k += 1) { fijar(100 * (1 - Math.pow(1 - k / pasos, 1.6))); pintarDemo(); await espera(80, g); }
}
async function avisar(texto, g, ms = 1900) { ds.aviso = texto; pintarDemo(); await espera(ms, g); ds.aviso = ""; pintarDemo(); }

const ESCENAS = [
  async (g) => { // 1 · Instala
    const c = ds.cartas[0];
    await espera(700, g);
    c.foco = true; await irA('.demo-tarjeta:nth-child(1) [data-b="instalar"]', g); await clic(g);
    c.estado = "desc"; c.pct = 0; pintarDemo();
    await descargar((p) => { c.pct = p; }, 2300, g);
    c.estado = "al_dia"; c.inst = c.ultima; c.foco = false; descansar(); pintarDemo();
    await avisar(dt("ok", { app: c.nombre, v: c.inst }), g);
  },
  async (g) => { // 2 · Actualiza una app
    const c = ds.cartas[1];
    await espera(700, g);
    c.estado = "act"; ds.todo = 1; c.foco = true; pintarDemo();
    await espera(900, g);
    await irA('#demo-todo, .demo-tarjeta:nth-child(2) [data-b="actualizar"]', g, 1100); await clic(g);
    ds.todo = 0; c.estado = "desc"; c.pct = 0; pintarDemo();
    await descargar((p) => { c.pct = p; }, 2200, g);
    c.estado = "al_dia"; c.inst = c.ultima; c.foco = false; descansar(); pintarDemo();
    await avisar(dt("ok", { app: c.nombre, v: c.inst }), g);
  },
  async (g) => { // 3 · El Hub se actualiza solo
    await espera(600, g);
    ds.hub.fase = "aviso"; pintarDemo();
    await espera(1100, g);
    await irA('[data-b="hub"]', g); await clic(g);
    ds.hub.fase = "desc"; ds.hub.pct = 0; descansar(); pintarDemo();
    await descargar((p) => { ds.hub.pct = p; }, 2000, g);
    await espera(300, g);
    ds.velo = true; pintarDemo();
    await espera(900, g);
    ds.hub.fase = null; ds.hub.inst = ds.hub.nueva; ds.hubNueva = true; ds.velo = false; pintarDemo();
    await avisar(dt("hub_ok", { v: ds.hub.inst }), g, 1600);
    ds.hubNueva = false; pintarDemo();
  },
  async (g) => { // 4 · Abre
    const c = ds.cartas[0];
    await espera(500, g);
    c.foco = true; await irA('.demo-tarjeta:nth-child(1) [data-b="abrir"]', g); await clic(g);
    c.abierta = true; ds.app = true; descansar(); pintarDemo();
    await espera(2900, g);
    ds.app = false; c.foco = false; pintarDemo();
    await espera(900, g);
  },
];

async function bucle(desde) {
  const g = ++generacion;
  let paso = desde;
  try {
    for (;;) {
      estadoInicial(paso); transcurrido = 0; descansar(); pintarDemo();
      await ESCENAS[paso](g);
      const barra = $(`.demo-paso[data-paso="${paso}"] i`);
      if (barra) barra.style.width = "100%";
      paso = (paso + 1) % ESCENAS.length;
    }
  } catch (e) {
    if (!(e instanceof Cancelada)) throw e;
  }
}

// Con «reducir movimiento»: una imagen fija del final de cada paso, sin cursor.
function fotoFija(paso) {
  estadoInicial(Math.min(paso + 1, 3));
  ds.paso = paso;
  if (paso === 1) ds.cartas[1].inst = versionDe("aferentes-csi");
  if (paso === 3) { ds.cartas[0].abierta = true; ds.app = true; }
  pintarDemo();
}

function iniciarDemo() {
  const caja = $("#demo");
  if (!caja) return;
  if (quieto) { fotoFija(0); } else { estadoInicial(0); pintarDemo(); }
  $("#demo-pasos").addEventListener("click", (e) => {
    const b = e.target.closest("[data-paso]");
    if (!b) return;
    const paso = Number(b.dataset.paso);
    if (quieto) fotoFija(paso); else bucle(paso);
  });
  if (quieto) return;
  let arrancada = false;
  const ver = (si) => {
    enVista = si;
    if (si && !arrancada) {
      arrancada = true;
      // Espera a que la ventana termine de enderezarse: con la inclinación, las posiciones del cursor saldrían torcidas.
      setTimeout(() => bucle(0), 1300);
    }
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => es.forEach((e) => ver(e.isIntersecting)), { threshold: 0.35 }).observe(caja);
  } else ver(true);
  let marco = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(marco);
    marco = requestAnimationFrame(() => { pintadas.length = 0; pintarDemo(); colocarCursor(); });
  });
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
  iniciarDemo();
});
