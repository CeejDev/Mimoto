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
    glovebox.tsx    # Digital Glovebox
    records.tsx     # Scanner / Records
    garage.tsx      # Garage
    rider-hub.tsx   # Rider Hub
constants/
  Theme.ts          # Design tokens (colors, spacing)
components/
  ScreenContainer.tsx
```

## Development Phases

- **Phase 1** — Project setup & base navigation (current)
- **Phase 2** — Database, Garage screen, Honda Click 125 v4 template
- **Phase 3** — Dashboard & Log Book
- **Phase 4** — Rider Hub & Safe Rider Streak
- **Phase 5** — Digital Glovebox, Scanner, Push Notifications
