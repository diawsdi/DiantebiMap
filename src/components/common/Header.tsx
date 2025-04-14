import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconMenu2, IconX, IconSun, IconMoon, IconMap } from '@tabler/icons-react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const HeaderContainer = styled.header`
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s;
  box-shadow: 0 2px 8px var(--color-shadow);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  
  svg {
    color: var(--color-primary);
    margin-right: 0.5rem;
  }
`;

const NavLinks = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px;
    flex-direction: column;
    background-color: var(--color-background);
    padding: 2rem;
    z-index: 101;
    box-shadow: -5px 0 15px var(--color-shadow);
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
    transition: transform 0.3s ease-in-out;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  margin: 0 1rem;
  padding: 0.5rem;
  color: ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-text)'};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  text-decoration: none;
  transition: all 0.2s;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: ${({ $active }) => $active ? '100%' : '0'};
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: var(--color-primary);
    transition: width 0.2s;
  }

  &:hover:after {
    width: 100%;
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 102;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 1rem;

  &:hover {
    background-color: var(--color-background-secondary);
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  z-index: 100;
`;

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <IconMap size={28} />
          DiantebiMap
        </Logo>

        <MobileMenuButton onClick={toggleMenu}>
          {menuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </MobileMenuButton>

        <Overlay $isOpen={menuOpen} onClick={closeMenu} />

        <NavLinks $isOpen={menuOpen}>
          <NavLink to="/" $active={location.pathname === '/'} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink
            to="/projects"
            $active={location.pathname === '/projects'}
            onClick={closeMenu}
          >
            Projects
          </NavLink>
          <NavLink
            to="/editor/new"
            $active={location.pathname.includes('/editor')}
            onClick={closeMenu}
          >
            Create Map
          </NavLink>
          <ThemeToggle onClick={toggleTheme}>
            {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ThemeToggle>
        </NavLinks>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 