import React, { useState, useEffect } from 'react'
import { auth } from './config/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { Person } from './types/Person'
import { Group } from './types/Group'
import { personService } from './services/personService'
import { groupService } from './services/groupService'
import { PeopleList } from './components/PeopleList'
import { PersonForm } from './components/PersonForm'
import { GroupList } from './components/GroupList'
import { GroupForm } from './components/GroupForm'
import { GroupDetail } from './components/GroupDetail'
import './App.css'

function App() {
  const [user, setUser] = useState(auth.currentUser)
  const [persons, setPersons] = useState<Person[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isPersonFormOpen, setIsPersonFormOpen] = useState(false)
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [activeTab, setActiveTab] = useState<'people' | 'groups'>('people')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        loadData()
      }
    })

    return () => unsubscribe()
  }, [])

  const loadData = async () => {
    if (!user) return
    try {
      const [personsData, groupsData] = await Promise.all([
        personService.getPersons(user.uid),
        groupService.getGroups(user.uid)
      ])
      setPersons(personsData)
      setGroups(groupsData)
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data. Please try again.')
    }
  }

  const handleAddPerson = async (person: Omit<Person, 'id' | 'dateAdded' | 'groupIds'>) => {
    if (!user) return
    try {
      const newPerson = await personService.addPerson(user.uid, person)
      setPersons(prev => [...prev, newPerson])
      setIsPersonFormOpen(false)
    } catch (error) {
      console.error('Error adding person:', error)
      setError('Failed to add person. Please try again.')
    }
  }

  const handleAddGroup = async (group: Omit<Group, 'id' | 'dateAdded' | 'personIds'>) => {
    if (!user) return
    try {
      const newGroup = await groupService.addGroup(user.uid, group)
      setGroups(prev => [...prev, newGroup])
      setIsGroupFormOpen(false)
    } catch (error) {
      console.error('Error adding group:', error)
      setError('Failed to add group. Please try again.')
    }
  }

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group)
  }

  const handleGroupUpdate = (updatedGroup: Group) => {
    setGroups(prev => prev.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    ))
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError(isRegistering ? 'Failed to register. Please try again.' : 'Failed to login. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      setError('Failed to logout. Please try again.')
    }
  }

  const handleDeletePerson = async (id: string) => {
    if (!user) return;
    try {
      await personService.deletePerson(id);
      setPersons(prevPeople => prevPeople.filter(person => person.id !== id));
    } catch (error) {
      console.error('Error deleting person:', error);
      setError('Failed to delete person. Please try again.');
    }
  };

  const handleUpdatePerson = async (id: string, updatedPerson: Omit<Person, 'id'>) => {
    if (!user) return;
    try {
      const updated = await personService.updatePerson(id, updatedPerson);
      setPersons(prev => prev.map(person => 
        person.id === id ? updated : person
      ));
    } catch (error) {
      console.error('Error updating person:', error);
      setError('Failed to update person. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <button 
          className="auth-switch"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Research People Tracker</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'people' ? 'active' : ''}`}
          onClick={() => setActiveTab('people')}
        >
          People
        </button>
        <button 
          className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </button>
      </div>

      {selectedGroup ? (
        <GroupDetail 
          group={selectedGroup} 
          onClose={() => setSelectedGroup(null)}
          onGroupUpdate={handleGroupUpdate}
        />
      ) : (
        <>
          {activeTab === 'groups' ? (
            <>
              <div className="section-header">
                <h2>Groups</h2>
                <button 
                  className="add-button"
                  onClick={() => setIsGroupFormOpen(true)}
                >
                  + Add Group
                </button>
              </div>
              <GroupList groups={groups} onGroupSelect={handleGroupSelect} />
            </>
          ) : (
            <>
              <div className="section-header">
                <h2>People</h2>
                <button 
                  className="add-button"
                  onClick={() => setIsPersonFormOpen(true)}
                >
                  + Add Person
                </button>
              </div>
              <PeopleList 
                people={persons} 
                onAddPerson={handleAddPerson}
                onDeletePerson={handleDeletePerson}
                onUpdatePerson={handleUpdatePerson}
                isAddFormOpen={isPersonFormOpen}
                onAddFormClose={() => setIsPersonFormOpen(false)}
              />
            </>
          )}
        </>
      )}

      {isPersonFormOpen && (
        <PersonForm
          onSubmit={handleAddPerson}
          onCancel={() => setIsPersonFormOpen(false)}
        />
      )}

      {isGroupFormOpen && (
        <GroupForm
          onClose={() => setIsGroupFormOpen(false)}
          onSubmit={handleAddGroup}
        />
      )}
    </div>
  )
}

export default App
