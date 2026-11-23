(() => {
  // main.ts
  var I18N = { "en": { "pattern": "Pattern", "global": "global", "ignore": "ignore case", "multiline": "multiline", "test": "\u25B6 Test", "explain": "\u2726 Explain", "presets": "Presets", "matches": "matches", "groups": "groups", "copied": "copied" }, "de": { "pattern": "Muster", "global": "global", "ignore": "Gro\xDF-/Kleinschreibung ignorieren", "multiline": "mehrzeilig", "test": "\u25B6 Testen", "explain": "\u2726 Erkl\xE4ren", "presets": "Presets", "matches": "Treffer", "groups": "Gruppen", "copied": "kopiert" } };
  var lang = localStorage.getItem("lang") || "en";
  var t = (k) => I18N[lang][k] || k;
  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i]").forEach((el) => el.textContent = t(el.dataset.i));
    document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  }
  document.querySelectorAll(".lang button").forEach((b) => b.onclick = () => {
    lang = b.dataset.lang;
    localStorage.setItem("lang", lang);
    applyLang();
  });
  var $ = (id) => document.getElementById(id);
  var PRESETS = ["dates", "\\d{4}-\\d{2}-\\d{2}"];
  var EXTRA = [["emails", "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"], ["urls", "https?:\\/\\/[^\\s]+"], ["hex colors", "#[0-9a-fA-F]{6}\\b"], ["dates", "\\d{4}-\\d{2}-\\d{2}"], ["ipv4", "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b"], ["time", "\\b\\d{2}:\\d{2}(:\\d{2})?\\b"]];
  var all = [PRESETS, ...EXTRA];
  var pw = $("presets");
  all.forEach(([n, p]) => {
    const b = document.createElement("button");
    b.textContent = n;
    b.onclick = () => {
      $("regex").value = p;
      test();
    };
    pw.appendChild(b);
  });
  function flags() {
    return ($("g").checked ? "g" : "") + ($("i").checked ? "i" : "") + ($("m").checked ? "m" : "");
  }
  function test() {
    const out = $("out");
    out.innerHTML = "";
    let re;
    try {
      re = new RegExp($("regex").value, flags());
    } catch (e) {
      out.textContent = "regex error: " + e.message;
      return;
    }
    const text = $("input").value;
    let m, count = 0;
    const frag = document.createDocumentFragment();
    if (!$("g").checked) {
      const r = new RegExp($("regex").value, flags().replace("g", ""));
      const mm = text.match(r);
      if (mm) {
        count = 1;
        frag.appendChild(document.createTextNode(text.slice(0, mm.index)));
        const mk = document.createElement("mark");
        mk.textContent = mm[0];
        frag.appendChild(mk);
        frag.appendChild(document.createTextNode(text.slice(mm.index + mm[0].length)));
      }
    } else {
      let last = 0;
      while ((m = re.exec(text)) !== null) {
        count++;
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const mk = document.createElement("mark");
        mk.textContent = m[0];
        frag.appendChild(mk);
        last = m.index + m[0].length;
        if (m[0] === "") re.lastIndex++;
        if (count > 500) break;
      }
      frag.appendChild(document.createTextNode(text.slice(last)));
    }
    out.appendChild(frag);
    const groups = count ? (text.match(re) || []).slice(1).filter((x) => x !== void 0).length : 0;
    $("stats").innerHTML = "<b>" + count + "</b> " + t("matches") + "<br>" + (count ? "<b>" + groups + "</b> " + t("groups") : "\u2014");
  }
  $("test").onclick = test;
  $("explain").onclick = () => {
    try {
      const re = new RegExp($("regex").value);
      $("out").textContent = "pattern: " + re.source + "\nflags: " + re.flags + "\ntesting " + $("input").value.length + " chars\u2026";
      test();
    } catch (e) {
      $("out").textContent = e.message;
    }
  };
  ["regex", "input"].forEach((id) => $(id).addEventListener("input", test));
  ["g", "i", "m"].forEach((id) => $(id).addEventListener("change", test));
  test();
  applyLang();
})();
