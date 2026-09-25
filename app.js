"use strict";

// Values recovered from the original FireBot 1.02 Android APK.
const DATA = {
  smoothNozzles: [
    [0.5, "1/2 in."], [0.625, "5/8 in."], [0.75, "3/4 in."], [0.875, "7/8 in."],
    [0.9375, "15/16 in."], [1.0, "1 in."], [1.125, "1 1/8 in."], [1.1875, "1 3/16 in."],
    [1.25, "1 1/4 in."], [1.375, "1 3/8 in."],
    [1.5, "1 1/2 in."], [1.75, "1 3/4 in."], [2.0, "2 in."], [2.25, "2 1/4 in."],
    [2.5, "2 1/2 in."], [2.75, "2 3/4 in."], [3.0, "3 in."]
  ],
  fogGpm: [50, 60, 70, 80, 95, 100, 125, 150, 180, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  nozzlePressure: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
  standardHose: [
    [1100, "3/4 in."],
    [150, "1 in."],
    [24, "1 1/2 in."],
    [15.5, "1 3/4 in."],
    [8, "2 in."],
    [2, "2 1/2 in."],
    [0.8, "3 in. w/ 2 1/2 in. couplings"],
    [0.677, "3 in. w/ 3 in. couplings"],
    [0.34, "3 1/2 in."],
    [0.2, "4 in."],
    [0.374, "4 in. Standpipe"],
    [0.1, "4 1/2 in."],
    [0.08, "5 in."],
    [0.126, "5 in. Standpipe"],
    [0.05, "6 in."],
    [0.052, "6 in. Standpipe"]
  ],
  // Updated hose-friction coefficients supplied by the user, based on charged/measured internal hose diameter.
  updatedHose: [
    { value: "1.5", label: "1 1/2 in. nominal", diameters: [[1.5, 29], [1.6, 21], [1.65, 18.3], [1.7, 15.75]] },
    { value: "1.75", label: "1 3/4 in. nominal", diameters: [[1.75, 13.2], [1.8, 11.5], [1.85, 10], [1.9, 8.75], [1.95, 7.7]] },
    { value: "2", label: "2 in. nominal (1 1/2 in. couplings)", diameters: [[2.0, 7], [2.15, 4.7], [2.2, 4.15]] },
    { value: "2.25", label: "2 1/4 in. nominal", diameters: [[2.25, 3.6], [2.3, 3.2]] },
    { value: "2.5", label: "2 1/2 in. nominal", diameters: [[2.5, 2.15], [2.6, 1.8], [2.7, 1.7], [2.75, 1.35], [2.8, 1.24], [2.85, 1.14], [2.9, 1.05]] }
  ],
  hoseLength: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600],
  elevation: [
    [-200, "-200 ft."], [-100, "-100 ft."], [0, "0 ft."], [100, "100 ft."], [200, "200 ft."],
    [300, "300 ft."], [400, "400 ft."], [500, "500 ft."],
    [2, "2 stories"], [3, "3 stories"], [4, "4 stories"], [5, "5 stories"], [6, "6 stories"],
    [7, "7 stories"], [8, "8 stories"], [9, "9 stories"], [10, "10 stories"]
  ],
  appliances: [
    [0, "0"], ["master", "1 - Master Stream"], [1, "1"], [2, "2"], [3, "3"], [4, "4"],
    [5, "5"], [6, "6"], [7, "7"], [8, "8"], [9, "9"], [10, "10"]
  ]
};

const $ = (id) => document.getElementById(id);
const els = {
  fogGpm: $("fogGpm"), smoothNozzle: $("smoothNozzle"), nozzlePressure: $("nozzlePressure"),
  hoseSize: $("hoseSize"), updatedHoseSize: $("updatedHoseSize"), updatedInternalDiameter: $("updatedInternalDiameter"),
  coefficientNote: $("coefficientNote"), hoseLength: $("hoseLength"), elevation: $("elevation"), appliances: $("appliances"),
  calculateBtn: $("calculateBtn"), mathBtn: $("mathBtn"), mathDialog: $("mathDialog"), mathOutput: $("mathOutput"),
  installBtn: $("installBtn"), installDialog: $("installDialog"), installDialogBody: $("installDialogBody"), installHint: $("installHint"),
  pdpValue: $("pdpValue"), gpmValue: $("gpmValue"), npValue: $("npValue"), flValue: $("flValue"), epValue: $("epValue"), apfValue: $("apfValue"), cValue: $("cValue"),
  networkBadge: $("networkBadge")
};

function addOptions(select, values, formatter = (v) => String(v)) {
  select.replaceChildren();
  values.forEach((item) => {
    const value = Array.isArray(item) ? item[0] : item;
    const label = Array.isArray(item) ? item[1] : formatter(item);
    const opt = document.createElement("option");
    opt.value = String(value);
    opt.textContent = label;
    select.appendChild(opt);
  });
}

function initOptions() {
  addOptions(els.fogGpm, DATA.fogGpm, (v) => `${v.toLocaleString()} gpm`);
  addOptions(els.smoothNozzle, DATA.smoothNozzles);
  addOptions(els.nozzlePressure, DATA.nozzlePressure, (v) => `${v} psi`);
  addOptions(els.hoseSize, DATA.standardHose);
  addOptions(els.updatedHoseSize, DATA.updatedHose.map((item) => [item.value, item.label]));
  populateUpdatedDiameters();
  addOptions(els.hoseLength, DATA.hoseLength, (v) => `${v} ft.`);
  addOptions(els.elevation, DATA.elevation);
  addOptions(els.appliances, DATA.appliances);

  // Practical defaults while keeping every original lookup value available.
  els.fogGpm.value = "150";
  els.smoothNozzle.value = "1.5";
  els.nozzlePressure.value = "50";
  els.hoseSize.value = "15.5";
  els.updatedHoseSize.value = "1.75";
  populateUpdatedDiameters();
  els.updatedInternalDiameter.value = "1.75";
  els.hoseLength.value = "200";
  els.elevation.value = "0";
  els.appliances.value = "0";
}

function nozzleType() {
  return document.querySelector('input[name="nozzleType"]:checked').value;
}

function coefficientMode() {
  return document.querySelector('input[name="coefficientMode"]:checked').value;
}

function selectedUpdatedHose() {
  return DATA.updatedHose.find((item) => item.value === els.updatedHoseSize.value) || DATA.updatedHose[0];
}

function populateUpdatedDiameters(preferredValue = null) {
  const hose = selectedUpdatedHose();
  els.updatedInternalDiameter.replaceChildren();
  hose.diameters.forEach(([diameter, coefficient]) => {
    const opt = document.createElement("option");
    opt.value = String(diameter);
    opt.dataset.coefficient = String(coefficient);
    opt.textContent = `${diameter} in. I.D.`;
    els.updatedInternalDiameter.appendChild(opt);
  });
  if (preferredValue != null && Array.from(els.updatedInternalDiameter.options).some((o) => o.value === String(preferredValue))) {
    els.updatedInternalDiameter.value = String(preferredValue);
  }
}

function toggleCoefficientFields() {
  const updated = coefficientMode() === "updated";
  document.querySelectorAll(".standard-coefficient-only").forEach((el) => el.classList.toggle("hidden", updated));
  document.querySelectorAll(".updated-coefficient-only").forEach((el) => el.classList.toggle("hidden", !updated));
  els.coefficientNote.textContent = updated
    ? "Updated mode uses the updated hose-friction coefficients and the charged/measured internal hose diameter. Only hose sizes included in the updated coefficient set are available."
    : "Standard mode uses the original FireBot coefficient values.";
}

function toggleNozzleFields() {
  const fog = nozzleType() === "fog";
  document.querySelectorAll(".fog-only").forEach((el) => el.classList.toggle("hidden", !fog));
  document.querySelectorAll(".smooth-only").forEach((el) => el.classList.toggle("hidden", fog));
}

function calculate() {
  const type = nozzleType();
  let NP;
  let GPM;

  if (type === "fog") {
    // Original FireBot fixes fog nozzle pressure at 100 psi.
    NP = 100;
    GPM = Number(els.fogGpm.value);
  } else {
    NP = Number(els.nozzlePressure.value);
    const diameter = Number(els.smoothNozzle.value);
    GPM = 29.7 * Math.pow(diameter, 2) * Math.sqrt(NP);
  }

  let C;
  let coefficientMath;
  if (coefficientMode() === "updated") {
    const hose = selectedUpdatedHose();
    const selectedDiameter = els.updatedInternalDiameter.selectedOptions[0];
    C = Number(selectedDiameter.dataset.coefficient);
    coefficientMath = `Coefficient set = Updated hose-friction coefficients\nHose = ${hose.label}\nMeasured I.D. = ${selectedDiameter.value} in.\nC = ${fmtCoefficient(C)}`;
  } else {
    C = Number(els.hoseSize.value);
    const hoseLabel = els.hoseSize.selectedOptions[0]?.textContent || "Standard hose";
    coefficientMath = `Coefficient set = Standard / original FireBot\nHose = ${hoseLabel}\nC = ${fmtCoefficient(C)}`;
  }
  const hoseLengthFt = Number(els.hoseLength.value);
  const Q = GPM / 100;
  const L = hoseLengthFt / 100;
  const FL = C * Math.pow(Q, 2) * L;

  const elevationValue = Number(els.elevation.value);
  let EP;
  let elevationMath;
  if (elevationValue >= 1 && elevationValue <= 50) {
    EP = 5 * (elevationValue - 1);
    elevationMath = `EP = 5 × (${fmt(elevationValue)} - 1) = ${fmt(EP)} psi`;
  } else {
    EP = 0.5 * elevationValue;
    elevationMath = `EP = 0.5 × ${fmt(elevationValue)} = ${fmt(EP)} psi`;
  }

  let APF = 0;
  const appliance = els.appliances.value;
  if (GPM >= 350) {
    if (appliance === "master") APF = 25;
    else APF = Number(appliance) * 10;
  }

  const PDP = NP + FL + APF + EP;

  els.pdpValue.textContent = fmt(PDP);
  els.gpmValue.textContent = fmt(GPM);
  els.npValue.textContent = fmt(NP);
  els.flValue.textContent = fmt(FL);
  els.epValue.textContent = fmt(EP);
  els.apfValue.textContent = fmt(APF);
  els.cValue.textContent = fmtCoefficient(C);
  els.mathBtn.disabled = false;

  const nozzleMath = type === "fog"
    ? `NP = ${fmt(NP)} psi\nGPM = ${fmt(GPM)} gpm (selected fog flow)`
    : `NP = ${fmt(NP)} psi\nGPM = 29.7 × (${fmt(Number(els.smoothNozzle.value))})² × √${fmt(NP)}\nGPM = ${fmt(GPM)} gpm`;

  const applianceMath = GPM < 350
    ? `APF = 0.00 psi (GPM < 350)`
    : appliance === "master"
      ? `APF = 25.00 psi (master stream)`
      : `APF = ${Number(appliance)} × 10 = ${fmt(APF)} psi`;

  els.mathOutput.textContent = [
    nozzleMath,
    "",
    coefficientMath,
    "",
    `FL = C × Q² × L`,
    `FL = ${fmtCoefficient(C)} × (${fmt(Q)})² × ${fmt(L)}`,
    `FL = ${fmt(FL)} psi`,
    "",
    elevationMath,
    "",
    applianceMath,
    "",
    `PDP = NP + FL + APF + EP`,
    `PDP = ${fmt(NP)} + ${fmt(FL)} + ${fmt(APF)} + ${fmt(EP)}`,
    `PDP = ${fmt(PDP)} psi`
  ].join("\n");

  saveSettings();
}

function fmt(value) {
  const safe = Math.abs(value) < 0.005 ? 0 : value;
  return safe.toFixed(2);
}

function fmtCoefficient(value) {
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

const SETTINGS_KEY = "firebot-pwa-settings-v1";
function saveSettings() {
  const data = {
    nozzleType: nozzleType(),
    coefficientMode: coefficientMode(),
    fogGpm: els.fogGpm.value,
    smoothNozzle: els.smoothNozzle.value,
    nozzlePressure: els.nozzlePressure.value,
    hoseSize: els.hoseSize.value,
    updatedHoseSize: els.updatedHoseSize.value,
    updatedInternalDiameter: els.updatedInternalDiameter.value,
    hoseLength: els.hoseLength.value,
    elevation: els.elevation.value,
    appliances: els.appliances.value
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
}
function restoreSettings() {
  try {
    const data = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (!data) return;
    const radio = document.querySelector(`input[name="nozzleType"][value="${data.nozzleType}"]`);
    if (radio) radio.checked = true;
    const coefficientRadio = document.querySelector(`input[name="coefficientMode"][value="${data.coefficientMode || "standard"}"]`);
    if (coefficientRadio) coefficientRadio.checked = true;
    ["fogGpm", "smoothNozzle", "nozzlePressure", "hoseSize", "hoseLength", "elevation", "appliances"].forEach((key) => {
      if (data[key] != null && Array.from(els[key].options).some((o) => o.value === String(data[key]))) els[key].value = String(data[key]);
    });
    if (data.updatedHoseSize != null && Array.from(els.updatedHoseSize.options).some((o) => o.value === String(data.updatedHoseSize))) {
      els.updatedHoseSize.value = String(data.updatedHoseSize);
    }
    populateUpdatedDiameters(data.updatedInternalDiameter);
  } catch (_) { /* Ignore corrupt local settings. */ }
}

let deferredInstallPrompt = null;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

function showInstallHelp() {
  if (isIOS) {
    els.installDialogBody.innerHTML = `
      <p>On iPhone or iPad:</p>
      <ol>
        <li>Open FireBot in <strong>Safari</strong>.</li>
        <li>Tap the <strong>Share</strong> button.</li>
        <li>Tap <strong>Add to Home Screen</strong>.</li>
        <li>Confirm <strong>Add</strong>.</li>
      </ol>
      <p>After the first successful load, FireBot is cached for offline use.</p>`;
  } else {
    els.installDialogBody.innerHTML = `
      <p>Use your browser's <strong>Install app</strong> or <strong>Add to Home screen</strong> command. On Android Chrome, the install prompt normally appears automatically when the site qualifies as a PWA.</p>`;
  }
  els.installDialog.showModal();
}

els.installBtn.addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  } else {
    showInstallHelp();
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  els.installBtn.textContent = "Install";
});

function updateNetworkBadge() {
  els.networkBadge.textContent = navigator.onLine ? "Offline ready" : "Offline";
}

initOptions();
restoreSettings();
toggleNozzleFields();
toggleCoefficientFields();
updateNetworkBadge();

document.querySelectorAll('input[name="nozzleType"]').forEach((radio) => radio.addEventListener("change", () => {
  toggleNozzleFields();
  saveSettings();
}));
document.querySelectorAll('input[name="coefficientMode"]').forEach((radio) => radio.addEventListener("change", () => {
  toggleCoefficientFields();
  saveSettings();
}));
els.updatedHoseSize.addEventListener("change", () => {
  populateUpdatedDiameters();
  saveSettings();
});
[els.fogGpm, els.smoothNozzle, els.nozzlePressure, els.hoseSize, els.updatedInternalDiameter, els.hoseLength, els.elevation, els.appliances].forEach((select) => select.addEventListener("change", saveSettings));
els.calculateBtn.addEventListener("click", calculate);
els.mathBtn.addEventListener("click", () => els.mathDialog.showModal());
window.addEventListener("online", updateNetworkBadge);
window.addEventListener("offline", updateNetworkBadge);

if (isIOS && !isStandalone) {
  els.installHint.classList.remove("hidden");
  els.installHint.innerHTML = `<strong>Install on iPhone:</strong> open this page in Safari, tap Share, then Add to Home Screen.`;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
