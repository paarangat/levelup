import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../styles/theme';
import Navbar from '../components/Navbar';
import ChallengeCard from '../components/ChallengeCard';
import { useUser } from '../contexts/UserContext';
import { Challenge as ChallengeType } from '../types';

const PALETTE = {
  mauve: "#EDC9FF",
  mimiPink: "#FED4E7",
  apricot: "#F2B79F",
  earthYellow: "#E5B769",
  citrine: "#D8CC34",
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${PALETTE.mauve} 0%,
    ${PALETTE.mimiPink} 25%,
    ${PALETTE.apricot} 50%,
    ${PALETTE.earthYellow} 75%,
    ${PALETTE.citrine} 100%
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  position: relative;

  @keyframes gradient-shift {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 3.5rem 2rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 3rem;
  position: relative;
  padding-left: 1.25rem;
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.5rem;
    bottom: 0.5rem;
    width: 0.25rem;
    background: ${theme.gradients.primary};
    border-radius: ${theme.borderRadius.full};
  }
  
  h1 {
    font-size: 2.25rem;
    font-weight: ${theme.fontWeight.bold};
    margin-bottom: 0.75rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
    
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 2.5rem;
    }
  }
  
  p {
    color: ${theme.colors.gray[600]};
    font-size: 1.125rem;
    max-width: 36rem;
  }
`;

const GradientText = styled.span`
  background: ${theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 2px;
    background: ${theme.gradients.primary};
    border-radius: ${theme.borderRadius.full};
    opacity: 0.7;
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  margin-bottom: 2.5rem;
  overflow-x: auto;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 24px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    pointer-events: none;
  }
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.gray[100]};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary.pink}80;
    border-radius: ${theme.borderRadius.full};
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? theme.colors.primary.pink : 'transparent'};
  font-weight: ${props => props.$active ? theme.fontWeight.semibold : theme.fontWeight.medium};
  color: ${props => props.$active ? theme.colors.primary.pink : theme.colors.gray[600]};
  cursor: pointer;
  transition: ${theme.transitions.default};
  white-space: nowrap;
  position: relative;
  font-size: 0.95rem;
  
  i {
    margin-right: 0.5rem;
    opacity: ${props => props.$active ? 1 : 0.7};
  }
  
  &:hover {
    color: ${theme.colors.primary.pink};
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 1.5rem;
    right: 1.5rem;
    bottom: -2px;
    height: 2px;
    background: ${theme.colors.primary.pink};
    transform: scaleX(${props => props.$active ? 1 : 0});
    transition: transform 0.3s ease;
    border-radius: ${theme.borderRadius.full};
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const Filters = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.25rem;
  background-color: ${theme.colors.white};
  padding: 1.25rem;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 1.5rem;
  }
`;

const CategorySelect = styled.select`
  padding: 0.75rem 1.25rem;
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray[700]};
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.pink};
    box-shadow: 0 0 0 3px ${theme.colors.primary.pink}20;
  }
  
  &:hover {
    border-color: ${theme.colors.gray[400]};
  }
`;

const SearchInput = styled.div`
  position: relative;
  width: 100%;
  max-width: 24rem;
  
  input {
    width: 100%;
    padding: 0.75rem 1.25rem 0.75rem 2.75rem;
    border: 1px solid ${theme.colors.gray[200]};
    border-radius: ${theme.borderRadius.lg};
    background-color: ${theme.colors.white};
    color: ${theme.colors.gray[700]};
    font-size: 0.875rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.pink};
      box-shadow: 0 0 0 3px ${theme.colors.primary.pink}20;
    }
    
    &:hover {
      border-color: ${theme.colors.gray[400]};
    }
    
    &::placeholder {
      color: ${theme.colors.gray[400]};
    }
  }
  
  i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.gray[400]};
    font-size: 1rem;
  }
`;

const ChallengesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    gap: 3rem;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 1.5rem;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled(motion.div)`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  width: 100%;
  max-width: 36rem;
  box-shadow: ${theme.shadows.xl}, 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ModalHeader = styled.div`
  padding: 1.75rem 2rem;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 1.5rem;
    bottom: 1.5rem;
    width: 0.25rem;
    background: ${theme.gradients.primary};
    border-radius: ${theme.borderRadius.full};
  }
  
  h2 {
    font-size: 1.625rem;
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.gray[900]};
    padding-left: 1rem;
    line-height: 1.3;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  
  p {
    color: ${theme.colors.gray[700]};
    margin-bottom: 2rem;
    font-size: 1.0625rem;
    line-height: 1.6;
  }
  
  .challenge-info {
    background-color: ${theme.colors.gray[50]};
    border-radius: ${theme.borderRadius.xl};
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.03);
    border: 1px solid ${theme.colors.gray[100]};
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid ${theme.colors.gray[100]};
      
      &:last-child {
        margin-bottom: 0;
        border-bottom: none;
        padding-bottom: 0;
      }
      
      &:first-child {
        padding-top: 0;
      }
      
      .label {
        font-weight: ${theme.fontWeight.medium};
        color: ${theme.colors.gray[700]};
        font-size: 0.9375rem;
      }
      
      .value {
        color: ${theme.colors.gray[900]};
        font-weight: ${theme.fontWeight.medium};
        font-size: 0.9375rem;
        
        &.highlight {
          color: ${theme.colors.primary.pink};
          font-weight: ${theme.fontWeight.semibold};
        }
        
        i {
          margin-right: 0.5rem;
          opacity: 0.9;
        }
      }
    }
  }
  
  .rules {
    h3 {
      font-size: 1.25rem;
      font-weight: ${theme.fontWeight.semibold};
      margin-bottom: 1rem;
      color: ${theme.colors.gray[900]};
      display: flex;
      align-items: center;
      
      i {
        margin-right: 0.625rem;
        color: ${theme.colors.primary.pink};
        opacity: 0.9;
      }
    }
    
    ul {
      list-style-type: none;
      padding-left: 0.5rem;
      
      li {
        position: relative;
        padding-left: 1.75rem;
        margin-bottom: 0.75rem;
        color: ${theme.colors.gray[700]};
        line-height: 1.5;
        
        &:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.625rem;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: ${theme.borderRadius.full};
          background: ${theme.gradients.primary};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid ${theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  background-color: ${theme.colors.gray[50]};
`;

const ButtonSecondary = styled.button`
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray[700]};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  padding: 0.875rem 1.75rem;
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background-color: ${theme.colors.gray[50]};
    border-color: ${theme.colors.gray[300]};
  }
  
  &:active {
    background-color: ${theme.colors.gray[100]};
  }
`;

const JoinButton = styled.button`
  background: ${theme.gradients.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: 0.875rem 1.75rem;
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  
  i {
    font-size: 3.5rem;
    color: ${theme.colors.gray[300]};
    margin-bottom: 1.5rem;
    background: ${theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: ${theme.fontWeight.semibold};
    margin-bottom: 0.75rem;
    color: ${theme.colors.gray[800]};
  }
  
  p {
    color: ${theme.colors.gray[600]};
    max-width: 28rem;
    margin: 0 auto;
    font-size: 1.0625rem;
    line-height: 1.6;
  }
`;

// Additional challenges beyond the default ones
const additionalChallenges: ChallengeType[] = [
  {
    id: "meditation-challenge",
    title: "21-Day Meditation Challenge",
    icon: "brain",
    daysTotal: 21,
    daysCompleted: 0,
    daysRemaining: 21,
    participants: 312,
    rewards: {
      points: 200,
      item: "Zen Master badge",
      itemIcon: "certificate",
    },
  },
  {
    id: "reading-challenge",
    title: "Book Reading Marathon",
    icon: "book",
    daysTotal: 30,
    daysCompleted: 0,
    daysRemaining: 30,
    participants: 124,
    rewards: {
      points: 250,
      item: "Premium avatar glasses",
      itemIcon: "glasses",
    },
  },
  {
    id: "water-challenge",
    title: "Water Intake Challenge",
    icon: "tint",
    daysTotal: 14,
    daysCompleted: 0,
    daysRemaining: 14,
    participants: 423,
    rewards: {
      points: 120,
      item: "Hydration badge",
      itemIcon: "certificate",
    },
  },
  {
    id: "coding-challenge",
    title: "Code Every Day",
    icon: "laptop-code",
    daysTotal: 30,
    daysCompleted: 0,
    daysRemaining: 30,
    participants: 98,
    rewards: {
      points: 300,
      item: "Developer avatar outfit",
      itemIcon: "tshirt",
    },
  },
  {
    id: "gratitude-challenge",
    title: "Daily Gratitude Journal",
    icon: "journal-whills",
    daysTotal: 14,
    daysCompleted: 0,
    daysRemaining: 14,
    participants: 156,
    rewards: {
      points: 100,
      item: "Mindfulness badge",
      itemIcon: "certificate",
    },
  }
];

type TabType = 'ongoing' | 'available' | 'completed';

const Challenge: React.FC = () => {
  const { user, challenges } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('ongoing');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [allChallenges, setAllChallenges] = useState<ChallengeType[]>([
    ...challenges, 
    ...additionalChallenges
  ]);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [checkedInChallenges, setCheckedInChallenges] = useState<Record<string, boolean>>({});
  
  // Filter challenges based on active tab, category, and search term
  const filteredChallenges = allChallenges.filter(challenge => {
    // Filter by tab
    if (activeTab === 'ongoing' && challenge.daysCompleted > 0 && challenge.daysCompleted < challenge.daysTotal) {
      return true;
    }
    if (activeTab === 'available' && challenge.daysCompleted === 0) {
      return true;
    }
    if (activeTab === 'completed' && challenge.daysCompleted === challenge.daysTotal) {
      return true;
    }
    
    if (activeTab !== 'ongoing' && activeTab !== 'available' && activeTab !== 'completed') {
      return true;
    }
    
    return false;
  }).filter(challenge => {
    // Filter by category
    if (category === 'all') return true;
    
    if (category === 'fitness' && (challenge.icon === 'dumbbell' || challenge.title.toLowerCase().includes('fitness'))) {
      return true;
    }
    if (category === 'mental' && (challenge.icon === 'brain' || challenge.title.toLowerCase().includes('meditation') || challenge.title.toLowerCase().includes('mental'))) {
      return true;
    }
    if (category === 'career' && (challenge.icon === 'laptop-code' || challenge.title.toLowerCase().includes('code') || challenge.title.toLowerCase().includes('career'))) {
      return true;
    }
    if (category === 'health' && (challenge.icon === 'tint' || challenge.title.toLowerCase().includes('health'))) {
      return true;
    }
    
    return false;
  }).filter(challenge => {
    // Filter by search term
    if (!searchTerm) return true;
    return challenge.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleChallengeClick = (challenge: ChallengeType) => {
    setSelectedChallenge(challenge);
    setDetailModalOpen(true);
  };
  
  const handleJoinChallenge = () => {
    if (!selectedChallenge) return;
    
    // Update the challenge to mark it as started
    setAllChallenges(prevChallenges => 
      prevChallenges.map(challenge => 
        challenge.id === selectedChallenge.id
          ? { ...challenge, daysCompleted: 1, daysRemaining: challenge.daysTotal - 1, participants: challenge.participants + 1 }
          : challenge
      )
    );
    
    setDetailModalOpen(false);
    setActiveTab('ongoing');
  };
  
  const handleCheckIn = (challenge: ChallengeType, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the detail modal
    
    // Don't allow check-in if already checked in today
    if (checkedInChallenges[challenge.id]) {
      return;
    }
    
    // Mark this challenge as checked in
    setCheckedInChallenges(prev => ({
      ...prev,
      [challenge.id]: true
    }));
    
    // Update challenge progress
    setAllChallenges(prevChallenges => 
      prevChallenges.map(c => {
        if (c.id === challenge.id) {
          const newDaysCompleted = c.daysCompleted + 1;
          const newDaysRemaining = c.daysRemaining - 1;
          const completed = newDaysCompleted >= c.daysTotal;
          
          // Move to completed tab if challenge is now completed
          if (completed && activeTab === 'ongoing') {
            // We'll handle this via the filter logic
          }
          
          return { 
            ...c, 
            daysCompleted: newDaysCompleted,
            daysRemaining: newDaysRemaining
          };
        }
        return c;
      })
    );
  };
  
  return (
    <PageContainer>
      <Navbar activeTab="challenge" />
      
      <MainContent>
        <PageHeader>
          <h1>Epic <GradientText>Challenges</GradientText></h1>
          <p>Join challenges to earn rewards and level up your habit game!</p>
        </PageHeader>
        
        <Tabs>
          <Tab 
            $active={activeTab === 'ongoing'}
            onClick={() => setActiveTab('ongoing')}
          >
            <i className="fas fa-running mr-2"></i> Ongoing Challenges
          </Tab>
          <Tab 
            $active={activeTab === 'available'}
            onClick={() => setActiveTab('available')}
          >
            <i className="fas fa-compass mr-2"></i> Available Challenges
          </Tab>
          <Tab 
            $active={activeTab === 'completed'}
            onClick={() => setActiveTab('completed')}
          >
            <i className="fas fa-check-circle mr-2"></i> Completed Challenges
          </Tab>
        </Tabs>
        
        <Filters>
          <CategorySelect 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="fitness">Fitness</option>
            <option value="mental">Mental Health</option>
            <option value="career">Career</option>
            <option value="health">Health</option>
          </CategorySelect>
          
          <SearchInput>
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search challenges..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
        </Filters>
        
        {filteredChallenges.length > 0 ? (
          <ChallengesGrid>
            {filteredChallenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onClick={() => handleChallengeClick(challenge)}
                checkedIn={checkedInChallenges[challenge.id]}
                onCheckIn={(e) => handleCheckIn(challenge, e)}
                enrolled={challenge.daysCompleted > 0}
              />
            ))}
          </ChallengesGrid>
        ) : (
          <EmptyState>
            <i className="fas fa-trophy"></i>
            <h3>No challenges found</h3>
            <p>
              {activeTab === 'ongoing' 
                ? "You don't have any ongoing challenges. Join a challenge to get started!"
                : activeTab === 'completed'
                ? "You haven't completed any challenges yet. Keep up the good work with your ongoing challenges!"
                : "No available challenges match your criteria. Try adjusting your filters."}
            </p>
          </EmptyState>
        )}
      </MainContent>
      
      <AnimatePresence>
        {detailModalOpen && selectedChallenge && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailModalOpen(false)}
          >
            <ModalContent
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h2>{selectedChallenge.title}</h2>
              </ModalHeader>
              
              <ModalBody>
                <p>Join this challenge to boost your habit streak and earn exclusive rewards!</p>
                
                <div className="challenge-info">
                  <div className="info-item">
                    <span className="label">Duration:</span>
                    <span className="value">{selectedChallenge.daysTotal} days</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Participants:</span>
                    <span className="value">{selectedChallenge.participants} people</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Reward:</span>
                    <span className="value highlight">
                      <i className="fas fa-star"></i> {selectedChallenge.rewards.points} points
                    </span>
                  </div>
                  {selectedChallenge.rewards.item && (
                    <div className="info-item">
                      <span className="label">Special Reward:</span>
                      <span className="value highlight">
                        <i className={`fas fa-${selectedChallenge.rewards.itemIcon}`}></i>
                        {selectedChallenge.rewards.item}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="rules">
                  <h3>
                    <i className="fas fa-scroll"></i>
                    Challenge Rules:
                  </h3>
                  <ul>
                    <li>Complete the daily task for this challenge every day</li>
                    <li>Check in daily to mark your progress</li>
                    <li>Miss no more than 2 days to earn the full reward</li>
                    <li>Share your progress with other participants</li>
                    <li>Complete all {selectedChallenge.daysTotal} days to earn the special reward</li>
                  </ul>
                </div>
              </ModalBody>
              
              <ModalFooter>
                <ButtonSecondary onClick={() => setDetailModalOpen(false)}>
                  Cancel
                </ButtonSecondary>
                
                <JoinButton onClick={handleJoinChallenge}>
                  Join Challenge
                </JoinButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Challenge;
