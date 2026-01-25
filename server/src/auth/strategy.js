import { prisma } from '../lib/prisma.js';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';

const LocalStrategy = new Strategy(async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return done(null, false, { message: 'Incorrect username!' });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return done(null, false, { message: 'Incorrect password!' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

export { LocalStrategy };
