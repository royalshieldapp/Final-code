function createState() {
  return {
    alarmArmed: false,
    nightModeEnabled: false,
    camerasOnline: true,
    escortRequests: 0,
    emergencyTriggered: false,
    locationShared: false,
    urlThreatsBlocked: 0,
    dataBreachMonitoring: false,
    malwareScanRunning: false,
    soundDetectionEnabled: false,
    lowBatteryProtocolEnabled: false,
    fakePinEnabled: false,
    voiceAssistantListening: false,
    autoRecordingEnabled: false,
    safePathMonitoring: false,
    lastAction: "Sin eventos recientes",
    logs: [],
  };
}

const state = createState();
const selectors = typeof document !== "undefined" ? createSelectors() : null;

function createSelectors() {
  return {
    alarm: document.querySelector("[data-toggle='alarm']"),
    night: document.querySelector("[data-toggle='night']"),
    cameras: document.querySelector("[data-toggle='cameras']"),
    escort: document.querySelector("[data-action='escort']"),
    emergency: document.getElementById("btn-emergency"),
    location: document.getElementById("btn-location"),
    url: document.querySelector("[data-action='url']"),
    breach: document.querySelector("[data-toggle='breach']"),
    malware: document.querySelector("[data-toggle='malware']"),
    sound: document.querySelector("[data-toggle='sound']"),
    battery: document.querySelector("[data-toggle='battery']"),
    fakepin: document.querySelector("[data-toggle='fakepin']"),
    voice: document.querySelector("[data-toggle='voice']"),
    recording: document.querySelector("[data-toggle='recording']"),
    safepath: document.querySelector("[data-toggle='safepath']"),
    clearLog: document.getElementById("btn-clear-log"),
    log: document.getElementById("action-log"),
    statusAlarm: document.getElementById("status-alarm"),
    statusCameras: document.getElementById("status-cameras"),
    statusLast: document.getElementById("status-last"),
    escortCount: document.getElementById("escort-count"),
    locationState: document.getElementById("location-state"),
    metricUrl: document.getElementById("metric-url"),
    metricBreach: document.getElementById("metric-breach"),
    metricMalware: document.getElementById("metric-malware"),
    metricSound: document.getElementById("metric-sound"),
    metricBattery: document.getElementById("metric-battery"),
    metricFakePin: document.getElementById("metric-fakepin"),
    metricVoice: document.getElementById("metric-voice"),
    metricRecording: document.getElementById("metric-recording"),
    metricSafePath: document.getElementById("metric-safepath"),
    form: document.getElementById("signup-form"),
    formStatus: document.getElementById("form-status"),
  };
}

function appendLog(message, targetSelectors = selectors, targetState = state) {
  targetState.lastAction = message;
  targetState.logs.unshift(message);

  if (!targetSelectors || !targetSelectors.statusLast || !targetSelectors.log) {
    return message;
  }

  targetSelectors.statusLast.textContent = message;
  const item = document.createElement("li");
  item.className = "log__item";
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  item.textContent = `${timestamp} · ${message}`;
  targetSelectors.log.prepend(item);
  return message;
}

function toggleFeature(feature, labels, targetSelectors = selectors, targetState = state) {
  targetState[feature] = !targetState[feature];
  const message = targetState[feature] ? labels.on : labels.off;
  appendLog(message, targetSelectors, targetState);
  updateUI(targetSelectors, targetState);
  return message;
}

function incrementEscort(targetSelectors = selectors, targetState = state) {
  targetState.escortRequests += 1;
  const message = `Acompañamiento programado #${targetState.escortRequests}`;
  appendLog(message, targetSelectors, targetState);
  updateUI(targetSelectors, targetState);
  return message;
}

function registerEmergency(targetSelectors = selectors, targetState = state) {
  targetState.emergencyTriggered = true;
  return appendLog("Botón de pánico presionado: enviando alerta y video", targetSelectors, targetState);
}

function shareLocation(targetSelectors = selectors, targetState = state) {
  targetState.locationShared = true;
  const message = "Ubicación compartida con el círculo seguro";
  appendLog(message, targetSelectors, targetState);
  updateUI(targetSelectors, targetState);
  return message;
}

function blockUrlThreat(targetSelectors = selectors, targetState = state) {
  targetState.urlThreatsBlocked += 1;
  const message = `URL maliciosa bloqueada #${targetState.urlThreatsBlocked}`;
  appendLog(message, targetSelectors, targetState);
  updateUI(targetSelectors, targetState);
  return message;
}

function completeSignup(data, targetSelectors = selectors, targetState = state) {
  const { name, email, country } = data;
  const statusMessage = `Cuenta creada para ${name} (${country}) · alerta vinculada a ${email}`;
  appendLog(`Registro completado: ${name}`, targetSelectors, targetState);

  if (targetSelectors?.formStatus) {
    targetSelectors.formStatus.textContent = statusMessage;
  }

  return statusMessage;
}

function clearActionLog(targetSelectors = selectors, targetState = state) {
  targetState.logs = [];

  if (targetSelectors?.log) {
    targetSelectors.log.innerHTML = "";
  }

  appendLog("Bitácora reiniciada", targetSelectors, targetState);
  updateUI(targetSelectors, targetState);
}

function updateUI(targetSelectors = selectors, targetState = state) {
  if (!targetSelectors) return;

  targetSelectors.statusAlarm.textContent = targetState.alarmArmed ? "Alarma activa" : "Listo para activar";
  targetSelectors.alarm.textContent = targetState.alarmArmed ? "Desarmar" : "Activar alarma";

  targetSelectors.statusCameras.textContent = targetState.camerasOnline ? "Monitoreo en vivo" : "Cámaras fuera de línea";
  targetSelectors.cameras.textContent = targetState.camerasOnline ? "Pausar cámaras" : "Reactivar cámaras";

  targetSelectors.night.textContent = targetState.nightModeEnabled ? "Modo nocturno activo" : "Activar modo nocturno";
  targetSelectors.statusLast.textContent = targetState.lastAction;

  targetSelectors.escortCount.textContent = `${targetState.escortRequests} acompañamientos`;
  targetSelectors.locationState.textContent = targetState.locationShared ? "Ubicación compartida" : "Ubicación privada";

  targetSelectors.metricUrl.textContent = `${targetState.urlThreatsBlocked} bloqueos`;
  targetSelectors.metricBreach.textContent = targetState.dataBreachMonitoring ? "Monitor activo" : "Inactivo";
  targetSelectors.metricMalware.textContent = targetState.malwareScanRunning ? "Escaneo en curso" : "En espera";
  targetSelectors.metricSound.textContent = targetState.soundDetectionEnabled ? "Escucha armada" : "Desarmado";
  targetSelectors.metricBattery.textContent = targetState.lowBatteryProtocolEnabled ? "Autonomía protegida" : "Inactivo";
  targetSelectors.metricFakePin.textContent = targetState.fakePinEnabled ? "Alerta silenciosa lista" : "Desarmado";
  targetSelectors.metricVoice.textContent = targetState.voiceAssistantListening ? "Asistente escuchando" : "En espera";
  targetSelectors.metricRecording.textContent = targetState.autoRecordingEnabled ? "Grabación armada" : "Pausado";
  targetSelectors.metricSafePath.textContent = targetState.safePathMonitoring ? "Ruta vigilada" : "Sin monitoreo";
}

function bindListeners(targetSelectors = selectors, targetState = state) {
  if (!targetSelectors) return;

  targetSelectors.alarm.addEventListener("click", () =>
    toggleFeature("alarmArmed", { on: "Alarma perimetral activada", off: "Alarma perimetral desactivada" }, targetSelectors, targetState)
  );

  targetSelectors.night.addEventListener("click", () =>
    toggleFeature("nightModeEnabled", { on: "Modo nocturno habilitado", off: "Modo nocturno deshabilitado" }, targetSelectors, targetState)
  );

  targetSelectors.cameras.addEventListener("click", () =>
    toggleFeature("camerasOnline", { on: "Cámaras en línea", off: "Cámaras fuera de servicio" }, targetSelectors, targetState)
  );

  targetSelectors.escort.addEventListener("click", () => {
    incrementEscort(targetSelectors, targetState);
  });

  targetSelectors.emergency.addEventListener("click", () => {
    registerEmergency(targetSelectors, targetState);
  });

  targetSelectors.location.addEventListener("click", () => {
    shareLocation(targetSelectors, targetState);
  });

  targetSelectors.url.addEventListener("click", () => {
    blockUrlThreat(targetSelectors, targetState);
  });

  targetSelectors.breach.addEventListener("click", () =>
    toggleFeature(
      "dataBreachMonitoring",
      { on: "Monitor de fugas activo", off: "Monitor de fugas pausado" },
      targetSelectors,
      targetState
    )
  );

  targetSelectors.malware.addEventListener("click", () =>
    toggleFeature(
      "malwareScanRunning",
      { on: "Escaneo de apps iniciado", off: "Escaneo completado" },
      targetSelectors,
      targetState
    )
  );

  targetSelectors.sound.addEventListener("click", () =>
    toggleFeature(
      "soundDetectionEnabled",
      { on: "Detección acústica armada", off: "Detección acústica detenida" },
      targetSelectors,
      targetState
    )
  );

  targetSelectors.battery.addEventListener("click", () =>
    toggleFeature(
      "lowBatteryProtocolEnabled",
      { on: "Protocolo de batería baja activado", off: "Modo batería baja desactivado" },
      targetSelectors,
      targetState
    )
  );

  targetSelectors.fakepin.addEventListener("click", () =>
    toggleFeature("fakePinEnabled", { on: "PIN falso armado", off: "PIN falso desarmado" }, targetSelectors, targetState)
  );

  targetSelectors.voice.addEventListener("click", () =>
    toggleFeature("voiceAssistantListening", { on: "Asistente de voz escuchando", off: "Asistente de voz en espera" }, targetSelectors, targetState)
  );

  targetSelectors.recording.addEventListener("click", () =>
    toggleFeature("autoRecordingEnabled", { on: "Grabación automática armada", off: "Grabación automática detenida" }, targetSelectors, targetState)
  );

  targetSelectors.safepath.addEventListener("click", () =>
    toggleFeature("safePathMonitoring", { on: "Ruta segura vigilada", off: "Ruta segura finalizada" }, targetSelectors, targetState)
  );

  targetSelectors.clearLog.addEventListener("click", () => {
    clearActionLog(targetSelectors, targetState);
  });

  targetSelectors.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const country = formData.get("country")?.toString() ?? "";

    const statusText = completeSignup({ name, email, country }, targetSelectors, targetState);
    if (targetSelectors.formStatus) {
      targetSelectors.formStatus.textContent = statusText;
    }

    event.currentTarget.reset();
  });
}

function init() {
  if (!selectors) return;
  bindListeners();
  updateUI();
  appendLog("Panel web inicializado");
}

init();

if (typeof module !== "undefined") {
  module.exports = {
    appendLog,
    blockUrlThreat,
    clearActionLog,
    completeSignup,
    createState,
    incrementEscort,
    registerEmergency,
    shareLocation,
    toggleFeature,
    updateUI,
  };
}
