# Ledgify — Smart Books. Happy Business.
**Free offline desktop accounting for Indian traders, retailers & manufacturers**

---

## What is Ledgify?
Ledgify is a free, fully offline desktop app that replaces Tally / Vyapar / MyBillBook for businesses with ₹2–15 Cr annual revenue. No cloud, no subscription, no data leaving your computer.

---

## Quick Setup (5 minutes)

### Step 1 — Install Node.js
Download and install from: **https://nodejs.org** → Click "LTS" version → Install normally

### Step 2 — Download Ledgify
Download this folder to your computer (or clone from GitHub).

### Step 3 — Open Terminal / Command Prompt
- **Mac:** Press `Cmd + Space`, type "Terminal", press Enter
- **Windows:** Press `Windows key`, type "cmd", press Enter

### Step 4 — Navigate to Ledgify folder
```bash
cd /path/to/ledgify
# Example Mac: cd ~/Downloads/ledgify
# Example Windows: cd C:\Users\YourName\Downloads\ledgify
```

### Step 5 — Install and Run
```bash
npm install
npm start
```

The Ledgify app will open on your screen! 🎉

---

## Build Installer (to share with others)

### macOS (Universal — works on Intel + M1/M2/M3/M4)
```bash
npm run build:mac-universal
```
Output: `dist/Ledgify-*.dmg` — double-click to install

### Windows
```bash
npm run build:win
```
Output: `dist/Ledgify-Setup-*.exe` — double-click to install

---

## Features
- 📄 **GST Invoicing** — CGST/SGST/IGST auto-calculated, HSN codes
- 📦 **Inventory** — Stock tracking, reorder alerts
- 👥 **Khata** — Customer ledger, WhatsApp reminders
- 🏛 **GST Returns** — GSTR-1, GSTR-3B summary, 2B reconciliation
- 🏦 **Bank Reconciliation** — Match statements to invoices
- 📊 **Reports** — P&L, Balance Sheet, Stock Report
- 🧑‍💼 **CA Connect** — Export complete books for your CA
- 🗣 **13 Languages** — Hindi, Gujarati, Tamil, Telugu + more
- 🔒 **100% Offline** — No internet, no cloud, no fees

---

## Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Quick action palette |
| `Ctrl+N` / `Cmd+N` | New Invoice |
| `Escape` | Close modal / palette |

---

## Data & Backup
- All data stored locally on your computer
- Go to **Settings → Backup & Data → Backup Now** regularly
- Backup file: `Ledgify_Backup_YYYY-MM-DD.json`
- To restore: **Settings → Restore from Backup**

---

## Supported Systems
| Platform | Requirement |
|----------|-------------|
| macOS Intel | macOS 10.15 (Catalina) or newer |
| macOS Apple Silicon (M1/M2/M3/M4) | Any macOS |
| Mac Mini / iMac | Any Intel or Apple Silicon |
| Windows | Windows 10 or Windows 11 |

---

## Troubleshooting

**"npm: command not found"**
→ Node.js not installed. Go to https://nodejs.org and install LTS version.

**App doesn't open after `npm start`**
→ Run `npm install` first. If error persists, run `npm install --legacy-peer-deps`

**White screen on startup**
→ Wait 5–10 seconds. First load installs dependencies. If persists, run `npm start` again.

**Data not saving**
→ App needs write permission to your home folder. On Mac, check System Preferences → Security.

---

## For Your CA
Go to **CA Connect** in the app → **Export CA Package** → Send the `.json` file to your CA.

---

## License
Free to use. Open source. Built with ❤️ for Indian businesses.

**Ledgify by LedgerLift** · Smart Books. Happy Business.
