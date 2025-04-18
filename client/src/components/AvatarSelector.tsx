import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../styles/theme';
import MaleDefault from '@assets/Male_Avatar.png';
import FemaleDefault from '@assets/Female_Avatar.png';

interface AvatarSelectorProps {
  selectedGender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
}

const SelectorContainer = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.colors.gray[700]};
  }
`;

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const AvatarCard = styled(motion.div)<{ $selected: boolean }>`
  position: relative;
  background-color: ${theme.colors.white};
  border: 1px solid ${props => props.$selected ? theme.colors.primary.pink : theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  padding: 1rem;
  cursor: pointer;
  transition: ${theme.transitions.default};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    left: -5px;
    margin: auto;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    border-radius: 10px;
    background: ${theme.gradients.cardBefore};
    z-index: -10;
    pointer-events: none;
    transition: ${theme.transitions.slow};
    opacity: ${props => props.$selected ? 1 : 0};
  }
  
  &::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: ${theme.gradients.cardAfter};
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
    transition: all 0.6s;
    opacity: ${props => props.$selected ? 1 : 0};
  }
  
  &:hover::after {
    filter: blur(30px);
    opacity: 0.8;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  ${props => props.$selected && `
    &::before {
      transform: rotate(-90deg) scaleX(1.1) scaleY(0.8);
    }
  `}
  
  input {
    display: none;
  }
`;

const AvatarContent = styled.div`
  text-align: center;
  
  img {
    width: 8rem;
    height: 8rem;
    margin: 0 auto;
  }
  
  label {
    display: block;
    margin-top: 0.75rem;
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.colors.gray[700]};
    cursor: pointer;
  }
`;

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedGender, onGenderChange }) => {
  return (
    <SelectorContainer>
      <label>Gender</label>
      <GenderGrid>
        <AvatarCard
          $selected={selectedGender === 'male'}
          onClick={() => onGenderChange('male')}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <input 
            type="radio" 
            name="gender" 
            id="male"
            value="male"
            checked={selectedGender === 'male'}
            onChange={() => onGenderChange('male')}
          />
          <AvatarContent>
            <motion.img 
              src={MaleDefault} 
              alt="Male Avatar"
              className="animate-float"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <label htmlFor="male">Male</label>
          </AvatarContent>
        </AvatarCard>
        
        <AvatarCard
          $selected={selectedGender === 'female'}
          onClick={() => onGenderChange('female')}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <input 
            type="radio" 
            name="gender" 
            id="female"
            value="female"
            checked={selectedGender === 'female'}
            onChange={() => onGenderChange('female')}
          />
          <AvatarContent>
            <motion.img 
              src={FemaleDefault} 
              alt="Female Avatar"
              className="animate-float"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <label htmlFor="female">Female</label>
          </AvatarContent>
        </AvatarCard>
      </GenderGrid>
    </SelectorContainer>
  );
};

export default AvatarSelector;
