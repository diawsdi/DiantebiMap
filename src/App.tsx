import { Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MapEditor from './components/MapEditor';
import ProjectLibrary from './components/ProjectLibrary';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading app resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2>Loading DiantebiMap</h2>
      </div>
    );
  }

  return (
    <MantineProvider
      theme={{
        colorScheme: theme,
        fontFamily: 'Inter, sans-serif',
        primaryColor: 'blue',
      }}
    >
      <div className={`app ${theme}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectLibrary />} />
          <Route path="/editor/:id" element={<MapEditor />} />
          <Route path="/editor/new" element={<MapEditor />} />
        </Routes>
      </div>
    </MantineProvider>
  );
} 