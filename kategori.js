const NAMA = {
  "pakaian": "Pakaian Tradisional",
  "rumah": "Rumah Tradisional",
  "alat-musik": "Alat Musik Tradisional",
  "makanan": "Makanan Khas Daerah",
};

/* Ikon cadangan untuk gambar yang belum ada */
const IKON = {
  "pakaian": '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M16 8 8 14l4 8 4-2v20h16V20l4 2 4-8-8-6c-2 4-6 6-8 6s-6-2-8-6z"/></svg>',
  "rumah": '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 24 24 8l19 16M11 20v21h26V20M20 41V30h8v11"/></svg>',
  "alat-musik": '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="21" r="14"/><circle cx="24" cy="21" r="5"/><path d="M12 42l6-9M36 42l-6-9"/></svg>',
  "makanan": '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 24h36a18 18 0 0 1-36 0z"/><path d="M18 8c-3 3 3 5 0 9M26 8c-3 3 3 5 0 9M34 8c-3 3 3 5 0 9"/></svg>',
};

const $ = (id) => document.getElementById(id);
const halaman = $("halaman");

const params = new URLSearchParams(location.search);
const slug = params.get("pulau");
const namaProvinsi = params.get("provinsi");
const kat = params.get("kategori");
const itemAwal = Number(params.get("item") || 0);

const pulau = window.DATA_PROVINSI && window.DATA_PROVINSI[slug];
const provinsi = pulau && pulau.provinsi.find((p) => p.nama === namaProvinsi);

if (!provinsi || !NAMA[kat]) {
  window.location.replace("jelajah.html");
} else {
  mulai();
}

function jadikanSlug(teks) {
  return teks.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function mulai() {
  const slugP = jadikanSlug(provinsi.nama);
  const items = window.ambilBudaya(slugP, kat);
  const n = items.length;

  document.title = `${NAMA[kat]} ${provinsi.nama} - Jelajah Nusantara`;
  $("judul-halaman").textContent = `${NAMA[kat]} ${provinsi.nama}`;
  $("btn-kembali").href = `provinsi.html?pulau=${slug}&provinsi=${encodeURIComponent(provinsi.nama)}`;

  const kolom = $("kolom-gambar");
  const panel = $("panel-info");
  const rel = $("rel");
  const pegangan = $("pegangan");
  const qrKartu = $("qr-kartu");

  const gambarEls = [];
  const infoEls = [];


  /* ---------- Bangun baris: gambar kecil + penjelasan ---------- */
  items.forEach((it, i) => {
    const g = document.createElement("button");
    g.type = "button";
    g.className = "gbr";
    g.setAttribute("aria-label", it.nama);
    // RUANG GAMBAR: pakai it.gambar kalau diisi, kalau tidak otomatis mencari
    // gambar/budaya/<provinsi>/<kategori>-<nomor>.png  (nomor mulai dari 1, urut seperti di daftar)
    // Kalau gambarnya belum ada, ikon cadangan yang tampil.
    const img = document.createElement("img");
    img.alt = "";
    const sumber = it.gambar || `gambar/budaya/${slugP}/${kat}-${i + 1}.png`;
    img.addEventListener("error", () => {
      // foto belum ada -> tampilkan ruang foto + nama file yang harus diisi
      g.classList.add("kosong");
      g.innerHTML = IKON[kat] + `<small>${sumber.split("/").pop()}</small>`;
    });
    img.src = sumber;
    g.appendChild(img);
    g.addEventListener("click", () => pilih(i));
    kolom.appendChild(g);
    gambarEls.push(g);

    const inf = document.createElement("div");
    inf.className = "info";
    const h = document.createElement("h2");
    h.textContent = it.nama;
    const p = document.createElement("p");
    p.textContent = it.deskripsi;
    inf.append(h);
    if (it.subjudul) {
      const s = document.createElement("div");
      s.className = "sub";
      s.textContent = it.subjudul;
      inf.append(s);
    }
    inf.append(p);

    inf.addEventListener("click", () => pilih(i));
    panel.appendChild(inf);
    infoEls.push(inf);
  });

  /* ---------- Baris aktif ---------- */
  let aktif = -1;
  let terkunci = false; // true saat sedang menggulir otomatis ke baris yang dipilih

  function setAktif(i) {
    if (i === aktif) return;
    aktif = i;
    gambarEls.forEach((el, k) => el.classList.toggle("aktif", k === i));
    infoEls.forEach((el, k) => el.classList.toggle("aktif", k === i));
    perbaruiQR();
  }

  const maks = () => kolom.scrollHeight - kolom.clientHeight;

  /* Baris aktif mengikuti posisi gulir: paling atas -> item pertama, paling bawah -> item terakhir.
     Dengan begini baris aktif selalu terlihat di layar. */
  function dariGulir() {
    if (terkunci) return;
    const m = maks();
    if (m > 1 && n > 1) setAktif(Math.round((kolom.scrollTop / m) * (n - 1)));
  }

  function pilih(i, langsung = false) {
    setAktif(i);
    const m = maks();
    if (m > 1 && n > 1) {
      terkunci = true;
      kolom.scrollTo({ top: (i / (n - 1)) * m, behavior: langsung ? "auto" : "smooth" });
      setTimeout(() => { terkunci = false; }, langsung ? 50 : 700);
    }
  }

  kolom.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); pilih(Math.min(n - 1, aktif + 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); pilih(Math.max(0, aktif - 1)); }
  });

  /* ---------- Gambar & penjelasan bergulir bersama ---------- */
  function samakan(dari, ke) {
    dari.addEventListener("scroll", () => {
      if (Math.abs(ke.scrollTop - dari.scrollTop) > 0.5) ke.scrollTop = dari.scrollTop;
      dariGulir();
      perbaruiRel();
    });
  }
  samakan(kolom, panel);
  samakan(panel, kolom);

  /* ---------- Batang gulir buatan ---------- */
  function perbaruiRel() {
    const m = maks();
    rel.classList.toggle("diam", m <= 1);
    if (m <= 1) return;
    const tinggiRel = rel.clientHeight;
    const tinggiPeg = Math.max(32, tinggiRel * (kolom.clientHeight / kolom.scrollHeight));
    pegangan.style.height = tinggiPeg + "px";
    pegangan.style.top = (tinggiRel - tinggiPeg - 4) * (kolom.scrollTop / m) + "px";
  }

  let seret = null;
  pegangan.addEventListener("pointerdown", (e) => {
    seret = { y: e.clientY, awal: kolom.scrollTop };
    pegangan.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  pegangan.addEventListener("pointermove", (e) => {
    if (!seret) return;
    const ruang = rel.clientHeight - pegangan.offsetHeight - 4;
    if (ruang > 0) kolom.scrollTop = seret.awal + ((e.clientY - seret.y) / ruang) * maks();
  });
  pegangan.addEventListener("pointerup", () => { seret = null; });
  rel.addEventListener("pointerdown", (e) => {
    if (e.target !== rel) return;
    const r = rel.getBoundingClientRect();
    kolom.scrollTop = ((e.clientY - r.top) / r.height) * maks();
  });
  window.addEventListener("resize", () => { perbaruiRel(); dariGulir(); });

  /* ---------- Tautan ke halaman pemindai (membawa konteks supaya tombol Kembali tepat) ---------- */
  function perbaruiQR() {
    qrKartu.href =
      `qr.html?pulau=${slug}&provinsi=${encodeURIComponent(provinsi.nama)}&kategori=${kat}&item=${items[aktif].itemQR ?? aktif}`;
  }

  /* ---------- Klik QR: zoom buram ke halaman QR ---------- */
  let sedangPergi = false;
  qrKartu.addEventListener("click", (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (sedangPergi) return;
    sedangPergi = true;

    const r = qrKartu.getBoundingClientRect();
    halaman.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
    halaman.style.setProperty("--skala", "2.4");
    halaman.style.animation = "none";
    document.body.classList.add("berangkat");
    void halaman.offsetWidth;
    halaman.classList.add("jalan");
    setTimeout(() => { window.location.href = qrKartu.href; }, 900);
  });

  /* ---------- Mulai ---------- */
  setAktif(0);
  pilih(Math.min(Math.max(0, itemAwal), n - 1), true);
  requestAnimationFrame(perbaruiRel);
}
