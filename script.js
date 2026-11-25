const HALAMAN_BERIKUTNYA = "jelajah.html"; // ganti sesuai halaman peta interaktifmu nanti

/* ---------- Elemen ---------- */
const $ = (id) => document.getElementById(id);

const layarPengaturan = $("layar-pengaturan");

const sliderVolume = $("slider-volume");
const sliderKecerahan = $("slider-kecerahan");
const nilaiVolume = $("nilai-volume");
const nilaiKecerahan = $("nilai-kecerahan");

const sliderKursor = $("slider-kursor");
const nilaiKursor = $("nilai-kursor");

const musik = $("musik");
const peredup = $("peredup");

const dialogTentang = $("dialog-tentang");
const dialogKeluar = $("dialog-keluar");

/* ---------- Simpan & ambil pengaturan ---------- */
// localStorage dipakai supaya pengaturan tetap tersimpan di halaman lain
function ambil(kunci, bawaan) {
  try {
    const nilai = localStorage.getItem(kunci);
    return nilai === null ? bawaan : Number(nilai);
  } catch { return bawaan; }
}
function simpan(kunci, nilai) {
  try { localStorage.setItem(kunci, nilai); } catch { /* abaikan */ }
}

/* ---------- Volume (1-100%) ---------- */
function aturVolume(persen) {
  nilaiVolume.textContent = persen + "%";
  musik.volume = persen / 100;
  simpan("jn-volume", persen);
}

/* ---------- Kecerahan (1-100%) ---------- */
function aturKecerahan(persen) {
  nilaiKecerahan.textContent = persen + "%";
  // 100% = layar normal, 1% = digelapkan sampai 85% (tidak pernah hitam total)
  peredup.style.opacity = ((100 - persen) / 100) * 0.85;
  simpan("jn-kecerahan", persen);
}

/* Muat nilai tersimpan saat halaman dibuka */
sliderVolume.value = ambil("jn-volume", 70);
sliderKecerahan.value = ambil("jn-kecerahan", 100);
aturVolume(Number(sliderVolume.value));
aturKecerahan(Number(sliderKecerahan.value));

sliderVolume.addEventListener("input", () => aturVolume(Number(sliderVolume.value)));
sliderKecerahan.addEventListener("input", () => aturKecerahan(Number(sliderKecerahan.value)));

/* ---------- Ukuran kursor (10-100%) ---------- */
sliderKursor.value = ambil("jn-kursor", 40);
nilaiKursor.textContent = sliderKursor.value + "%";
sliderKursor.addEventListener("input", () => {
  const p = window.aturKursor(Number(sliderKursor.value)); // juga menyimpan nilainya
  nilaiKursor.textContent = p + "%";
});

/* ---------- Musik latar ---------- */
// Browser melarang suara otomatis, jadi musik mulai setelah klik pertama
document.addEventListener("click", () => {
  if (musik.paused) {
    const janji = musik.play();
    if (janji && janji.catch) janji.catch(() => {});
  }
}, { once: true });

/* ---------- Buka / tutup layar pengaturan ---------- */
function bukaPengaturan() {
  layarPengaturan.classList.add("buka");
  layarPengaturan.setAttribute("aria-hidden", "false");
}
function tutupPengaturan() {
  layarPengaturan.classList.remove("buka");
  layarPengaturan.setAttribute("aria-hidden", "true");
}

$("btn-pengaturan").addEventListener("click", bukaPengaturan);
$("btn-kembali").addEventListener("click", tutupPengaturan);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && layarPengaturan.classList.contains("buka") && !document.querySelector("dialog[open]")) {
    tutupPengaturan();
  }
});

/* ---------- Dialog: Tentang & Keluar ---------- */
$("btn-tentang").addEventListener("click", () => dialogTentang.showModal());
$("btn-keluar").addEventListener("click", () => dialogKeluar.showModal());
document.querySelectorAll(".tutup-dialog").forEach((tombol) => {
  tombol.addEventListener("click", () => tombol.closest("dialog").close());
});

/* ---------- Tombol Main: animasi lalu pindah halaman ---------- */
$("btn-main").addEventListener("click", () => {
  document.body.classList.add("mulai");
  setTimeout(() => { window.location.href = HALAMAN_BERIKUTNYA; }, 1000);
});
