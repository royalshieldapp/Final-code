import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Contact } from '../types';
import Modal from '../components/Modal';

const Settings: React.FC = () => {
  const { settings, setSettings, contacts, setContacts } = useAppContext();
  const [contactModal, setContactModal] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [name, setName] = useState('');
  const [contactValue, setContactValue] = useState('');

  const toggleSetting = (key: 'notifications' | 'sound') => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const updateSensitivity = (value: 'low' | 'medium' | 'high') => setSettings({ ...settings, sensitivity: value });
  const updateDefaultAction = (value: 'sms' | 'email' | 'push' | 'call') => setSettings({ ...settings, defaultAction: value });

  const openAdd = () => {
    setEditing(null);
    setName('');
    setContactValue('');
    setContactModal(true);
  };

  const saveContact = () => {
    if (!name || !contactValue) return;
    if (editing) {
      setContacts(contacts.map((c) => (c.id === editing.id ? { ...c, name, contact: contactValue } : c)));
    } else {
      setContacts([...contacts, { id: crypto.randomUUID(), name, contact: contactValue }]);
    }
    setContactModal(false);
  };

  const editContact = (contact: Contact) => {
    setEditing(contact);
    setName(contact.name);
    setContactValue(contact.contact);
    setContactModal(true);
  };

  const deleteContact = (id: string) => setContacts(contacts.filter((c) => c.id !== id));

  return (
    <div style={{ padding: 16 }}>
      <div className="card">
        <h2>Settings</h2>
        <div className="banner">
          <div>Notifications: {settings.notifications ? 'ON' : 'OFF'}</div>
          <button className="secondary-btn" onClick={() => toggleSetting('notifications')}>
            Toggle
          </button>
        </div>
        <div className="banner" style={{ marginTop: 8 }}>
          <div>Sound/Vibration: {settings.sound ? 'ON' : 'OFF'}</div>
          <button className="secondary-btn" onClick={() => toggleSetting('sound')}>Toggle</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="label">Sensor sensitivity</label>
          <select className="input" value={settings.sensitivity} onChange={(e) => updateSensitivity(e.target.value as any)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label className="label">Default SOS action</label>
          <select className="input" value={settings.defaultAction} onChange={(e) => updateDefaultAction(e.target.value as any)}>
            <option value="sms">Send SMS</option>
            <option value="email">Send Email</option>
            <option value="push">Push notification</option>
            <option value="call">Phone call</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Emergency contacts</h3>
          <button className="primary-btn" onClick={openAdd}>Add contact</button>
        </div>
        {contacts.length === 0 && <p>No contacts yet</p>}
        {contacts.map((c) => (
          <div key={c.id} className="banner" style={{ marginTop: 8 }}>
            <div>
              <div>{c.name}</div>
              <div>{c.contact}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="secondary-btn" onClick={() => editContact(c)}>Edit</button>
              <button className="secondary-btn" onClick={() => deleteContact(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={contactModal} onClose={() => setContactModal(false)} title={editing ? 'Edit contact' : 'Add contact'}>
        <label className="label">Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="label">Phone/Email</label>
        <input className="input" value={contactValue} onChange={(e) => setContactValue(e.target.value)} />
        <button className="primary-btn" onClick={saveContact}>{editing ? 'Save' : 'Add'}</button>
      </Modal>
    </div>
  );
};

export default Settings;
