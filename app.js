import { seedDecisions } from "./seed.js";
import { filterDecisions, normalizeDecision, summary } from "./model.js";

const storageKey = "decision-ledger-decisions";
let decisions = JSON.parse(localStorage.getItem(storageKey) || "null") || seedDecisions;
const $ = selector => document.querySelector(selector);
const list = $("#decision-list"), dialog = $("#decision-dialog"), search = $("#search"), type = $("#type-filter"), status = $("#status-filter");

function save() { localStorage.setItem(storageKey, JSON.stringify(decisions)); }
function initials(name) { return name.split(" ").map(word => word[0]).join("").slice(0, 2); }
function escape(value = "") { return String(value).replace(/[&<>]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;" })[char]); }
function render() {
  const counts = summary(decisions), filtered = filterDecisions(decisions, { query: search.value, type: type.value, status: status.value });
  $("#active-count").textContent = counts.active; $("#reversible-count").textContent = counts.reversible; $("#confidence-count").textContent = `${counts.averageConfidence}%`; $("#result-count").textContent = `${filtered.length} of ${counts.total} decisions`;
  list.innerHTML = filtered.length ? filtered.map(item => `<article class="decision-card"><div class="date"><b>${new Intl.DateTimeFormat("en", { month:"short" }).format(new Date(`${item.date}T00:00:00`))}</b><span>${new Date(`${item.date}T00:00:00`).getDate()}</span></div><div class="decision-main"><div class="decision-title"><div><span class="pill ${item.status.toLowerCase()}">${item.status}</span>${item.reversible ? '<span class="pill reversible">Reversible</span>' : ""}</div><h3>${escape(item.title)}</h3></div><p>${escape(item.context)}</p><div class="meta"><span class="avatar">${initials(item.owner)}</span><span>${escape(item.owner)}</span><i></i><span>${escape(item.type)}</span>${item.evidence ? `<i></i><span>↗ ${escape(item.evidence)}</span>` : ""}</div></div><div class="confidence"><b>${item.confidence}%</b><span>confidence</span><div><i style="width:${item.confidence}%"></i></div></div></article>`).join("") : '<div class="empty">No decisions match these filters.</div>';
}
function open() { dialog.showModal(); }
function exportArchive() { const url = URL.createObjectURL(new Blob([JSON.stringify({ exportedAt:new Date().toISOString(), decisions }, null, 2)], { type:"application/json" })); const link = Object.assign(document.createElement("a"), { href:url, download:"decision-ledger.json" }); link.click(); URL.revokeObjectURL(url); }
$("#open-dialog").addEventListener("click", open); $("#hero-record").addEventListener("click", open); $("#close-dialog").addEventListener("click", () => dialog.close()); $("#export").addEventListener("click", exportArchive);
[search, type, status].forEach(control => control.addEventListener("input", render)); $("#confidence").addEventListener("input", event => $("#confidence-output").textContent = `${event.target.value}%`);
$("#decision-form").addEventListener("submit", event => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); decisions = [normalizeDecision({ ...values, reversible: Boolean(values.reversible), tags: [] }), ...decisions]; save(); event.currentTarget.reset(); $("#confidence-output").textContent = "70%"; dialog.close(); render(); });
render();
