const $ = (id) => document.getElementById(id);
const halaman = $("halaman");
const mv = $("mv");
const galat = $("galat");

const params = new URLSearchParams(location.search);
const slugProv = params.get("prov");        // contoh: aceh
const kat = params.get("kat");              // contoh: pakaian
const idxItem = Number(params.get("item") || 0);
const idxVarianAwal = Number(params.get("v") || 0);
const srcLangsung = params.get("src");      // dipakai kalau QR hanya berisi file / tautan GLB
const namaLangsung = params.get("nama");
const kembaliLama = params.get("kembali");

/* ---------- Keamanan: hanya .glb / .gltf lewat http(s) atau alamat relatif ---------- */
function srcAman(teks) {
  if (!teks) return false;
  try {
    const u = new URL(teks, location.href);
    return ["http:", "https:"].includes(u.protocol) && /\.(glb|gltf)$/i.test(u.pathname);
  } catch { return false; }
}

function jadikanSlug(teks) {
  return teks.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* ---------- Data item (kalau datang dari kode di data-budaya.js) ---------- */
let item = null;
let konteks = null; // { pulau, namaProvinsi }

if (slugProv && kat && window.ambilBudaya) {
  const daftar = window.ambilBudaya(slugProv, kat);
  item = daftar[Math.min(Math.max(0, idxItem), daftar.length - 1)] || null;

  // cari nama provinsi & pulau dari slug, supaya tombol "informasi" tahu tujuannya
  for (const [pulauSlug, p] of Object.entries(window.DATA_PROVINSI || {})) {
    const ketemu = p.provinsi.find((x) => jadikanSlug(x.nama) === slugProv);
    if (ketemu) { konteks = { pulau: pulauSlug, namaProvinsi: ketemu.nama }; break; }
  }
}

/* ---------- Tombol-tombol ---------- */
const urlInfoDasar = konteks
  ? `kategori.html?pulau=${konteks.pulau}&provinsi=${encodeURIComponent(konteks.namaProvinsi)}&kategori=${kat}&item=${idxItem}`
  : null;
const urlInfo = urlInfoDasar && `${urlInfoDasar}&v=${idxVarianAwal}`;   // &v = versi (Laki-Laki / Perempuan) yang sedang dibuka

if (urlInfo) {
  $("btn-kembali").href = urlInfo;      // Kembali -> halaman informasi (daftar gambar & penjelasan)
  $("btn-info").href = urlInfo;         // "Klik untuk melihat informasi" -> halaman yang sama
} else {
  $("btn-info").hidden = true;          // tanpa konteks, tidak ada halaman informasi
  if (kembaliLama && /^[\w\-./]+\.html(\?[^#]*)?$/.test(kembaliLama)) $("btn-kembali").href = kembaliLama;
}

/* ---------- Tampilkan item (dan versinya) ---------- */
const varianList = item && Array.isArray(item.varian) && item.varian.length > 1 ? item.varian : null;
let varianAktif = varianList ? Math.min(Math.max(0, idxVarianAwal), varianList.length - 1) : 0;

function tampilkanGalat(pesan) { galat.innerHTML = pesan; galat.hidden = false; }
function sembunyikanGalat() { galat.hidden = true; }

function terapkan() {
  const data = Object.assign({}, item || {}, varianList ? varianList[varianAktif] : {});
  const nama = data.nama || namaLangsung || "Model 3D";

  if (urlInfoDasar) {   // tombol Kembali / Info ikut versi yang sedang dipilih
    const u = `${urlInfoDasar}&v=${varianAktif}`;
    $("btn-kembali").href = u;
    $("btn-info").href = u;
  }

  $("judul").textContent = nama;
  $("subjudul").textContent = data.subjudul || "";
  $("deskripsi").textContent = data.deskripsi || "";
  $("deskripsi").scrollTop = 0;
  document.title = `${nama} - Jelajah Nusantara`;
  mv.setAttribute("alt", `Model 3D ${nama}`);

  if (varianList) {
    document.querySelectorAll("#varian button").forEach((b, i) =>
      b.setAttribute("aria-pressed", String(i === varianAktif)));
  }

  const sumber = data.model3d || (!item ? srcLangsung : null);
  $("muat-isi").style.width = "0";
  sembunyikanGalat();

  if (!sumber) {
    mv.removeAttribute("src");
    tampilkanGalat("Model 3D untuk versi ini belum tersedia.");
  } else if (!srcAman(sumber)) {
    mv.removeAttribute("src");
    tampilkanGalat("Model 3D tidak ditemukan.<br>Pindai QR Code di flashcard lagi.");
  } else {
    mv.setAttribute("src", sumber);
  }
}

/* Tombol pilihan versi (Laki-Laki / Perempuan, dst.) */
if (varianList) {
  const wadah = $("varian");
  varianList.forEach((v, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = v.label || `Versi ${i + 1}`;
    b.dataset.tombol = jadikanSlug(v.label || `versi-${i + 1}`);   // gambar/tombol/laki-laki.png, perempuan.png, ...
    b.addEventListener("click", () => { varianAktif = i; terapkan(); });
    wadah.appendChild(b);
    if (window.pasangGambarTombol) window.pasangGambarTombol(b);
  });
  wadah.hidden = false;
}

mv.addEventListener("progress", (e) => {
  $("muat-isi").style.width = Math.round((e.detail.totalProgress || 0) * 100) + "%";
});
mv.addEventListener("error", () => {
  tampilkanGalat("Model 3D gagal dimuat.<br>Periksa nama file dan pastikan formatnya .glb.");
});

if (!item && !srcLangsung) {
  tampilkanGalat("Model 3D tidak ditemukan.<br>Pindai QR Code di flashcard lagi.");
} else {
  terapkan();
  setTimeout(() => {
    if (!customElements.get("model-viewer")) {
      tampilkanGalat("Penampil 3D tidak termuat.<br>Pastikan file <b>model-viewer.min.js</b> ada di folder yang sama.");
    }
  }, 2500);
}

/* ---------- Pindah halaman dengan zoom buram ---------- */
let sedangPergi = false;
document.querySelectorAll("a[data-transisi]").forEach((a) => {
  a.addEventListener("click", (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (sedangPergi) return;
    sedangPergi = true;

    const r = a.getBoundingClientRect();
    halaman.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
    halaman.style.setProperty("--skala", "1.7");
    halaman.style.animation = "none";
    document.body.classList.add("berangkat");
    void halaman.offsetWidth;
    halaman.classList.add("jalan");
    setTimeout(() => { window.location.href = a.href; }, 800);
  });
});
