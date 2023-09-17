declare namespace Express {
  export interface Request {
    user: {
      _id: string;
      name: string;
      lastName: string;
      email: string;
      isAdmin: boolean;
      dateOfBirth?: string;
      token: string;
    };
  }
}
