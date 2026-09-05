# Mimoto

Motorcycle maintenance and rider utility app built with React Native and Expo.

## Getting Started

```bash
npm install
npm start
```

Scan the QR code with Expo Go on your device, or press `w` to open in the browser.

## Project Structure

```
app/
  (tabs)/
    index.tsx       # Dashboard
    log-book.tsx    # Log Book
    records.tsx     # Scanner / Records
    rider-hub.tsx   # Rider Hub
    garage.tsx      # Garage (+ Digital Glovebox)
lib/
  database.ts       # SQLite setup, queries, seed
  seed/             # Honda Click 125 v4 template
context/
  DatabaseContext.tsx
components/
  garage/           # Garage screen cards
  ui/               # Shared UI (Card, etc.)
```

## Development Phases

- **Phase 1** — Project setup & base navigation ✓
- **Phase 2** — Database, Garage screen, Honda Click 125 v4 template ✓
- **Phase 3** — Dashboard & Log Book
- **Phase 4** — Rider Hub & Safe Rider Streak
- **Phase 5** — Digital Glovebox uploads, Scanner, Push Notifications

## Phase 2: Garage

The **Garage** tab includes:

- **Bike Profile** — editable Make & Model (defaults to Honda Click 125 v4)
- **Maintenance Schedule** — seeded service intervals from the OEM template
- **OEM Part Rolodex** — add, edit, and delete part numbers
- **Digital Glovebox** — placeholder rows for registration, insurance, and license (Phase 5)

Data persists locally via **expo-sqlite**.
