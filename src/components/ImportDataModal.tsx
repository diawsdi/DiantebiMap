import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  IconX, 
  IconUpload, 
  IconLink, 
  IconDatabase, 
  IconWorld, 
  IconFile, 
  IconTable,
  IconCloudUpload
} from '@tabler/icons-react';

// Modal backdrop and container styling
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 20px var(--color-shadow);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--color-text);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? 'var(--color-primary)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text)')};
  }
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FileUploadArea = styled.div`
  border: 2px dashed var(--color-border);
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--color-primary);
    background-color: var(--color-background-secondary);
  }
`;

const FileUploadIcon = styled.div`
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const FileUploadText = styled.div`
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
`;

const SupportedFormats = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const FormatBadge = styled.span`
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const BrowseButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

// Form components
const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  color: var(--color-text);
  
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  color: var(--color-text);
  
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--color-background-secondary);
  }
`;

const SaveButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const ServiceCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--color-primary);
    background-color: var(--color-background-secondary);
  }
`;

const ServiceIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-background-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
`;

const ServiceInfo = styled.div`
  flex: 1;
`;

const ServiceTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ServiceDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
`;

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
}

const ImportDataModal: React.FC<ImportDataModalProps> = ({ isOpen, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  if (!isOpen) return null;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleImport = () => {
    // Process the imported data based on the active tab
    // For now, just close the modal
    onClose();
  };
  
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Import Data</ModalTitle>
          <CloseButton onClick={onClose}>
            <IconX size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <TabContainer>
            <Tab $active={activeTab === 'file'} onClick={() => setActiveTab('file')}>
              <IconUpload size={18} />
              File
            </Tab>
            <Tab $active={activeTab === 'database'} onClick={() => setActiveTab('database')}>
              <IconDatabase size={18} />
              Database
            </Tab>
            <Tab $active={activeTab === 'service'} onClick={() => setActiveTab('service')}>
              <IconWorld size={18} />
              Web Service
            </Tab>
          </TabContainer>
          
          {activeTab === 'file' && (
            <TabContent>
              <FileUploadArea>
                <FileUploadIcon>
                  <IconCloudUpload size={50} />
                </FileUploadIcon>
                
                <FileUploadText>
                  <h3>Drag and drop your file here</h3>
                  <p>or click to browse files from your computer</p>
                </FileUploadText>
                
                <SupportedFormats>
                  <FormatBadge>GeoJSON</FormatBadge>
                  <FormatBadge>Shapefile</FormatBadge>
                  <FormatBadge>KML</FormatBadge>
                  <FormatBadge>GML</FormatBadge>
                  <FormatBadge>CSV</FormatBadge>
                  <FormatBadge>XLSX</FormatBadge>
                </SupportedFormats>
                
                <input 
                  type="file" 
                  id="file-upload" 
                  hidden 
                  accept=".geojson,.json,.kml,.shp,.csv,.xlsx,.gpx"
                  onChange={handleFileChange}
                />
                
                <BrowseButton onClick={() => document.getElementById('file-upload')?.click()}>
                  Browse Files
                </BrowseButton>
              </FileUploadArea>
              
              {selectedFile && (
                <FormGroup>
                  <Label>Selected File</Label>
                  <div>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</div>
                </FormGroup>
              )}
              
              <FormGroup>
                <Label>Layer Options</Label>
                <Select>
                  <option value="auto">Auto-detect geometry type</option>
                  <option value="point">Point</option>
                  <option value="line">Line</option>
                  <option value="polygon">Polygon</option>
                </Select>
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton onClick={onClose}>Cancel</CancelButton>
                <SaveButton onClick={handleImport}>Import</SaveButton>
              </ButtonGroup>
            </TabContent>
          )}
          
          {activeTab === 'database' && (
            <TabContent>
              <FormGroup>
                <Label>Database Type</Label>
                <Select>
                  <option value="postgres">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="mssql">SQL Server</option>
                  <option value="oracle">Oracle</option>
                  <option value="sqlite">SQLite</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Host</Label>
                <Input type="text" placeholder="localhost" />
              </FormGroup>
              
              <FormGroup>
                <Label>Port</Label>
                <Input type="text" placeholder="5432" />
              </FormGroup>
              
              <FormGroup>
                <Label>Database Name</Label>
                <Input type="text" placeholder="mydatabase" />
              </FormGroup>
              
              <FormGroup>
                <Label>Username</Label>
                <Input type="text" placeholder="username" />
              </FormGroup>
              
              <FormGroup>
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" />
              </FormGroup>
              
              <FormGroup>
                <Label>SQL Query (Optional)</Label>
                <Input 
                  type="text" 
                  placeholder="SELECT * FROM spatial_table WHERE..." 
                  style={{ fontFamily: 'monospace' }}
                />
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton onClick={onClose}>Cancel</CancelButton>
                <SaveButton onClick={handleImport}>Connect</SaveButton>
              </ButtonGroup>
            </TabContent>
          )}
          
          {activeTab === 'service' && (
            <TabContent>
              <ServiceCard>
                <ServiceIcon>
                  <IconTable size={24} />
                </ServiceIcon>
                <ServiceInfo>
                  <ServiceTitle>Web Map Service (WMS)</ServiceTitle>
                  <ServiceDescription>
                    Connect to OGC WMS services to display raster map layers
                  </ServiceDescription>
                </ServiceInfo>
              </ServiceCard>
              
              <ServiceCard>
                <ServiceIcon>
                  <IconFile size={24} />
                </ServiceIcon>
                <ServiceInfo>
                  <ServiceTitle>Web Feature Service (WFS)</ServiceTitle>
                  <ServiceDescription>
                    Access vector features from OGC WFS services
                  </ServiceDescription>
                </ServiceInfo>
              </ServiceCard>
              
              <ServiceCard>
                <ServiceIcon>
                  <IconWorld size={24} />
                </ServiceIcon>
                <ServiceInfo>
                  <ServiceTitle>Vector Tile Service</ServiceTitle>
                  <ServiceDescription>
                    Add Mapbox or other vector tile services
                  </ServiceDescription>
                </ServiceInfo>
              </ServiceCard>
              
              <FormGroup>
                <Label>Service URL</Label>
                <Input type="text" placeholder="https://example.com/geoserver/wms" />
              </FormGroup>
              
              <FormGroup>
                <Label>Service Type</Label>
                <Select>
                  <option value="wms">WMS</option>
                  <option value="wfs">WFS</option>
                  <option value="vectortile">Vector Tile</option>
                  <option value="arcgis">ArcGIS REST</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Layer Name (Optional)</Label>
                <Input type="text" placeholder="layer_name" />
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton onClick={onClose}>Cancel</CancelButton>
                <SaveButton onClick={handleImport}>Connect</SaveButton>
              </ButtonGroup>
            </TabContent>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default ImportDataModal; 