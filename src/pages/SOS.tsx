import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import CameraService from '../services/CameraService';
import LocationService from '../services/LocationService';
import Modal from '../components/Modal';

const SOS: React.FC = () => {
  const { setScreen, sosActive, setSosActive, addMedia, lastSentAt, setLastSentAt, contacts, user, media } = useAppContext();
  const [status, setStatus] = useState('Tap the red S.O.S button to start emergency capture.');
  const [warning, setWarning] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const countdownRef = useRef<NodeJS.Timer | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [sensorError, setSensorError] = useState('');
  const [locationMessage, setLocationMessage] = useState('');

  useEffect(() => {
    setStatus(sosActive ? 'Emergency in progress – sending your location and alerts...' : 'Tap the red S.O.S button to start emergency capture.');
  }, [sosActive]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const beginSend = async () => {
    if (contacts.length === 0) {
      setSensorError('Please add at least one emergency contact first.');
      return;
    }
    setWarning('⚠ Emergency send!');
    setSosActive(true);
    intervalRef.current = setInterval(async () => {
      try {
        const { lat, lng } = await LocationService.fetchCurrent();
        setLastSentAt(new Date().toLocaleTimeString());
        setLocationMessage(`Emergency message sent successfully. Lat: ${lat}, Lng: ${lng}`);
      } catch (error) {
        setLocationMessage('GPS Error – The message could not be sent. Location not available.');
      }
    }, 1000);
  };

  const triggerSOS = () => {
    setCountdown(5);
    setSensorError('');
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev && prev > 1) {
          return prev - 1;
        }
        clearInterval(countdownRef.current as NodeJS.Timer);
        setCountdown(null);
        beginSend();
        return null;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);
    setWarning('');
    setSosActive(false);
  };

  const captureMedia = async (type: 'photo' | 'video') => {
    const mediaItem = await CameraService.capture(type);
    addMedia(mediaItem);
  };

  const openContacts = () => setScreen('settings');

  return (
    <div style={{ padding: 16 }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="status-text">{sosActive ? 'S.O.S ACTIVE' : 'S.O.S'}</div>
          <div>{status}</div>
          {lastSentAt && <div>Last sent at {lastSentAt}</div>}
          {sensorError && <div style={{ color: 'crimson' }}>{sensorError}</div>}
          {locationMessage && <div>{locationMessage}</div>}
          {warning && <div style={{ color: '#e67e22', fontWeight: 700 }}>{warning}</div>}
        </div>
        {user && user.isPremium && <span className="badge">Premium</span>}
      </div>

      {countdown !== null && (
        <div className="banner">
          Sending alert in {countdown}... Press CANCEL to stop.
          <button className="secondary-btn" onClick={cancelCountdown}>CANCEL</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
        <button className="sos-button" onClick={triggerSOS}>S.O.S</button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="primary-btn" onClick={() => captureMedia('photo')}>Capture photo</button>
        <button className="primary-btn" onClick={() => captureMedia('video')}>Capture video</button>
        <button className="secondary-btn" onClick={() => setGalleryOpen(true)}>Open emergency gallery</button>
        <button className="secondary-btn" onClick={openContacts}>Manage emergency contacts</button>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="secondary-btn" onClick={() => setScreen('map')}>Location/Map</button>
        <button className="secondary-btn" onClick={() => setScreen('settings')}>Settings</button>
        <button className="secondary-btn" onClick={() => setScreen('sos')}>Home</button>
      </div>

      <Modal open={galleryOpen} onClose={() => setGalleryOpen(false)} title="Emergency gallery">
        {media.length === 0 && <p>No media captured yet.</p>}
        <div className="grid" style={{ maxHeight: 320, overflow: 'auto' }}>
          {media.map((item) => (
            <div key={item.id} className="card" style={{ margin: 0 }}>
              <div style={{ fontWeight: 700 }}>{item.type.toUpperCase()}</div>
              <div>{item.timestamp}</div>
              <img src={item.url} alt={item.type} style={{ width: '100%', borderRadius: 8 }} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SOS;
