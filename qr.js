const NAMA = {
  "pakaian": "Pakaian Tradisional",
  "rumah": "Rumah Tradisional",
  "alat-musik": "Alat Musik Tradisional",
  "makanan": "Makanan Khas Daerah",
};

const $ = (id) => document.getElementById(id);
const video = $("video");
const pemindai = $("pemindai");
const pesanKamera = $("pesan-kamera");
const statusEl = $("status");
const hasilEl = $("hasil");

/* ---------- Tombol Kembali: ke halaman kategori asal (kalau datang dari sana) ---------- */
const params = new URLSearchParams(location.search);
if (params.get("pulau") && params.get("provinsi") && NAMA[params.get("kategori")]) {
  $("btn-kembali").href =
    `kategori.html?pulau=${params.get("pulau")}&provinsi=${encodeURIComponent(params.get("provinsi"))}` +
    `&kategori=${params.get("kategori")}&item=${params.get("item") || 0}&v=${params.get("v") || 0}`;
}

/* ---------- Kamera ---------- */
let aliran = null;      // MediaStream
let memindai = false;
const kanvas = document.createElement("canvas");
const ctx = kanvas.getContext ? kanvas.getContext("2d", { willReadFrequently: true }) : null;

const diagEl = $("diagnosis");
const btnCoba = $("btn-coba");

/* Tampilkan pesan masalah kamera + rincian teknis + tombol coba lagi */
function pesan(teks, teknis) {
  pemindai.classList.remove("menyala");
  pesanKamera.textContent = teks;
  btnCoba.hidden = false;
  diagEl.hidden = !teknis;
  diagEl.textContent = teknis ? `Rincian teknis: ${teknis}` : "";
}

async function nyalakanKamera() {
  hasilEl.hidden = true;
  statusEl.textContent = "";
  btnCoba.hidden = true;
  diagEl.hidden = true;
  pesanKamera.textContent = "Membuka kamera…";
  pemindai.classList.remove("menyala");

  const alamat = location.origin;
  const aman = window.isSecureContext || ["localhost", "127.0.0.1"].includes(location.hostname);

  if (!aman) {
    pesan(`Browser memblokir kamera di alamat ini (${alamat}). ` +
          `Buka lewat http://localhost atau http://127.0.0.1, atau lewat https. ` +
          `Kamu juga bisa memakai tombol "Pindai dari foto".`,
          `alamat tidak aman: ${alamat}`);
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    pesan('Browser ini tidak mendukung akses kamera. Coba Chrome, Edge, Firefox, atau Safari terbaru, atau pakai "Pindai dari foto".',
          "navigator.mediaDevices tidak tersedia");
    return;
  }

  try {
    try {
      aliran = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },   // kamera belakang kalau ada
        audio: false,
      });
    } catch (err) {
      // Laptop/PC tanpa kamera belakang: coba lagi dengan kamera apa saja
      if (err && (err.name === "OverconstrainedError" || err.name === "NotFoundError")) {
        aliran = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } else {
        throw err;
      }
    }
  } catch (err) {
    const nama = (err && err.name) || "Error";
    if (nama === "NotAllowedError" || nama === "SecurityError" || nama === "PermissionDeniedError") {
      pesan('Izin kamera ditolak. Klik ikon gembok atau kamera di sebelah alamat (bagian atas browser), ' +
            'ubah "Kamera" menjadi "Izinkan", lalu klik "Coba kamera lagi". ' +
            'Kalau memakai pratinjau di dalam VS Code, buka lewat Chrome atau Edge.', nama);
    } else if (nama === "NotFoundError" || nama === "DevicesNotFoundError") {
      pesan('Kamera tidak ditemukan. Pastikan perangkat punya kamera dan kameranya aktif, atau pakai "Pindai dari foto".', nama);
    } else if (nama === "NotReadableError" || nama === "TrackStartError" || nama === "AbortError") {
      pesan("Kamera sedang dipakai aplikasi lain (misalnya Zoom, Google Meet, atau tab lain). Tutup dulu, lalu klik Coba kamera lagi.", nama);
    } else {
      pesan('Kamera tidak bisa dibuka. Klik "Coba kamera lagi" atau pakai "Pindai dari foto".', `${nama}: ${err && err.message}`);
    }
    return;
  }

  video.srcObject = aliran;
  try { await video.play(); } catch { /* beberapa browser memutar otomatis */ }
  pemindai.classList.add("menyala");
  statusEl.textContent = "Mencari QR Code…";
  memindai = true;
  requestAnimationFrame(pindaiBingkai);
}

function matikanKamera() {
  memindai = false;
  if (aliran) { aliran.getTracks().forEach((t) => t.stop()); aliran = null; }
  video.srcObject = null;
}

/* ---------- Membaca QR dari gambar kamera ---------- */
let terakhir = 0;
function pindaiBingkai(waktu) {
  if (!memindai) return;
  requestAnimationFrame(pindaiBingkai);
  if (waktu - terakhir < 100) return;           // ±10 kali per detik sudah cukup
  terakhir = waktu;

  if (video.readyState < 2 || !video.videoWidth || !ctx) return;

  const skala = Math.min(1, 640 / video.videoWidth);   // kecilkan supaya ringan
  kanvas.width = Math.round(video.videoWidth * skala);
  kanvas.height = Math.round(video.videoHeight * skala);
  ctx.drawImage(video, 0, 0, kanvas.width, kanvas.height);

  const data = ctx.getImageData(0, 0, kanvas.width, kanvas.height);
  const kode = jsQR(data.data, data.width, data.height, { inversionAttempts: "dontInvert" });
  if (kode && kode.data) tanganiHasil(kode.data);
}

/* ---------- Apa yang dilakukan setelah QR terbaca ---------- */
let pewaktu = null;

function tanganiHasil(teks) {
  matikanKamera();
  pemindai.classList.remove("menyala");
  pesanKamera.textContent = "QR Code terbaca";
  statusEl.textContent = "";
  clearTimeout(pewaktu);

  const t = teks.trim();
  const cocok = window.cariBerdasarkanKode ? window.cariBerdasarkanKode(t) : null;
  const GLB = /\.(glb|gltf)(\?.*)?$/i;

  let sumber = null;       // tautan / file model
  let urlPenampil = null;  // alamat halaman penampil 3D di dalam aplikasi

  if (cocok) {
    const it = cocok.item;
    const semua = [it.model3d, ...(it.varian || []).map((v) => v.model3d)].filter(Boolean);
    sumber = semua[0] || null;
    if (semua.some((s) => GLB.test(s))) {
      urlPenampil = `model3d.html?prov=${encodeURIComponent(cocok.provinsi)}&kat=${encodeURIComponent(cocok.kategori)}` +
                    `&item=${cocok.indeks}&v=${cocok.varian}`;
    }
  } else if (/^https?:\/\//i.test(t) || /^(?!.*\.\.)[\w\-./]+\.(glb|gltf)$/i.test(t)) {
    sumber = t;
    if (GLB.test(t)) {
      urlPenampil = `model3d.html?src=${encodeURIComponent(t)}&nama=${encodeURIComponent("Model 3D")}` +
                    `&kembali=${encodeURIComponent(location.pathname.split("/").pop() + location.search)}`;
    }
  }

  $("hasil-judul").textContent = cocok ? cocok.item.nama : (sumber ? "QR Code terbaca" : "QR Code tidak dikenali");
  $("hasil-isi").textContent = cocok
    ? `${NAMA[cocok.kategori] || "Budaya"}` + (sumber ? "" : " — model 3D untuk item ini belum tersedia.")
    : (sumber ? sumber : `Isi QR: ${teks}`);

  const buka = $("hasil-buka");
  if (urlPenampil) {
    // Model GLB dibuka di penampil 3D di dalam aplikasi, langsung otomatis
    buka.href = urlPenampil;
    buka.removeAttribute("target");
    buka.querySelector(".teks-tombol").textContent = "Lihat model 3D";
    buka.hidden = false;
    pewaktu = setTimeout(() => pergi(buka.href), 900);
  } else if (sumber && /^https?:\/\//i.test(sumber)) {
    // Tautan biasa (bukan GLB): buka di tab baru
    buka.href = sumber;
    buka.target = "_blank";
    buka.querySelector(".teks-tombol").textContent = "Buka model 3D";
    buka.hidden = false;
  } else {
    buka.hidden = true;
  }

  hasilEl.hidden = false;
}

/* Pindah halaman dengan zoom buram */
let sedangPergi = false;
function pergi(url) {
  if (sedangPergi) return;
  sedangPergi = true;
  const el = document.getElementById("halaman");
  const r = hasilEl.getBoundingClientRect();
  el.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
  el.style.setProperty("--skala", "2.2");
  el.style.animation = "none";
  document.body.classList.add("berangkat");
  void el.offsetWidth;
  el.classList.add("jalan");
  setTimeout(() => { window.location.href = url; }, 900);
}
$("hasil-buka").addEventListener("click", (e) => {
  const b = e.currentTarget;
  if (b.getAttribute("target") === "_blank" || e.button !== 0 || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  clearTimeout(pewaktu);
  pergi(b.href);
});

/* ---------- Pindai dari foto (cadangan kalau kamera tidak bisa dipakai) ---------- */
$("input-foto").addEventListener("change", (e) => {
  const berkas = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!berkas) return;

  matikanKamera();
  pemindai.classList.remove("menyala");
  statusEl.textContent = "Membaca foto…";

  const url = URL.createObjectURL(berkas);
  const gambar = new Image();
  gambar.onload = () => {
    const skala = Math.min(1, 1280 / Math.max(gambar.width, gambar.height));
    kanvas.width = Math.round(gambar.width * skala);
    kanvas.height = Math.round(gambar.height * skala);
    ctx.drawImage(gambar, 0, 0, kanvas.width, kanvas.height);
    URL.revokeObjectURL(url);

    const data = ctx.getImageData(0, 0, kanvas.width, kanvas.height);
    const kode = jsQR(data.data, data.width, data.height, { inversionAttempts: "attemptBoth" });
    if (kode && kode.data) {
      tanganiHasil(kode.data);
    } else {
      statusEl.textContent = "QR Code tidak terbaca di foto. Coba foto lagi dengan QR yang jelas, terang, dan tidak terpotong.";
      btnCoba.hidden = false;
    }
  };
  gambar.onerror = () => { statusEl.textContent = "Foto tidak bisa dibuka."; URL.revokeObjectURL(url); };
  gambar.src = url;
});

btnCoba.addEventListener("click", nyalakanKamera);

$("btn-ulang").addEventListener("click", () => { clearTimeout(pewaktu); nyalakanKamera(); });
window.addEventListener("pagehide", matikanKamera);
document.addEventListener("visibilitychange", () => { if (document.hidden) matikanKamera(); });

nyalakanKamera();
