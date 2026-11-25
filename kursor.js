/* Kursor sarung tangan yang ukurannya bisa diatur (10-100%).
   100% = lebar 100px, 10% = lebar 10px. Nilai tersimpan di localStorage ("jn-kursor"). */
(function () {
  const BAWAAN = 40;

  function gaya(persen) {
    const w = persen;
    const h = Math.round(persen * 1.2);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 40 48">` +
      `<g fill="#fff" stroke="#123B2B" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">` +
      `<path d="M9 25V9a5 5 0 0 1 10 0v10a4 4 0 0 1 7-1 4 4 0 0 1 6 1 4 4 0 0 1 4 3v13q0 5-5 7H13q-5-4-6-9l-4-6a3.5 3.5 0 0 1 6-4z"/>` +
      `<path d="M19 19v8M26 18v9M32 20v7" fill="none"/>` +
      `<rect x="11" y="41" width="21" height="6" rx="2" fill="#123B2B"/>` +
      `</g></svg>`;
    const uri = "data:image/svg+xml," + encodeURIComponent(svg);
    const hx = Math.round(14 * w / 40);   // titik klik = ujung telunjuk
    const hy = Math.round(3 * w / 40);
    return `*, *::before, *::after { cursor: url("${uri}") ${hx} ${hy}, pointer !important; }`;
  }

  function terapkan(persen) {
    let el = document.getElementById("gaya-kursor");
    if (!el) {
      el = document.createElement("style");
      el.id = "gaya-kursor";
      document.head.appendChild(el);
    }
    el.textContent = gaya(persen);
  }

  window.aturKursor = function (persen) {
    persen = Math.min(100, Math.max(10, Math.round(persen)));
    terapkan(persen);
    try { localStorage.setItem("jn-kursor", persen); } catch { /* abaikan */ }
    return persen;
  };

  let awal = BAWAAN;
  try {
    const t = localStorage.getItem("jn-kursor");
    if (t !== null) awal = Number(t);
  } catch { /* abaikan */ }
  terapkan(Math.min(100, Math.max(10, awal)));
})();
