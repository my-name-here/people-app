import React, { useState, useRef, useEffect } from 'react';
import { Person } from '../types/Person';
import { NotesModal } from './NotesModal';
import './PersonList.css';

interface PersonListProps {
  persons: Person[];
}

export const PersonList: React.FC<PersonListProps> = ({ persons }) => {
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [truncatedNotes, setTruncatedNotes] = useState<Set<string>>(new Set());
  const notesRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Check which notes are truncated
    const checkTruncation = () => {
      const newTruncatedNotes = new Set<string>();
      Object.entries(notesRefs.current).forEach(([id, element]) => {
        if (element && element.scrollHeight > element.clientHeight) {
          newTruncatedNotes.add(id);
        }
      });
      setTruncatedNotes(newTruncatedNotes);
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [persons]);

  return (
    <>
      <div className="persons-grid">
        {persons.map((person) => (
          <div key={person.id} className="person-card">
            <div className="person-image">
              {person.profilePictureUrl ? (
                <img src={person.profilePictureUrl} alt={person.name} />
              ) : (
                <div className="placeholder-image">
                  {person.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="person-info">
              <div className="person-name">{person.name}</div>
              {person.role && (
                <div className="info-row">
                  <span className="info-label">Role:</span>
                  <span className="info-value">{person.role}</span>
                </div>
              )}
              {person.organization && (
                <div className="info-row">
                  <span className="info-label">Organization:</span>
                  <span className="info-value">{person.organization}</span>
                </div>
              )}
              {person.notes && (
                <div className="info-row">
                  <span className="info-label">Notes:</span>
                  <div className="notes-container">
                    <div
                      ref={el => { notesRefs.current[person.id] = el; }}
                      className="info-value notes-value"
                    >
                      {person.notes}
                    </div>
                    {truncatedNotes.has(person.id) && (
                      <button
                        className="show-more-button"
                        onClick={() => setSelectedNotes(person.notes ?? null)} // Using nullish coalescing operator
                      >
                        Show More
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedNotes && (
        <NotesModal
          notes={selectedNotes}
          onClose={() => setSelectedNotes(null)}
        />
      )}
    </>
  );
};
