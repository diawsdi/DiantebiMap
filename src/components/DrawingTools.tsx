import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { MapRef } from 'react-map-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {
  IconMapPin,
  IconLine,
  IconPolygon,
  IconSelect,
  IconTrash,
  IconEditCircle,
  IconCut
} from '@tabler/icons-react';

// Instead of augmenting the module, create a custom type that extends MapboxDraw
type ExtendedMapboxDraw = MapboxDraw & {
  getSelectedIds(): string[];
}

interface DrawingToolsProps {
  mapRef: React.RefObject<MapRef>;
}

// Styled components
const ToolsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-background);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 8px;
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const ToolButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? 'var(--color-primary-light)' : 'var(--color-background)')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text)')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-border)')};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ $active }) => ($active ? 'var(--color-primary-light)' : 'var(--color-background-secondary)')};
  }
`;

const Divider = styled.div`
  width: 1px;
  height: auto;
  background: var(--color-border);
  margin: 0 4px;
`;

const DrawingTools: React.FC<DrawingToolsProps> = ({ mapRef }) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const drawInstance = useRef<ExtendedMapboxDraw | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<ExtendedMapboxDraw | null>(null);
  const [hasSelection, setHasSelection] = useState(false);

  // Initialize drawing tools when map is ready
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    mapInstanceRef.current = map;
    
    // Check if draw control already exists and remove it first to prevent duplicates
    if (drawInstance.current) {
      try {
        map.removeControl(drawInstance.current);
      } catch (e) {
        console.warn("Could not remove existing draw control", e);
      }
    }
    
    // Create a new MapboxDraw instance with custom styles
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Add styles for drawing features
      styles: [
        {
          'id': 'gl-draw-polygon-fill-inactive',
          'type': 'fill',
          'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          'paint': {
            'fill-color': '#3bb2d0',
            'fill-outline-color': '#3bb2d0',
            'fill-opacity': 0.1
          }
        },
        {
          'id': 'gl-draw-polygon-fill-active',
          'type': 'fill',
          'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          'paint': {
            'fill-color': '#fbb03b',
            'fill-outline-color': '#fbb03b',
            'fill-opacity': 0.1
          }
        },
        {
          'id': 'gl-draw-polygon-midpoint',
          'type': 'circle',
          'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
          'paint': {
            'circle-radius': 3,
            'circle-color': '#fbb03b'
          }
        },
        {
          'id': 'gl-draw-polygon-stroke-inactive',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#3bb2d0',
            'line-width': 2
          }
        },
        {
          'id': 'gl-draw-polygon-stroke-active',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#fbb03b',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        {
          'id': 'gl-draw-line-inactive',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#3bb2d0',
            'line-width': 2
          }
        },
        {
          'id': 'gl-draw-line-active',
          'type': 'line',
          'filter': ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#fbb03b',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        {
          'id': 'gl-draw-point-point-stroke-inactive',
          'type': 'circle',
          'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['==', 'meta', 'vertex'], ['!=', 'mode', 'static']],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#fff',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#3bb2d0'
          }
        },
        {
          'id': 'gl-draw-point-inactive',
          'type': 'circle',
          'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['==', 'meta', 'feature'], ['!=', 'mode', 'static']],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#3bb2d0'
          }
        },
        {
          'id': 'gl-draw-point-stroke-active',
          'type': 'circle',
          'filter': ['all', ['==', '$type', 'Point'], ['==', 'active', 'true'], ['!=', 'meta', 'midpoint']],
          'paint': {
            'circle-radius': 7,
            'circle-color': '#fff',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fbb03b'
          }
        },
        {
          'id': 'gl-draw-point-active',
          'type': 'circle',
          'filter': ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint'], ['==', 'active', 'true']],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#fbb03b'
          }
        },
        {
          'id': 'gl-draw-polygon-fill-static',
          'type': 'fill',
          'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
          'paint': {
            'fill-color': '#404040',
            'fill-outline-color': '#404040',
            'fill-opacity': 0.1
          }
        },
        {
          'id': 'gl-draw-polygon-stroke-static',
          'type': 'line',
          'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#404040',
            'line-width': 2
          }
        },
        {
          'id': 'gl-draw-line-static',
          'type': 'line',
          'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#404040',
            'line-width': 2
          }
        },
        {
          'id': 'gl-draw-point-static',
          'type': 'circle',
          'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#404040'
          }
        }
      ]
    });

    // Add the draw control to the map
    map.addControl(draw);
    drawInstance.current = draw as ExtendedMapboxDraw;
    drawRef.current = draw as ExtendedMapboxDraw;

    // Set up event handlers after adding the control
    const onDrawCreate = () => {
      console.log('Feature created');
      // Reset active button after drawing is complete
      setActiveButton(null);
    };
    
    const onDrawUpdate = () => {
      console.log('Feature updated');
    };
    
    const onDrawDelete = () => {
      console.log('Feature deleted');
    };
    
    const onDrawSelectionChange = () => {
      // Update UI to reflect selected features
      handleSelectedFeaturesChange();
    };
    
    const onDrawModeChange = (e: any) => {
      console.log('Mode changed:', e.mode);
      // Update button state based on current mode
      if (e.mode === 'simple_select' && activeButton !== 'select' && activeButton !== 'edit') {
        setActiveButton('select');
      }
    };

    map.on('draw.create', onDrawCreate);
    map.on('draw.update', onDrawUpdate);
    map.on('draw.delete', onDrawDelete);
    map.on('draw.selectionchange', onDrawSelectionChange);
    map.on('draw.modechange', onDrawModeChange);

    // Remove draw control and event listeners on cleanup
    return () => {
      if (map) {
        map.off('draw.create', onDrawCreate);
        map.off('draw.update', onDrawUpdate);
        map.off('draw.delete', onDrawDelete);
        map.off('draw.selectionchange', onDrawSelectionChange);
        map.off('draw.modechange', onDrawModeChange);
        
        if (draw) {
          try {
            map.removeControl(draw);
          } catch (e) {
            console.warn("Error removing draw control during cleanup", e);
          }
        }
      }
    };
  }, [mapRef]); // Only re-run if mapRef changes

  // Handle tool button clicks
  const handleToolClick = (mode: string) => {
    if (!drawInstance.current || !mapInstanceRef.current) return;
    
    // If clicking the same mode, deactivate it
    if (activeButton === mode) {
      drawInstance.current.changeMode('simple_select');
      setActiveButton(null);
      return;
    }
    
    setActiveButton(mode);
    
    try {
      switch (mode) {
        case 'select':
          drawInstance.current.changeMode('simple_select');
          break;
        case 'edit':
          // First try to get the selected features
          const selectedFeatures = drawInstance.current.getSelectedIds();
          // If there's a selected feature, go into direct_select mode
          if (selectedFeatures.length) {
            drawInstance.current.changeMode('direct_select', { featureId: selectedFeatures[0] });
          } else {
            // Otherwise, just enable selection
            drawInstance.current.changeMode('simple_select');
          }
          break;
        case 'point':
          drawInstance.current.changeMode('draw_point');
          break;
        case 'line':
          drawInstance.current.changeMode('draw_line_string');
          break;
        case 'polygon':
          drawInstance.current.changeMode('draw_polygon');
          break;
        default:
          drawInstance.current.changeMode('simple_select');
      }
    } catch (error) {
      console.error('Error changing drawing mode:', error);
      // Reset active button if mode change fails
      setActiveButton(null);
    }
  };

  // Delete selected features
  const handleDelete = () => {
    if (!drawRef.current || !mapRef.current) return;
    
    // Use the ExtendedMapboxDraw type instead of type assertion
    const selectedIds = drawRef.current.getSelectedIds();
    if (selectedIds.length) {
      drawRef.current.delete(selectedIds);
    }
  };

  // Delete all features
  const deleteAll = () => {
    if (!drawInstance.current) return;
    drawInstance.current.deleteAll();
  };

  const handleSelectedFeaturesChange = () => {
    if (!drawRef.current) return;
    
    // Use the ExtendedMapboxDraw type instead of type assertion
    const selectedIds = drawRef.current.getSelectedIds();
    setHasSelection(selectedIds.length > 0);
  };

  const checkSelection = () => {
    if (!drawRef.current) return false;
    
    // Use the ExtendedMapboxDraw type instead of type assertion
    const selectedIds = drawRef.current.getSelectedIds();
    return selectedIds.length > 0;
  };

  return (
    <ToolsContainer>
      <ToolButton 
        $active={activeButton === 'select'} 
        onClick={() => handleToolClick('select')}
        title="Select"
      >
        <IconSelect size={20} />
      </ToolButton>
      
      <ToolButton 
        $active={activeButton === 'edit'} 
        onClick={() => handleToolClick('edit')}
        title="Edit"
      >
        <IconEditCircle size={20} />
      </ToolButton>
      
      <Divider />
      
      <ToolButton 
        $active={activeButton === 'point'} 
        onClick={() => handleToolClick('point')}
        title="Add Point"
      >
        <IconMapPin size={20} />
      </ToolButton>
      
      <ToolButton 
        $active={activeButton === 'line'} 
        onClick={() => handleToolClick('line')}
        title="Add Line"
      >
        <IconLine size={20} />
      </ToolButton>
      
      <ToolButton 
        $active={activeButton === 'polygon'} 
        onClick={() => handleToolClick('polygon')}
        title="Add Polygon"
      >
        <IconPolygon size={20} />
      </ToolButton>
      
      <Divider />
      
      <ToolButton 
        onClick={handleDelete}
        title="Delete Selected"
      >
        <IconTrash size={20} />
      </ToolButton>
      
      <ToolButton 
        onClick={deleteAll}
        title="Delete All"
      >
        <IconCut size={20} />
      </ToolButton>
    </ToolsContainer>
  );
};

export default DrawingTools; 