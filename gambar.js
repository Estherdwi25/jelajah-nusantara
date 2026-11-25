/* =====================================================================
   RUANG GAMBAR
   1) Gambar tombol : elemen dengan data-tombol="nama" otomatis memakai
                      gambar/tombol/nama.png kalau filenya ada.
   2) Slot gambar   : elemen dengan data-slot="gambar/logo.png" menampilkan
                      gambar itu kalau ada, kalau belum ada tampil kotak berlabel.
   ===================================================================== */
(function () {
  const FOLDER_TOMBOL = "gambar/tombol/";

  /* ---------- Gambar tombol ---------- */
  function pasangGambarTombol(el) {
    const nama = el.dataset.tombol;
    if (!nama || el.dataset.gambarDicoba) return;
    el.dataset.gambarDicoba = "1";

    const img = new Image();
    img.className = "gambar-tombol";
    img.alt = "";
    img.addEventListener("load", () => {
      // tulisan dipindah ke <span> supaya bisa disembunyikan tapi tetap terbaca pembaca layar
      if (!el.querySelector(".teks-tombol")) {
        const span = document.createElement("span");
        span.className = "teks-tombol";
        while (el.firstChild) span.appendChild(el.firstChild);
        el.appendChild(span);
      }
      el.insertBefore(img, el.firstChild);
      el.classList.add("bergambar");
    });
    img.src = FOLDER_TOMBOL + nama + ".png";
  }
  window.pasangGambarTombol = pasangGambarTombol;
  document.querySelectorAll("[data-tombol]").forEach(pasangGambarTombol);

  /* ---------- Slot gambar ---------- */
  document.querySelectorAll("[data-slot]").forEach((el) => {
    el.classList.add("slot-gambar");

    const label = document.createElement("span");
    label.className = "label-slot";
    label.textContent = el.dataset.label || "Gambar";
    el.appendChild(label);

    const img = new Image();
    img.alt = el.dataset.alt || "";
    img.addEventListener("load", () => {
      el.appendChild(img);
      el.classList.add("terisi");
    });
    img.src = el.dataset.slot;
  });
})();
