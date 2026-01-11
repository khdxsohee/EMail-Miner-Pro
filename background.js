// --- CONFIG ---
const STORAGE_KEY = 'leadsync_data_v2';
const AUTO_MODE_KEY = 'auto_mining_enabled';

// --- LISTEN FOR TABS ---
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Sirf check karein jab page pura load ho jaye aur http/https ho
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        
        // Pehla check karein storage mein ki user ne Auto Mode ON kiya hai ya nahi
        chrome.storage.local.get([AUTO_MODE_KEY], (result) => {
            if (result[AUTO_MODE_KEY] === true) {
                // Agar ON hai toh mine karein
                mineDataFromTab(tabId);
            }
            // Agar OFF hai toh kuch nahi karein (Manual mode rahega)
        });
    }
});

// --- MINING LOGIC ---
async function mineDataFromTab(tabId) {
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: scrapePageContentAdvanced, 
        });

        if (results && results[0] && results[0].result) {
            await processAndSaveResults(results[0].result);
        }
    } catch (error) {
        // Ignore restricted pages or if tab closed too fast
        // console.log("Auto-mine skip:", error); 
    }
}

// --- SCRAPER FUNCTION (Popup ke sath same logic) ---
function scrapePageContentAdvanced() {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const text = document.body.innerText;
    const emails = text.match(emailRegex) || [];

    const linksData = Array.from(document.querySelectorAll('a[href]')).map(a => {
        return {
            url: a.href,
            text: a.innerText.toLowerCase().trim(),
            hostname: a.hostname
        };
    }).filter(l => l.hostname.length > 3);

    return {
        emails,
        linksData,
        pageTitle: document.title,
        currentUrl: window.location.href
    };
}

// --- SMART PROCESSING & SAVING ---
async function processAndSaveResults(data) {
    const storedData = await chrome.storage.local.get([STORAGE_KEY]);
    let allData = storedData[STORAGE_KEY] || [];
    let newCount = 0;

    data.emails.forEach(email => {
        const exists = allData.some(item => item.email === email);
        
        if (!exists) {
            let name = email.split('@')[0];
            name = name.charAt(0).toUpperCase() + name.slice(1);
            
            let websiteUrl = "";
            let confidence = "auto"; 
            
            const domain = email.split('@')[1];
            const username = email.split('@')[0];

            // LEVEL 1: Verified
            const exactLink = data.linksData.find(l => l.hostname.includes(domain));
            if (exactLink) {
                websiteUrl = exactLink.url;
                confidence = "verified";
            }
            // LEVEL 2: Linked
            else if (username.length > 5) {
                const keywordLink = data.linksData.find(l => 
                    l.text.includes(username) || l.hostname.includes(username)
                );
                if (keywordLink) {
                    websiteUrl = keywordLink.url;
                    confidence = "linked";
                }
            }
            // LEVEL 3: Auto
            else {
                websiteUrl = `https://${domain}`;
                confidence = "auto";
            }

            allData.push({
                id: Date.now() + Math.random(),
                name: name,
                email: email,
                website: websiteUrl,
                source: data.pageTitle,
                confidence: confidence,
                timestamp: new Date().toISOString()
            });
            newCount++;
        }
    });

    if (newCount > 0) {
        await chrome.storage.local.set({ [STORAGE_KEY]: allData });
        
        // Badge update on icon
        chrome.action.setBadgeText({ text: `+${newCount}` });
        chrome.action.setBadgeBackgroundColor({ color: '#22C55E' });
        setTimeout(() => chrome.action.setBadgeText({ text: "" }), 3000);
    }
}