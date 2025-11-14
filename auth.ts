import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
//get user fucntion that queries user from database 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

/*
1. Create a new file called auth.ts that spreads your authConfig object:

2.Add Credential Provider:  Next, you will need to add the providers option for NextAuth.js. 
providers is an array where you list different login options such as Google or GitHub. 
For this course, we will focus on using the Credentials provider only.

The Credentials provider allows users to log in with a username and a password.

3. Adding the sign in functionality: 
- You can use the authorize function to handle the authentication logic. 
Similarly to Server Actions, you can use zod to validate the email and password before checking if the user exists in the database:
- After validating the credentials, create a new getUser function that queries the user from the database.
- Then, call bcrypt.compare to check if the passwords match:
- Finally, if the passwords match you want to return the user, otherwise, return null to prevent the user from logging in.

*/