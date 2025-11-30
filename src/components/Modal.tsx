import React from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, title, onClose, actions, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title && <h3 style={{ margin: 0 }}>{title}</h3>}
          <button className="secondary-btn" onClick={onClose}>Close</button>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
        {actions && <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;
