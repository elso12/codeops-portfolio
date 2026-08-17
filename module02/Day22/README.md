# Birr Watch - Live Exchange App

## Overview
Birr Watch is a single-page frontend application designed to show real-time exchange rates for the Ethiopian Birr (ETB). It features live API integration, a dynamic currency converter, a persistent personal watchlist, and full input validation.

## Features
- **Live Data Integration:** Fetches fresh exchange rates directly from the open ETB rates API (`https://open.er-api.com/v6/latest/ETB`).
- **Currency Conversion:** Instantly converts any user-specified ETB amount into selected global currencies with error handling and regex validation.
- **Watchlist Management:** Allows users to add and remove currencies with duplicate protection and event delegation.
- **State Persistence:** Automatically saves choices and the active watchlist to `localStorage` using serialized JSON.
- **Robust UI States:** Manages loading, success, and error paths via status indicators.

## Tech Stack
- **HTML5** (Semantic markup with explicit IDs matching state requirements)
- **CSS3** (Responsive design, modern gradients, and custom states)
- **JavaScript (ES6+)** (Async/await, fetch API, array mapping, event delegation)

## How to Run
1. Clone or download the repository to your local machine.
2. Open the `index.html` file directly in your browser, or run it via a local development environment like VS Code's **Live Server**.