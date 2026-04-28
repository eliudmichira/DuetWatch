// Runs in the MAIN world on yflix to block popups
(function() {
  const origOpen = window.open;
  window.open = function () {
    try { console.log("[Duet] blocked popup from yflix"); } catch {}
    return null;
  };
  // Mask the function to avoid detection by Cloudflare Turnstile bot protection
  window.open.toString = () => "function open() { [native code] }";
})();
