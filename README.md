# BitScope — Visual Bitcoin Explorer & Intelligence Dashboard

**A modern Bitcoin explorer that transforms raw blockchain data into an interactive intelligence dashboard.**

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

BitScope reimagines how Bitcoin data is explored. Instead of dense tables and raw hexadecimal data, it presents transaction flow, address behavior, mempool dynamics, and block activity through a clean, responsive interface.

Powered by the Blockstream public API and built with a modern frontend stack, BitScope feels like a Bitcoin intelligence dashboard rather than a traditional block explorer.

---

## Key Features

### Transaction Intelligence
- Visual input → output flow
- Fee, size, fee-rate, and confirmation status
- Instant examples from live mempool transactions

### Address Intelligence
- BTC received vs spent overview
- Recent transaction history
- Behavioral risk scoring heuristic
- Wallet activity summary

### Block Explorer
- Real-time latest blocks feed
- Block height navigation
- Block statistics dashboard

### Mempool Intelligence
- Live unconfirmed transactions
- Fee priority classification (Low / Medium / High)
- Fee distribution chart (sat/vB buckets)

### UI / UX
- Glassmorphism card design
- Dark / Light theme toggle
- Fully responsive layout
- Tailwind v4 design tokens

---

## Tech Stack

| Layer        | Technology                             |
|-------------|-----------------------------------------|
| Framework   | Next.js 16 (App Router, Turbopack)     |
| Language    | TypeScript (strict mode)               |
| Styling     | Tailwind CSS v4                        |
| Charts      | Recharts                               |
| Icons       | Lucide                                 |
| Data Source | Blockstream Bitcoin API                |

---

## Architecture

    app/
      address/
      block/
      blocks/
      mempool/
      tx/
    components/
      AddressDashboard.tsx
      TransactionDashboard.tsx
      LatestBlocks.tsx
      MempoolFeed.tsx
      MempoolFeeChart.tsx
      Navbar.tsx
      ThemeToggle.tsx

---

## Screenshots

_Add screenshots here_

- Transaction Flow View
- Address Intelligence Dashboard
- Mempool Fee Chart
- Latest Blocks Feed

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm / npm / yarn

### Installation

```bash
git clone https://github.com/your-username/bitscope.git
cd bitscope
pnpm install
pnpm dev
 ``` 
 
http://localhost:3000



## Usage Examples

You can explore BitScope by searching:

- **Block height:** 840000
- **Any transaction hash**
- **Bitcoin Genesis address:** 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

---

## What Makes BitScope Different

Traditional explorers show raw blockchain data.

**BitScope shows blockchain intelligence** through visualization and thoughtful UI.

Designed for:

- Security analysts
- Blockchain researchers
- Developers
- Hackathon judges and recruiters

---

## Future Improvements

- Address clustering heuristics
- Whale movement detection
- Historical fee trend analysis
- Export transaction graph as image
- Lightning Network statistics
- Performance caching layer

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with a clear description

Ensure code is typed, formatted, and consistent with the existing structure.