import React from 'react';
import { Group } from '../types/Group';
import './GroupList.css';

interface GroupListProps {
  groups: Group[];
  onGroupSelect: (group: Group) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ groups, onGroupSelect }) => {
  return (
    <div className="groups-grid">
      {groups.map(group => (
        <div 
          key={group.id} 
          className="group-card"
          onClick={() => onGroupSelect(group)}
        >
          <h3>{group.name}</h3>
          <p className="description">{group.description}</p>
          <div className="group-meta">
            <span className="member-count">
              {new Set(group.personIds).size} members
            </span>
            <span className="date-added">
              Added {new Date(group.dateAdded).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}; 