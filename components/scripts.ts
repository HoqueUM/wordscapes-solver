var itertools = require('itertools');
import { check } from 'scrabble-dict';


const getDefinitions = async (letters: string) => {
    //console.log(`Looking up definitions for: ${letters}`);
    const exists = await check(letters);

    console.log(`Does the word "${letters}" exist? ${exists ? 'Yes' : 'No'}`);
    return exists;
};

const checkValidCombinations = async (letters: string, minLength: number) => {
    let validCombinations: Record<number, string[]> = {};

    for (let length = minLength; length <= letters.length; length++) {
        for (let perm of itertools.permutations(letters, length)) {
            let word = perm.join('').toLowerCase();

            // Replace the following line with your actual word checking logic
            const isValidWord: boolean = await getDefinitions(word);

            if (isValidWord) {
                if (!validCombinations[length]) {
                    validCombinations[length] = [];
                }
                validCombinations[length].push(word);
                console.log(word);
            }
        }
    }

    return validCombinations;
};

(async () => {
    const letters = "gullies";
    const valid_combinations = await checkValidCombinations(letters, 4);
    console.log(valid_combinations);
})();