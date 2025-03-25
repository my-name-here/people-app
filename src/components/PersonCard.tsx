import React, { useState, useEffect } from 'react';
import { Person } from '../types/Person';
import './PersonCard.css';

interface PersonCardProps {
  person: Person;
  onDelete: (id: string) => void;
  onEdit: (person: Person) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onDelete, onEdit }) => {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const time = new Date().toLocaleTimeString('en-US', {
          timeZone: person.timezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        setCurrentTime(time);
      } catch (error) {
        console.error('Error formatting time:', error);
        setCurrentTime('Invalid timezone');
      }
    };

    // Update time immediately and then every minute
    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [person.timezone]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    if (window.confirm('Are you sure you want to delete this person?')) {
      onDelete(person.id);
    }
  };

  const handleClick = () => {
    onEdit(person);
  };

  const handleNotesClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    setIsNotesExpanded(!isNotesExpanded);
  };

  const truncateNotes = (notes: string) => {
    if (notes.length <= 100) return notes;
    return notes.substring(0, 100) + '...';
  };

  return (
    <div className="person-card" onClick={handleClick}>
      <button className="delete-button" onClick={handleDelete} aria-label="Delete person">
        ×
      </button>
      <div className="person-image">
        {(person.imageUrl || (person as any).profilePictureUrl) ? (
          <img src={person.imageUrl || (person as any).profilePictureUrl} alt={person.name} />
        ) : (
          <div className="placeholder-image">
            {person.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="person-info">
        <h3>{person.name}</h3>
        {person.role && (
          <p className="role">
            <span className="field-label">Role:</span> {person.role}
          </p>
        )}
        {person.organization && (
          <p className="organization">
            <span className="field-label">Organization:</span> {person.organization}
          </p>
        )}
        {person.timezone && (
          <p className="timezone">
            <span className="field-label">Local Time:</span> {currentTime}
          </p>
        )}
        {person.notes && (
          <div className="notes-container">
            <p className="notes">
              <span className="field-label">Notes:</span>
              <span className="notes-content">
                {isNotesExpanded ? person.notes : truncateNotes(person.notes)}
              </span>
            </p>
            {person.notes.length > 100 && (
              <button 
                className="expand-notes-button" 
                onClick={handleNotesClick}
                aria-label={isNotesExpanded ? "Show less" : "Show more"}
              >
                {isNotesExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 