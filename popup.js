// --- VARIABLES ---
let allData = [];
const STORAGE_KEY = 'leadsync_data_v2';

// --- DOM ELEMENTS ---
const extractBtn = document.getElementById('extractBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const countSpan = document.getElementById('count');
const statusSpan = document.getElementById('status');
const toastEl = document.getElementById('toast');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// --- EVENT LISTENERS ---
extractBtn.addEventListener('click', handleExtraction);
exportBtn.addEventListener('click', exportToCSV);
clearBtn.addEventListener('click', () => {
    if(allData.length === 0) return;
    if(confirm("Clear all extracted records?")) {
        allData = [];
        saveData();
        renderTable();
        showToast("All data cleared");
    }
});

// --- CORE FUNCTIONS ---

function loadData() {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (result[STORAGE_KEY]) {
            allData = result[STORAGE_KEY];
        }
        renderTable();
    });
}

function saveData() {
    chrome.storage.local.set({ [STORAGE_KEY]: allData });
    updateStats();
}

// 3. SMART EXTRACTION LOGIC
async function handleExtraction() {
    // UI Loading
    extractBtn.disabled = true;
    const originalText = extractBtn.innerHTML;
    extractBtn.innerHTML = "Analyzing...";
    statusSpan.textContent = "Scanning content...";

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: scrapePageContentAdvanced,
        });

        if (results && results[0] && results[0].result) {
            processResults(results[0].result);
        }
    } catch (error) {
        console.error(error);
        showToast("Error scanning page");
    } finally {
        extractBtn.disabled = false;
        extractBtn.innerHTML = originalText;
    }
}

// 4. ADVANCED SCRAPER (The Key Fix)
function scrapePageContentAdvanced() {
    // 1. Find Emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const text = document.body.innerText;
    const emails = text.match(emailRegex) || [];

    // 2. Gather all Links with their text context
    // We need both href and the text inside <a> to match keywords
    const linksData = Array.from(document.querySelectorAll('a[href]')).map(a => {
        return {
            url: a.href,
            text: a.innerText.toLowerCase().trim(),
            hostname: a.hostname
        };
    }).filter(l => l.hostname.length > 3); // filter out empty anchors

    return {
        emails,
        linksData,
        pageTitle: document.title,
        currentUrl: window.location.href
    };
}

// 5. SMART PROCESSING (Keyword Matching)
function processResults(data) {
    let newCount = 0;
    
    data.emails.forEach(email => {
        const exists = allData.some(item => item.email === email);
        
        if (!exists) {
            let name = email.split('@')[0];
            name = name.charAt(0).toUpperCase() + name.slice(1);
            
            let websiteUrl = "";
            let confidence = "auto"; // 'verified', 'linked', 'auto'
            
            const domain = email.split('@')[1];
            const username = email.split('@')[0]; // e.g. "skinstorepakistan"

            // --- LEVEL 1: Verified (Exact Domain Match) ---
            const exactLink = data.linksData.find(l => l.hostname.includes(domain));
            if (exactLink) {
                websiteUrl = exactLink.url;
                confidence = "verified";
            }
            // --- LEVEL 2: Linked (Smart Keyword Match for Gmail/Yahoo users) ---
            // If email is user@gmail.com, search for links containing "user" in the link text
            // Only do this if username is longer than 5 chars to avoid generic matches like "info"
            else if (username.length > 5) {
                const keywordLink = data.linksData.find(l => 
                    l.text.includes(username) || l.hostname.includes(username)
                );
                if (keywordLink) {
                    websiteUrl = keywordLink.url;
                    confidence = "linked";
                }
            }
            // --- LEVEL 3: Auto (Construction) ---
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
                confidence: confidence
            });
            newCount++;
        }
    });

    saveData();
    renderTable();
    
    if (newCount > 0) {
        statusSpan.textContent = `Synced ${newCount} records`;
        showToast(`Successfully synced ${newCount} leads`);
    } else {
        statusSpan.textContent = "No new emails found";
        showToast("No new emails detected");
    }
}

// 6. RENDER TABLE
function renderTable() {
    tableBody.innerHTML = '';
    
    if (allData.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        [...allData].reverse().forEach(item => {
            const row = document.createElement('tr');
            
            // Determine Badge Text & Class
            let badgeClass = 'badge-auto';
            let badgeText = 'Auto';
            if(item.confidence === 'verified') { badgeClass = 'badge-verified'; badgeText = 'Verified'; }
            if(item.confidence === 'linked') { badgeClass = 'badge-linked'; badgeText = 'Linked'; }

            row.innerHTML = `
                <td>
                    <span class="email-cell">${item.email}</span>
                    <span class="name-cell">${item.name}</span>
                </td>
                <td>
                    <div class="web-cell">
                        <a href="${item.website}" target="_blank">
                            ${item.website.replace('https://','').replace('http://','')}
                        </a>
                        <span class="badge ${badgeClass}">${badgeText}</span>
                    </div>
                    <div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">${item.source.substring(0, 25)}...</div>
                </td>
                <td>
                    <div class="action-btn" onclick="deleteItem(${item.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    updateStats();
}

// 7. DELETE ITEM
window.deleteItem = function(id) {
    allData = allData.filter(item => item.id !== id);
    saveData();
    renderTable();
}

// 8. EXPORT CSV
function exportToCSV() {
    if (allData.length === 0) {
        showToast("No data to export");
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Email,Website,Source,Confidence\n"; 
    allData.forEach(row => {
        let safeName = row.name.replace(/,/g, " ");
        let safeWeb = row.website.replace(/,/g, " ");
        let safeSource = row.source.replace(/,/g, " ");
        csvContent += `${safeName},${row.email},${safeWeb},${safeSource},${row.confidence}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leadsync_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV downloaded");
}

function updateStats() {
    countSpan.textContent = `${allData.length} Records`;
}

function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}