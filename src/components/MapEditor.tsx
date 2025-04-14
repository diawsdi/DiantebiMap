import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Map, { MapRef, NavigationControl, Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DrawingTools from './DrawingTools';
import { 
  IconAdjustments, 
  IconDownload, 
  IconChevronLeft, 
  IconChevronRight, 
  IconPlus, 
  IconTrash, 
  IconEye, 
  IconEyeOff, 
  IconPencil, 
  IconColorPicker,
  IconUpload,
  IconDatabase,
  IconMap,
  IconBrush,
  IconFilter,
  IconLayoutList,
  IconPhoto,
  IconSettings,
  IconRuler,
  IconDeviceFloppy,
  IconFileExport,
  IconShare,
  IconEdit,
  IconStack2,
  IconArrowsExchange2,
  IconCheck,
  IconLayersIntersect as IconLayers,
  IconMapPin,
  IconLine,
  IconPolygon,
  IconRectangle,
  IconCircle,
  IconSelect,
  IconEditCircle,
  IconCut,
  IconRuler2,
  IconRulerMeasure,
  IconArrowsSplit2,
  IconArrowMerge,
  IconEraser,
  IconCirclePlus,
  IconCircleMinus,
  IconTargetArrow,
  IconLayersDifference,
  IconBorderAll,
  IconBorderStyle2,
  IconBorderRadius
} from '@tabler/icons-react';
import { HexColorPicker } from 'react-colorful';
import { useTheme } from '../context/ThemeContext';
import { mockGeoJSONData } from '../data/mockData';
import ImportDataModal from './ImportDataModal';

// Temporary API token - in production, this should be properly secured
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWJkb3VsYXllZGlhdyIsImEiOiJjbDEyM2g2NnIwMXB3M2NvM3h1NG9jNHlvIn0.x2XSx5TEfjozyDQwgK55Ag';

// Sidebar tabs
enum SidebarTab {
  LAYERS = 'layers',
  DATA_SOURCES = 'dataSources',
  STYLING = 'styling',
  PROPERTIES = 'properties',
  ANALYSIS = 'analysis',
  LEGEND = 'legend',
  BASEMAPS = 'basemaps',
  EXPORT = 'export',
  SETTINGS = 'settings',
  TOOLS = 'tools'
}

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const TopBar = styled.div`
  height: 60px;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 10;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const SidePanel = styled.div<{ $isOpen: boolean }>`
  width: ${({ $isOpen }) => ($isOpen ? '350px' : '0')};
  height: 100%;
  overflow-y: auto;
  transition: width 0.3s ease;
  background: var(--color-background);
  border-right: 1px solid var(--color-border);
  z-index: 5;
  display: flex;
  flex-direction: column;
`;

const TabContainer = styled.div`
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background-secondary);

  /* Hide scrollbar */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  height: 70px;
  padding: 0.5rem;
  background: ${({ $active }) => ($active ? 'var(--color-background)' : 'var(--color-background-secondary)')};
  border: none;
  border-bottom: ${({ $active }) => ($active ? '3px solid var(--color-primary)' : '3px solid transparent')};
  border-right: 1px solid var(--color-border);
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text)')};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-background);
    color: var(--color-primary);
  }
  
  svg {
    margin-bottom: 0.25rem;
  }
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProjectName = styled.h1`
  font-size: 1.25rem;
  margin: 0;
  color: var(--color-text);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-background-secondary);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius);
  background: transparent;
  border: 1px solid var(--color-border);
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-background-secondary);
  }
`;

const SidePanelToggle = styled.button<{ $isOpen: boolean }>`
  position: absolute;
  top: 10px;
  left: ${({ $isOpen }) => ($isOpen ? '350px' : '0')};
  width: 24px;
  height: 40px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-left: ${({ $isOpen }) => ($isOpen ? '1px solid var(--color-border)' : 'none')};
  border-radius: ${({ $isOpen }) => ($isOpen ? '0 4px 4px 0' : '0 4px 4px 0')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: left 0.3s ease;
  
  &:hover {
    background: var(--color-background-secondary);
  }
`;

const PanelHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelTitle = styled.h2`
  font-size: 1.125rem;
  margin: 0;
  color: var(--color-text);
`;

const PanelContent = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
`;

const SectionHeader = styled.h3`
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin: 1.5rem 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  
  &:first-child {
    margin-top: 0;
  }
`;

const LayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const LayerItem = styled.div<{ $isActive: boolean; $isDragging?: boolean }>`
  padding: 0.75rem;
  border-radius: var(--border-radius);
  background: ${({ $isActive, $isDragging }) => 
    $isDragging 
      ? 'var(--color-primary-light)' 
      : $isActive 
        ? 'var(--color-primary-light)' 
        : 'var(--color-background-secondary)'};
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'pointer')};
  transition: all 0.2s;
  border: ${({ $isDragging }) => ($isDragging ? '1px dashed var(--color-primary)' : 'none')};
  box-shadow: ${({ $isDragging }) => ($isDragging ? '0 4px 8px var(--color-shadow)' : 'none')};
  
  &:hover {
    background: ${({ $isActive }) => ($isActive ? 'var(--color-primary-light)' : 'var(--color-background-secondary)')};
    transform: translateY(-2px);
    box-shadow: 0 2px 4px var(--color-shadow);
  }
`;

const LayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const LayerName = styled.span<{ $isVisible: boolean }>`
  font-weight: 500;
  color: var(--color-text);
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0.6)};
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LayerActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LayerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const LayerGroup = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  overflow: hidden;
`;

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  cursor: pointer;
`;

const GroupContent = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  padding: 0.5rem;
`;

const LayerProperties = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Property = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: ${({ color }) => color};
  border: 1px solid var(--color-border);
`;

const AddLayerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  background: transparent;
  border: 1px dashed var(--color-border);
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.2s;
  margin-top: 0.5rem;
  
  &:hover {
    background: var(--color-background-secondary);
  }
`;

const LayerControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SearchLayer = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const ToggleLayersButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  
  &:hover {
    background: var(--color-background-secondary);
  }
  
  svg {
    margin-right: 0.25rem;
  }
`;

const DragIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  cursor: grab;
  color: var(--color-text-secondary);
  
  &:active {
    cursor: grabbing;
  }
`;

const LayerType = styled.span`
  font-size: 0.75rem;
  background: var(--color-background);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  color: var(--color-text-secondary);
`;

const PropertiesPanel = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--color-border);
`;

const PropertyGroup = styled.div`
  margin-bottom: 1rem;
`;

const PropertyLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
`;

const ColorPickerContainer = styled.div`
  position: relative;
  margin-top: 0.5rem;
`;

const ColorPickerTrigger = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius);
  background: ${({ color }) => color};
  border: 1px solid var(--color-border);
  cursor: pointer;
`;

const ColorPickerPopover = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  z-index: 10;
  box-shadow: 0 5px 15px var(--color-shadow);
  border-radius: var(--border-radius);
  background: var(--color-background);
  padding: 0.5rem;
  border: 1px solid var(--color-border);
`;

// Mock layer data
const initialLayers = [
  {
    id: 'layer-1',
    name: 'Base Map',
    type: 'base',
    visible: true,
    color: '#4285F4',
    opacity: 1
  },
  {
    id: 'layer-2',
    name: 'Population Density',
    type: 'fill',
    visible: true,
    color: '#EA4335',
    opacity: 0.7
  },
  {
    id: 'layer-3',
    name: 'Roads',
    type: 'line',
    visible: true,
    color: '#FBBC05',
    opacity: 0.9
  }
];

// Mock basemaps
const basemaps = [
  { id: 'dark', name: 'Dark', style: 'mapbox://styles/mapbox/dark-v11', thumbnail: '/basemap-dark.jpg' },
  { id: 'openstreetmap', name: 'OpenStreetMap', style: 'mapbox://styles/mapbox/streets-v12', thumbnail: '/basemap-streets.jpg' },
  { id: 'satellite', name: 'Satellite', style: 'mapbox://styles/mapbox/satellite-v9', thumbnail: '/basemap-satellite.jpg' },
  { id: 'satellite-streets', name: 'Satellite Streets', style: 'mapbox://styles/mapbox/satellite-streets-v12', thumbnail: '/basemap-satellite-streets.jpg' }
];

interface Layer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  color: string;
  opacity: number;
}

// Add interface for draw feature
// interface DrawnFeature {
//   id: string;
//   type: string;
//   properties: Record<string, any>;
// }

const MapEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.LAYERS);
  const [projectName, setProjectName] = useState(id === 'new' ? 'New Map' : 'Loading...');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentBasemap, setCurrentBasemap] = useState('openstreetmap');
  const mapRef = useRef<MapRef>(null);
  
  // Additional state for Layers tab
  const [searchValue, setSearchValue] = useState('');
  const [groupsOpen, setGroupsOpen] = useState<Record<string, boolean>>({
    base: true,
    vector: true,
    raster: true
  });
  
  // State for Styling tab
  const [localColorPickerOpen, setLocalColorPickerOpen] = useState(false);
  const [selectedLayerForStyle, setSelectedLayerForStyle] = useState<string | null>(activeLayerId);
  const [styleProperty, setStyleProperty] = useState('fill-color');
  const [currentStyleView, setCurrentStyleView] = useState<'simple' | 'advanced'>('simple');
  
  // State for import data modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importModalTab, setImportModalTab] = useState<'file' | 'database' | 'service'>('file');
  
  // Load project data
  useEffect(() => {
    if (id && id !== 'new') {
      // In a real app, you would fetch project data from an API
      setProjectName('Project ' + id);
      // Mock loading data
      const timer = setTimeout(() => {
        // setLayers(fetchedLayers);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [id]);

  // Update selectedLayerForStyle when activeLayerId changes
  useEffect(() => {
    if (activeLayerId) {
      setSelectedLayerForStyle(activeLayerId);
    }
  }, [activeLayerId]);
  
  const activeLayer = activeLayerId ? layers.find(layer => layer.id === activeLayerId) : null;
  
  // Filter layers based on search
  const filteredLayers = layers.filter(layer => 
    layer.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Group layers by type
  const groupedLayers: Record<string, Layer[]> = {
    base: [],
    vector: [],
    raster: []
  };

  filteredLayers.forEach(layer => {
    if (layer.type === 'base') {
      groupedLayers.base.push(layer);
    } else if (['fill', 'line', 'symbol', 'circle'].includes(layer.type)) {
      groupedLayers.vector.push(layer);
    } else {
      groupedLayers.raster.push(layer);
    }
  });

  const selectedLayer = selectedLayerForStyle 
    ? layers.find(layer => layer.id === selectedLayerForStyle) 
    : null;
  
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  
  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
  };
  
  const handleBackClick = () => {
    navigate('/projects');
  };
  
  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };
  
  const deleteLayer = (layerId: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    if (activeLayerId === layerId) {
      setActiveLayerId(null);
    }
  };
  
  const handleColorChange = (color: string) => {
    if (selectedLayerForStyle) {
      setLayers(prevLayers =>
        prevLayers.map(layer =>
          layer.id === selectedLayerForStyle ? { ...layer, color } : layer
        )
      );
    }
  };
  
  const handleOpacityChange = (opacity: number) => {
    if (selectedLayerForStyle) {
      setLayers(prevLayers =>
        prevLayers.map(layer =>
          layer.id === selectedLayerForStyle ? { ...layer, opacity } : layer
        )
      );
    }
  };
  
  const addNewLayer = () => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      name: `New Layer ${layers.length + 1}`,
      type: 'fill',
      visible: true,
      color: '#34D399',
      opacity: 0.7
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
    setActiveTab(SidebarTab.LAYERS);
  };

  const changeBasemap = (basemapId: string) => {
    setCurrentBasemap(basemapId);
  };
  
  const toggleGroup = (group: string) => {
    setGroupsOpen(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const showAllLayers = () => {
    setLayers(prevLayers =>
      prevLayers.map(layer => ({ ...layer, visible: true }))
    );
  };

  const hideAllLayers = () => {
    setLayers(prevLayers =>
      prevLayers.map(layer => ({ ...layer, visible: false }))
    );
  };

  const moveLayer = (fromIndex: number, toIndex: number) => {
    const updatedLayers = [...layers];
    const [movedLayer] = updatedLayers.splice(fromIndex, 1);
    updatedLayers.splice(toIndex, 0, movedLayer);
    setLayers(updatedLayers);
  };
  
  const handleLayerSelect = (layerId: string) => {
    setSelectedLayerForStyle(layerId);
  };

  const handleImportData = (data: any) => {
    // Process the imported data and create a new layer
    console.log('Imported data:', data);
    // In a real app, you would convert this data to a layer
    
    // Example of creating a new layer from imported data
    const newLayer = {
      id: `layer-${Date.now()}`,
      name: data.name || `Imported Layer ${layers.length + 1}`,
      type: data.type || 'fill',
      visible: true,
      color: '#34D399',
      opacity: 0.7
    };
    
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
    setActiveTab(SidebarTab.LAYERS);
  };

  const openImportModal = (tab: 'file' | 'database' | 'service' = 'file') => {
    setImportModalTab(tab);
    setIsImportModalOpen(true);
  };

  // Render the appropriate sidebar content based on the active tab
  const renderSidebarContent = () => {
    switch (activeTab) {
      case SidebarTab.LAYERS:
        return renderLayersTab();
      case SidebarTab.DATA_SOURCES:
        return renderDataSourcesTab();
      case SidebarTab.STYLING:
        return renderStylingTab();
      case SidebarTab.PROPERTIES:
        return renderPropertiesTab();
      case SidebarTab.ANALYSIS:
        return renderAnalysisTab();
      case SidebarTab.LEGEND:
        return renderLegendTab();
      case SidebarTab.BASEMAPS:
        return renderBasemapsTab();
      case SidebarTab.EXPORT:
        return renderExportTab();
      case SidebarTab.SETTINGS:
        return renderSettingsTab();
      case SidebarTab.TOOLS:
        return renderToolsTab();
      default:
        return renderLayersTab();
    }
  };

  // Each of these functions will return the content for that specific tab
  const renderLayersTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Layers</PanelTitle>
          <ToggleLayersButton onClick={addNewLayer} title="Add new layer">
            <IconPlus size={16} />
          </ToggleLayersButton>
        </PanelHeader>
        <PanelContent>
          <LayerControls>
            <SearchLayer 
              placeholder="Search layers..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <ToggleLayersButton onClick={showAllLayers} title="Show all layers">
              <IconEye size={16} />
            </ToggleLayersButton>
            <ToggleLayersButton onClick={hideAllLayers} title="Hide all layers">
              <IconEyeOff size={16} />
            </ToggleLayersButton>
          </LayerControls>

          {/* Base layers group */}
          {groupedLayers.base.length > 0 && (
            <LayerGroup>
              <GroupHeader onClick={() => toggleGroup('base')}>
                <span>Base Layers</span>
                <LayerButton>
                  {groupsOpen.base ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
                </LayerButton>
              </GroupHeader>
              <GroupContent $isOpen={groupsOpen.base}>
                <LayersList>
                  {groupedLayers.base.map((layer, index) => (
                    <LayerItem
                      key={layer.id}
                      $isActive={activeLayerId === layer.id}
                      onClick={() => setActiveLayerId(layer.id)}
                    >
                      <LayerHeader>
                        <DragIndicator title="Drag to reorder">
                          <IconArrowsExchange2 size={16} />
                        </DragIndicator>
                        <LayerName $isVisible={layer.visible}>{layer.name}</LayerName>
                        <LayerActions>
                          <LayerButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerVisibility(layer.id);
                            }}
                            title={layer.visible ? 'Hide layer' : 'Show layer'}
                          >
                            {layer.visible ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                          </LayerButton>
                          <LayerButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLayer(layer.id);
                            }}
                            title="Delete layer"
                          >
                            <IconTrash size={16} />
                          </LayerButton>
                        </LayerActions>
                      </LayerHeader>
                      <LayerProperties>
                        <Property>
                          <ColorSwatch color={layer.color} />
                          <LayerType>{layer.type}</LayerType>
                        </Property>
                      </LayerProperties>
                    </LayerItem>
                  ))}
                </LayersList>
              </GroupContent>
            </LayerGroup>
          )}

          {/* Vector layers group */}
          {groupedLayers.vector.length > 0 && (
            <LayerGroup>
              <GroupHeader onClick={() => toggleGroup('vector')}>
                <span>Vector Layers</span>
                <LayerButton>
                  {groupsOpen.vector ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
                </LayerButton>
              </GroupHeader>
              <GroupContent $isOpen={groupsOpen.vector}>
                <LayersList>
                  {groupedLayers.vector.map((layer, index) => (
                    <LayerItem
                      key={layer.id}
                      $isActive={activeLayerId === layer.id}
                      onClick={() => setActiveLayerId(layer.id)}
                    >
                      <LayerHeader>
                        <DragIndicator title="Drag to reorder">
                          <IconArrowsExchange2 size={16} />
                        </DragIndicator>
                        <LayerName $isVisible={layer.visible}>{layer.name}</LayerName>
                        <LayerActions>
                          <LayerButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerVisibility(layer.id);
                            }}
                            title={layer.visible ? 'Hide layer' : 'Show layer'}
                          >
                            {layer.visible ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                          </LayerButton>
                          <LayerButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLayer(layer.id);
                            }}
                            title="Delete layer"
                          >
                            <IconTrash size={16} />
                          </LayerButton>
                        </LayerActions>
                      </LayerHeader>
                      <LayerProperties>
                        <Property>
                          <ColorSwatch color={layer.color} />
                          <LayerType>{layer.type}</LayerType>
                        </Property>
                      </LayerProperties>
                    </LayerItem>
                  ))}
                </LayersList>
              </GroupContent>
            </LayerGroup>
          )}

          {/* Raster layers group */}
          {groupedLayers.raster.length > 0 && (
            <LayerGroup>
              <GroupHeader onClick={() => toggleGroup('raster')}>
                <span>Raster Layers</span>
                <LayerButton>
                  {groupsOpen.raster ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
                </LayerButton>
              </GroupHeader>
              <GroupContent $isOpen={groupsOpen.raster}>
                <LayersList>
                  {groupedLayers.raster.map((layer, index) => (
                    <LayerItem
                      key={layer.id}
                      $isActive={activeLayerId === layer.id}
                      onClick={() => setActiveLayerId(layer.id)}
                    >
                      <LayerHeader>
                        <DragIndicator title="Drag to reorder">
                          <IconArrowsExchange2 size={16} />
                        </DragIndicator>
                        <LayerName $isVisible={layer.visible}>{layer.name}</LayerName>
                        <LayerActions>
                          <LayerButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerVisibility(layer.id);
                            }}
                            title={layer.visible ? 'Hide layer' : 'Show layer'}
                          >
                            {layer.visible ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                          </LayerButton>
                          <LayerButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLayer(layer.id);
                            }}
                            title="Delete layer"
                          >
                            <IconTrash size={16} />
                          </LayerButton>
                        </LayerActions>
                      </LayerHeader>
                      <LayerProperties>
                        <Property>
                          <ColorSwatch color={layer.color} />
                          <LayerType>{layer.type}</LayerType>
                        </Property>
                      </LayerProperties>
                    </LayerItem>
                  ))}
                </LayersList>
              </GroupContent>
            </LayerGroup>
          )}

          {/* No layers found */}
          {filteredLayers.length === 0 && (
            <div style={{ 
              padding: '2rem 0', 
              textAlign: 'center',
              color: 'var(--color-text-secondary)'
            }}>
              <IconLayoutList size={40} style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <p>No layers found{searchValue ? ` matching "${searchValue}"` : ''}.</p>
            </div>
          )}

          <AddLayerButton onClick={addNewLayer}>
            <IconPlus size={16} />
            Add New Layer
          </AddLayerButton>
        </PanelContent>
      </>
    );
  };

  const renderDataSourcesTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Data Sources</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <SectionHeader>Import Data</SectionHeader>
          
          <DataSourceCard onClick={() => openImportModal('file')}>
            <DataSourceIcon>
              <IconUpload size={24} />
            </DataSourceIcon>
            <DataSourceContent>
              <DataSourceTitle>Upload File</DataSourceTitle>
              <DataSourceDescription>
                Import GeoJSON, Shapefile, KML, or CSV with coordinates
              </DataSourceDescription>
              <DataSourceButton>
                Choose File
              </DataSourceButton>
            </DataSourceContent>
          </DataSourceCard>
          
          <DataSourceCard onClick={() => openImportModal('database')}>
            <DataSourceIcon>
              <IconDatabase size={24} />
            </DataSourceIcon>
            <DataSourceContent>
              <DataSourceTitle>Connect Database</DataSourceTitle>
              <DataSourceDescription>
                Connect to PostGIS, SQL Server, or other spatial databases
              </DataSourceDescription>
              <DataSourceButton>
                Configure Connection
              </DataSourceButton>
            </DataSourceContent>
          </DataSourceCard>
          
          <DataSourceCard onClick={() => openImportModal('service')}>
            <DataSourceIcon>
              <IconArrowsExchange2 size={24} />
            </DataSourceIcon>
            <DataSourceContent>
              <DataSourceTitle>Web Service</DataSourceTitle>
              <DataSourceDescription>
                Connect to WMS, WFS, or Vector Tile services
              </DataSourceDescription>
              <DataSourceButton>
                Add Service
              </DataSourceButton>
            </DataSourceContent>
          </DataSourceCard>
          
          <SectionHeader>Recent Sources</SectionHeader>
          
          <RecentSourcesList>
            <RecentSourceItem>
              <RecentSourceInfo>
                <RecentSourceName>cities_data.geojson</RecentSourceName>
                <RecentSourceMeta>GeoJSON • 2.4MB • 156 features</RecentSourceMeta>
              </RecentSourceInfo>
              <RecentSourceActions>
                <SourceActionButton title="Add to map">
                  <IconPlus size={16} />
                </SourceActionButton>
              </RecentSourceActions>
            </RecentSourceItem>
            
            <RecentSourceItem>
              <RecentSourceInfo>
                <RecentSourceName>population_2022.csv</RecentSourceName>
                <RecentSourceMeta>CSV • 1.2MB • 432 rows</RecentSourceMeta>
              </RecentSourceInfo>
              <RecentSourceActions>
                <SourceActionButton title="Add to map">
                  <IconPlus size={16} />
                </SourceActionButton>
              </RecentSourceActions>
            </RecentSourceItem>
            
            <RecentSourceItem>
              <RecentSourceInfo>
                <RecentSourceName>rivers.shp</RecentSourceName>
                <RecentSourceMeta>Shapefile • 3.8MB • 89 features</RecentSourceMeta>
              </RecentSourceInfo>
              <RecentSourceActions>
                <SourceActionButton title="Add to map">
                  <IconPlus size={16} />
                </SourceActionButton>
              </RecentSourceActions>
            </RecentSourceItem>
          </RecentSourcesList>
          
          <SectionHeader>External Services</SectionHeader>
          
          <ExternalServicesGrid>
            <ExternalServiceCard>
              <ExternalServiceIcon>🌦️</ExternalServiceIcon>
              <ExternalServiceName>Weather Data</ExternalServiceName>
              <ExternalServiceButton>Connect</ExternalServiceButton>
            </ExternalServiceCard>
            
            <ExternalServiceCard>
              <ExternalServiceIcon>🏙️</ExternalServiceIcon>
              <ExternalServiceName>Census Data</ExternalServiceName>
              <ExternalServiceButton>Connect</ExternalServiceButton>
            </ExternalServiceCard>
            
            <ExternalServiceCard>
              <ExternalServiceIcon>🛰️</ExternalServiceIcon>
              <ExternalServiceName>Satellite Imagery</ExternalServiceName>
              <ExternalServiceButton>Connect</ExternalServiceButton>
            </ExternalServiceCard>
            
            <ExternalServiceCard>
              <ExternalServiceIcon>🔍</ExternalServiceIcon>
              <ExternalServiceName>More Services</ExternalServiceName>
              <ExternalServiceButton>Browse</ExternalServiceButton>
            </ExternalServiceCard>
          </ExternalServicesGrid>
        </PanelContent>
      </>
    );
  };

  const renderStylingTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Style</PanelTitle>
          <StyleViewToggle>
            <StyleViewButton 
              $active={currentStyleView === 'simple'} 
              onClick={() => setCurrentStyleView('simple')}
            >
              Simple
            </StyleViewButton>
            <StyleViewButton 
              $active={currentStyleView === 'advanced'} 
              onClick={() => setCurrentStyleView('advanced')}
            >
              Advanced
            </StyleViewButton>
          </StyleViewToggle>
        </PanelHeader>
        <PanelContent>
          <SectionHeader>Select Layer</SectionHeader>
          <LayerSelector>
            {layers.map(layer => (
              <LayerOption 
                key={layer.id}
                $active={selectedLayerForStyle === layer.id}
                onClick={() => handleLayerSelect(layer.id)}
              >
                <ColorSwatch color={layer.color} />
                <span>{layer.name}</span>
              </LayerOption>
            ))}
          </LayerSelector>

          {selectedLayer ? (
            <>
              <SectionHeader>Appearance</SectionHeader>
              
              {currentStyleView === 'simple' ? (
                // Simple styling view
                <>
                  <PropertyGroup>
                    <PropertyLabel>Color</PropertyLabel>
                    <ColorPickerContainer>
                      <ColorPickerTrigger
                        color={selectedLayer.color}
                        onClick={() => setLocalColorPickerOpen(!localColorPickerOpen)}
                      />
                      <ColorPickerPopover $isOpen={localColorPickerOpen}>
                        <HexColorPicker color={selectedLayer.color} onChange={handleColorChange} />
                      </ColorPickerPopover>
                    </ColorPickerContainer>
                  </PropertyGroup>
                  
                  <PropertyGroup>
                    <PropertyRow>
                      <PropertyLabel>Opacity: {selectedLayer.opacity.toFixed(1)}</PropertyLabel>
                      <OpacityValue>{Math.round(selectedLayer.opacity * 100)}%</OpacityValue>
                    </PropertyRow>
                    <RangeInput
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedLayer.opacity}
                      onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                    />
                  </PropertyGroup>
                  
                  {selectedLayer.type === 'line' && (
                    <PropertyGroup>
                      <PropertyLabel>Line Width</PropertyLabel>
                      <RangeInput
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value="2"
                        onChange={() => {}}
                      />
                    </PropertyGroup>
                  )}
                  
                  <PropertyGroup>
                    <PropertyLabel>Style Presets</PropertyLabel>
                    <StylePresetsGrid>
                      <StylePreset color="#E63946" onClick={() => handleColorChange('#E63946')} />
                      <StylePreset color="#1D3557" onClick={() => handleColorChange('#1D3557')} />
                      <StylePreset color="#2A9D8F" onClick={() => handleColorChange('#2A9D8F')} />
                      <StylePreset color="#F4A261" onClick={() => handleColorChange('#F4A261')} />
                      <StylePreset color="#6D597A" onClick={() => handleColorChange('#6D597A')} />
                      <StylePreset color="#277DA1" onClick={() => handleColorChange('#277DA1')} />
                    </StylePresetsGrid>
                  </PropertyGroup>
                </>
              ) : (
                // Advanced styling view
                <>
                  <PropertyGroup>
                    <PropertyLabel>Style Property</PropertyLabel>
                    <StylePropertySelect
                      value={styleProperty}
                      onChange={(e) => setStyleProperty(e.target.value)}
                    >
                      {selectedLayer.type === 'fill' && (
                        <>
                          <option value="fill-color">Fill Color</option>
                          <option value="fill-outline-color">Outline Color</option>
                          <option value="fill-opacity">Fill Opacity</option>
                          <option value="fill-pattern">Fill Pattern</option>
                        </>
                      )}
                      {selectedLayer.type === 'line' && (
                        <>
                          <option value="line-color">Line Color</option>
                          <option value="line-width">Line Width</option>
                          <option value="line-opacity">Line Opacity</option>
                          <option value="line-dasharray">Line Dash Pattern</option>
                        </>
                      )}
                    </StylePropertySelect>
                  </PropertyGroup>
                  
                  <PropertyGroup>
                    <PropertyLabel>Style Type</PropertyLabel>
                    <StyleTypeToggle>
                      <StyleTypeButton $active={true}>Single Value</StyleTypeButton>
                      <StyleTypeButton $active={false}>Data Driven</StyleTypeButton>
                    </StyleTypeToggle>
                  </PropertyGroup>
                  
                  <PropertyGroup>
                    <PropertyLabel>Expression Editor</PropertyLabel>
                    <CodeEditor>
                      {styleProperty === 'fill-color' && `
["interpolate",
  ["linear"],
  ["get", "value"],
  0, "${selectedLayer.color}",
  100, "${selectedLayer.color}"
]`}
                    </CodeEditor>
                  </PropertyGroup>
                  
                  <PropertyGroup>
                    <PropertyLabel>Style Layers</PropertyLabel>
                    <StyleLayer>
                      <StyleLayerName>Base Style</StyleLayerName>
                      <StyleLayerActions>
                        <LayerButton>
                          <IconEye size={16} />
                        </LayerButton>
                        <LayerButton>
                          <IconTrash size={16} />
                        </LayerButton>
                      </StyleLayerActions>
                    </StyleLayer>
                    <StyleLayerAdd>
                      <IconPlus size={16} />
                      Add Style Layer
                    </StyleLayerAdd>
                  </PropertyGroup>
                </>
              )}
            </>
          ) : (
            <EmptyStateMessage>
              <IconBrush size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Select a layer to style</p>
            </EmptyStateMessage>
          )}
        </PanelContent>
      </>
    );
  };

  const renderPropertiesTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Properties</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <EmptyStateMessage>
            <IconEdit size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Select a feature to edit properties</p>
          </EmptyStateMessage>
        </PanelContent>
      </>
    );
  };

  const renderAnalysisTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Analysis</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <EmptyStateMessage>
            <IconFilter size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Analysis tools coming soon</p>
          </EmptyStateMessage>
        </PanelContent>
      </>
    );
  };

  const renderLegendTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Legend</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <EmptyStateMessage>
            <IconLayoutList size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Legend editor coming soon</p>
          </EmptyStateMessage>
        </PanelContent>
      </>
    );
  };

  const renderBasemapsTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Map Style</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <SectionHeader>Select Style</SectionHeader>
          <BasemapGrid>
            {basemaps.map(basemap => (
              <BasemapCard 
                key={basemap.id}
                $active={currentBasemap === basemap.id}
                onClick={() => changeBasemap(basemap.id)}
              >
                <BasemapPreview $style={basemap.id}>
                  {currentBasemap === basemap.id && (
                    <BasemapActiveIndicator>
                      <IconCheck size={16} />
                    </BasemapActiveIndicator>
                  )}
                </BasemapPreview>
                <BasemapName>{basemap.name}</BasemapName>
              </BasemapCard>
            ))}
          </BasemapGrid>

          <SectionHeader>Map Settings</SectionHeader>
          <SettingGroup>
            <SettingLabel>Labels</SettingLabel>
            <ToggleSwitch $active={true} data-active="true">
              <ToggleSlider />
            </ToggleSwitch>
          </SettingGroup>

          <SettingGroup>
            <SettingLabel>Boundaries</SettingLabel>
            <ToggleSwitch $active={true} data-active="true">
              <ToggleSlider />
            </ToggleSwitch>
          </SettingGroup>

          <SettingGroup>
            <SettingLabel>Buildings</SettingLabel>
            <ToggleSwitch $active={true} data-active="true">
              <ToggleSlider />
            </ToggleSwitch>
          </SettingGroup>

          <SettingGroup>
            <SettingLabel>Traffic</SettingLabel>
            <ToggleSwitch $active={false} data-active="false">
              <ToggleSlider />
            </ToggleSwitch>
          </SettingGroup>
        </PanelContent>
      </>
    );
  };

  const renderExportTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Export & Share</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <EmptyStateMessage>
            <IconFileExport size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Export options coming soon</p>
          </EmptyStateMessage>
        </PanelContent>
      </>
    );
  };

  const renderSettingsTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Map Settings</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <EmptyStateMessage>
            <IconSettings size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Map settings coming soon</p>
          </EmptyStateMessage>
        </PanelContent>
      </>
    );
  };

  const renderToolsTab = () => {
    return (
      <>
        <PanelHeader>
          <PanelTitle>Drawing & Measurement</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <SectionHeader>Drawing Tools</SectionHeader>
          <EmptyStateMessage>
            <IconEdit size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Drawing tools have been moved to the toolbar at the bottom of the map</p>
            <p>Use the drawing toolbar to create features on the map</p>
          </EmptyStateMessage>

          <SectionHeader>Measurement</SectionHeader>
          <EmptyStateMessage>
            <IconRuler2 size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Measurement tools coming soon</p>
          </EmptyStateMessage>
          
          <SectionHeader>Advanced Editing</SectionHeader>
          <EmptyStateMessage>
            <IconArrowsSplit2 size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Advanced editing tools coming soon</p>
          </EmptyStateMessage>
        </PanelContent>
      </>
    );
  };

  // Styled components for Data Sources tab
  const DataSourceCard = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: var(--border-radius);
    background: var(--color-background-secondary);
    margin-bottom: 1rem;
    transition: all 0.2s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px var(--color-shadow);
    }
  `;

  const DataSourceIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius);
    background: var(--color-primary-light);
    color: var(--color-primary);
    margin-right: 1rem;
  `;

  const DataSourceContent = styled.div`
    flex: 1;
  `;

  const DataSourceTitle = styled.h4`
    margin: 0 0 0.25rem;
    font-size: 1rem;
    color: var(--color-text);
  `;

  const DataSourceDescription = styled.p`
    margin: 0 0 0.75rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  `;

  const DataSourceButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    background: var(--color-primary);
    color: white;
    border: none;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: var(--color-primary-dark);
    }
  `;

  const RecentSourcesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `;

  const RecentSourceItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-radius: var(--border-radius);
    background: var(--color-background-secondary);
    transition: all 0.2s;
    
    &:hover {
      background: var(--color-background);
      box-shadow: 0 2px 4px var(--color-shadow);
    }
  `;

  const RecentSourceInfo = styled.div`
    flex: 1;
  `;

  const RecentSourceName = styled.div`
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: var(--color-text);
  `;

  const RecentSourceMeta = styled.div`
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  `;

  const RecentSourceActions = styled.div`
    display: flex;
    gap: 0.5rem;
  `;

  const SourceActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--border-radius);
    background: var(--color-background);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: var(--color-primary-light);
      color: var(--color-primary);
      border-color: var(--color-primary);
    }
  `;

  const ExternalServicesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  `;

  const ExternalServiceCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border-radius: var(--border-radius);
    background: var(--color-background-secondary);
    transition: all 0.2s;
    text-align: center;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px var(--color-shadow);
    }
  `;

  const ExternalServiceIcon = styled.div`
    font-size: 2rem;
    margin-bottom: 0.5rem;
  `;

  const ExternalServiceName = styled.div`
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
    color: var(--color-text);
  `;

  const ExternalServiceButton = styled.button`
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
    background: var(--color-background);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }
  `;

  // Styling tab styled components
  const StyleViewToggle = styled.div`
    display: flex;
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 1px solid var(--color-border);
  `;

  const StyleViewButton = styled.button<{ $active: boolean }>`
    padding: 0.25rem 0.75rem;
    background: ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-background)'};
    color: ${({ $active }) => $active ? 'white' : 'var(--color-text)'};
    border: none;
    font-size: 0.75rem;
    cursor: pointer;
  `;

  const LayerSelector = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
  `;

  const LayerOption = styled.div<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    background: ${({ $active }) => $active ? 'var(--color-primary-light)' : 'var(--color-background)'};
    
    &:hover {
      background: ${({ $active }) => $active ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'};
    }
  `;

  const PropertyRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const OpacityValue = styled.span`
    font-size: 0.875rem;
    color: var(--color-text);
  `;

  const RangeInput = styled.input`
    width: 100%;
    margin: 0.5rem 0;
    
    &::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: var(--color-primary);
      border-radius: 50%;
      cursor: pointer;
    }
  `;

  const StylePresetsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
  `;

  const StylePreset = styled.button<{ color: string }>`
    width: 36px;
    height: 36px;
    border-radius: var(--border-radius);
    background: ${({ color }) => color};
    border: 1px solid var(--color-border);
    cursor: pointer;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 4px var(--color-shadow);
    }
  `;

  const StylePropertySelect = styled.select`
    width: 100%;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
    background: var(--color-background);
    color: var(--color-text);
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  `;

  const StyleTypeToggle = styled.div`
    display: flex;
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 1px solid var(--color-border);
  `;

  const StyleTypeButton = styled.button<{ $active: boolean }>`
    flex: 1;
    padding: 0.5rem;
    background: ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-background)'};
    color: ${({ $active }) => $active ? 'white' : 'var(--color-text)'};
    border: none;
    font-size: 0.875rem;
    cursor: pointer;
  `;

  const CodeEditor = styled.pre`
    background: var(--color-background-secondary);
    border-radius: var(--border-radius);
    padding: 0.75rem;
    font-family: monospace;
    font-size: 0.875rem;
    color: var(--color-text);
    white-space: pre-wrap;
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid var(--color-border);
  `;

  const StyleLayer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: var(--color-background-secondary);
    border-radius: var(--border-radius);
    margin-bottom: 0.5rem;
  `;

  const StyleLayerName = styled.span`
    font-size: 0.875rem;
    color: var(--color-text);
  `;

  const StyleLayerActions = styled.div`
    display: flex;
    gap: 0.25rem;
  `;

  const StyleLayerAdd = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    border: 1px dashed var(--color-border);
    background: var(--color-background);
    color: var(--color-text);
    font-size: 0.875rem;
    cursor: pointer;
    
    &:hover {
      background: var(--color-background-secondary);
    }
  `;

  const EmptyStateMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    color: var(--color-text-secondary);
    text-align: center;
  `;

  // Basemaps tab styled components
  const BasemapGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  `;

  const BasemapCard = styled.div<{ $active: boolean }>`
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 2px solid ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-border)'};
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      box-shadow: 0 4px 8px var(--color-shadow);
      transform: translateY(-2px);
    }
  `;

  const BasemapPreview = styled.div<{ $style?: string }>`
    height: 120px;
    background: ${({ $style }) => {
      switch ($style) {
        case 'dark':
          return '#242424';
        case 'openstreetmap':
          return '#f2f2f2 url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 10 H 90 V 90 H 10 Z\' fill=\'none\' stroke=\'%23bbb\' stroke-width=\'1\'/%3E%3C/svg%3E")';
        case 'satellite':
          return '#04152b';
        case 'satellite-streets':
          return '#133863 url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 10 H 90 V 90 H 10 Z\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'0.5\'/%3E%3C/svg%3E")';
        default:
          return 'var(--color-background-secondary)';
      }
    }};
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${({ $style }) => {
        switch ($style) {
          case 'dark':
            return "url(\"data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 40 L 70 40 L 70 60 L 30 60 Z\' fill=\'none\' stroke=\'%23555\' stroke-width=\'1\'/%3E%3Cpath d=\'M10 10 L 90 10 L 90 90 L 10 90 Z\' fill=\'none\' stroke=\'%23444\' stroke-width=\'1\'/%3E%3C/svg%3E\")";
          case 'openstreetmap':
            return "url(\"data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 40 L 70 40 L 70 60 L 30 60 Z\' fill=\'none\' stroke=\'%23ccc\' stroke-width=\'2\'/%3E%3Cpath d=\'M10 10 L 90 10 L 90 90 L 10 90 Z\' fill=\'none\' stroke=\'%23ddd\' stroke-width=\'2\'/%3E%3C/svg%3E\")";
          case 'satellite':
            return "url(\"data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E\")";
          case 'satellite-streets':
            return "url(\"data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.3\'/%3E%3Cpath d=\'M30 10 L 30 90 M 70 10 L 70 90 M 10 30 L 90 30 M 10 70 L 90 70\' stroke=\'%23fff\' stroke-width=\'0.5\' opacity=\'0.7\'/%3E%3C/svg%3E\")";
          default:
            return 'none';
        }
      }};
    }
  `;

  const BasemapActiveIndicator = styled.div`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const BasemapName = styled.div`
    padding: 0.5rem;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 500;
  `;

  const CustomStyleInput = styled.div`
    margin-bottom: 1.5rem;
  `;

  const CustomStyleLabel = styled.label`
    display: block;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-secondary);
  `;

  const CustomStyleField = styled.input`
    width: 100%;
    padding: 0.625rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
    background: var(--color-background);
    color: var(--color-text);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  `;

  const CustomStyleButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    background: var(--color-primary);
    color: white;
    border: none;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: var(--color-primary-dark);
    }
  `;

  const SettingGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
    
    &:last-child {
      border-bottom: none;
    }
  `;

  const SettingLabel = styled.div`
    font-size: 0.875rem;
    color: var(--color-text);
  `;

  const ToggleSwitch = styled.div<{ $active?: boolean }>`
    position: relative;
    width: 36px;
    height: 20px;
    background: ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
  `;

  const ToggleSlider = styled.div`
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: all 0.2s;
    
    ${ToggleSwitch}[data-active="true"] & {
      transform: translateX(16px);
    }
  `;

  // Styled components for Tools tab
  const ToolsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  `;

  const ToolButton = styled.button<{ $active?: boolean; disabled?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--border-radius);
    background: ${({ $active }) => $active ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'};
    color: ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-text)'};
    border: 1px solid ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-border)'};
    cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
    opacity: ${({ disabled }) => disabled ? 0.5 : 1};
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
      background: ${({ $active }) => $active ? 'var(--color-primary-light)' : 'var(--color-background)'};
      transform: translateY(-2px);
      box-shadow: 0 2px 4px var(--color-shadow);
    }
  `;

  // Map styles toolbar components
  const MapStylesToolbar = styled.div`
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-background);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 999;
    padding: 8px;
    display: flex;
    flex-direction: row;
    gap: 8px;
  `;

  const StyleCard = styled.div<{ $active?: boolean }>`
    display: flex;
    flex-direction: column;
    width: 36px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      transform: translateY(-2px);
    }
  `;

  const StyleThumbnail = styled.div<{ $active?: boolean }>`
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 4px;
    overflow: hidden;
    border: 2px solid ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-border)')};
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;

  return (
    <EditorContainer>
      <TopBar>
        <Title>
          <BackButton onClick={handleBackClick}>
            <IconChevronLeft size={16} />
            Back
          </BackButton>
          <ProjectName>{projectName}</ProjectName>
        </Title>
        <Actions>
          <ActionButton title="Save" onClick={() => console.log('Save clicked')}>
            <IconDeviceFloppy size={20} />
          </ActionButton>
          <ActionButton title="Export" onClick={() => setActiveTab(SidebarTab.EXPORT)}>
            <IconFileExport size={20} />
          </ActionButton>
          <ActionButton title="Share" onClick={() => console.log('Share clicked')}>
            <IconShare size={20} />
          </ActionButton>
          <ActionButton title="Settings" onClick={() => setActiveTab(SidebarTab.SETTINGS)}>
            <IconSettings size={20} />
          </ActionButton>
        </Actions>
      </TopBar>
      
      <MainContent>
        <SidePanel $isOpen={isPanelOpen}>
          <TabContainer>
            <Tab 
              $active={activeTab === SidebarTab.LAYERS} 
              onClick={() => handleTabChange(SidebarTab.LAYERS)}
            >
              <IconLayoutList size={20} />
              Layers
            </Tab>
            <Tab 
              $active={activeTab === SidebarTab.DATA_SOURCES} 
              onClick={() => handleTabChange(SidebarTab.DATA_SOURCES)}
            >
              <IconDatabase size={20} />
              Data
            </Tab>
            <Tab 
              $active={activeTab === SidebarTab.STYLING} 
              onClick={() => handleTabChange(SidebarTab.STYLING)}
            >
              <IconBrush size={20} />
              Style
            </Tab>
            <Tab 
              $active={activeTab === SidebarTab.PROPERTIES} 
              onClick={() => handleTabChange(SidebarTab.PROPERTIES)}
            >
              <IconEdit size={20} />
              Props
            </Tab>
            <Tab 
              $active={activeTab === SidebarTab.ANALYSIS} 
              onClick={() => handleTabChange(SidebarTab.ANALYSIS)}
            >
              <IconFilter size={20} />
              Analysis
            </Tab>
            <Tab 
              $active={activeTab === SidebarTab.LEGEND} 
              onClick={() => handleTabChange(SidebarTab.LEGEND)}
            >
              <IconLayoutList size={20} />
              Legend
            </Tab>
            <Tab 
              $active={activeTab === SidebarTab.BASEMAPS} 
              onClick={() => handleTabChange(SidebarTab.BASEMAPS)}
            >
              <IconMap size={20} />
              Basemap
            </Tab>
            <Tab 
              $active={activeTab === SidebarTab.TOOLS} 
              onClick={() => handleTabChange(SidebarTab.TOOLS)}
            >
              <IconRuler size={20} />
              Tools
            </Tab>
          </TabContainer>
          
          {renderSidebarContent()}
        </SidePanel>
        
        <SidePanelToggle $isOpen={isPanelOpen} onClick={togglePanel}>
          {isPanelOpen ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
        </SidePanelToggle>
        
        <MapContainer>
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: -14.5,
              latitude: 14.5,
              zoom: 6
            }}
            mapStyle={
              basemaps.find(b => b.id === currentBasemap)?.style || 
              'mapbox://styles/mapbox/streets-v12'
            }
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="top-right" />
            
            {/* This would be populated with actual GeoJSON data in a real application */}
            {layers.map(layer => (
              layer.visible && (
                <Source key={layer.id} id={layer.id} type="geojson" data={mockGeoJSONData}>
                  <Layer 
                    id={`${layer.id}-layer`}
                    type="fill"
                    paint={{ 
                      'fill-color': layer.color,
                      'fill-opacity': layer.opacity
                    }}
                  />
                </Source>
              )
            ))}
          </Map>
          <DrawingTools mapRef={mapRef} />
          
          {/* Add Map Styles Toolbar */}
          <MapStylesToolbar>
            {basemaps.map(basemap => (
              <StyleCard 
                key={basemap.id}
                $active={currentBasemap === basemap.id}
                onClick={() => changeBasemap(basemap.id)}
              >
                <StyleThumbnail $active={currentBasemap === basemap.id}>
                  <img 
                    src={`/maps/${basemap.id}.png`} 
                    alt={basemap.name}
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f1f1f1'/%3E%3C/svg%3E";
                    }}
                  />
                </StyleThumbnail>
              </StyleCard>
            ))}
          </MapStylesToolbar>
        </MapContainer>
      </MainContent>
      
      {/* Add the Import Data Modal */}
      <ImportDataModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImportData}
      />
    </EditorContainer>
  );
};

export default MapEditor;