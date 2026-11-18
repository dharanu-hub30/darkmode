(function () {
  "use strict";

  var KEY = "windwave-theme";          // stores "light", "dark" or "system"
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function $(id) { return document.getElementById(id); }

  /* ---------- Storage (always wrapped: it can be blocked) ---------- */
  var storageOK = true;
  function readSaved() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" || v === "system" ? v : null;
    } catch (e) { storageOK = false; return null; }
  }
  function writeSaved(v) {
    try { localStorage.setItem(KEY, v); storageOK = true; }
    catch (e) { storageOK = false; }
  }

  /* ---------- Event log ---------- */
  var logList = $("dkw-log");
  var logStarted = false;
  function log(text) {
    if (!logStarted) { logList.innerHTML = ""; logStarted = true; }
    var li = document.createElement("li");
    li.textContent = new Date().toLocaleTimeString("en-GB") + "  " + text;
    logList.appendChild(li);
    logList.scrollTop = logList.scrollHeight;
    while (logList.children.length > 30) logList.removeChild(logList.firstChild);
  }

  /* ---------- Theme logic ---------- */
  var choice = readSaved() || "system";

  function resolve(c) {
    if (c === "light" || c === "dark") return c;
    return mq.matches ? "dark" : "light";
  }

  var toggleBtn = $("dkw-toggle");
  var radios = document.querySelectorAll(".dkw-seg button");
  var metaTheme = $("dkw-meta-theme");

  function updateUI() {
    var applied = resolve(choice);
    toggleBtn.setAttribute("aria-pressed", applied === "dark" ? "true" : "false");
    toggleBtn.setAttribute("aria-label", applied === "dark" ? "Switch to light theme" : "Switch to dark theme");
    Array.prototype.forEach.call(radios, function (b) {
      b.setAttribute("aria-checked", b.dataset.choice === choice ? "true" : "false");
    });
    $("dkw-i-system").textContent = mq.matches ? "dark" : "light";
    $("dkw-i-saved").textContent = readSaved() || "none yet";
    $("dkw-i-applied").textContent = applied;
    $("dkw-i-storage").textContent = storageOK ? "localStorage OK" : "blocked (not saved)";
    if (metaTheme) metaTheme.setAttribute("content", applied === "dark" ? "#0c0c0f" : "#f4f1ea");
  }

  function applyTheme() {
    root.setAttribute("data-theme", resolve(choice));
    updateUI();
  }

  function setChoice(next, why) {
    choice = next;
    writeSaved(next);
    applyTheme();
    log(why + " -> saved \"" + next + "\", applied \"" + resolve(next) + "\"");
  }

  /* ---------- Events: toggle button and 3-way control ---------- */
  toggleBtn.addEventListener("click", function () {
    setChoice(resolve(choice) === "dark" ? "light" : "dark", "click on toggle");
  });

  Array.prototype.forEach.call(radios, function (b) {
    b.addEventListener("click", function () { setChoice(b.dataset.choice, "chose " + b.dataset.choice); });
  });

  $("dkw-cta").addEventListener("click", function () {
    setChoice(resolve(choice) === "dark" ? "light" : "dark", "hero button");
  });

  // Follow the device live when "System" is selected
  function onSystemChange() {
    log("matchMedia change -> system now prefers " + (mq.matches ? "dark" : "light"));
    if (choice === "system") applyTheme(); else updateUI();
  }
  if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange);

  // Keep several open tabs in sync
  window.addEventListener("storage", function (e) {
    if (e.key !== KEY) return;
    choice = readSaved() || "system";
    applyTheme();
    log("storage event from another tab -> " + choice);
  });

  /* ---------- Class vs inline style demo ---------- */
  var box = $("dkw-box");
  var note = $("dkw-note");
  var colours = ["#ff5a1f", "#1f4fff", "#16a34a", "#d946ef"];
  var ci = 0;

  $("dkw-b-class").addEventListener("click", function () {
    var on = box.classList.toggle("dkw-flip");
    note.textContent = "box.classList.toggle('dkw-flip') -> " + (on ? "added" : "removed");
    log("classList.toggle -> " + (on ? "on" : "off"));
  });

  $("dkw-b-inline").addEventListener("click", function () {
    var c = colours[ci++ % colours.length];
    box.style.background = c;
    box.style.color = "#ffffff";
    note.textContent = "box.style.background = '" + c + "'";
    log("inline style -> background " + c);
  });

  $("dkw-b-reset").addEventListener("click", function () {
    box.removeAttribute("style");
    box.classList.remove("dkw-flip");
    note.textContent = "Reset: style attribute and class removed.";
    log("demo box reset");
  });

  /* ---------- Start ---------- */
  applyTheme();
  log("page loaded -> choice \"" + choice + "\", applied \"" + resolve(choice) + "\"");
})();
