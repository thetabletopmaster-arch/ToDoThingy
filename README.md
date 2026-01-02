# Productivity Dashboard

A beautiful, cozy, and professional productivity dashboard built with React, TypeScript, and Tailwind CSS. Stay focused, organized, and on track with this all-in-one productivity tool.

## Features

### Task Management
- **Add and manage tasks** with an intuitive interface
- **Beautiful destruction animation** when completing tasks
- **Delete tasks** with a simple click
- Tasks persist during the session

### Time Display
- **Real-time clock** showing current time with date
- Updates every second for accurate timekeeping

### Sunrise & Sunset Times
- **Automatic location detection** using browser geolocation
- **Daily sunrise and sunset times** for your location
- Beautiful sunrise/sunset icons

### Timer
- **Customizable countdown timer** (default 25 minutes - perfect for Pomodoro technique)
- **Visual progress indicator** with circular animation
- **Play, pause, and reset controls**
- **Browser notifications** when timer completes (with permission)

### Design
- **Cozy warm color palette** with subtle gradients
- **Glass-effect UI components** for a modern, professional look
- **Smooth animations** powered by Framer Motion
- **Fully responsive** - works great on desktop and mobile
- **Clean typography** using Inter font family

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ToDoThingy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173` (or the URL shown in terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Browser Permissions

For the best experience, allow the following permissions when prompted:

- **Location** - For accurate sunrise/sunset times
- **Notifications** - For timer completion alerts

## Usage Tips

- **Tasks**: Click the plus button or press Enter to add a new task
- **Timer**: Set your desired minutes and click play to start
- **Completion**: Watch the satisfying destruction animation when you complete a task!

## Development

### Project Structure

```
ToDoThingy/
├── src/
│   ├── components/
│   │   ├── TaskItem.tsx       # Individual task with animations
│   │   ├── TaskList.tsx       # Task list manager
│   │   ├── CurrentTime.tsx    # Real-time clock
│   │   ├── SunriseSunset.tsx  # Sunrise/sunset display
│   │   └── Timer.tsx          # Countdown timer
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles and Tailwind config
├── index.html                 # HTML template
└── vite.config.ts             # Vite configuration
```

### Customization

You can customize the color palette by editing the `@theme` section in `src/index.css`:

```css
@theme {
  --color-warm-50: #fdf8f6;
  --color-warm-100: #f2e8e5;
  /* ... more colors */
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
