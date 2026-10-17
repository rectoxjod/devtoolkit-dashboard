const $ = (id) => document.getElementById(id);

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item === tab));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.toggle("active", panel.id === tab.dataset.panel));
  });
});

function feedback(id, message, error = false) {
  const element = $(id);
  element.textContent = message;
  element.classList.toggle("error", error);
}
async function copyText(text, feedbackId) {
  if (!text) return feedback(feedbackId, "Nothing to copy yet.", true);
  try {
    await navigator.clipboard.writeText(text);
    feedback(feedbackId, "Copied to clipboard.");
  } catch {
    feedback(feedbackId, "Clipboard access was blocked by your browser.", true);
  }
}

$("formatJson").addEventListener("click", () => {
  try {
    $("jsonOutput").value = JSON.stringify(JSON.parse($("jsonInput").value), null, 2);
    feedback("jsonFeedback", "Valid JSON · formatted successfully.");
  } catch (error) {
    feedback("jsonFeedback", `Invalid JSON: ${error.message}`, true);
  }
});
$("minifyJson").addEventListener("click", () => {
  try {
    $("jsonOutput").value = JSON.stringify(JSON.parse($("jsonInput").value));
    feedback("jsonFeedback", "Valid JSON · minified successfully.");
  } catch (error) {
    feedback("jsonFeedback", `Invalid JSON: ${error.message}`, true);
  }
});
$("copyJson").addEventListener("click", () => copyText($("jsonOutput").value, "jsonFeedback"));

$("apiMethod").addEventListener("change", () => {
  $("bodyWrap").classList.toggle("hidden", !["POST", "PUT", "PATCH"].includes($("apiMethod").value));
});
$("sendRequest").addEventListener("click", async () => {
  const url = $("apiUrl").value.trim();
  const method = $("apiMethod").value;
  if (!url) return feedback("apiFeedback", "Enter a request URL first.", true);
  let body;
  if (["POST", "PUT", "PATCH"].includes(method)) {
    try { body = JSON.stringify(JSON.parse($("apiBody").value)); }
    catch (error) { return feedback("apiFeedback", `Request body is not valid JSON: ${error.message}`, true); }
  }
  $("sendRequest").disabled = true;
  $("sendRequest").textContent = "Sending…";
  $("apiOutput").textContent = "Request in progress…";
  $("apiMeta").textContent = "Loading";
  feedback("apiFeedback", "");
  const start = performance.now();
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body
    });
    const elapsed = Math.round(performance.now() - start);
    const raw = await response.text();
    let formatted = raw;
    try { formatted = JSON.stringify(JSON.parse(raw), null, 2); } catch {}
    $("apiOutput").textContent = formatted || "(Empty response body)";
    $("apiMeta").textContent = `${response.status} ${response.statusText} · ${elapsed} ms`;
    feedback("apiFeedback", response.ok ? "Request completed." : "The server returned an HTTP error status.", !response.ok);
  } catch (error) {
    $("apiOutput").textContent = error.message;
    $("apiMeta").textContent = "Request failed";
    feedback("apiFeedback", "Request failed. Check the URL, your connection, and whether the server allows CORS.", true);
  } finally {
    $("sendRequest").disabled = false;
    $("sendRequest").textContent = "Send request ↗";
  }
});

$("encode").addEventListener("click", () => {
  try {
    const bytes = new TextEncoder().encode($("baseInput").value);
    let binary = "";
    bytes.forEach((byte) => binary += String.fromCharCode(byte));
    $("baseOutput").value = btoa(binary);
    feedback("baseFeedback", "Encoded successfully.");
  } catch (error) { feedback("baseFeedback", error.message, true); }
});
$("decode").addEventListener("click", () => {
  try {
    const binary = atob($("baseInput").value.trim());
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    $("baseOutput").value = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    feedback("baseFeedback", "Decoded successfully.");
  } catch { feedback("baseFeedback", "Invalid Base64 or unsupported text encoding.", true); }
});
$("copyBase").addEventListener("click", () => copyText($("baseOutput").value, "baseFeedback"));

$("generateUuid").addEventListener("click", () => {
  if (crypto.randomUUID) $("uuidOutput").textContent = crypto.randomUUID();
  else {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    $("uuidOutput").textContent = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }
  feedback("uuidFeedback", "New UUID generated.");
});
$("copyUuid").addEventListener("click", () => copyText($("uuidOutput").textContent, "uuidFeedback"));
