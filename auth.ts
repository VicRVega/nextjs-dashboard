import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
    providers: [Credentials({})],
});

/*
1. Create a new file called auth.ts that spreads your authConfig object:

2. Next, you will need to add the providers option for NextAuth.js. 
providers is an array where you list different login options such as Google or GitHub. 
For this course, we will focus on using the Credentials provider only.

The Credentials provider allows users to log in with a username and a password.

*/