import React from 'react';
import { Person } from '../types/Person';
import { Group } from '../types/Group';
import { useTheme } from '../contexts/ThemeContext';
import './Settings.css';

interface SettingsProps {
  people: Person[];
  groups: Group[];
}

export const Settings: React.FC<SettingsProps> = ({ people, groups }) => {
  const { theme, setTheme } = useTheme();

  const exportToJSON = (data: any, filename: string) => {
    // Convert data to JSON string with pretty formatting
    const jsonContent = JSON.stringify(data, null, 2);
    
    // Create and trigger download
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportData = () => {
    // Prepare people data
    const peopleData = people.map(person => ({
      id: person.id,
      name: person.name,
      role: person.role,
      organization: person.organization,
      notes: person.notes,
      timezone: person.timezone,
      imageUrl: person.imageUrl || '',
      dateAdded: person.dateAdded
    }));

    // Prepare groups data with member details
    const groupsData = groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.personIds?.map(personId => {
        const person = people.find(p => p.id === personId);
        return person ? {
          id: person.id,
          name: person.name
        } : null;
      }).filter(Boolean) || [],
      dateAdded: group.dateAdded
    }));

    // Combine data into a structured object
    const exportData = {
      exportDate: new Date().toISOString(),
      people: peopleData,
      groups: groupsData
    };

    exportToJSON(exportData, 'people_app_backup');
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="theme-selector">
          <label htmlFor="theme-select">Theme:</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
            className="theme-dropdown"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="system">System Default</option>
          </select>
        </div>
      </div>
      <div className="settings-section">
        <h3>Data Export</h3>
        <p>Export your data to JSON format for backup or analysis. The export includes all information needed to recreate your database.</p>
        <div className="export-buttons">
          <button onClick={handleExportData} className="export-button">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}; 