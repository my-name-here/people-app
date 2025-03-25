import React, { useState, useEffect } from 'react';
import { Group } from '../types/Group';
import { Person } from '../types/Person';
import { personService } from '../services/personService';
import { groupService } from '../services/groupService';
import './GroupDetail.css';

interface GroupDetailProps {
  group: Group;
  onClose: () => void;
  onGroupUpdate?: (updatedGroup: Group) => void;
}

export const GroupDetail: React.FC<GroupDetailProps> = ({ group, onClose, onGroupUpdate }) => {
  const [members, setMembers] = useState<Person[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [availablePersons, setAvailablePersons] = useState<Person[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group>(group);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentGroup(group);
    loadMembers();
  }, [group]);

  useEffect(() => {
    if (isAddMemberOpen) {
      loadAvailablePersons();
      setError(null);
    }
  }, [isAddMemberOpen]);

  const loadMembers = async () => {
    const memberPromises = currentGroup.personIds.map(id => personService.getPerson(id));
    const memberResults = await Promise.all(memberPromises);
    // Filter out null values and duplicates
    const uniqueMembers = Array.from(
      new Map(memberResults.filter((person): person is Person => person !== null)
        .map(person => [person.id, person]))
      .values()
    );
    setMembers(uniqueMembers);
  };

  const loadAvailablePersons = async () => {
    // Get all persons for the current user
    const allPersons = await personService.getPersons(currentGroup.userId);
    // Filter out persons that are already members of the group
    const available = allPersons.filter(person => !currentGroup.personIds.includes(person.id));
    setAvailablePersons(available);
  };

  const handleAddMember = async (personId: string) => {
    try {
      setError(null);
      await groupService.addPersonToGroup(currentGroup.id, personId);
      const person = await personService.getPerson(personId);
      if (person) {
        const updatedGroup = {
          ...currentGroup,
          personIds: [...currentGroup.personIds, personId]
        };
        setCurrentGroup(updatedGroup);
        setMembers(prev => [...prev, person]);
        setAvailablePersons(prev => prev.filter(p => p.id !== personId));
        onGroupUpdate?.(updatedGroup);
      }
      setIsAddMemberOpen(false);
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add member. Please try again.');
    }
  };

  const handleRemoveMember = async (personId: string) => {
    try {
      setError(null);
      await groupService.removePersonFromGroup(currentGroup.id, personId);
      const person = await personService.getPerson(personId);
      if (person) {
        const updatedGroup = {
          ...currentGroup,
          personIds: currentGroup.personIds.filter(id => id !== personId)
        };
        setCurrentGroup(updatedGroup);
        setMembers(prev => prev.filter(member => member.id !== personId));
        setAvailablePersons(prev => [...prev, person]);
        onGroupUpdate?.(updatedGroup);
      }
    } catch (error) {
      console.error('Error removing member:', error);
      setError('Failed to remove member. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content group-detail">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{currentGroup.name}</h2>
        <p className="description">{currentGroup.description}</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="members-section">
          <div className="section-header">
            <h3>Members ({members.length})</h3>
            <button 
              className="add-member-button"
              onClick={() => setIsAddMemberOpen(true)}
            >
              + Add Member
            </button>
          </div>

          <div className="members-list">
            {members.map(member => (
              <div key={member.id} className="member-card">
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <p className="role">{member.role}</p>
                  <p className="organization">{member.organization}</p>
                </div>
                <button 
                  className="remove-member-button"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {isAddMemberOpen && (
          <div className="add-member-modal">
            <h3>Add Member</h3>
            <div className="available-persons">
              {availablePersons.length === 0 ? (
                <p className="no-available-persons">No available persons to add</p>
              ) : (
                availablePersons.map(person => (
                  <div 
                    key={person.id} 
                    className="person-option"
                    onClick={() => handleAddMember(person.id)}
                  >
                    <h4>{person.name}</h4>
                    <p>{person.role} at {person.organization}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 