import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Auth from './pages/Auth';
import SOS from './pages/SOS';
import MapScreen from './pages/Map';
import Advanced from './pages/Advanced';
import Settings from './pages/Settings';
import Intelligence from './pages/Intelligence';
import Decoy from './pages/Decoy';

const Shell: React.FC = () => {
  const { screen, setScreen, user, isDecoy } = useAppContext();

  const renderScreen = () => {
    switch (screen) {
      case 'auth':
        return <Auth />;
      case 'sos':
        return <SOS />;
      case 'map':
        return <MapScreen />;
      case 'advanced':
        return <Advanced />;
      case 'settings':
        return <Settings />;
      case 'intelligence':
        return <Intelligence />;
      case 'decoy':
        return <Decoy />;
      default:
        return <SOS />;
    }
  };

  return (
    <div className="app-shell">
      <header>
        <div style={{ fontWeight: 800 }}>Safety & Cyber Monitor</div>
        <div className="nav-buttons">
          <button className="secondary-btn" onClick={() => setScreen('auth')}>Auth</button>
          <button className="secondary-btn" onClick={() => setScreen('sos')}>SOS/Home</button>
          <button className="secondary-btn" onClick={() => setScreen('map')}>Map</button>
          <button className="secondary-btn" onClick={() => setScreen('advanced')}>Advanced</button>
          <button className="secondary-btn" onClick={() => setScreen('settings')}>Settings</button>
          <button className="secondary-btn" onClick={() => setScreen('intelligence')}>Safety Mode</button>
        </div>
        {user && <div>{user.fullName} {user.isPremium && <span className="badge">Premium</span>}</div>}
        {isDecoy && <span className="badge">Decoy</span>}
      </header>
      <main style={{ flex: 1 }}>{renderScreen()}</main>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <Shell />
  </AppProvider>
);

export default App;
