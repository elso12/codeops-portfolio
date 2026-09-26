# Module 03 - Day 06: Mesob House Web Application

## Overview
Mesob House is a React web application for a restaurant digital dining system built using React, Vite, Zustand, and React Hook Form with Zod validation.

## Tech Stack
- React 19
- Vite 6
- Zustand 5
- React Hook Form 7 & Zod 3
- Vanilla CSS3
- Oxlint

## Features
- Menu display with category, search, and dietary filtering.
- Shopping cart with dine-in, delivery, and takeaway options.
- Order tracking system.
- Table reservation form with validation.
- Customer review submission system.
- Privacy and legal modal views.

## Project Structure

```text
src/
├── assets/         # Static media assets
├── components/     # React UI components
├── context/        # React context providers
├── services/       # API services and data helpers
├── store/          # Zustand state management
├── utils/          # Form validation schemas
├── App.css         # Component styling
├── App.jsx         # Root component
├── index.css       # Global styles
└── main.jsx        # Entry point
```

## Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Run linter:
   ```bash
   npm run lint
   ```

4. Build for production:
   ```bash
   npm run build
   ```
