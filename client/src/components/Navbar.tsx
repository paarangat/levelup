import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import theme from '../styles/theme';
import { useUser } from '../contexts/UserContext';
import MaleSkin1 from '../assets/Male_Skin1.png';
import FemaleSkin1 from '../assets/Female_Skin1.png';
import LevelUpLogo from '@assets/logo.png';

const NavContainer = styled.nav`
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: ${theme.shadows.md};
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 50;
  border-bottom: 1px solid rgba(237, 201, 255, 0.3);
`;

const NavContent = styled.div`
  max-width: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.75rem 1rem;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 1rem 2rem;
    grid-template-columns: 1fr auto 1fr;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 1rem 3rem;
  }
`;



const Logo = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  justify-self: start;

  img {
    height: 40px;
    width: auto;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const DesktopNav = styled.div`
  display: none;

  @media (min-width: ${theme.breakpoints.md}) {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    gap: 1rem;
  }
`;



const NavButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.25rem;
  border-radius: ${theme.borderRadius.lg};
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.md};
  font-family: ${theme.fontFamily.outfit};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: none;
  cursor: pointer;

  ${props => props.$active ? `
    background: linear-gradient(135deg, #F2B79F 0%, #E5B769 100%);
    color: ${theme.colors.white};
    box-shadow: 0 4px 8px rgba(242, 183, 159, 0.5);
    transform: translateY(-2px);
  ` : `
    background: transparent;
    color: ${theme.colors.gray[700]};

    &:hover {
      background-color: rgba(242, 183, 159, 0.1);
      transform: translateY(-2px);
    }
  `}

  i {
    font-size: ${theme.fontSize.lg};
  }
`;

const MobileNav = styled.div`
  border-top: 1px solid rgba(140, 111, 240, 0.15);
  padding: 0.75rem 0.5rem;
  display: flex;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 49; // Below main nav but above page content
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.07);

  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileNavButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.625rem 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.$active ? '#8C6FF0' : theme.colors.gray[600]};
  flex-grow: 1; // Make buttons distribute space evenly
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -0.75rem;
    left: 50%;
    transform: translateX(-50%) ${props => props.$active ? 'scaleX(1)' : 'scaleX(0)'};
    width: 1.5rem;
    height: 0.25rem;
    background: linear-gradient(90deg, #8C6FF0, #E372A8);
    border-radius: ${theme.borderRadius.full};
    opacity: ${props => props.$active ? 1 : 0};
    transition: all 0.3s ease;
  }

  span {
    font-size: ${theme.fontSize.xs};
    margin-top: 0.375rem;
    font-weight: ${props => props.$active ? theme.fontWeight.semibold : theme.fontWeight.medium};
    background: ${props => props.$active 
      ? 'linear-gradient(90deg, #8C6FF0, #E372A8)' 
      : 'none'};
    -webkit-background-clip: ${props => props.$active ? 'text' : 'none'};
    -webkit-text-fill-color: ${props => props.$active ? 'transparent' : 'inherit'};
  }

  i {
    font-size: 1.25rem;
    transition: transform 0.3s ease;
    transform: ${props => props.$active ? 'translateY(-2px)' : 'none'};
  }

  &:hover {
    i {
      transform: translateY(-2px);
    }
    
    &::before {
      opacity: 0.5;
      transform: translateX(-50%) scaleX(0.7);
    }
  }
`;

const UserArea = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  justify-self: end;

  @media (min-width: ${theme.breakpoints.md}) {
    gap: 1.25rem;
  }
`;


const PointsDisplay = styled.div`
  display: none;

  @media (min-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    background: linear-gradient(to right, rgba(242, 183, 159, 0.2), rgba(229, 183, 105, 0.2));
    border-radius: ${theme.borderRadius.full};
    padding: 0.5rem 1rem;
    box-shadow: inset 0 0 0 1px rgba(242, 183, 159, 0.3);
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(to right, rgba(242, 183, 159, 0.3), rgba(229, 183, 105, 0.3));
      transform: translateY(-2px);
    }

    i {
      color: ${theme.colors.accent2};
      font-size: ${theme.fontSize.lg};
    }

    span {
      margin-left: 0.5rem;
      font-weight: ${theme.fontWeight.semibold};
      font-size: ${theme.fontSize.md};
      color: ${theme.colors.gray[800]};
    }
  }
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem; // Reduce padding slightly for mobile
  border-radius: ${theme.borderRadius.full};
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(242, 183, 159, 0.1);
  }

  .avatar {
    width: 2.5rem; // Slightly smaller avatar for mobile
    height: 2.5rem;
    border-radius: ${theme.borderRadius.full};
    overflow: hidden;
    border: 2px solid transparent;
    background: linear-gradient(to right, ${theme.colors.secondary.peach}, ${theme.colors.secondary.gold}) border-box;
    mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      background-color: #f8f8f8;
    }
  }

  span {
    display: none;
  }

  i {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 0.5rem; // Restore padding for desktop
    .avatar {
        width: 2.75rem; // Restore avatar size for desktop
        height: 2.75rem;
    }
    span {
      display: block;
      margin-left: 0.75rem;
      font-weight: ${theme.fontWeight.semibold};
      font-size: ${theme.fontSize.md};
      color: ${theme.colors.gray[800]};
    }
    i {
      display: block;
      color: ${theme.colors.gray[400]};
      margin-left: 0.5rem;
    }
  }
`;

const ProfileDropdown = styled(motion.div)`
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 12rem;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  overflow: hidden;
  z-index: 10;
  top: 100%; // Position below the button
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${theme.colors.gray[700]};
  text-decoration: none;

  &:hover {
    background-color: ${theme.colors.gray[100]};
  }

  i {
    margin-right: 0.5rem;
  }
`;

const Divider = styled.div`
  border-top: 1px solid ${theme.colors.gray[100]};
`;

const ProfileContainer = styled.div`
  position: relative;
`;

interface NavbarProps {
  activeTab?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab = 'home' }) => {
  const [location, setLocation] = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(activeTab);
  const { user, resetUser } = useUser();

  useEffect(() => {
    const path = location.substring(1) || 'home';
    setCurrentTab(path);
  }, [location]);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'home') {
      setLocation('/');
    } else {
      setLocation(`/${tab}`);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    resetUser();
    setLocation('/');
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#profile-container') && dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <NavContainer>
        <NavContent>
          <Logo onClick={() => handleTabClick('home')}>
            <img src={LevelUpLogo} alt="LevelUp Logo" />
          </Logo>

          <DesktopNav>
            <NavButton
              $active={currentTab === 'home'}
              onClick={() => handleTabClick('home')}
            >
              <i className="fas fa-home"></i>Home
            </NavButton>
            <NavButton
              $active={currentTab === 'todo'}
              onClick={() => handleTabClick('todo')}
            >
              <i className="fas fa-check-circle"></i>ToDo
            </NavButton>
            <NavButton
              $active={currentTab === 'connect'}
              onClick={() => handleTabClick('connect')}
            >
              <i className="fas fa-users"></i>Connect
            </NavButton>
            <NavButton
              $active={currentTab === 'challenge'}
              onClick={() => handleTabClick('challenge')}
            >
              <i className="fas fa-trophy"></i>Challenge
            </NavButton>
            <NavButton
              $active={currentTab === 'rewards'}
              onClick={() => handleTabClick('rewards')}
            >
              <i className="fas fa-gift"></i>Rewards
            </NavButton>
          </DesktopNav>

          <UserArea>
            <PointsDisplay>
              <i className="fas fa-star"></i>
              <span>{user?.points ?? 0} pts</span>
            </PointsDisplay>

            <ProfileContainer id="profile-container">
              <ProfileButton onClick={toggleDropdown}>
                <div className="avatar">
                  <img 
                    src={user.avatar || (user.gender === 'female' ? FemaleSkin1 : MaleSkin1)} 
                    alt={`${user.name}'s Avatar`} 
                  />
                </div>
                <span>{user?.name}</span>
                <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
              </ProfileButton>

              <AnimatePresence>
                {dropdownOpen && (
                  <ProfileDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem href="/profile" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-user"></i>My Profile
                    </DropdownItem>
                    <DropdownItem href="/settings" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-cog"></i>Settings
                    </DropdownItem>
                    <Divider />
                    <DropdownItem href="#" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>Logout
                    </DropdownItem>
                  </ProfileDropdown>
                )}
              </AnimatePresence>
            </ProfileContainer>
          </UserArea>
        </NavContent>
      </NavContainer>

      <MobileNav>
          <MobileNavButton
            $active={currentTab === 'home'}
            onClick={() => handleTabClick('home')}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </MobileNavButton>
          <MobileNavButton
            $active={currentTab === 'todo'}
            onClick={() => handleTabClick('todo')}
          >
            <i className="fas fa-check-circle"></i>
            <span>ToDo</span>
          </MobileNavButton>
          <MobileNavButton
            $active={currentTab === 'connect'}
            onClick={() => handleTabClick('connect')}
          >
            <i className="fas fa-users"></i>
            <span>Connect</span>
          </MobileNavButton>
          <MobileNavButton
            $active={currentTab === 'challenge'}
            onClick={() => handleTabClick('challenge')}
          >
            <i className="fas fa-trophy"></i>
            <span>Challenge</span>
          </MobileNavButton>
          <MobileNavButton
            $active={currentTab === 'rewards'}
            onClick={() => handleTabClick('rewards')}
          >
            <i className="fas fa-gift"></i>
            <span>Rewards</span>
          </MobileNavButton>
        </MobileNav>
    </>
  );
};

export default Navbar;