import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import LocationService from '../services/LocationService';
import CyberAttackService from '../services/CyberAttackService';
import { CyberAttackPoint } from '../types';
import Modal from '../components/Modal';

const MapScreen: React.FC = () => {
  const { setScreen } = useAppContext();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [attackData, setAttackData] = useState<CyberAttackPoint[]>([]);
  const [selected, setSelected] = useState<CyberAttackPoint | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    refreshLocation();
    CyberAttackService.fetch().then(setAttackData);
  }, []);

  const refreshLocation = async () => {
    const loc = await LocationService.fetchCurrent();
    setCoords({ lat: loc.lat, lng: loc.lng });
  };

  return (
    <div style={{ padding: 16 }}>
      <div className="card">
        <h2>Live Location & Cyber Attack Map</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="primary-btn" onClick={refreshLocation}>Refresh location</button>
          <button className="secondary-btn" onClick={() => setShareOpen(true)}>Share location</button>
          <button className="secondary-btn" onClick={() => setScreen('intelligence')}>Start Safe Path Mode</button>
        </div>
        <div style={{ marginTop: 12, background: '#dff7fa', padding: 12, borderRadius: 12 }}>
          <div>Map placeholder – integrate Mapbox/Leaflet</div>
          {coords && <div>Your location: {coords.lat}, {coords.lng}</div>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {attackData.map((point) => (
              <button key={point.id} className="secondary-btn" onClick={() => setSelected(point)}>
                {point.title} ({point.severity})
              </button>
            ))}
          </div>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        <p>{selected?.description}</p>
        <p>Severity: {selected?.severity}</p>
        <p>Coords: {selected?.lat}, {selected?.lng}</p>
      </Modal>

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share location preview">
        {coords ? (
          <p>Message to contacts: I am here ({coords.lat}, {coords.lng})</p>
        ) : (
          <p>Location not fetched yet.</p>
        )}
      </Modal>
    </div>
  );
};

export default MapScreen;
