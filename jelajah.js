const HALAMAN_PULAU = "pulau.html"; // halaman tujuan; menerima ?pulau=nama-pulau

const peta = document.getElementById("peta");
const label = document.getElementById("label-pulau");
const peredup = document.getElementById("peredup");
const semuaPulau = document.querySelectorAll(".pulau");

/* ---------- Kecerahan dari halaman pengaturan ---------- */
try {
  const persen = Number(localStorage.getItem("jn-kecerahan") ?? 100);
  peredup.style.opacity = ((100 - persen) / 100) * 0.85;
} catch { /* abaikan */ }

/* ---------- Gambar peta latar: kalau ada, bentuk pulau jadi transparan ---------- */
const latarPeta = document.querySelector(".latar-peta");
if (latarPeta) {
  const tandai = () => document.body.classList.add("peta-gambar");
  if (latarPeta.complete && latarPeta.naturalWidth > 0) tandai();
  else latarPeta.addEventListener("load", tandai);
}

/* ---------- Nama pulau mengikuti kursor ---------- */
function tampilkanLabel(nama, x, y) {
  label.textContent = nama;
  label.style.transform = `translate(${x + 18}px, ${y + 22}px)`;
  label.classList.add("tampil");
}
function sembunyikanLabel() { label.classList.remove("tampil"); }

semuaPulau.forEach((pulau) => {
  const nama = pulau.dataset.nama;

  pulau.addEventListener("mouseenter", (e) => tampilkanLabel(nama, e.clientX, e.clientY));
  pulau.addEventListener("mousemove", (e) => tampilkanLabel(nama, e.clientX, e.clientY));
  pulau.addEventListener("mouseleave", sembunyikanLabel);

  // Navigasi keyboard: label muncul di tengah pulau
  pulau.addEventListener("focus", () => {
    const r = pulau.getBoundingClientRect();
    tampilkanLabel(nama, r.left + r.width / 2, r.top + r.height / 2);
  });
  pulau.addEventListener("blur", sembunyikanLabel);

  pulau.addEventListener("click", () => pilihPulau(pulau));
  pulau.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pilihPulau(pulau); }
  });
});

/* ---------- Pilih pulau: zoom ke pulau, pulau lain memburam, lalu pindah halaman ---------- */
const svg = document.querySelector(".peta svg");
const DURASI = 1100; // ms, samakan dengan transition .peta di jelajah.css
let sudahMemilih = false;

// Area tempat pulau akan digambar di halaman provinsi (sesuai padding .peta di pulau.css)
function areaTujuan() {
  const kecil = innerWidth <= 800;
  const kiri = innerWidth * (kecil ? 0.03 : 0.08);
  const atas = innerHeight * (kecil ? 0.18 : 0.15);
  const lebar = innerWidth - kiri * 2;
  const tinggi = innerHeight * (kecil ? 0.68 : 0.74);
  return { cx: kiri + lebar / 2, cy: atas + tinggi / 2, lebar, tinggi };
}

function pilihPulau(pulau) {
  if (sudahMemilih) return;
  sudahMemilih = true;

  // Posisi & ukuran pulau di layar (dihitung dari geometrinya, bukan dari efek hover)
  peta.style.animation = "none";
  const bb = pulau.getBBox();
  const m = svg.getScreenCTM();
  const ke = (x, y) => ({ x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f });
  const a = ke(bb.x, bb.y);
  const b = ke(bb.x + bb.width, bb.y + bb.height);
  const lebar = b.x - a.x;
  const tinggi = b.y - a.y;
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2;

  // Pulau diperbesar & digeser ke tengah, tepat di tempat ia akan muncul di halaman berikutnya
  const t = areaTujuan();
  const skala = Math.min(14, Math.min(t.lebar / lebar, t.tinggi / tinggi));
  const tx = t.cx - skala * cx;
  const ty = t.cy - skala * cy;

  pulau.classList.add("dipilih");
  document.body.classList.add("berangkat");
  peta.style.transformOrigin = "0 0";
  peta.style.transform = `translate(${tx}px, ${ty}px) scale(${skala})`;

  setTimeout(() => {
    window.location.href = `${HALAMAN_PULAU}?pulau=${pulau.dataset.slug}`;
  }, DURASI + 50);
}
