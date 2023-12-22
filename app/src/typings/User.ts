export type User = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  isEmployee: boolean;
  token: string;
};
