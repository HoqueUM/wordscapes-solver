import { permutations } from 'itertools';
import { readFile } from 'fs';
// Cache for the word list to avoid reloading
let wordListCache = null;

function loadWordList(filePath) {
    return new Promise((resolve, reject) => {
        readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const words = data.split('\n').map(word => word.trim().toLowerCase());
                resolve(new Set(words));
            }
        });
    });
}

async function getCachedWordList(filePath) {
    if (!wordListCache) {
        wordListCache = await loadWordList(filePath);
    }
    return wordListCache;
}

async function isValidScrabbleWord(word) {
    try {
        const wordList = await getCachedWordList('utils/twl.txt');
        return wordList.has(word.toLowerCase());
    } catch (error) {
        console.error('Error loading word list:', error);
        return false;
    }
}

const checkCombinations = async (letters, minLength) => {
    let validCombinations = {};

    for (let length = minLength; length <= letters.length; length++) {
        for (let perm of permutations(letters, length)) {
            let word = perm.join('').toLowerCase();
            let isValid = await isValidScrabbleWord(word);
            console.log(`${word} is a ${isValid ? 'Valid' : 'Invalid'} Scrabble word`);
            if (isValid) {
                validCombinations[word] = true;
            }
        }
    }

    return validCombinations;
}

export async function getValidWords(letters, length) {
    const wordList = await checkCombinations(letters, length);
    return wordList;
}