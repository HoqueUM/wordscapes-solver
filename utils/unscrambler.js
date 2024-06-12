import { permutations } from 'itertools';
import { readFile } from 'fs/promises'; // Use promises-based API

// Cache for the word list to avoid reloading
let wordListCache = null;

async function loadWordList(filePath) {
    try {
        const data = await readFile(filePath, 'utf8');
        const words = data.split('\n').map(word => word.trim().toLowerCase());
        return new Set(words);
    } catch (err) {
        throw new Error(`Error reading file ${filePath}: ${err.message}`);
    }
}

async function getCachedWordList(filePath) {
    if (!wordListCache) {
        wordListCache = await loadWordList(filePath);
    }
    return wordListCache;
}

async function isValidScrabbleWord(word) {
    try {
        const wordList = await getCachedWordList('./public/twl.txt');
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
            if (isValid) {
                validCombinations[word] = true;
            }
        }
    }

    return validCombinations;
}

export async function getValidWords(letters, length) {
    const validCombinations = await checkCombinations(letters, length);
    const validWords = Object.keys(validCombinations);
    validWords.sort();
    let validWordsLengths = {};
    for (let word of validWords) {
        if (!validWordsLengths[word.length]) {
            validWordsLengths[word.length] = [];
        }
        validWordsLengths[word.length].push(word);
    }
    return validWordsLengths;
}
