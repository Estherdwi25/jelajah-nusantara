const halaman = document.getElementById("halaman");
const konten = document.getElementById("konten");
const params = new URLSearchParams(location.search);
const slug = params.get("pulau");
const namaProvinsi = params.get("provinsi");

const pulau = window.DATA_PROVINSI && window.DATA_PROVINSI[slug];
const provinsi = pulau && pulau.provinsi.find((p) => p.nama === namaProvinsi);

function tampilkanGalat(judul, isi) {
  konten.innerHTML = `<div class="galat"><h2>${judul}</h2><p>${isi}</p></div>`;
  document.getElementById("btn-kembali").href = "jelajah.html";
}

if (!window.DATA_PROVINSI) {
  tampilkanGalat("Data provinsi tidak termuat",
    "File <b>provinsi-data.js</b> tidak ditemukan. Pastikan ada di folder yang sama dengan <b>provinsi.html</b>.");
} else if (!provinsi) {
  tampilkanGalat("Provinsi tidak dikenal", "Pilih provinsi lagi dari peta.");
} else {
  mulai();
}

/* "Daerah Istimewa Yogyakarta" -> "daerah-istimewa-yogyakarta" (nama folder foto) */
function jadikanSlug(teks) {
  return teks.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function mulai() {
  const slugProvinsi = jadikanSlug(provinsi.nama);

  document.title = `${provinsi.nama} - Jelajah Nusantara`;
  document.getElementById("nama-provinsi").textContent = provinsi.nama;
  document.getElementById("btn-kembali").href = `pulau.html?pulau=${slug}`;

  document.querySelectorAll(".kartu").forEach((kartu) => {
    const kategori = kartu.dataset.kategori;

    // RUANG FOTO: gambar/budaya/<provinsi>/<kategori>.png  (atau .webp / .jpg)
    // Kalau fotonya belum ada, ikon cadangan tetap tampil.
    const kotak = kartu.querySelector(".gambar");
    const img = kotak.querySelector("img");
    const calon = ["png", "webp", "jpg"].map((e) => `gambar/budaya/${slugProvinsi}/${kategori}.${e}`);
    kotak.querySelector(".cadangan small").textContent = calon[0];   // petunjuk nama file
    let n = 0;
    img.addEventListener("load", () => kotak.classList.add("ada-foto"));
    img.addEventListener("error", () => { if (++n < calon.length) img.src = calon[n]; });
    img.src = calon[0];

    // Klik: zoom buram ke halaman kategori
    const url = `kategori.html?pulau=${slug}&provinsi=${encodeURIComponent(provinsi.nama)}&kategori=${kategori}`;
    kartu.href = url;
    kartu.addEventListener("click", (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return; // biarkan buka tab baru
      e.preventDefault();
      pergi(url, kartu);
    });
  });
}

/* ---------- Pindah halaman dengan zoom buram ---------- */
let sedangPergi = false;

function pergi(url, dariElemen) {
  if (sedangPergi) return;
  sedangPergi = true;

  const r = dariElemen.getBoundingClientRect();
  halaman.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
  halaman.style.setProperty("--skala", "2.2");
  halaman.style.animation = "none";
  document.body.classList.add("berangkat");
  void halaman.offsetWidth;
  halaman.classList.add("jalan");

  setTimeout(() => { window.location.href = url; }, 900);
}
