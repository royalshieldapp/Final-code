import React from 'react';
import { useAppContext } from '../context/AppContext';

const Decoy: React.FC = () => {
  const { setScreen } = useAppContext();
  return (
    <div style={{ padding: 16 }}>
      <div className="card">
        <h2>Welcome to Daily Tips</h2>
        <p>This decoy home keeps things calm while silent alerts notify trusted contacts.</p>
        <button className="secondary-btn" onClick={() => setScreen('sos')}>Return to main app</button>
      </div>
    </div>
  );
};

export default Decoy;
