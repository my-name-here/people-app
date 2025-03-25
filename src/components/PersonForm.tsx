import React, { useState, useEffect } from 'react';
import { Person } from '../types/Person';
import { CLOUDINARY_UPLOAD_URL, UPLOAD_PRESET } from '../config/cloudinary';
import './PersonForm.css';

// List of common timezones
const TIMEZONES = [
  // North America
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'America/Toronto', label: 'Toronto (ET)' },
  { value: 'America/Vancouver', label: 'Vancouver (PT)' },
  { value: 'America/Mexico_City', label: 'Mexico City (CT)' },
  
  // Europe
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)' },
  
  // Asia
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)' },
  
  // Oceania
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST)' },
  { value: 'Australia/Brisbane', label: 'Brisbane (AEST)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST)' },
  
  // South America
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (ART)' },
  { value: 'America/Santiago', label: 'Santiago (CLT)' },
  { value: 'America/Lima', label: 'Lima (PET)' },
  
  // Africa
  { value: 'Africa/Cairo', label: 'Cairo (EET)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)' },
  { value: 'Africa/Lagos', label: 'Lagos (WAT)' },
  { value: 'Africa/Nairobi', label: 'Nairobi (EAT)' },
  
  // India
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Asia/Delhi', label: 'Delhi (IST)' },
  { value: 'Asia/Bangalore', label: 'Bangalore (IST)' },
  
  // Middle East
  { value: 'Asia/Tehran', label: 'Tehran (IRST)' },
  { value: 'Asia/Jerusalem', label: 'Jerusalem (IST)' },
  { value: 'Asia/Riyadh', label: 'Riyadh (AST)' },
  { value: 'Asia/Doha', label: 'Doha (AST)' }
];

interface PersonFormProps {
  onSubmit: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Person;
  onCancel: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [organization, setOrganization] = useState(initialData?.organization || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [timezone, setTimezone] = useState(initialData?.timezone || 'America/New_York');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData ? (initialData.imageUrl || (initialData as any).profilePictureUrl) : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role || '');
      setOrganization(initialData.organization || '');
      setNotes(initialData.notes || '');
      setImagePreview(initialData.imageUrl || (initialData as any).profilePictureUrl || null);
      setTimezone(initialData.timezone || 'America/New_York');
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = initialData?.imageUrl || (initialData as any).profilePictureUrl;
      
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('upload_preset', UPLOAD_PRESET || '');
        
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        imageUrl = data.secure_url;
      }

      const formData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        role: role.trim() || '',
        organization: organization.trim() || '',
        notes: notes.trim() || '',
        imageUrl: imageUrl || '',
        timezone: timezone || 'America/New_York',
        userId: initialData?.userId || '',
        dateAdded: initialData?.dateAdded || new Date().toISOString(),
        groupIds: initialData?.groupIds || [],
      };

      await onSubmit(formData);
      onCancel();
    } catch (error) {
      console.error('Error in form submission:', error);
      setImagePreview(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button type="button" className="close-button" onClick={handleCancel}>×</button>
        <h2>{initialData ? 'Edit Person' : 'Add New Person'}</h2>
        <form onSubmit={handleSubmit} className="person-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="organization">Organization</label>
            <input
              type="text"
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Profile Picture</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Update Person' : 'Add Person'}
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 