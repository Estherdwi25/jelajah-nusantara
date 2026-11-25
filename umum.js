/* Menerapkan kecerahan dari pengaturan ("jn-kecerahan") dengan lapisan peredup */
(function () {
  let persen = 100;
  try { persen = Number(localStorage.getItem("jn-kecerahan") ?? 100); } catch { /* abaikan */ }
  const el = document.createElement("div");
  el.style.cssText = "position:fixed;inset:0;background:#000;pointer-events:none;z-index:100;";
  el.style.opacity = ((100 - persen) / 100) * 0.85;
  document.body.appendChild(el);
})();
