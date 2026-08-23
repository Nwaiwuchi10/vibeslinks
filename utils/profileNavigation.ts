/**
 * Navigation helper to handle user and host profile picture / name clicks.
 */
export type UserLike = {
  id?: string;
  _id?: string;
  name?: string;
  fullName?: string;
  username?: string;
  profilePictureUrl?: string | null;
  avatarUrl?: string | null;
  avatar?: string | null;
  role?: string;
  isHost?: boolean;
  type?: string;
};

/**
 * Navigates to a user's profile screen.
 * - If target is the logged-in user, navigates to your own profile tab `/(tabs)/profile`.
 * - If target is another user or host, navigates to `/host-profile` capturing all user & host information.
 */
export function navigateToUserProfile(
  router: any,
  targetUser?: UserLike | null,
  currentUserId?: string | null
) {
  if (!targetUser) return;
  const targetId = targetUser.id || targetUser._id;
  const targetName =
    targetUser.name ||
    targetUser.fullName ||
    targetUser.username ||
    'User Profile';
  const targetAvatar =
    targetUser.profilePictureUrl ||
    targetUser.avatarUrl ||
    targetUser.avatar ||
    '';

  if (!targetId) return;

  // 1) Logged-in user: keep own profile screen intact
  if (currentUserId && (targetId === currentUserId || String(targetId) === String(currentUserId))) {
    router.push('/(tabs)/profile');
    return;
  }

  // 2) Single unified profile navigation for all other users and hosts
  router.push({
    pathname: '/host-profile',
    params: {
      id: targetId,
      name: targetName,
      avatar: targetAvatar,
      username: targetUser.username || '',
      role: targetUser.role || (targetUser.isHost ? 'host' : 'user'),
    },
  });
}
