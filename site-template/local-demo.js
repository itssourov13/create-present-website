(() => {
  "use strict";
  const isSensitiveAction = (label) => /continue with google|sign in with google|publish(?: gift| journey)?|publish & pay|pay now|checkout|razorpay|delete gift|delete journey/i.test(label);
  const ensureDialog = (message) => {
    let dialog = document.getElementById("local-demo-dialog");
    if (dialog) dialog.remove();
    dialog = document.createElement("div");
    dialog.id = "local-demo-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "local-demo-title");
    dialog.style.cssText = "position:fixed;z-index:2147483000;inset:0;display:grid;place-items:center;padding:20px;background:rgba(12,10,20,.66);font:15px/1.55 system-ui,-apple-system,sans-serif";
    const panel = document.createElement("div");
    panel.style.cssText = "width:min(100%,440px);background:#fff;color:#222;border-radius:18px;padding:26px;box-shadow:0 20px 70px #0005";
    const title = document.createElement("h2");
    title.id = "local-demo-title";
    title.textContent = "Local demo only";
    title.style.cssText = "font-size:23px;line-height:1.2;margin:0 0 12px";
    const text = document.createElement("p");
    text.textContent = message;
    text.style.cssText = "margin:0 0 20px;color:#555";
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Got it";
    close.style.cssText = "border:0;border-radius:10px;background:#6d4bc3;color:#fff;padding:11px 18px;font-weight:650;cursor:pointer";
    close.addEventListener("click", () => dialog.remove());
    panel.append(title, text, close);
    dialog.append(panel);
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.remove(); });
    document.body.append(dialog);
    close.focus();
  };
  document.addEventListener("click", (event) => {
    const control = event.target && event.target.closest ? event.target.closest("button,a,[role=button],input[type=submit]") : null;
    if (!control) return;
    const label = ((control.innerText || control.value || control.getAttribute("aria-label") || "") + " " + (control.getAttribute("title") || "")).trim();
    if (!isSensitiveAction(label)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    const msg = /google|sign in/i.test(label)
      ? "Google sign-in requires the original service configuration. It is intentionally disabled in this local reconstruction."
      : /delete/i.test(label)
        ? "Deleting real journeys is unavailable. No production records can be changed from this local demo."
        : "Publishing and payments are not connected. No charge or production publish request was made.";
    ensureDialog(msg);
  }, true);
  document.addEventListener("submit", (event) => {
    const form = event.target;
    const action = (form && form.getAttribute && form.getAttribute("action")) || "";
    if (action.startsWith("/api/")) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
      ensureDialog("This action needs the private backend, which is intentionally not connected in the local demo.");
    }
  }, true);
})();
