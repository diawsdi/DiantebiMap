# DiantebiMap

A modern, intuitive web mapping application that simplifies the GIS experience with a clean, user-friendly interface.

## Features

- **Clean, Minimal Interface** - Focus on what matters with a beautifully designed UI
- **Interactive Map Experience** - Smooth navigation and real-time interaction
- **Layer Management** - Easily manage multiple data layers with intuitive controls
- **Visual Customization** - Style your maps with a powerful yet simple styling interface
- **Project Library** - Manage all your maps in one organized dashboard
- **Modern UI/UX** - Responsive design works across devices

## Tech Stack

- **React** - Front-end UI library
- **TypeScript** - Type-safe JavaScript
- **Mapbox GL JS** - Powerful mapping library
- **Styled Components** - Component-level styling
- **React Router** - Navigation and routing
- **Framer Motion** - Smooth animations
- **Mantine** - UI component library
- **Zustand** - State management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/diantebimap.git
cd diantebimap
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file and add your Mapbox token:
```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Start the development server:
```
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
diantebimap/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # React components
│   │   ├── common/      # Reusable components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
└── package.json         # Dependencies and scripts
```

## Development

### Building for Production

```
npm run build
```

The built files will be in the `dist` directory and can be served by any static file server.

## License

MIT

## Acknowledgements

- [Mapbox](https://www.mapbox.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)# DiantebiMap
