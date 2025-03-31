export interface Person {
  id: string;
  name: string;
  role: string;
  organization: string;
  notes?: string;
  timezone: string;
  imageUrl?: string;
  dateAdded: string;
  createdAt: string;
  updatedAt: string;
  groupIds: string[];
  userId: string;
} 