/**
 * Generate winning 5 numbers (1-45)
 */
export function generateRandomDraw(): number[] {
  const numbers: number[] = [];
  while (numbers.length < 5) {
    const n = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(n)) numbers.push(n);
  }
  return numbers.sort((a, b) => a - b);
}

/**
 * Weighted by frequency — MORE frequent scores from users = more likely to be drawn
 */
export function generateAlgorithmicDraw(allUserScores: number[][]): number[] {
  const frequency: Record<number, number> = {};
  allUserScores.flat().forEach(score => {
    frequency[score] = (frequency[score] || 0) + 1;
  });
  
  // Build weighted pool
  const pool: number[] = [];
  Object.entries(frequency).forEach(([score, count]) => {
    for (let i = 0; i < count; i++) pool.push(Number(score));
  });
  
  if (pool.length < 5) return generateRandomDraw();

  // Pick 5 unique numbers from weighted pool
  const selected: number[] = [];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  for (const n of shuffled) {
    if (!selected.includes(n) && selected.length < 5) selected.push(n);
  }
  
  // If we couldn't get 5 unique from the pool (unlikely), fill with random
  while (selected.length < 5) {
    const n = Math.floor(Math.random() * 45) + 1;
    if (!selected.includes(n)) selected.push(n);
  }

  return selected.sort((a, b) => a - b);
}

/**
 * Calculate matches for a user's entry
 */
export function calculateMatches(userNumbers: number[], drawNumbers: number[]): number {
  return userNumbers.filter(n => drawNumbers.includes(n)).length;
}

/**
 * Calculate prize pools
 */
export function calculatePrizePools(subscriberCount: number, pricePerUser: number = 20, rolledOverJackpot: number = 0) {
  const totalPool = subscriberCount * pricePerUser * 0.5; // 50% of revenue to prize pool
  return {
    total: totalPool + rolledOverJackpot,
    jackpot: totalPool * 0.4 + rolledOverJackpot, // 40% + any rollover
    fourMatch: totalPool * 0.35,  // 35%
    threeMatch: totalPool * 0.25  // 25%
  };
}
