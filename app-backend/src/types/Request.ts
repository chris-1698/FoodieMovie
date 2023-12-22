declare namespace Express {
  export interface Request {
    user: {
      _id: string;
      name: string;
      lastName: string;
      email: string;
      isEmployee: boolean;
      dateOfBirth?: string;
      token: string;
    };
  }
}
