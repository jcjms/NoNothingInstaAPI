const fs = require('fs');
const readline = require('readline');
const puppeteer = require('puppeteer');

const usernameFile = 'usernames.txt';
const outputFile = 'output.json';
let filesCreated = false;

[usernameFile, outputFile].forEach(file => {
    if (!fs.existsSync(file))
        fs.writeFileSync(file, '');
    filesCreated = true;
});

if (filesCreated) console.log('Files created. Fill in the username(s) and run the script again to execute.');

const emailRegex = /[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const linkRegex = /"sameAs":"(.*?)"/;

const outputData = [];

const overallStartTime = performance.now();

function findEmail(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            const result = findEmail(obj[key]);
            if (result) {
                return result;
            }
        } else if (typeof obj[key] === 'string') {
            const emailMatch = emailRegex.exec(obj[key]);
            if (emailMatch) {
                return emailMatch[0];
            }
        }
    }
    return null;
}

function findLink(bioContent) {
    const match = linkRegex.exec(bioContent);
    const link = match ? match[1] : '';
    if (link) {
        return link.replace(/\\\//g, '/');
    } else {
        return null;
    }
}

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new'
    });

    const readInterface = readline.createInterface({
        input: fs.createReadStream(usernameFile),
    });

    try {
        for await (const username of readInterface) {
            const startTime = performance.now();
            const insta = await browser.newPage();
            await insta.goto(`https://instagram.com/${username}`, { waitUntil: 'networkidle0' });

            console.log(`Fetching profile...\nUsername: ${username}`);
            const bioContent = await insta.evaluate(() => {
                const scriptTag = document.querySelector('script[type="application/ld+json"]');
                const jsonContent = scriptTag.textContent;
                return jsonContent;
            });

            const data = JSON.parse(bioContent);

            await insta.close();

            const context = data["@context"];
            const type = data["@type"];
            const description = data["description"];
            const authorType = data["author"]["@type"];
            const authorIdentifierType = data["author"]["identifier"]["@type"];
            const authorIdentifierPropertyID = data["author"]["identifier"]["propertyID"];
            const authorIdentifierValue = data["author"]["identifier"]["value"];
            const authorImage = data["author"]["image"];
            const authorName = data["author"]["name"];
            const authorAlternateName = data["author"]["alternateName"];
            const authorSameAs = data["author"]["sameAs"];
            const authorUrl = data["author"]["url"];
            const mainEntityType = data["mainEntityOfPage"]["@type"];
            const mainEntityId = data["mainEntityOfPage"]["@id"];
            const identifierType = data["identifier"]["@type"];
            const identifierPropertyID = data["identifier"]["propertyID"];
            const identifierValue = data["identifier"]["value"];
            const interactionStatisticType1 = data["interactionStatistic"][0]["@type"];
            const interactionStatisticInteractionType1 = data["interactionStatistic"][0]["interactionType"];
            const interactionStatisticUserInteractionCount1 = data["interactionStatistic"][0]["userInteractionCount"];
            const interactionStatisticType2 = data["interactionStatistic"][1]["@type"];
            const interactionStatisticInteractionType2 = data["interactionStatistic"][1]["interactionType"];
            const interactionStatisticUserInteractionCount2 = data["interactionStatistic"][1]["userInteractionCount"];

            const link = findLink(bioContent);
            const email = findEmail(data);

            const result = {
                context: context,
                type: type,
                description: description,
                authorType: authorType,
                authorIdentifierType: authorIdentifierType,
                authorIdentifierPropertyID: authorIdentifierPropertyID,
                authorIdentifierValue: authorIdentifierValue,
                authorImage: authorImage,
                authorName: authorName,
                authorAlternateName: authorAlternateName,
                authorSameAs: authorSameAs,
                authorUrl: authorUrl,
                mainEntityType: mainEntityType,
                mainEntityId: mainEntityId,
                identifierType: identifierType,
                identifierPropertyID: identifierPropertyID,
                identifierValue: identifierValue,
                interactionStatisticType1: interactionStatisticType1,
                interactionStatisticInteractionType1: interactionStatisticInteractionType1,
                interactionStatisticUserInteractionCount1: interactionStatisticUserInteractionCount1,
                interactionStatisticType2: interactionStatisticType2,
                interactionStatisticInteractionType2: interactionStatisticInteractionType2,
                interactionStatisticUserInteractionCount2: interactionStatisticUserInteractionCount2,
                link: link,
                email: email
            };

            console.log(result);

            outputData.push(result);

            fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
            const endTime = performance.now();
            console.log('Part time', ((endTime - startTime) / 1000).toFixed(2) + 's');
        };
    } catch (error) {
        console.error('Error:', error);
    } finally {
        const overallEndTime = performance.now();
        console.log('Total time', (((overallEndTime - overallStartTime) / 1000).toFixed(2)) + 's')

        await browser.close();
    }
})();