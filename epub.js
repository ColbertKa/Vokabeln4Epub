let MaxFrequencyRank = 11000;
let unter8k=0;
let uber8k=0;


function uebersetzeSeltene(word) {
    let lower=word.toLowerCase();
    if (frequencyRankMap.has(lower)){
        if(frequencyRankMap.get(lower) > 8000 ){
            uber8k++
        }else{
            unter8k++
        }
    }
    if (frequencyRankMap.has(lower) && frequencyRankMap.get(lower) > MaxFrequencyRank ) {
        if(dict.has(lower)){
            return `${word}<vok>${dict.get(lower)} ${Math.floor(frequencyRankMap.get(lower) / 1000)}k</vok>`
        } else {
            let wortOhneEndung=removeEndung(lower);
            if(dict.has(wortOhneEndung)){
                return `${word}<vok>${dict.get(wortOhneEndung)} ${Math.floor(frequencyRankMap.get(lower) / 1000)}k</vok>`
            } else {
                return `${word}<vok>?</vok>`
            }
        }
    } else {
        return word
    }

}


function removeEndung(word) {
    if (word.endsWith('s')) {
        return word.slice(0, -1); // Remove the last character
    }
    if (word.endsWith('ed')) {
        // Auch hier gibt es Ausnahmen, z.B. "hated" -> "hate"
        return word.slice(0, -2); // Endung 'ed' entfernen
    }
     if (word.endsWith('ing')) {
        // Berücksichtige Fälle wie "running" -> "run", "swimming" -> "swim"
        // Eine einfache Entfernung des Suffixes reicht hier nicht immer.
        // Für eine robustere Lösung bräuchte man ein Stemming-Algorithmus.
        // Hier eine einfache (aber nicht perfekte) Heuristik:
        if (word.length > 4 && word.slice(-4, -3) === word.slice(-5, -4)) { // z.B. "nn" in "running"
            return word.slice(0, -4); // Endung 'ing' und doppelten Konsonanten entfernen
        }
        return word.slice(0, -3); // Endung 'ing' entfernen
    }
    return word; // Return the original word if it doesn't end with 's'
}

function addStyleToHtmlHead(htmlString) {
    const headEndTag = '</head>';
    const headEndIndex = htmlString.indexOf(headEndTag);

    if (headEndIndex === -1) {
        console.warn("</head> tag not found in the HTML string. Style not added.");
        return htmlString; // Return original string if <head> is not found
    }

    // Construct the <style> tag
    const fullStyleTag = "<style> vok {vertical-align: sub;  font-size: smaller; font-style: italic;  } </style> "


    // Insert the style tag just before the </head> tag
    const modifiedHtmlString =
        htmlString.substring(0, headEndIndex) +
        fullStyleTag +
        htmlString.substring(headEndIndex);

    return modifiedHtmlString;
}


// function modifyTextInBody(htmlString) {
//     return htmlString.replace(/(<body[^>]*>)([\s\S]*?)(<\/body>)/, (match, startTag, bodyContent, endTag) => {
//         let modifiedBody = bodyContent.replace(/>([^<]+)</g, (match, text) => `>${text.replace(/\b\w+\b/g, word => `${word.length}-${word}`)}<`);
//         return startTag + modifiedBody + endTag;
//     });
// }

function modifyTextInBody(htmlString) {
    return htmlString.replace(/(<body[^>]*>)([\s\S]*?)(<\/body>)/, (match, startTag, bodyContent, endTag) => {
        let modifiedBody = bodyContent.replace(/>([^<]+)</g, (match, text) => `>${text.replace(/\b\w+\b/g, word => `${uebersetzeSeltene(word)}`)}<`);
        return startTag + modifiedBody + endTag;
    });
}

function vokabeln4Html(htmlString) {
    return modifyTextInBody(addStyleToHtmlHead(htmlString));
}




let frequencyRankMap = new Map();
async function fetchAndMapWordsFrequency(url) {
    try {
        let response = await fetch(url);
        let text = await response.text();


        text.split(/\r?\n/).forEach((word, index) => {
            if (word.trim()) { // Ensure the word isn't empty
                frequencyRankMap.set(word, index + 1);
            }
        });

        console.log("Word frequency list loaded")
    } catch (error) {
        console.error("Error fetching the file:", error);
    }
}

// Example: Call the function with a file URL
//fetchAndMapWordsFrequency("enwiki-frequency-sort-500k.txt");

const dict = new Map();
async function fetchAndProcessDict(url) {
    const response = await fetch(url);
    const text = await response.text();

    const lines = text.trim().split('\n');


    for (const line of lines) {
        const [key, value] = line.split(';');

        if (dict.has(key)) {
            const existing = dict.get(key);
            const newValue = existing.length + value.length + 1 <= 40
                ? `${existing},${value}`
                : existing;
            dict.set(key, newValue);
        } else {
            dict.set(key, value);
        }
    }
    console.log("Dict loaded")
}


async function loadWords() {
    const results = await Promise.all([fetchAndProcessDict('vokabeln.csv'), fetchAndMapWordsFrequency("enwiki-frequency-sort-500k.txt")]);  
}
//loadWords();

