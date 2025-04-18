import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../styles/theme';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onClick?: () => void;
  checkedIn?: boolean;
  enrolled?: boolean;
  onCheckIn?: (e: React.MouseEvent) => void;
}

const CardContainer = styled(motion.div)`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius['xl']};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.4s ease;
  border: 1px solid rgba(140, 111, 240, 0.08);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #8C6FF0, #E372A8);
    opacity: 0.7;
    transition: all 0.3s ease;
  }

  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transform: translateY(-6px);
    
    &::before {
      opacity: 1;
      height: 6px;
    }
  }
`;

const CardBody = styled.div`
  padding: 2rem;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 1.5rem;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const ChallengeInfo = styled.div`
  display: flex;
  align-items: flex-start;

  .icon {
    width: 3rem;
    height: 3rem;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.gradients.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.white};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-size: 1.25rem;
  }

  .text {
    margin-left: 1rem;

    h3 {
      font-weight: ${theme.fontWeight.bold};
      margin-bottom: 0.375rem;
      font-size: 1.125rem;
      color: ${theme.colors.gray[900]};
    }

    p {
      font-size: 0.875rem;
      color: ${theme.colors.gray[500]};
      display: flex;
      align-items: center;

      i {
        margin-right: 0.375rem;
        color: ${theme.colors.primary.pink};
        opacity: 0.8;
      }
    }
  }
`;

const ParticipantsBadge = styled.div`
  background-color: ${theme.colors.secondary.lavender}20;
  padding: 0.5rem 0.75rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.75rem;
  color: ${theme.colors.primary.pink};
  font-weight: ${theme.fontWeight.medium};
  display: flex;
  align-items: center;
  border: 1px solid ${theme.colors.secondary.lavender}30;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);

  i {
    margin-right: 0.375rem;
    font-size: 0.875rem;
  }
`;

const ProgressSection = styled.div`
  margin-bottom: 1.75rem;
  background-color: rgba(140, 111, 240, 0.05);
  padding: 1.5rem;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid rgba(140, 111, 240, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(140, 111, 240, 0.3), transparent);
    border-radius: ${theme.borderRadius.full};
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: ${theme.colors.gray[700]};
    margin-bottom: 0.75rem;

    .percentage {
      font-weight: ${theme.fontWeight.semibold};
      color: #8C6FF0;
      background: linear-gradient(90deg, #8C6FF0, #E372A8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding: 0 0.5rem;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #8C6FF0, #E372A8);
        opacity: 0.5;
        border-radius: ${theme.borderRadius.full};
      }
    }
  }

  .progress-bar {
    height: 0.75rem;
    background-color: rgba(140, 111, 240, 0.12);
    border-radius: ${theme.borderRadius.full};
    overflow: hidden;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
    position: relative;

    .fill {
      height: 100%;
      background: linear-gradient(90deg, #8C6FF0, #E372A8);
      border-radius: ${theme.borderRadius.full};
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 10px;
        background: white;
        opacity: 0.2;
        filter: blur(5px);
      }
    }
  }
`;

const RewardsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;

  .reward-info {
    p {
      font-size: 0.875rem;
      color: ${theme.colors.gray[600]};
      margin-bottom: 0.375rem;
      font-weight: ${theme.fontWeight.medium};
    }

    .rewards {
      display: flex;
      align-items: center;

      i {
        margin-right: 0.375rem;

        &.points {
          color: ${theme.colors.secondary.gold};
          font-size: 1rem;
        }

        &.item {
          color: ${theme.colors.primary.blue};
          font-size: 1rem;
        }
      }

      span {
        font-weight: ${theme.fontWeight.semibold};
        color: ${theme.colors.gray[800]};
      }

      .separator {
        margin: 0 0.75rem;
        color: ${theme.colors.gray[400]};
      }
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${theme.colors.gray[100]};
  margin: 1.5rem 0;
`;

const CheckInButton = styled.button<{ $checkedIn?: boolean }>`
  background: ${props => props.$checkedIn 
    ? theme.colors.gray[300] 
    : 'linear-gradient(135deg, #8C6FF0 0%, #E372A8 100%)'
  };
  color: ${props => props.$checkedIn ? theme.colors.gray[600] : theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: ${theme.fontWeight.medium};
  cursor: ${props => props.$checkedIn ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${props => props.$checkedIn 
    ? 'none' 
    : '0 4px 10px rgba(140, 111, 240, 0.15)'
  };

  &:hover {
    box-shadow: ${props => props.$checkedIn 
      ? 'none' 
      : '0 6px 15px rgba(140, 111, 240, 0.25)'
    };
    transform: ${props => props.$checkedIn ? 'none' : 'translateY(-2px)'};
  }

  &:active {
    transform: ${props => props.$checkedIn ? 'none' : 'translateY(1px)'};
    box-shadow: ${props => props.$checkedIn 
      ? 'none' 
      : '0 2px 5px rgba(140, 111, 240, 0.2)'
    };
  }

  i {
    font-size: 1rem;
  }
`;

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onClick, 
  checkedIn = false,
  enrolled = false,
  onCheckIn
}) => {
  const progressPercentage = (challenge.daysCompleted / challenge.daysTotal) * 100;

  // Button click handler with fallback to card click
  const handleButtonClick = (e: React.MouseEvent) => {
    if (onCheckIn) {
      onCheckIn(e);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <CardContainer
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
    >
      <CardBody>
        <HeaderSection>
          <ChallengeInfo>
            <div className="icon">
              <i className={`fas fa-${challenge.icon}`}></i>
            </div>
            <div className="text">
              <h3>{challenge.title}</h3>
              <p>
                <i className="fas fa-calendar-alt"></i>
                {challenge.daysRemaining} days remaining
              </p>
            </div>
          </ChallengeInfo>

          <ParticipantsBadge>
            <i className="fas fa-users"></i>
            {challenge.participants} participants
          </ParticipantsBadge>
        </HeaderSection>

        <ProgressSection>
          <div className="progress-labels">
            <span>Progress: {challenge.daysCompleted}/{challenge.daysTotal} days</span>
            <span className="percentage">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="progress-bar">
            <div className="fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </ProgressSection>

        <Divider />

        <RewardsSection>
          <div className="reward-info">
            <p>Reward:</p>
            <div className="rewards">
              <i className="fas fa-star points"></i>
              <span>{challenge.rewards.points} points</span>

              {challenge.rewards.item && (
                <>
                  <span className="separator">+</span>
                  <i className={`fas fa-${challenge.rewards.itemIcon} item`}></i>
                  <span>{challenge.rewards.item}</span>
                </>
              )}
            </div>
          </div>

          {!enrolled ? (
            <CheckInButton onClick={handleButtonClick} $checkedIn={false}>
              <i className="fas fa-plus-circle"></i>
              Enroll
            </CheckInButton>
          ) : (
            <CheckInButton onClick={handleButtonClick} $checkedIn={checkedIn}>
              <i className={`fas ${checkedIn ? 'fa-check' : 'fa-calendar-check'}`}></i>
              {checkedIn ? 'Checked In' : 'Check In'}
            </CheckInButton>
          )}
        </RewardsSection>
      </CardBody>
    </CardContainer>
  );
};

export default ChallengeCard;