/**
 * Compares the guess to the answer. Requires that guess and answer are the same length
 * and only contain lowercase alphabetical characters.
 * @param guess The guess
 * @param answer The answer
 * @return result: number[][]. result[0] is the list of 0-indexed positions of letters
 * in the guess which are in the answer and in the right place, and result[1] is a similar
 * list of positions of letters in the guess which are in the answer but in the wrong place.
 */
export const compareGuess = (guess: string, answer: string): number[][] => {
    const res: number[][] = [[], []];

    // Find letters in the right place first. If the letter is repeated
    // in guess, we want to indicate the letter in the right place.
    for (let i = 0; i < answer.length; i++) {
        if (guess[i] === answer[i]) {
            res[0].push(i);
            // Take out any letters in the answer that have already
            // been used
            answer = answer.substring(0, i) + "-" + answer.substring(i+1);
            guess = guess.substring(0, i) + "!" + guess.substring(i+1);
        }
    }

    for (let i = 0; i < guess.length; i++) {
        for (let j = 0; j < answer.length; j++) {
            if (i === j) {
                continue;
            }
            if (guess[i] === answer[j]) {
                res[1].push(i);
                // Take out any letters in the answer and guess that have already
                // been used
                answer = answer.substring(0, j) + "-" + answer.substring(j+1);
                guess = guess.substring(0, i) + "!" + guess.substring(i+1);
            }
        }
    }

    return res;
}