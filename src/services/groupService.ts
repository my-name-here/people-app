import { 
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Group } from '../types/Group';
import { personService } from './personService';

const COLLECTION_NAME = 'groups';

export const groupService = {
  async addGroup(userId: string, group: Omit<Group, 'id' | 'dateAdded' | 'personIds'>): Promise<Group> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...group,
      userId,
      dateAdded: new Date().toISOString(),
      personIds: []
    });
    
    return {
      ...group,
      id: docRef.id,
      dateAdded: new Date().toISOString(),
      personIds: [],
      userId
    };
  },

  async getGroups(userId: string): Promise<Group[]> {
    const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Group));
  },

  async getGroup(groupId: string): Promise<Group | null> {
    const docRef = doc(db, COLLECTION_NAME, groupId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Group;
  },

  async deleteGroup(groupId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, groupId);
    await deleteDoc(docRef);
  },

  async updateGroup(groupId: string, updates: Partial<Group>): Promise<void> {
    const groupRef = doc(db, COLLECTION_NAME, groupId);
    await updateDoc(groupRef, updates);
  },

  async addPersonToGroup(groupId: string, personId: string): Promise<void> {
    const groupRef = doc(db, COLLECTION_NAME, groupId);
    const group = await this.getGroup(groupId);
    
    if (!group) {
      throw new Error('Group not found');
    }

    // Check if person is already in the group
    if (group.personIds.includes(personId)) {
      return; // Person is already in the group, no need to add them again
    }

    await updateDoc(groupRef, {
      personIds: arrayUnion(personId)
    });
  },

  async removePersonFromGroup(groupId: string, personId: string): Promise<void> {
    const groupRef = doc(db, COLLECTION_NAME, groupId);
    await updateDoc(groupRef, {
      personIds: arrayRemove(personId)
    });
  }
}; 