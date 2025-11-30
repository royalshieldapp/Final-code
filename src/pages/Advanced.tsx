import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BreachService from '../services/BreachService';
import UrlCheckService from '../services/UrlCheckService';
import NetworkScanService from '../services/NetworkScanService';
import { DeviceInfo } from '../types';

const Advanced: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [breachInput, setBreachInput] = useState('');
  const [breachResult, setBreachResult] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlResult, setUrlResult] = useState('');
  const [cameraStatus, setCameraStatus] = useState<Record<string, string>>({});
  const [snapshot, setSnapshot] = useState('');
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  const requirePremium = (action: () => void) => {
    if (!user?.isPremium) {
      setSubscribeOpen(true);
      return;
    }
    action();
  };

  const upgrade = () => {
    if (user) {
      setUser({ ...user, isPremium: true });
    }
    setSubscribeOpen(false);
  };

  const handleBreach = () =>
    requirePremium(async () => {
      const res = await BreachService.check(breachInput);
      setBreachResult(res.message);
    });

  const handleUrl = () =>
    requirePremium(async () => {
      const res = await UrlCheckService.scan(urlInput);
      setUrlResult(`${res.level} - ${res.tips}`);
    });

  const testCamera = (id: string) =>
    requirePremium(() => {
      setCameraStatus((prev) => ({ ...prev, [id]: Math.random() > 0.5 ? 'online' : 'offline' }));
    });

  const viewSnapshot = (id: string) =>
    requirePremium(() => {
      setSnapshot(`https://placehold.co/400x220/gold/000?text=Camera+${id}`);
    });

  const scanNetwork = () =>
    requirePremium(async () => {
      const res = await NetworkScanService.scan();
      setDevices(res);
    });

  const cameras = [
    { id: 'A', name: 'Front Door' },
    { id: 'B', name: 'Garage' },
  ];

  return (
    <div className="gold-theme" style={{ minHeight: '100vh', padding: 16 }}>
      <div className="gold-card">
        <h2>Advanced Features (Gold)</h2>
        <div>Subscription: {user?.isPremium ? 'Premium/Gold' : 'Free'}</div>
        <button className="primary-btn" onClick={() => setSubscribeOpen(true)}>
          Upgrade to Premium/Gold
        </button>
      </div>

      <div className="gold-card">
        <h3>Data Breach Check</h3>
        <input className="input" value={breachInput} onChange={(e) => setBreachInput(e.target.value)} placeholder="Email or username" />
        <button className="primary-btn" onClick={handleBreach}>Check</button>
        {breachResult && <div style={{ marginTop: 8 }}>{breachResult}</div>}
      </div>

      <div className="gold-card">
        <h3>URL Check</h3>
        <input className="input" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://" />
        <button className="primary-btn" onClick={handleUrl}>Scan</button>
        {urlResult && <div style={{ marginTop: 8 }}>{urlResult}</div>}
      </div>

      <div className="gold-card">
        <h3>Cameras Integration</h3>
        {cameras.map((cam) => (
          <div key={cam.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ flex: 1 }}>{cam.name}</div>
            <button className="secondary-btn" onClick={() => testCamera(cam.id)}>Test connection</button>
            <button className="secondary-btn" onClick={() => viewSnapshot(cam.id)}>View snapshot</button>
            <span>{cameraStatus[cam.id]}</span>
          </div>
        ))}
        {snapshot && <img src={snapshot} alt="snapshot" style={{ width: '100%', borderRadius: 8 }} />}
      </div>

      <div className="gold-card">
        <h3>Network Scan</h3>
        <button className="primary-btn" onClick={scanNetwork}>Scan network</button>
        {devices.length > 0 && (
          <table className="table" style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>IP</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.ip}>
                  <td>{d.name}</td>
                  <td>{d.ip}</td>
                  <td>{d.type}</td>
                  <td>{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} title="Subscription">
        <p>Unlock Gold features with Premium.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="primary-btn" onClick={upgrade}>Confirm upgrade</button>
          <button className="secondary-btn" onClick={() => setSubscribeOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default Advanced;
