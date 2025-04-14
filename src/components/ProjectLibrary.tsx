import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  IconPlus, 
  IconSearch, 
  IconAdjustments, 
  IconTrash, 
  IconCopy, 
  IconShare, 
  IconMap
} from '@tabler/icons-react';
import Header from './common/Header';

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ProjectsContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  color: var(--color-text);
`;

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  
  &:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-shadow);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  display: flex;
  flex: 1;
  min-width: 300px;
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-background-secondary);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled.div`
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: var(--color-background-secondary);
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px var(--color-shadow);
  }
`;

const ProjectThumbnail = styled.div`
  width: 100%;
  height: 180px;
  background-color: var(--color-background);
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--color-text-secondary);
    background-color: var(--color-background);
    
    svg {
      font-size: 3rem;
    }
  }
`;

const ProjectInfo = styled.div`
  padding: 1.25rem;
`;

const ProjectName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.25rem;
`;

const ProjectActions = styled.div`
  display: flex;
  justify-content: space-between;
  
  .left {
    display: flex;
    gap: 0.5rem;
  }
  
  .right {
    display: flex;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-background-secondary);
    color: var(--color-primary);
  }
  
  &.delete:hover {
    color: var(--color-error);
    border-color: var(--color-error);
  }
`;

const OpenButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 0;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--color-text);
  }
  
  p {
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
  }
  
  svg {
    font-size: 3rem;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }
`;

// Mock data for projects
const mockProjects = [
  {
    id: '1',
    name: 'Urban Planning Analysis',
    thumbnail: null,
    lastEdited: '2 days ago',
    date: '2023-10-25'
  },
  {
    id: '2',
    name: 'Population Density Map',
    thumbnail: '/project-2-thumb.jpg',
    lastEdited: 'Yesterday',
    date: '2023-10-28'
  },
  {
    id: '3',
    name: 'Transportation Network',
    thumbnail: '/project-3-thumb.jpg',
    lastEdited: '1 week ago',
    date: '2023-10-20'
  },
  {
    id: '4',
    name: 'Environmental Study',
    thumbnail: null,
    lastEdited: '3 days ago',
    date: '2023-10-24'
  }
];

const ProjectLibrary: React.FC = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleDelete = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };
  
  const handleDuplicate = (id: string) => {
    const projectToDuplicate = projects.find(project => project.id === id);
    if (projectToDuplicate) {
      const newProject = {
        ...projectToDuplicate,
        id: Date.now().toString(),
        name: `${projectToDuplicate.name} (Copy)`,
        lastEdited: 'Just now',
        date: new Date().toISOString().split('T')[0]
      };
      setProjects([newProject, ...projects]);
    }
  };
  
  const filteredProjects = searchQuery
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;
  
  return (
    <ProjectsContainer>
      <Header />
      <ProjectsContent>
        <TopBar>
          <Title>Your Projects</Title>
          <CreateButton to="/editor/new">
            <IconPlus size={20} />
            Create New Map
          </CreateButton>
        </TopBar>
        
        <SearchContainer>
          <SearchBar>
            <IconSearch size={20} />
            <SearchInput 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={handleSearch}
            />
          </SearchBar>
          <FilterButton>
            <IconAdjustments size={20} />
            Filter
          </FilterButton>
        </SearchContainer>
        
        {filteredProjects.length > 0 ? (
          <ProjectGrid>
            {filteredProjects.map(project => (
              <ProjectCard key={project.id}>
                <ProjectThumbnail>
                  {project.thumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={project.name}
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.style.display = 'none';
                        
                        const parent = imgElement.parentNode as HTMLElement;
                        if (parent) {
                          const placeholder = parent.querySelector('.placeholder');
                          if (placeholder) {
                            (placeholder as HTMLElement).style.display = 'flex';
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="placeholder">
                      <IconMap size={50} />
                    </div>
                  )}
                </ProjectThumbnail>
                <ProjectInfo>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectMeta>
                    <span>Last edited: {project.lastEdited}</span>
                    <span>{project.date}</span>
                  </ProjectMeta>
                  <ProjectActions>
                    <div className="left">
                      <ActionButton 
                        className="delete" 
                        title="Delete"
                        onClick={() => handleDelete(project.id)}
                      >
                        <IconTrash size={18} />
                      </ActionButton>
                      <ActionButton 
                        title="Duplicate"
                        onClick={() => handleDuplicate(project.id)}
                      >
                        <IconCopy size={18} />
                      </ActionButton>
                      <ActionButton title="Share">
                        <IconShare size={18} />
                      </ActionButton>
                    </div>
                    <div className="right">
                      <OpenButton to={`/editor/${project.id}`}>
                        Open
                      </OpenButton>
                    </div>
                  </ProjectActions>
                </ProjectInfo>
              </ProjectCard>
            ))}
          </ProjectGrid>
        ) : (
          <EmptyState>
            <IconMap size={60} />
            <h3>No projects found</h3>
            <p>
              {searchQuery 
                ? `No projects match your search for "${searchQuery}"`
                : "You don't have any projects yet. Create your first map!"}
            </p>
            <CreateButton to="/editor/new">
              <IconPlus size={20} />
              Create New Map
            </CreateButton>
          </EmptyState>
        )}
      </ProjectsContent>
    </ProjectsContainer>
  );
};

export default ProjectLibrary; 