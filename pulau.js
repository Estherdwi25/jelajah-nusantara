const SVG_NS = "http://www.w3.org/2000/svg";

const svg = document.getElementById("svg");
const lapisan = document.getElementById("lapisan");
const lapisanSorot = document.getElementById("lapisan-sorot");
const label = document.getElementById("label-provinsi");

/* ---------- Kecerahan dari halaman pengaturan ---------- */
try {
  const persen = Number(localStorage.getItem("jn-kecerahan") ?? 100);
  document.getElementById("peredup").style.opacity = ((100 - persen) / 100) * 0.85;
} catch { /* abaikan */ }

/* ---------- Ambil data pulau dari ?pulau=nama ---------- */
const slug = new URLSearchParams(location.search).get("pulau");
const pulau = window.DATA_PROVINSI && window.DATA_PROVINSI[slug];

function tampilkanGalat(judul, isi) {
  document.getElementById("judul").textContent = "Oops";
  document.getElementById("peta").innerHTML =
    `<div class="galat"><h2>${judul}</h2><p>${isi}</p></div>`;
}

if (!window.DATA_PROVINSI) {
  tampilkanGalat(
    "Data provinsi tidak termuat",
    "File <b>provinsi-data.js</b> tidak ditemukan. Pastikan file itu ada di folder yang sama dengan <b>pulau.html</b>."
  );
} else if (!pulau) {
  tampilkanGalat(
    "Pulau tidak dikenal",
    `Tidak ada data untuk pulau &ldquo;${slug ?? ""}&rdquo;. Pilih pulau lagi dari peta.`
  );
} else {
  document.title = pulau.nama + " - Jelajah Nusantara";
  document.getElementById("judul").textContent = pulau.nama;
  svg.setAttribute("viewBox", `0 0 ${pulau.lebar} ${pulau.tinggi}`);

  // seberapa tinggi provinsi "terangkat" saat disorot (mengikuti ukuran peta)
  svg.style.setProperty("--angkat", Math.max(pulau.lebar, pulau.tinggi) * 0.007 + "px");

  pulau.provinsi.forEach((p, i) => buatProvinsi(p, i));
  tampilkanInfoPulau();
}

/* ---------- Kartu informasi ---------- */
function isiKartu(judul, teks) {
  const j = document.getElementById("judul-kartu");
  const isi = document.getElementById("isi-kartu");
  j.textContent = judul;
  j.classList.toggle("panjang", judul.length > 14);
  isi.replaceChildren();
  String(teks || "").split("\n").filter(Boolean).forEach((baris) => {
    const p = document.createElement("p");
    p.textContent = baris;
    isi.appendChild(p);
  });
  isi.scrollTop = 0;
}
function tampilkanInfoPulau() {
  const info = window.INFO_PULAU && window.INFO_PULAU[slug];
  isiKartu(pulau.nama, info || "Informasi tentang pulau ini akan segera hadir.");
}
function tampilkanInfoProvinsi(p) {
  const info = window.INFO_PROVINSI && window.INFO_PROVINSI[p.nama];
  if (info) isiKartu(p.nama, info); else tampilkanInfoPulau();
}

/* ---------- Nama provinsi mengikuti kursor ---------- */
function tampilkanLabel(nama, x, y) {
  label.textContent = nama;
  label.style.transform = `translate(${x + 18}px, ${y + 22}px)`;
  label.classList.add("tampil");
}
function sembunyikanLabel() { label.classList.remove("tampil"); }

/* ---------- Provinsi ---------- */
let aktif = null; // { asli, salinan }

function buatProvinsi(p, i) {
  const el = document.createElementNS(SVG_NS, "path");
  el.setAttribute("d", p.d);
  el.setAttribute("fill", p.warna);
  el.setAttribute("id", "prov-" + i);
  el.setAttribute("class", "provinsi");
  el.setAttribute("tabindex", "0");
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", p.nama);
  lapisan.appendChild(el);

  el.addEventListener("mouseenter", (e) => { sorot(el, p); tampilkanLabel(p.nama, e.clientX, e.clientY); tampilkanInfoProvinsi(p); });
  el.addEventListener("mousemove", (e) => tampilkanLabel(p.nama, e.clientX, e.clientY));
  el.addEventListener("mouseleave", () => { lepas(); sembunyikanLabel(); tampilkanInfoPulau(); });

  // Klik / Enter: pilih provinsi
  el.addEventListener("click", () => pilihProvinsi(el, p));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pilihProvinsi(el, p); }
  });

  // Navigasi keyboard
  el.addEventListener("focus", () => {
    sorot(el, p);
    tampilkanInfoProvinsi(p);
    const r = el.getBoundingClientRect();
    tampilkanLabel(p.nama, r.left + r.width / 2, r.top + r.height / 2);
  });
  el.addEventListener("blur", () => { lepas(); sembunyikanLabel(); tampilkanInfoPulau(); });
}

/* Salinan provinsi diletakkan di lapisan paling atas supaya tidak
   tertutup provinsi tetangga saat "timbul". */
function sorot(asli, p) {
  if (aktif && aktif.asli === asli) return;
  lepas();

  // Salinan biasa (bukan <use>), karena <use> ikut menyalin gaya "tersorot" milik aslinya
  const salinan = asli.cloneNode(false);
  ["id", "tabindex", "role", "aria-label"].forEach((a) => salinan.removeAttribute(a));
  salinan.setAttribute("class", "sorot");
  const kotak = asli.getBBox();
  salinan.style.transformOrigin = `${kotak.x + kotak.width / 2}px ${kotak.y + kotak.height / 2}px`;
  lapisanSorot.appendChild(salinan);
  asli.classList.add("tersorot");

  aktif = { asli, salinan };
  requestAnimationFrame(() => requestAnimationFrame(() => salinan.classList.add("naik")));
}

function lepas() {
  if (!aktif) return;
  const { asli, salinan } = aktif;
  aktif = null;
  salinan.classList.remove("naik");
  setTimeout(() => {
    salinan.remove();
    if (!aktif || aktif.asli !== asli) asli.classList.remove("tersorot");
  }, 230);
}

/* ---------- Pilih provinsi: zoom buram, lalu pindah halaman ---------- */
let sudahMemilih = false;

function pilihProvinsi(el, p) {
  if (sudahMemilih) return;
  sudahMemilih = true;

  const peta = document.getElementById("peta");
  const r = el.getBoundingClientRect();
  peta.style.animation = "none";
  peta.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
  peta.style.setProperty("--skala", "2.6");
  peta.classList.add("zoom-keluar");
  document.body.classList.add("berangkat");
  void peta.offsetWidth;
  peta.classList.add("jalan");

  setTimeout(() => {
    window.location.href = `provinsi.html?pulau=${slug}&provinsi=${encodeURIComponent(p.nama)}`;
  }, 900);
}
