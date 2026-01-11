
<div align="center">

  <!-- PROJECT LOGO (Optional, replacing with icon representation) -->
  <img src="https://raw.githubusercontent.com/khdxsohee/EMail-Miner-Pro/main/icons/icon128.png" alt="Logo" width="120" height="120">

  <!-- BADGES -->
  ![Version](https://img.shields.io/badge/version-6.12.10-blue.svg)
  ![Chrome](https://img.shields.io/badge/Chrome-Extension-green.svg)
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

  # EMail Miner Pro

  **The Enterprise-Level Smart Data Extraction Tool**

  [Features](#features) • [Installation](#installation) • [How It Works](#how-it-works) • [Credits](#credits)

</div>

---

## 📖 Overview

**EMail Miner Pro** is a powerful, enterprise-grade Google Chrome Extension designed to automate the lead generation process. It intelligently scans web pages to extract email addresses, names, and associated websites with high accuracy.

Unlike basic scrapers, EMail Miner Pro features a **Smart Linking Algorithm** that automatically connects email addresses to their correct websites, even when the data is scattered across the page (e.g., in Google Search results).

<div align="center">

[⬇️ Download Extension](https://github.com/khdxsohee/EMail-Miner-Pro/archive/refs/heads/main.zip)

</div>

---

## ✨ Features

*   **🔍 Smart Website Extraction:**
    *   **Verified Links:** Uses a 3-level verification system (Verified, Linked, Auto) to match emails with correct websites.
*   **🚀 Auto-Mining Mode:**
 A new "Set it and forget it" mode. Enable Auto-Mining to automatically extract emails from newly opened tabs in the background without lifting a finger.
*   **💾 Persistent Storage:**
    *   Data is saved locally in your browser. You can navigate between pages (Page 1 to Page 2), and the extension will accumulate data without losing previous results.
*   **🚫 Duplicate Filter:**
    *   Automatically prevents the same email from being added twice.
*   **📊 CSV Export:**
    *   Export your entire lead list to Excel/CSV format with a single click.
*   **🎨 Professional UI:**
    *   Clean, modern, and responsive interface designed for high productivity.
    *   Color-coded confidence badges (Verified, Linked, Auto).

---

## 🛠️ Installation

Since this is a custom developer tool, it requires a manual installation via Developer Mode in Chrome.

1.  **Download:** Download or clone this repository.
    ```bash
    git clone https://github.com/khdxsohee/EMail-Miner-Pro.git
    ```
2.  **Open Chrome Extensions:**
    *   Go to `chrome://extensions/` in your address bar.
3.  **Enable Developer Mode:**
    *   Toggle the switch in the top-right corner to **ON**.
4.  **Load Unpacked:**
    *   Click the **"Load unpacked"** button in the top-left.
5.  **Select Folder:**
    *   Select the folder where you saved the extension files.
6.  **Pin It:**
    *   Click the puzzle icon in Chrome and pin **EMail Miner Pro** for easy access.

---

## 🚀 How It Works (Smart Extraction)

EMail Miner Pro uses advanced logic to clean up your data. Here is a practical example of how it handles raw data:

> **Example Scenario:**
> You search Google for: `@gmail.com` `store` `pakistan`.
> You see a search result containing:
> *   *Text:* "Contact Skin Store Pakistan at skinstorepakistan@gmail.com for orders."
> *   *Link:* [Visit Website](https://www.skinstorepakistan.com)

**What EMail Miner Pro does:**

1.  **Extraction:** It detects `skinstorepakistan@gmail.com` and `skinstorepakistan`.
2.  **Logic Processing:**
    *   It checks if the email domain (`gmail.com`) exists in the links? **No.**
    *   It searches the page for links containing the username keyword `skinstorepakistan`. **Found!**
3.  **Result:**
    *   **Email:** `skinstorepakistan@gmail.com`
    *   **Website:** `https://www.skinstorepakistan.com`
    *   **Confidence:** Linked (Blue Badge)

This ensures your CSV file contains actual clickable business websites, not just generic domains.

---

## 📸 Screenshots

<img width="395" height="558" alt="image" src="https://github.com/user-attachments/assets/8201c75c-1126-4c06-810e-712673dd98b9" />


1.  **Dashboard View:** Modern table showing extracted leads.
2.  **Smart Action:** Clicking "Mine Data" on a Google Search page.
3.  **Export:** Clean CSV formatting.

---

## 📂 File Structure

```text
EMail-Miner-Pro/
├── icons/              # Extension ICONS
    └── icon16.png
    └── icon48.png
    └── icon128.png
├── manifest.json       # Extension configuration
├── popup.html          # User Interface (HTML/CSS)
├── popup.js            # Core Logic & Extraction Script
└── README.md           # Documentation
```

---

## ⚙️ Tech Stack

*   **Vanilla JavaScript:** No frameworks, for maximum performance and speed.
*   **Chrome Extension Manifest V3:** The latest and most secure extension standard.
*   **CSS3:** Custom enterprise-grade styling without external libraries.

---

## 📝 Usage Guide

1.  Open a website or search engine (e.g., Google).
2.  Click the **EMail Miner Pro** icon.
3.  Click the **"Mine Email Data"** button.
4.  The extension will instantly scan the visible text and links.
5.  Navigate to "Page 2" of your search and click "Mine Email Data" again. The new data will be added to the existing list.
6.  When finished, click **"Export CSV"** to download your data.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Credits

<div align="center">

**Developed & Maintained by**

**[Khalid Software House](https://khalid-software-house.web.app)**

*Enterprise Software Solutions*

</div>

---



