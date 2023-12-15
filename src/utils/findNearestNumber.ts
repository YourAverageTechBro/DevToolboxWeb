/**
 * Finds the number in the list that is nearest to a given target number.
 *
 * @param list - The list of numbers to search.
 * @param targetNumber - The target number to find the nearest number to.
 * @returns The number in the list that is nearest to the targetNumber,
 *                          or null if the list is empty.
 */
export const findNearestNumber = (list: number[], targetNumber: number) => {
  let nearestNumber: number | null = null;
  let minDifference = Infinity;

  for (const item of list) {
    const currentDifference = Math.abs(item - targetNumber);

    if (currentDifference < minDifference) {
      minDifference = currentDifference;
      nearestNumber = item;
    }
  }

  return nearestNumber;
};
