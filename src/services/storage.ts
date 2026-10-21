// Storage service managing progress and preferences

export interface GameRecords {
  memoryMatch: {
    bestMoves: number;
    completed: boolean;
  };
  trivia: {
    score: number;
    completed: boolean;
    answers: Record<number, number>;
  };
  heartCatcher: {
    bestScore: number;
    completed: boolean;
  };
}

export interface UserProgress {
  masteredLevels: number[];
  currentLevel: number;
  gameRecords: GameRecords;
  openedLetters: number[];
  revealedReasons: number[];
  watchedReels: string[];
  isMuted: boolean;
  sfxEnabled: boolean;
  hasStarted: boolean;
}

const STORAGE_KEY = 'isha20:v1';

const defaultProgress: UserProgress = {
  masteredLevels: [1, 2], // Level 1 & 2 mastered initially as shown in Stitch, or 0
  currentLevel: 3,
  gameRecords: {
    memoryMatch: { bestMoves: 12, completed: false },
    trivia: { score: 5, completed: true, answers: { 1: 1, 2: 1, 3: 0, 4: 3, 5: 0 } },
    heartCatcher: { bestScore: 20, completed: false }
  },
  openedLetters: [1],
  revealedReasons: [1, 2, 7],
  watchedReels: ['reel-1'],
  isMuted: false,
  sfxEnabled: true,
  hasStarted: false
};

export function isUnlockAll(): boolean {
  try {
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    return search.includes('unlock=all') || hash.includes('unlock=all');
  } catch {
    return false;
  }
}

export function getNow(): Date {
  try {
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    const searchParams = new URLSearchParams(search);
    const hashQuery = hash.includes('?') ? hash.substring(hash.indexOf('?')) : '';
    const hashParams = new URLSearchParams(hashQuery);
    const nowParam = searchParams.get('now') || hashParams.get('now');
    if (nowParam) {
      const parsed = new Date(nowParam);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  } catch {}
  return new Date();
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return {
      ...defaultProgress,
      ...parsed,
      gameRecords: {
        ...defaultProgress.gameRecords,
        ...(parsed.gameRecords || {})
      }
    };
  } catch (err) {
    console.warn('Failed to load localStorage progress:', err);
    return defaultProgress;
  }
}

export function saveProgress(progress: Partial<UserProgress>): UserProgress {
  try {
    const current = loadProgress();
    const updated: UserProgress = {
      ...current,
      ...progress,
      gameRecords: {
        ...current.gameRecords,
        ...(progress.gameRecords || {})
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save progress:', err);
    return defaultProgress;
  }
}

export function resetProgress(): UserProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to reset progress:', err);
  }
  return defaultProgress;
}
