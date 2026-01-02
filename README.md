# Productivity Dashboard

A sleek, modern productivity dashboard designed to be your browser's homepage. Built with React, TypeScript, and Tailwind CSS, featuring dual themes and persistent task management.

## Features

### Task Management
- **Persistent tasks** saved to localStorage (never lose your tasks!)
- **Particle destruction animation** - 20 colorful particles burst when completing tasks
- **Smooth animations** powered by Framer Motion
- **Quick add** with keyboard shortcuts (Enter to submit)

### Quick Links
- **One-click access** to Claude, ChatGPT, Skool, and Gmail
- **Beautiful buttons** with hover animations
- Opens in new tabs for seamless workflow

### Real-Time Information
- **Live clock** with date display
- **Weather widget** showing temperature, humidity, wind speed, and UV index
- **Sunrise/sunset times** based on your location
- **Auto-refreshing** data

### Pomodoro Timer
- **Customizable timer** (default 25 minutes)
- **Visual progress ring** with smooth animations
- **Browser notifications** when complete
- **Play, pause, and reset** controls

### Dual Themes
- **Dark Mode** - Cool blue tones, perfect for daily use
- **Midnight Shift** - Deep black with red accents for late-night productivity
- **Toggle button** in top-right corner
- **Theme persistence** remembers your preference

### Compact Design
- **Everything fits on one screen** - no scrolling needed
- **Responsive layout** adapts to any screen size
- **Glass-morphism effects** for modern aesthetics

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Open-Meteo API** - Free weather data

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd ToDoThingy

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Set as Browser Homepage

### Chrome/Edge
1. Build the project: `npm run build`
2. Open `chrome://settings/` or `edge://settings/`
3. Go to "On startup"
4. Select "Open a specific page or set of pages"
5. Click "Add a new page"
6. Enter the path to `dist/index.html` (e.g., `file:///path/to/ToDoThingy/dist/index.html`)

**Alternative (Recommended):**
1. Deploy to a hosting service (Vercel, Netlify, GitHub Pages)
2. Set the deployed URL as your homepage

### Firefox
1. Build the project: `npm run build`
2. Open `about:preferences#home`
3. Under "Homepage and new windows"
4. Select "Custom URLs"
5. Enter the path to `dist/index.html`

### Deploy to GitHub Pages (Recommended)

```bash
# Build the project
npm run build

# Push dist folder to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

Then set `https://<username>.github.io/<repo-name>` as your homepage.

### Deploy to Vercel/Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy and use the URL as your homepage

## Browser Permissions

For full functionality, allow these permissions:

- **Location** - For accurate weather and sunrise/sunset times
- **Notifications** - For timer completion alerts

## Usage Tips

- **Add tasks**: Type and press Enter
- **Complete tasks**: Click the checkbox for particle animation
- **Delete tasks**: Hover over task and click X
- **Change timer**: Enter minutes and click "Set"
- **Switch themes**: Click moon/flame icon in top-right
- **Quick links**: Click any button to open in new tab

## Theme Modes

**Dark Mode (Default)**
- Cool blue/slate color scheme
- Perfect for daytime productivity
- Easy on the eyes

**Midnight Shift**
- Deep black background
- Red accent colors
- Ideal for late-night work sessions
- Reduces eye strain in darkness

## Project Structure

```
ToDoThingy/
├── src/
│   ├── components/
│   │   ├── TaskItem.tsx         # Task with particle animation
│   │   ├── TaskList.tsx         # Task manager with localStorage
│   │   ├── InfoBar.tsx          # Time, weather, sun times
│   │   ├── CompactTimer.tsx     # Pomodoro timer
│   │   ├── QuickLinks.tsx       # App shortcut buttons
│   │   └── ThemeToggle.tsx      # Theme switcher
│   ├── App.tsx                  # Main app layout
│   ├── main.tsx                 # Entry point
│   └── index.css                # Themes and global styles
├── index.html                   # HTML template
└── vite.config.ts              # Vite configuration
```

## Customization

### Add More Quick Links

Edit `src/components/QuickLinks.tsx`:

```typescript
const links: QuickLink[] = [
  { name: 'Your App', url: 'https://example.com', color: 'bg-purple-600 hover:bg-purple-700', midnightColor: 'bg-red-600 hover:bg-red-500' },
  // ... existing links
];
```

### Customize Colors

Edit `src/index.css` to change theme colors:

```css
/* Dark mode gradient */
body {
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 50%, #16213e 100%);
}

/* Midnight mode gradient */
body.midnight {
  background: linear-gradient(135deg, #000000 0%, #0d0d0d 50%, #1a0000 100%);
}
```

## Browser Extension Alternative

Want this as a new tab extension?

1. Build the project
2. Create `manifest.json` in the `dist` folder
3. Load as unpacked extension in Chrome

See the [New Tab Extension Guide](https://developer.chrome.com/docs/extensions/mv3/override/) for details.

## License

MIT

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## Support

If you encounter issues:
1. Check browser console for errors
2. Ensure location permissions are granted
3. Try clearing localStorage: `localStorage.clear()`
4. Rebuild the project: `npm run build`

## Credits

- Weather data: [Open-Meteo](https://open-meteo.com/)
- Icons: [Lucide](https://lucide.dev/)
- Fonts: [Inter](https://fonts.google.com/specimen/Inter)
