// /lib/checkAdmin.js
'use server';

import { getUserFromCookies } from './getUser';

export async function checkAdmin() {
  const user = await getUserFromCookies();
  if (!user || !user.isAdmin) {
    throw new Error('Unauthorized: Admin access only');
  }
  return user;
}
