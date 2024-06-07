var itertools = require('itertools');
const puppeteer = require('puppeteer');
var izip = itertools.izip;
var cycle = itertools.cycle;
var repeat = itertools.repeat;

const getDefinitions = async (letters) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto('https://www.wordnik.com/words/' + letters, {
        waitUntil: 'domcontentloaded',
    });

    const isSorryMessage = await page.evaluate(() => {
        const element = document.querySelector(".weak");
        return element && element.innerText === "Sorry, no definitions found. Check out and contribute to the discussion of this word!";
    });

    await browser.close();

    return isSorryMessage;
};

const checkValidCombinations = async (letters) => {
    let valid_combinations = [];

    for (let i = 2; i <= letters.length; i++) {
        for (let combination of izip(cycle(letters), repeat(letters, i))) {
            let combinedLetters = combination.join("").slice(0, i);
            const isSorry = await getDefinitions(combinedLetters);

            if (!isSorry) {
                valid_combinations.push(combinedLetters);
            }
        }
    }

    return valid_combinations;
};

(async () => {
    const letters = "gullies";
    const valid_combinations = await checkValidCombinations(letters);
    console.log(valid_combinations);
})();