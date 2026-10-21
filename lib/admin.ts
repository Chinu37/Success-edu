// NEXT_PUBLIC_ADMIN_ID accepts one Clerk user id or a comma-separated list.
// Admins can see every student and purchase on the platform.
export const isAdmin = (userId?: string | null) => {
  if (!userId) return false;

  const adminIds = (process.env.NEXT_PUBLIC_ADMIN_ID ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  return adminIds.includes(userId);
};
