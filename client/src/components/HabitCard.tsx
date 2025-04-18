import React, { KeyboardEvent } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../styles/theme';
import { HabitCategory } from '../types';
import { useUser } from '../contexts/UserContext';

// Import all avatar images for different activities based on gender
import MaleFitnessAvatar from '@assets/Male_Fitness_Avatar.png';
import FemaleCareerAvatar from '@assets/Female_Career_Avatar.png';
import MaleJournalingAvatar from '@assets/Male_Journaling_Avatar.png';
import FemaleMeditatingAvatar from '@assets/Female_Meditating_Avatar.png';
import MaleCareerAvatar from '@assets/Male_Career_Avatar.png';
import FemaleFitnessAvatar from '@assets/Female_Fitness_Avatar.png';
import FemaleJournalingAvatar from '@assets/Female_Journaling_Avatar.png';
import MaleMeditatingAvatar from '@assets/Male_Meditating_Avatar.png';
import MaleAvatar from '@assets/Male_Avatar.png';
import FemaleAvatar from '@assets/Female_Avatar.png';

interface HabitCardProps {
  habit: HabitCategory;
  onClick: (habit: HabitCategory) => void;
}

// --- Styled Components ---

const CardContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: ${theme.borderRadius['lg'] ?? '0.75rem'}; /* Slightly smaller radius */
  /* Use aspect-ratio for better responsiveness in grids */
  aspect-ratio: 3 / 4; /* Adjust ratio as needed */
  min-height: 14rem; /* Optional: set a minimum height */
  box-shadow: ${theme.shadows.md ?? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  transition: transform ${theme.transitions?.default ?? '0.2s ease-in-out'},
              box-shadow ${theme.transitions?.default ?? '0.2s ease-in-out'};

  /* Enhanced hover effect */
  &:hover, &:focus-visible {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl ?? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'};
    outline: none; /* Remove default focus outline */
  }

  /* Add focus-visible styling for keyboard navigation */
  &:focus-visible {
     box-shadow: ${theme.shadows.xl ?? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'},
                 0 0 0 3px ${theme.colors.primary?.pink ?? 'rgba(59, 130, 246, 0.5)'}; /* Focus ring */
  }

  /* Gradient Overlay for text readability */
  &::before {
    content: '';
    position: absolute;
    inset: 0; /* Replaces top, left, width, height */
    /* Stronger gradient at the bottom where text is */
    background: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%);
    z-index: 1;
    transition: background ${theme.transitions?.default ?? '0.2s ease-in-out'};
  }

  &:hover::before {
     background: linear-gradient(to bottom, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.85) 100%);
  }
`;

const CardImage = styled.img`
  display: block; /* Remove potential whitespace below image */
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Optional: Slight desaturation for better text contrast */
  /* filter: saturate(85%); */
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${theme.spacing?.md ?? '1rem'}; /* Use theme spacing */
  z-index: 10;
  color: ${theme.colors.white ?? '#FFFFFF'};

  /* Add subtle text shadow for better readability */
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
`;

const CardTitle = styled.h3`
  font-size: ${theme.fontSize?.lg ?? '1.125rem'}; /* Slightly smaller default */
  font-weight: ${theme.fontWeight?.semibold ?? 600};
  margin: 0 0 0.5rem 0; /* Adjust margin */
  line-height: 1.3; /* Improve line height */
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Use gap for spacing */
  flex-wrap: wrap; /* Allow wrapping if needed */
`;

// Define status colors within the component or ensure they exist in the theme
const statusColors = {
  Excellent: theme.colors.status?.excellent ?? '#10B981', // Green
  Good: theme.colors.status?.good ?? '#3B82F6',       // Blue
  Fair: theme.colors.status?.fair ?? '#F59E0B',         // Amber
  'Needs Work': theme.colors.status?.needsWork ?? '#EF4444', // Red
  default: theme.colors.gray?.[500] ?? '#6B7280',
};

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.2rem 0.6rem; /* Adjust padding */
  border-radius: ${theme.borderRadius?.full ?? '9999px'};
  font-size: ${theme.fontSize?.xs ?? '0.75rem'};
  font-weight: ${theme.fontWeight?.medium ?? 500};
  line-height: 1.2;
  color: ${theme.colors.white ?? '#FFFFFF'};
  background-color: ${({ status }) => statusColors[status as keyof typeof statusColors] || statusColors.default};
  /* Ensure sufficient contrast - may need adjustments based on actual colors */
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
`;

const StreakText = styled.span`
  font-size: ${theme.fontSize?.sm ?? '0.875rem'};
  font-weight: ${theme.fontWeight?.medium ?? 500};
  display: inline-flex; /* Use inline-flex */
  align-items: center;
  gap: 0.25rem; /* Space between icon and text */
  opacity: 0.9; /* Slightly less prominent than status */
`;

// Function to get the appropriate avatar based on habit name and user gender
const getAvatarByHabitAndGender = (habitName: string, gender: 'male' | 'female'): string => {
  const habitNameLower = habitName.toLowerCase();
  
  // Match habit name with corresponding avatar
  if (habitNameLower.includes('fitness') || habitNameLower.includes('exercise')) {
    return gender === 'male' ? MaleFitnessAvatar : FemaleFitnessAvatar;
  } else if (habitNameLower.includes('career') || habitNameLower.includes('work')) {
    return gender === 'male' ? MaleCareerAvatar : FemaleCareerAvatar;
  } else if (habitNameLower.includes('journal') || habitNameLower.includes('writing')) {
    return gender === 'male' ? MaleJournalingAvatar : FemaleJournalingAvatar;
  } else if (habitNameLower.includes('meditat') || habitNameLower.includes('mindful') || habitNameLower.includes('mental')) {
    return gender === 'male' ? MaleMeditatingAvatar : FemaleMeditatingAvatar;
  }
  
  // Default avatar if no specific match
  return gender === 'male' ? MaleAvatar : FemaleAvatar;
};

// --- Component Implementation ---

const HabitCard: React.FC<HabitCardProps> = ({ habit, onClick }) => {
  const { user } = useUser();
  
  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    // Trigger onClick on Enter or Spacebar press for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      onClick(habit);
    }
  };

  // Determine streak text and icon
  const showStreak = habit.streak > 0;
  
  // Get the appropriate avatar based on habit name and user gender
  const avatarSrc = getAvatarByHabitAndGender(habit.name, user.gender);

  return (
    <CardContainer
      // Add accessibility attributes
      role="button"
      tabIndex={0} // Make it focusable
      aria-label={`View details for ${habit.name}`} // Screen reader label
      onClick={() => onClick(habit)}
      onKeyPress={handleKeyPress}
      // Animation props
      whileHover={{ scale: 1.03 }} // Subtle scale on hover
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      layout // Animate layout changes if card position changes
    >
      <CardImage src={avatarSrc} alt={`Image representing ${habit.name}`} loading="lazy" />
      <CardContent>
        <CardTitle>{habit.name}</CardTitle>
        <StatusInfo>
          <StatusBadge status={habit.status}>{habit.status}</StatusBadge>
          {/* Only show streak info if streak > 0 */}
          {showStreak && (
            <StreakText>
              <i className="fas fa-fire" /> {habit.streak} {habit.streak === 1 ? 'day' : 'days'}
            </StreakText>
          )}
        </StatusInfo>
      </CardContent>
    </CardContainer>
  );
};

export default HabitCard;