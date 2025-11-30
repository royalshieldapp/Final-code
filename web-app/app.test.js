const test = require('node:test');
const assert = require('node:assert');
const {
  appendLog,
  blockUrlThreat,
  clearActionLog,
  completeSignup,
  createState,
  incrementEscort,
  registerEmergency,
  shareLocation,
  toggleFeature,
} = require('./app.js');

function freshState() {
  return createState();
}

test('toggleFeature actualiza el estado y la bitácora', () => {
  const state = freshState();
  const labels = { on: 'Alarma perimetral activada', off: 'Alarma perimetral desactivada' };
  const message = toggleFeature('alarmArmed', labels, null, state);

  assert.equal(state.alarmArmed, true);
  assert.equal(state.lastAction, labels.on);
  assert.equal(state.logs[0], labels.on);
  assert.equal(message, labels.on);
});

test('incrementEscort suma solicitudes y registra acción', () => {
  const state = freshState();
  incrementEscort(null, state);
  incrementEscort(null, state);

  assert.equal(state.escortRequests, 2);
  assert.equal(state.logs[0], 'Acompañamiento programado #2');
});

test('blockUrlThreat aumenta el contador y registra el bloqueo', () => {
  const state = freshState();
  blockUrlThreat(null, state);
  assert.equal(state.urlThreatsBlocked, 1);
  assert.equal(state.logs[0], 'URL maliciosa bloqueada #1');
});

test('shareLocation activa el compartido de ubicación y deja traza', () => {
  const state = freshState();
  shareLocation(null, state);
  assert.equal(state.locationShared, true);
  assert.equal(state.lastAction, 'Ubicación compartida con el círculo seguro');
});

test('registerEmergency marca el flag de emergencia y registra en logs', () => {
  const state = freshState();
  registerEmergency(null, state);
  assert.equal(state.emergencyTriggered, true);
  assert.equal(state.logs[0], 'Botón de pánico presionado: enviando alerta y video');
});

test('completeSignup devuelve el mensaje de estado y registra la acción', () => {
  const state = freshState();
  const statusText = completeSignup(
    { name: 'Ada Lovelace', email: 'ada@example.com', country: 'UK' },
    null,
    state
  );

  assert.match(statusText, /Ada Lovelace/);
  assert.equal(state.logs[0], 'Registro completado: Ada Lovelace');
});

test('clearActionLog reinicia los logs y deja constancia del reinicio', () => {
  const state = freshState();
  appendLog('Evento previo', null, state);
  clearActionLog(null, state);

  assert.equal(state.logs.length, 1);
  assert.equal(state.logs[0], 'Bitácora reiniciada');
  assert.equal(state.lastAction, 'Bitácora reiniciada');
});
