import React, { useState, useEffect } from 'react';
import { Person } from '../types/Person';
import './PersonForm.css';

interface PersonFormProps {
  person?: Person;
  onSubmit: (person: Omit<Person, 'id' | 'dateAdded' | 'groupIds'>) => void;
  onCancel: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ person, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Person, 'id' | 'dateAdded' | 'groupIds'>>({
    name: '',
    role: '',
    organization: '',
    notes: '',
    timezone: 'America/New_York',
    imageUrl: '',
    userId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        role: person.role,
        organization: person.organization,
        notes: person.notes || '',
        timezone: person.timezone,
        imageUrl: person.imageUrl || '',
        userId: person.userId,
        createdAt: person.createdAt,
        updatedAt: new Date().toISOString()
      });
    }
  }, [person]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="person-form">
      <button type="button" className="close-button" onClick={onCancel} aria-label="Close form">
        ×
      </button>
      <h2>{person ? 'Edit Person' : 'Add Person'}</h2>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value, updatedAt: new Date().toISOString() })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="role">Role</label>
        <input
          type="text"
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value, updatedAt: new Date().toISOString() })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="organization">Organization</label>
        <input
          type="text"
          id="organization"
          value={formData.organization}
          onChange={(e) => setFormData({ ...formData, organization: e.target.value, updatedAt: new Date().toISOString() })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value, updatedAt: new Date().toISOString() })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="timezone">Timezone</label>
        <select
          id="timezone"
          value={formData.timezone}
          onChange={(e) => setFormData({ ...formData, timezone: e.target.value, updatedAt: new Date().toISOString() })}
          required
        >
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="America/Anchorage">Alaska Time (AKT)</option>
          <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
          <option value="Europe/London">London (GMT/BST)</option>
          <option value="Europe/Paris">Paris (CET/CEST)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
          <option value="Asia/Shanghai">Shanghai (CST)</option>
          <option value="Australia/Sydney">Sydney (AEST)</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="imageUrl">Profile Image URL</label>
        <input
          type="url"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value, updatedAt: new Date().toISOString() })}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-button">
          {person ? 'Save Changes' : 'Add Person'}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}; 