export type User = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  isAdmin: boolean;
  token: string;
};
