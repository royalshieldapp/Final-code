import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import SilentAlertService from '../services/SilentAlertService';

const Intelligence: React.FC = () => {
  const { sosActive, contacts, setScreen, user, setUser, setIsDecoy } = useAppContext();
  const [battery, setBattery] = useState(50);
  const [lowBatteryEnabled, setLowBatteryEnabled] = useState(false);
  const [lowBatteryLog, setLowBatteryLog] = useState('');
  const [audioLogs, setAudioLogs] = useState<string[]>([]);
  const [realPin, setRealPin] = useState(user?.realPin || '');
  const [fakePin, setFakePin] = useState(user?.fakePin || '');
  const [pinEntry, setPinEntry] = useState('');
  const [safeOrigin, setSafeOrigin] = useState('Home');
  const [safeDestination, setSafeDestination] = useState('Office');
  const [routeMessage, setRouteMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setLogs((prev) => (sosActive ? [...prev, `Audio recording started ${new Date().toLocaleTimeString()}`] : prev));
  }, [sosActive]);

  useEffect(() => {
    if (lowBatteryEnabled && battery < 15) {
      const now = new Date().toLocaleTimeString();
      setLowBatteryLog(`Low battery alert sent at ${now} to ${contacts.length} contacts`);
    }
  }, [battery, lowBatteryEnabled, contacts]);

  const savePins = () => {
    if (!user) return;
    setUser({ ...user, realPin, fakePin });
  };

  const evaluatePinLogin = async () => {
    if (!user) return;
    if (pinEntry === user.realPin) {
      setIsDecoy(false);
      setScreen('sos');
    } else if (pinEntry === user.fakePin) {
      await SilentAlertService.sendSilentAlert('Fake PIN triggered from Intelligence screen');
      setIsDecoy(true);
      setScreen('decoy');
    }
  };

  const setSafeRoute = () => {
    setRouteMessage(`Route set from ${safeOrigin} to ${safeDestination}`);
  };

  const startMonitoring = () => {
    const deviation = Math.random() * 100 > 60;
    if (deviation) {
      setRouteMessage('Safe path deviation detected – sending alert');
      SilentAlertService.sendSilentAlert('Safe path deviation');
    } else {
      setRouteMessage('Route monitoring active. Stay on path.');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div className="card">
        <h2>Emergency Intelligence / Safety Mode</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          <label className="label">Battery level: {battery}%</label>
          <input type="range" min={0} max={100} value={battery} onChange={(e) => setBattery(Number(e.target.value))} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={lowBatteryEnabled} onChange={(e) => setLowBatteryEnabled(e.target.checked)} />
            Enable low battery emergency mode
          </label>
          {lowBatteryLog && <div className="banner">{lowBatteryLog}</div>}
        </div>
      </div>

      <div className="card">
        <h3>Automatic audio recording when SOS is active</h3>
        {sosActive ? <div className="badge">Audio recording active</div> : <div>Waiting for SOS</div>}
        <button
          className="secondary-btn"
          onClick={() =>
            setAudioLogs((prev) => [...prev, `${sosActive ? 'Recording' : 'Idle'} log at ${new Date().toLocaleTimeString()}`])
          }
        >
          View logs
        </button>
        <div className="log-list">
          {audioLogs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Fake PIN – Silent alert</h3>
        <label className="label">Real PIN</label>
        <input className="input" value={realPin} onChange={(e) => setRealPin(e.target.value)} />
        <label className="label">Fake PIN</label>
        <input className="input" value={fakePin} onChange={(e) => setFakePin(e.target.value)} />
        <button className="primary-btn" onClick={savePins}>Save PINs</button>

        <label className="label">Enter PIN to test login flow</label>
        <input className="input" value={pinEntry} onChange={(e) => setPinEntry(e.target.value)} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="secondary-btn" onClick={evaluatePinLogin}>Submit PIN</button>
          <button className="secondary-btn" onClick={() => setScreen('auth')}>Back to Auth</button>
        </div>
      </div>

      <div className="card">
        <h3>Safe path mode</h3>
        <div className="safe-path">
          <input className="input" value={safeOrigin} onChange={(e) => setSafeOrigin(e.target.value)} placeholder="Origin" />
          <input className="input" value={safeDestination} onChange={(e) => setSafeDestination(e.target.value)} placeholder="Destination" />
          <button className="secondary-btn" onClick={setSafeRoute}>Set safe route</button>
          <button className="primary-btn" onClick={startMonitoring}>Start monitoring</button>
          {routeMessage && <div className="banner">{routeMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
