import React from 'react';
import { Link } from 'react-router-dom';
import { IconMap, IconMapPin, IconPlus, IconArrowRight } from '@tabler/icons-react';
import Header from './common/Header';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  padding: 5rem 0;
  text-align: center;
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    var(--color-background-secondary) 100%
  );
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  max-width: 700px;
  margin: 0 auto 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: all 0.2s;
  background-color: ${props => props.$primary ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.$primary ? '#fff' : 'var(--color-text)'};
  border: ${props => props.$primary ? 'none' : '1px solid var(--color-border)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-shadow);
    background-color: ${props => props.$primary ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)'};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: var(--color-background);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: var(--color-background-secondary);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px var(--color-shadow);
  }

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--color-text);
    display: flex;
    align-items: center;
  }

  svg {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }

  p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
`;

const HeroImage = styled.div`
  max-width: 800px;
  margin: 0 auto;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 8px 30px var(--color-shadow);
`;

const Dashboard: React.FC = () => {
  const features = [
    {
      title: 'Intuitive Mapping Interface',
      description: 'Enjoy a clean, modern interface that makes creating and exploring maps simple and enjoyable.',
      icon: <IconMap size={24} />
    },
    {
      title: 'Layer Management',
      description: 'Easily add, style, and organize multiple data layers with our intuitive drag-and-drop interface.',
      icon: <IconMapPin size={24} />
    },
    {
      title: 'Customizable Workspace',
      description: 'Arrange your workspace to fit your workflow with modular panels and tools.',
      icon: <IconPlus size={24} />
    },
    {
      title: 'Data Import/Export',
      description: 'Import various geospatial data formats and export your maps as images or interactive web maps.',
      icon: <IconArrowRight size={24} />
    },
    {
      title: 'Real-time Collaboration',
      description: 'Work together with teammates on the same map in real-time, making collaboration seamless.',
      icon: <IconMap size={24} />
    },
    {
      title: 'Interactive Annotations',
      description: 'Add labels, drawings, and custom annotations to your maps to highlight important information.',
      icon: <IconMapPin size={24} />
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardContainer>
      <Header />
      
      <HeroSection>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <Title>Mapping Made Simple</Title>
          <Subtitle>
            Create beautiful, interactive maps with our intuitive interface.
            No GIS expertise required.
          </Subtitle>
          
          <ButtonGroup>
            <Button to="/editor/new" $primary>
              <IconPlus size={20} />
              Create New Map
            </Button>
            <Button to="/projects">
              <IconMap size={20} />
              View Projects
            </Button>
          </ButtonGroup>
          
          <HeroImage>
            <img 
              src="/map-preview.jpg" 
              alt="DiantebiMap Preview" 
              style={{ width: '100%', height: 'auto' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </HeroImage>
        </motion.div>
      </HeroSection>
      
      <FeaturesSection>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h3>{feature.icon} {feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </DashboardContainer>
  );
};

export default Dashboard; 