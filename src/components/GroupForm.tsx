import React, { useState } from 'react';
import { Group } from '../types/Group';
import './GroupForm.css';

type GroupFormData = {
  name: string;
  description: string;
};

interface GroupFormProps {
  onSubmit: (group: Omit<Group, 'id' | 'dateAdded' | 'personIds'>) => void;
  onClose: () => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Group, 'id' | 'dateAdded' | 'personIds'>);
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Create New Group</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Group Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <button type="submit" className="submit-button">Create Group</button>
        </form>
      </div>
    </div>
  );
}; 