export interface Person {
  id: string;
  name: string;
  role: string;
  organization: string;
  notes?: string;
  timezone: string;
  imageUrl?: string;
  profilePictureUrl?: string;
  dateAdded: string;
  createdAt: string;
  updatedAt: string;
  groupIds: string[];
  userId: string;
}
