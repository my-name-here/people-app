import React from 'react';
import './NotesModal.css';

interface NotesModalProps {
  notes: string;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ notes, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content notes-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Full Notes</h3>
        <div className="notes-content">
          {notes}
        </div>
      </div>
    </div>
  );
}; 