import bcrypt from 'bcryptjs';
import { User } from './models/userModel';

export const sampleUsers: User[] = [
  {
    name: 'Joe',
    lastName: 'Cornell',
    email: 'employee1@foodiemovie.com',
    password: bcrypt.hashSync('123456'),
    isEmployee: true,
    dateOfBirth: '06/03/1995',
  },
  {
    name: 'Jade',
    lastName: 'Crawford',
    email: 'notemployee@example.com',
    password: bcrypt.hashSync('123456'),
    isEmployee: false,
  },
];
