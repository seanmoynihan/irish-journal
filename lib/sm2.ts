// SM-2 Spaced Repetition Algorithm
// quality: 0-5 where 0-2 = fail, 3-5 = pass
// 5 = perfect, 4 = correct with hesitation, 3 = correct with difficulty
// 2 = incorrect but easy to recall, 1 = incorrect, 0 = complete blackout

export interface SM2Card {
  ease_factor: number;
  interval: number;
  repetitions: number;
}

export interface SM2Result extends SM2Card {
  next_review: number; // unix timestamp
}

export function calculateSM2(card: SM2Card, quality: number): SM2Result {
  const q = Math.max(0, Math.min(5, quality));

  let { ease_factor, interval, repetitions } = card;

  if (q >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  } else {
    // Incorrect response — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  ease_factor = ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  ease_factor = Math.max(1.3, ease_factor);

  const next_review = Math.floor(Date.now() / 1000) + interval * 86400;

  return { ease_factor, interval, repetitions, next_review };
}

export function isDue(next_review: number): boolean {
  return next_review <= Math.floor(Date.now() / 1000);
}

export function qualityLabel(q: number): string {
  const labels: Record<number, string> = {
    5: 'Perfect',
    4: 'Good',
    3: 'Okay',
    2: 'Hard',
    1: 'Wrong',
    0: 'Blackout',
  };
  return labels[q] ?? 'Unknown';
}
