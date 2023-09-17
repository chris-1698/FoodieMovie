import bcrypt from 'bcryptjs';
import { User } from './models/userModel';

export const sampleUsers: User[] = [
  {
    name: 'Joe',
    lastName: 'Cornell',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
    dateOfBirth: '06/03/1995',
  },
  {
    name: 'Jade',
    lastName: 'Crawford',
    email: 'notadmin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
  },
];
