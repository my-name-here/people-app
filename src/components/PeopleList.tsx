import React, { useState } from 'react';
import { Person } from '../types/Person';
import { PersonCard } from './PersonCard';
import { PersonForm } from './PersonForm';
import './PeopleList.css';

interface PeopleListProps {
  people: Person[];
  onAddPerson: (person: Omit<Person, 'id'>) => void;
  onDeletePerson: (id: string) => void;
  onUpdatePerson: (id: string, person: Omit<Person, 'id'>) => void;
  isAddFormOpen: boolean;
  onAddFormClose: () => void;
}

export const PeopleList: React.FC<PeopleListProps> = ({ 
  people, 
  onAddPerson, 
  onDeletePerson,
  onUpdatePerson,
  isAddFormOpen,
  onAddFormClose
}) => {
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const handleSubmit = async (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    await onAddPerson(person);
    onAddFormClose();
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
  };

  const handleEditSubmit = async (updatedPerson: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPerson) {
      await onUpdatePerson(editingPerson.id, updatedPerson);
      setEditingPerson(null);
    }
  };

  return (
    <div className="people-list">
      <div className="people-grid">
        {people.map(person => (
          <PersonCard 
            key={person.id} 
            person={person}
            onDelete={onDeletePerson}
            onEdit={handleEdit}
          />
        ))}
      </div>
      {isAddFormOpen && (
        <PersonForm 
          onSubmit={handleSubmit} 
          onCancel={onAddFormClose}
        />
      )}
      {editingPerson && (
        <PersonForm
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingPerson(null)}
          initialData={editingPerson}
        />
      )}
    </div>
  );
}; 