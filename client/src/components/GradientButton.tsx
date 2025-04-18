import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../styles/theme';

interface GradientButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
  large?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

const StyledButton = styled(motion.button)<{ $fullWidth?: boolean; $large?: boolean }>`
  background: ${theme.gradients.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeight.bold};
  border: none;
  border-radius: ${theme.borderRadius.full};
  padding: ${props => props.$large ? '1rem 2rem' : '0.75rem 1.5rem'};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  font-size: ${props => props.$large ? '1.25rem' : '1rem'};
  cursor: pointer;
  box-shadow: ${theme.shadows.md};
  transition: ${theme.transitions.default};
  font-family: ${theme.fontFamily.poppins};
  
  &:hover {
    box-shadow: ${theme.shadows.xl};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const GradientButton: React.FC<GradientButtonProps> = ({
  onClick,
  children,
  fullWidth = false,
  large = false,
  type = 'button',
  className = '',
  disabled = false
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      $fullWidth={fullWidth}
      $large={large}
      className={className}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      animate={{ 
        opacity: [0.8, 1, 0.8],
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </StyledButton>
  );
};

export default GradientButton;
