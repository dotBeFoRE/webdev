import { isModerator, isAdmin, isNotBanned } from './roleGuards';

describe('roleGuards', () => {
  describe('isModerator', () => {
    it('returns true if user is moderator', () => {
      expect(isModerator({ isModerator: true, isAdmin: false })).toBe(true);
    });

    it('returns true if user is admin', () => {
      expect(isModerator({ isModerator: false, isAdmin: true })).toBe(true);
    });

    it('returns false if user is not moderator nor admin', () => {
      expect(isModerator({ isModerator: false, isAdmin: false })).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('returns true if user is admin', () => {
      expect(isAdmin({ isAdmin: true })).toBe(true);
    });

    it('returns false if user is not admin', () => {
      expect(isAdmin({ isAdmin: false })).toBe(false);
    });
  });

  describe('isNotBanned', () => {
    it('returns true if user is not banned', () => {
      expect(isNotBanned({ isBanned: false })).toBe(true);
    });

    it('returns false if user is banned', () => {
      expect(isNotBanned({ isBanned: true })).toBe(false);
    });
  });
});
