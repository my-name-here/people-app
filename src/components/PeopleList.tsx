import React, { useState } from 'react';
import { Person } from '../types/Person';
import { Group } from '../types/Group';
import { PersonCard } from './PersonCard';
import { PersonForm } from './PersonForm';
import './PeopleList.css';

interface PeopleListProps {
  people: Person[];
  groups: Group[];
  onDeletePerson: (id: string) => void;
  onEditPerson: (person: Person) => void;
  isAddFormOpen: boolean;
  onAddFormClose: () => void;
}

export const PeopleList: React.FC<PeopleListProps> = ({
  people,
  groups,
  onDeletePerson,
  onEditPerson,
  isAddFormOpen,
  onAddFormClose
}) => {
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
  };

  const handleSubmit = async () => { // Removed unused 'person' parameter
    await onAddFormClose();
  };

  const handleEditSubmit = async (updatedPerson: Omit<Person, 'id' | 'dateAdded' | 'groupIds'>) => {
    if (editingPerson) {
      const personWithId = {
        ...updatedPerson,
        id: editingPerson.id,
        dateAdded: editingPerson.dateAdded,
        groupIds: editingPerson.groupIds
      };
      await onEditPerson(personWithId);
      setEditingPerson(null);
    }
  };

  return (
    <div className="people-list">
      {people.map(person => (
        <PersonCard
          key={person.id}
          person={person}
          onDelete={onDeletePerson}
          onEdit={handleEdit}
          groups={groups}
        />
      ))}
      {isAddFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PersonForm
              onSubmit={handleSubmit}
              onCancel={onAddFormClose}
            />
          </div>
        </div>
      )}
      {editingPerson && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PersonForm
              person={editingPerson}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingPerson(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
