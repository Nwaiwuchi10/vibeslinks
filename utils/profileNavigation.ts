/**
 * Navigation helper to handle user and host profile picture / name clicks.
 */
export type UserLike = {
  id?: string;
  _id?: string;
  name?: string;
  fullName?: string;
  username?: string;
  profilePictureUrl?: string;
  avatarUrl?: string;
  avatar?: string;
  role?: string;
  isHost?: boolean;
  type?: string;
};

/**
 * Navigates to a user's profile screen.
 * - If target is the logged-in user, navigates to your own profile tab `/(tabs)/profile`.
 * - If target is another user or host, navigates to `/host-profile` with user details.
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

  if (currentUserId && (targetId === currentUserId || String(targetId) === String(currentUserId))) {
    router.push('/(tabs)/profile');
  } else {
    router.push({
      pathname: '/host-profile',
      params: {
        id: targetId,
        name: targetName,
        avatar: targetAvatar,
        role: targetUser.role || (targetUser.isHost ? 'host' : 'user'),
      },
    });
  }
}
