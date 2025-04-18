import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../styles/theme';
import { HabitCategory } from '../types';
import { useUser } from '../contexts/UserContext';

interface HabitModalProps {
  habit: HabitCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius['3xl']};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 64rem;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    max-height: 80vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: ${theme.colors.white};
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  i {
    font-size: 1.25rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const LeftSection = styled.div`
  position: relative;
  width: 100%;
  height: 16rem;
  
  @media (min-width: ${theme.breakpoints.md}) {
    width: 40%;
    height: auto;
    max-height: 80vh;
  }
`;

const HabitHero = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2));
    z-index: 1;
  }
`;

const HabitInfo = styled.div`
  position: relative;
  z-index: 2;
  padding: 2rem;
  color: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HabitTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const HabitStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StatusBadge = styled.div<{ status: string }>`
  padding: 0.5rem 1.25rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: ${theme.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.white};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  ${({ status }) => {
    switch (status) {
      case 'Excellent':
        return `background-color: ${theme.colors.status.excellent};`;
      case 'Good':
        return `background-color: ${theme.colors.status.good};`;
      case 'Fair':
        return `background-color: ${theme.colors.status.fair};`;
      default:
        return `background-color: ${theme.colors.status.needsWork};`;
    }
  }}
  
  i {
    font-size: 1rem;
  }
`;

const StreakText = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.white};
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.full};
  backdrop-filter: blur(4px);

  i {
    color: ${theme.colors.accent2};
    margin-right: 0.625rem;
    font-size: 1.125rem;
  }
`;

const RightSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 2.5rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 1.25rem;
  color: ${theme.colors.gray[800]};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  i {
    color: ${theme.colors.primary.pink};
    font-size: 1.25rem;
  }
`;

const ProgressSection = styled.div`
  margin-bottom: 2.5rem;
`;

const WeekGrid = styled.div`
  background: linear-gradient(to right, rgba(237, 201, 255, 0.1), rgba(254, 212, 231, 0.1));
  padding: 1.5rem;
  border-radius: ${theme.borderRadius.xl};
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  box-shadow: inset 0 0 0 1px rgba(237, 201, 255, 0.3);
`;

const DayCircle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .day-indicator {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.white};
    background: ${theme.gradients.primary};
    font-weight: ${theme.fontWeight.bold};
    font-size: 1.125rem;
    box-shadow: 0 4px 8px rgba(237, 201, 255, 0.4);
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }

  .completion {
    font-size: 0.875rem;
    color: ${theme.colors.accent1};
    font-weight: ${theme.fontWeight.medium};
  }
`;

const TasksSection = styled.div`
  margin-bottom: 2.5rem;
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.gray[100]};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  .checkbox-container {
    position: relative;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1.25rem;
  }

  input[type="checkbox"] {
    width: 1.5rem;
    height: 1.5rem;
    opacity: 0;
    position: absolute;
    cursor: pointer;
    z-index: 2;
  }
  
  .checkbox-custom {
    position: absolute;
    top: 0;
    left: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 2px solid ${theme.colors.primary.pink};
    background-color: white;
    transition: all 0.2s ease;
    pointer-events: none;
    
    &:after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      color: white;
      font-size: 1rem;
      transition: all 0.2s ease;
    }
  }
  
  input[type="checkbox"]:checked + .checkbox-custom {
    background-color: ${theme.colors.primary.pink};
    
    &:after {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  .task-content {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-name {
    color: ${theme.colors.gray[800]};
    font-size: 1.125rem;
    font-weight: ${theme.fontWeight.medium};
  }

  .points {
    font-weight: ${theme.fontWeight.semibold};
    color: ${theme.colors.accent2};
    font-size: 1rem;
    padding: 0.25rem 0.75rem;
    background: rgba(229, 183, 105, 0.1);
    border-radius: ${theme.borderRadius.full};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  margin-top: auto;
  border-top: 1px solid ${theme.colors.gray[200]};
`;

const MilestoneText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span:first-child {
    color: ${theme.colors.gray[600]};
    font-size: 0.875rem;
  }

  span:nth-child(2) {
    font-weight: ${theme.fontWeight.semibold};
    color: ${theme.colors.gray[800]};
    font-size: 1.125rem;
  }

  span:last-child {
    font-size: 0.875rem;
    color: ${theme.colors.primary.pink};
    font-weight: ${theme.fontWeight.medium};
  }
`;

const AddTaskButton = styled.button`
  background: ${theme.gradients.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeight.medium};
  padding: 0.75rem 1.5rem;
  border-radius: ${theme.borderRadius.full};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 8px rgba(237, 201, 255, 0.4);

  i {
    font-size: 0.875rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(237, 201, 255, 0.5);
  }
`;

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const HabitModal: React.FC<HabitModalProps> = ({ habit, isOpen, onClose }) => {
  const { updateHabitTask } = useUser();

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (habit) {
      updateHabitTask(habit.id, taskId, completed);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && habit && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <LeftSection>
              <HabitHero>
                <img src={habit.avatarSrc} alt={habit.name} />
                <CloseButton onClick={onClose}>
                  <i className="fas fa-times"></i>
                </CloseButton>
                <HabitInfo>
                  <HabitTitle>{habit.name} Quest</HabitTitle>
                  <HabitStatus>
                    <StatusBadge status={habit.status}>
                      <i className="fas fa-medal"></i>
                      {habit.status}
                    </StatusBadge>
                    <StreakText>
                      <i className="fas fa-fire"></i>
                      <span>{habit.streak} day streak</span>
                    </StreakText>
                  </HabitStatus>
                </HabitInfo>
              </HabitHero>
            </LeftSection>

            <RightSection>
              <ProgressSection>
                <SectionTitle>
                  <i className="fas fa-chart-line"></i>
                  Your Progress
                </SectionTitle>
                <WeekGrid>
                  {weekDays.map((day, index) => (
                    <DayCircle key={index}>
                      <div className="day-indicator">{day}</div>
                      <span className="completion">✓</span>
                    </DayCircle>
                  ))}
                </WeekGrid>
              </ProgressSection>

              <TasksSection>
                <SectionTitle>
                  <i className="fas fa-tasks"></i>
                  Today's Tasks
                </SectionTitle>
                <TasksList>
                  {habit.tasks.map((task) => (
                    <TaskItem key={task.id}>
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) =>
                            handleTaskToggle(task.id, e.target.checked)
                          }
                        />
                        <div className="checkbox-custom"></div>
                      </div>
                      <div className="task-content">
                        <span className="task-name">{task.name}</span>
                        <span className="points">+{task.points} pts</span>
                      </div>
                    </TaskItem>
                  ))}
                </TasksList>
              </TasksSection>

              <ModalFooter>
                <MilestoneText>
                  <span>Next milestone:</span>
                  <span>{habit.streak + 3} day streak</span>
                  <span>+25 bonus pts</span>
                </MilestoneText>
                <AddTaskButton>
                  <i className="fas fa-plus"></i>
                  Add Custom Task
                </AddTaskButton>
              </ModalFooter>
            </RightSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default HabitModal;
