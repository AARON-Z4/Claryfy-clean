import express from 'express';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import { analyzeContentWithGemini } from './advancedAnalysis.js';
import { createChat, addMessageToChat, getUserProfile, incrementUsage } from './firestore.js';

puppeteer.use(StealthPlugin());

const router = express.Router();
const urlRegex = /(https?:\/\/[^\s]+)/;

const USAGE_LIMITS = {
    free: 10,
    premium: 50
};

async function extractArticleText(htmlContent) {
    try {
        const $ = cheerio.load(htmlContent);
        $('script, style, noscript, header, footer, nav, aside, iframe, .ad, .advert, .popup').remove();
        let mainText = '';
        $('p').each((i, elem) => {
            const pText = $(elem).text().trim();
            if (pText.length > 20) { // Only add paragraphs with some substance
                mainText += pText + '\n\n';
            }
        });
        return mainText.trim();
    } catch (error) {
        console.error("Cheerio Text Extraction Error:", error);
        throw new Error("Failed to parse article HTML.");
    }
}

async function getPageContent(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            // More robust arguments to prevent detection and improve stability
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"'
            ]
        });

        const page = await browser.newPage();
        
        // Block unnecessary resources to speed up page loads and avoid getting stuck
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if(['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())){
                req.abort();
            } else {
                req.continue();
            }
        });

        // Increased timeout to 30 seconds
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const content = await page.content();
        return content;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}


router.post('/', async (req, res) => {
    const { userId, newsText: originalInput, chatId } = req.body;
    if (!userId || !originalInput) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const userProfile = await getUserProfile(userId);
        const limit = USAGE_LIMITS[userProfile.plan] || 10;
        if (userProfile.usageCount >= limit) {
            return res.status(429).json({ error: 'Daily usage limit reached.' });
        }

        let textToAnalyze = originalInput;
        let domain = 'N/A';
        let currentChatId = chatId;

        const urlMatch = originalInput.match(urlRegex);
        if (urlMatch) {
            const url = urlMatch[0];
            domain = new URL(url).hostname.replace(/^www\./, '');
            try {
                const htmlContent = await getPageContent(url);
                textToAnalyze = await extractArticleText(htmlContent);
                
                if (!textToAnalyze || textToAnalyze.length < 150) {
                     return res.status(400).json({ error: "Could not extract a readable article from this URL. The page might not be a news article or is heavily protected." });
                }
            } catch (fetchError) {
                console.error("Puppeteer/Fetch Error:", fetchError);
                // Provide a more specific error if it's a timeout
                if (fetchError.name === 'TimeoutError') {
                    return res.status(500).json({ error: "Failed to load the URL. The request timed out." });
                }
                return res.status(500).json({ error: "Failed to fetch content from the URL. The site may be using advanced blocking techniques." });
            }
        }

        const finalResult = await analyzeContentWithGemini(textToAnalyze, domain);

        if (!currentChatId) {
            const title = domain !== 'N/A' ? domain : (originalInput.substring(0, 50) + '...');
            currentChatId = await createChat(userId, title);
        }

        await addMessageToChat(userId, currentChatId, { user: originalInput, ai: finalResult });
        await incrementUsage(userId);

        res.json({ result: finalResult, chatId: currentChatId });

    } catch (err) {
        console.error("Prediction Route Error:", err);
        res.status(500).json({ error: err.message || 'An unexpected error occurred.' });
    }
});

export default router;