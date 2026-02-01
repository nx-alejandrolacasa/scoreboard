# Scoreboard PWA

A simple score tracking PWA for matches/games. Built with Astro + React + Tailwind CSS.

## Project Structure

- `src/components/ScoreTracker.tsx` - Main React component with score areas, color pickers, team names
- `src/layouts/Layout.astro` - HTML layout with PWA meta tags
- `src/styles/global.css` - Global styles including iOS PWA fixes
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## iOS PWA Full-Screen Recipe

### 1. Meta Tags (in Layout.astro)
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" content="#yourcolor" />
```

### 2. CSS Hack (global.css)
```css
html {
  /* Extends document height to fill the gap at bottom */
  min-height: calc(100% + env(safe-area-inset-top));
  display: flex;
  flex-direction: column;
}

body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}
```

### 3. Safe Area Padding (on content sections)
```css
padding-top: env(safe-area-inset-top, 0px);    /* for top section */
padding-bottom: env(safe-area-inset-bottom, 0px); /* for bottom section */
```

### 4. Dynamic Theme Color (JavaScript)
```javascript
// Update status bar color dynamically
document.querySelector('meta[name="theme-color"]').setAttribute("content", newColor);

// Set body background to match bottom area (fills home indicator region)
document.body.style.backgroundColor = bottomColor;
```

**Key insight**: The `min-height: calc(100% + env(safe-area-inset-top))` hack compensates for iOS moving the viewport up when using `black-translucent` status bar.

## Features

- Tap anywhere on a section to increment score
- Minus button to decrement
- Color picker for each team
- Editable team names
- Screen wake lock (keeps display on)
- Dynamic status bar color matching top section
- Works as installed PWA on iOS with full-screen support
