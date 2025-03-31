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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Person } from '../types/Person';

const COLLECTION_NAME = 'persons';

export const personService = {
  async addPerson(userId: string, person: Omit<Person, 'id' | 'dateAdded' | 'groupIds' | 'profilePictureUrl'>): Promise<Person> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...person,
      userId,
      dateAdded: serverTimestamp(),
      groupIds: []
    });

    return {
      id: docRef.id,
      ...person,
      userId,
      dateAdded: new Date().toISOString(),
      groupIds: []
    };
  },

  async getPersons(userId: string): Promise<Person[]> {
    const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Person));
  },

  async getPerson(personId: string): Promise<Person | null> {
    const docRef = doc(db, COLLECTION_NAME, personId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Person;
  },

  async deletePerson(personId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, personId));
  },

  async updatePerson(id: string, person: Omit<Person, 'id' | 'profilePictureUrl'>): Promise<Person> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, person);
    return {
      id,
      ...person
    };
  }
};
