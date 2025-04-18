import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../styles/theme';
import Navbar from '../components/Navbar';
import ProgressRing from '../components/ProgressRing';
import { useUser } from '../contexts/UserContext';
import { useLocation } from 'wouter';
import { Settings, Star, CheckCircle, Trophy, Dumbbell, Sun, Brain, PenFancy, CalendarCheck, Fire, Tshirt } from 'lucide-react';

// --- Constants ---
const PALETTE = {
  mauve: "#EDC9FF",
  mimiPink: "#FED4E7",
  apricot: "#F2B79F",
  earthYellow: "#E5B769",
  citrine: "#D8CC34",
};

// Example XP calculation (replace with actual logic if available)
const XP_PER_LEVEL = 500; // Example: XP needed to advance one level

/**
 * Interface for Achievement data structure.
 */
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType; // Use Lucide icon component type
  progress: number;
  total: number;
  unlocked: boolean;
}

// Mock achievements with Lucide icons
// In a real app, this data might come from the backend or context
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Maintain a 7-day streak in any habit",
    icon: Fire, // Use icon component
    progress: 7,
    total: 7,
    unlocked: true,
  },
  {
    id: "early-riser",
    title: "Early Riser",
    description: "Complete morning tasks before 8 AM for 5 days",
    icon: Sun,
    progress: 5,
    total: 5,
    unlocked: true,
  },
  {
    id: "fitness-enthusiast",
    title: "Fitness Enthusiast",
    description: "Complete 20 fitness tasks",
    icon: Dumbbell,
    progress: 15,
    total: 20,
    unlocked: false,
  },
  {
    id: "mindfulness-guru",
    title: "Mindfulness Guru",
    description: "Complete 15 meditation sessions",
    icon: Brain,
    progress: 8,
    total: 15,
    unlocked: false,
  },
  {
    id: "challenge-champion",
    title: "Challenge Champion",
    description: "Complete 3 challenges",
    icon: Trophy,
    progress: 1,
    total: 3,
    unlocked: false,
  },
  {
    id: "consistent-writer",
    title: "Consistent Writer",
    description: "Journal for 10 consecutive days",
    icon: PenFancy,
    progress: 5,
    total: 10,
    unlocked: false,
  },
];

// Mock stats (replace with actual derived data)
const MOCK_STATS = {
    daysActive: 32,
    longestStreak: 14,
    challengesWon: 3,
    itemsUnlocked: 2,
};


// --- Styled Components ---

/**
 * Main container for the Profile page with gradient background.
 */
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

/**
 * Wrapper for the main content area, setting max-width and padding.
 */
const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem 2rem; /* Adjusted padding for Navbar */

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 5rem 2rem 3rem;
  }
`;

/**
 * Header section for the page title and description.
 */
const PageHeader = styled.div`
  margin-bottom: 2.5rem; /* Increased margin */
  padding-left: 1rem; /* Add padding for accent line */
  position: relative;

  /* Accent line */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.25rem;
    bottom: 0.25rem;
    width: 0.25rem;
    background: ${theme.gradients.primary};
    border-radius: ${theme.borderRadius.full};
  }

  h1 {
    font-size: 2rem; /* Adjusted size */
    font-weight: ${theme.fontWeight.bold};
    margin-bottom: 0.75rem;
  }

  p {
    color: ${theme.colors.gray[600]};
    font-size: 1.1rem; /* Adjusted size */
  }
`;

/**
 * Span to apply gradient styling to text.
 */
const GradientText = styled.span`
  background: ${theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

/**
 * Grid layout for the profile page (Sidebar + Content).
 */
const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem; /* Increased gap */

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 18rem 1fr; /* Fixed sidebar width */
  }
`;

/**
 * Container for the profile sidebar.
 * Becomes sticky on larger screens.
 */
const ProfileSidebar = styled.div`
  @media (min-width: ${theme.breakpoints.lg}) {
    position: sticky;
    top: 6rem; /* Adjust based on Navbar height */
    height: max-content;
  }
`;

/**
 * Card styling for the profile information in the sidebar.
 */
const ProfileCard = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg}; /* Enhanced shadow */
  overflow: hidden;
`;

/**
 * Header section of the profile card, containing avatar and basic info.
 */
const ProfileCardHeader = styled.div` /* Renamed */
  background: ${theme.gradients.primary};
  padding: 2.5rem 1.5rem; /* Increased padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  text-align: center;

  .edit-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    color: ${theme.colors.white};
    width: 2.25rem; /* Slightly larger */
    height: 2.25rem;
    border-radius: ${theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: ${theme.transitions.default};
    z-index: 1;

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .icon { /* Icon styling */
        width: 1rem;
        height: 1rem;
    }
  }
`;

/**
 * Container for the user avatar image.
 */
const AvatarContainer = styled.div`
  width: 9rem; /* Increased size */
  height: 9rem;
  border-radius: ${theme.borderRadius.full};
  border: 5px solid white; /* Thicker border */
  overflow: hidden;
  margin-bottom: 1.25rem; /* Increased margin */
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block; /* Remove potential bottom space */
  }
`;

/**
 * User name display in the profile card header.
 */
const UserName = styled.h2`
  color: ${theme.colors.white};
  font-size: 1.625rem; /* Increased size */
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 0.375rem;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
`;

/**
 * User level display in the profile card header.
 */
const UserLevel = styled.div`
  color: ${theme.colors.white}E0; /* Slightly less transparent */
  font-size: 0.9rem; /* Adjusted size */
  display: flex;
  align-items: center;
  gap: 0.375rem;

  .icon { /* Icon styling */
      width: 0.9em;
      height: 0.9em;
      opacity: 0.9;
  }
`;

/**
 * Section within the profile card displaying key stats (Points, Streak, etc.).
 */
const ProfileCardStats = styled.div` /* Renamed */
  padding: 1.5rem;
`;

/**
 * Individual stat item within the ProfileCardStats section.
 */
const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* Use gap */
  margin-bottom: 1.5rem; /* Increased margin */

  &:last-child {
    margin-bottom: 0;
  }

  .icon-wrapper { /* Renamed */
    width: 2.75rem; /* Adjusted size */
    height: 2.75rem;
    border-radius: ${theme.borderRadius.full};
    background-color: ${theme.colors.gray[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .icon { /* Icon styling */
      color: ${theme.colors.primary.pink};
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .text {
    h3 {
      font-size: 1.2rem; /* Increased size */
      font-weight: ${theme.fontWeight.semibold};
      margin-bottom: 0.2rem; /* Adjusted margin */
      color: ${theme.colors.gray[800]};
    }

    p {
      font-size: 0.875rem;
      color: ${theme.colors.gray[600]};
    }
  }
`;

/**
 * Container for the main profile content sections (Level, Achievements, Stats).
 */
const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem; /* Increased gap */
`;

/**
 * Generic container for a content section (e.g., Level, Achievements).
 */
const Section = styled(motion.div)` /* Added motion */
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg}; /* Enhanced shadow */
  overflow: hidden;
`;

/**
 * Header for each content section.
 */
const SectionHeader = styled.div`
  padding: 1.5rem 2rem; /* Increased padding */
  border-bottom: 1px solid ${theme.colors.gray[100]}; /* Lighter border */

  h2 {
    font-size: 1.375rem; /* Adjusted size */
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.gray[800]};
  }
`;

/**
 * Container for the level progress visualization and details.
 */
const LevelProgressSection = styled.div` /* Renamed */
  padding: 2rem; /* Increased padding */
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Add gap */

  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
  }

  .progress-visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;

    @media (min-width: ${theme.breakpoints.md}) {
      margin-right: 2.5rem; /* Increased margin */
    }

    .level-badge {
      width: 9rem; /* Increased size */
      height: 9rem;
      position: relative;
      margin-bottom: 1rem; /* Add margin */

      .level-number {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.75rem; /* Increased size */
        font-weight: ${theme.fontWeight.bold};
        color: ${theme.colors.gray[700]};
      }
    }

    .next-level-info { /* Renamed */
      font-size: 0.9rem; /* Adjusted size */
      color: ${theme.colors.gray[600]};
      display: flex;
      align-items: center;
      gap: 0.375rem;

      .icon { /* Icon styling */
          color: ${theme.colors.primary.pink};
          width: 1em;
          height: 1em;
      }
    }
  }

  .progress-details {
    flex-grow: 1; /* Take remaining space */

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem; /* Increased margin */

      .xp-label, .percentage { /* Target specific elements */
        font-size: 0.9rem; /* Adjusted size */
        color: ${theme.colors.gray[600]};
      }

      .percentage {
        font-weight: ${theme.fontWeight.semibold};
        color: ${theme.colors.gray[800]};
      }
    }

    .progress-bar-container { /* Renamed */
      height: 0.875rem; /* Slightly thicker */
      background-color: ${theme.colors.gray[100]}; /* Lighter background */
      border-radius: ${theme.borderRadius.full};
      overflow: hidden;
      margin-bottom: 2rem; /* Increased margin */
      border: 1px solid ${theme.colors.gray[200]};

      .fill {
        height: 100%;
        background: ${theme.gradients.primary};
        border-radius: ${theme.borderRadius.full};
        transition: width 0.5s ease-out;
      }
    }

    .next-reward {
      h3 {
        font-size: 1.05rem; /* Adjusted size */
        font-weight: ${theme.fontWeight.semibold};
        margin-bottom: 0.75rem; /* Increased margin */
        color: ${theme.colors.gray[700]};
      }

      .reward-item {
        display: flex;
        align-items: center;
        padding: 1rem; /* Increased padding */
        background-color: ${theme.colors.gray[50]};
        border-radius: ${theme.borderRadius.lg};
        border: 1px solid ${theme.colors.gray[100]};
        gap: 0.75rem;

        .icon { /* Icon styling */
          color: ${theme.colors.secondary.gold};
          width: 1.5rem;
          height: 1.5rem;
          flex-shrink: 0;
        }

        span {
          font-weight: ${theme.fontWeight.medium};
          color: ${theme.colors.gray[800]};
        }
      }
    }
  }
`;

/**
 * Grid layout for displaying achievement cards.
 */
const AchievementsGrid = styled.div`
  padding: 2rem; /* Increased padding */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Adjusted minmax */
  gap: 1.5rem; /* Increased gap */
`;

/**
 * Card component for displaying a single achievement.
 * Styles change based on the `$unlocked` prop.
 */
const AchievementCard = styled(motion.div)<{ $unlocked: boolean }>`
  background-color: ${props => props.$unlocked ? theme.colors.white : theme.colors.gray[50]};
  border: 1px solid ${props => props.$unlocked ? theme.colors.gray[200] : theme.colors.gray[100]};
  border-radius: ${theme.borderRadius.xl}; /* More rounded */
  padding: 1.5rem; /* Increased padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.md};
  }

  /* Overlay for locked achievements */
  ${props => !props.$unlocked && `
    opacity: 0.7;
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: inherit;
      z-index: 1;
      pointer-events: none;
    }
  `}

  .badge {
    width: 4.5rem; /* Increased size */
    height: 4.5rem;
    border-radius: ${theme.borderRadius.full};
    background: ${props => props.$unlocked ? theme.gradients.primary : theme.colors.gray[200]};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem; /* Increased margin */
    flex-shrink: 0;
    box-shadow: ${props => props.$unlocked ? `0 4px 10px ${theme.colors.primary.pink}40` : 'none'};

    .icon { /* Icon styling */
      font-size: 1.75rem; /* Adjusted size */
      color: ${props => props.$unlocked ? theme.colors.white : theme.colors.gray[400]};
      width: 1.75rem;
      height: 1.75rem;
    }
  }

  h3 {
    font-size: 1.05rem; /* Adjusted size */
    font-weight: ${theme.fontWeight.semibold};
    margin-bottom: 0.5rem;
    color: ${theme.colors.gray[800]};
  }

  p {
    font-size: 0.875rem;
    color: ${theme.colors.gray[600]};
    margin-bottom: 1rem; /* Increased margin */
    line-height: 1.5;
  }

  .progress-text { /* Renamed */
    width: 100%;
    font-size: 0.8rem; /* Adjusted size */
    color: ${theme.colors.gray[500]};
    margin-top: auto; /* Push to bottom */
  }

  /* Lock icon for locked achievements */
  ${props => !props.$unlocked && `
    .lock-indicator { /* Renamed */
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 2rem;
      height: 2rem;
      border-radius: ${theme.borderRadius.full};
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;

      .icon {
        color: ${theme.colors.white};
        width: 1rem;
        height: 1rem;
      }
    }
  `}
`;

/**
 * Grid layout for displaying user statistics cards.
 */
const StatsGrid = styled.div`
  padding: 2rem; /* Increased padding */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* Adjusted minmax */
  gap: 1.5rem; /* Increased gap */
`;

/**
 * Card component for displaying a single statistic.
 */
const StatCard = styled.div`
  background-color: ${theme.colors.gray[50]};
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: ${theme.borderRadius.lg};
  padding: 1.5rem; /* Increased padding */
  text-align: center; /* Center align content */

  h3 {
    font-size: 0.9rem; /* Adjusted size */
    color: ${theme.colors.gray[600]};
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center; /* Center header content */
    gap: 0.5rem;

    .icon { /* Icon styling */
        color: ${theme.colors.primary.pink};
        width: 1rem;
        height: 1rem;
    }
  }

  .value {
    font-size: 1.75rem; /* Increased size */
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.gray[800]};
  }
`;


// --- Component ---

/**
 * Profile Page Component
 * Displays user information, level progress, achievements, and statistics.
 */
const Profile: React.FC = () => {
  const { user, habitCategories } = useUser();
  const [, setLocation] = useLocation();

  // Calculate total streaks from habit categories
  // Note: Ensure habitCategories are loaded before calculating
  const totalStreaks = habitCategories?.reduce((acc, category) => acc + (category.streak || 0), 0) ?? 0;

  // Calculate total completed tasks
  const totalCompletedTasks = habitCategories?.reduce(
    (acc, category) => acc + (category.tasks?.filter(task => task.completed).length || 0),
    0
  ) ?? 0;

  // Calculate current XP and percentage towards next level
  // This assumes user.points directly represents XP. Adjust if calculation is different.
  const currentLevelXP = user.points % XP_PER_LEVEL;
  const xpPercentage = (currentLevelXP / XP_PER_LEVEL) * 100;

  // Use mock achievements for now
  const achievements = MOCK_ACHIEVEMENTS;

  return (
    <PageContainer>
      <Navbar activeTab="profile" />

      <MainContent>
        <PageHeader>
          <h1>My <GradientText>Hero Profile</GradientText></h1>
          <p>View your journey, stats, and unlocked achievements.</p>
        </PageHeader>

        <ProfileGrid>
          {/* Profile Sidebar */} 
          <ProfileSidebar>
            <ProfileCard>
              <ProfileCardHeader>
                <button
                    className="edit-button"
                    onClick={() => setLocation('/settings')}
                    aria-label="Go to settings"
                 >
                  <Settings className="icon" />
                </button>

                <AvatarContainer>
                  <img src={user.avatar} alt={`${user.name}'s avatar`} />
                </AvatarContainer>

                <UserName>{user.name}</UserName>
                <UserLevel>
                  <Star className="icon" />
                  Level {user.level} Adventurer
                </UserLevel>
              </ProfileCardHeader>

              <ProfileCardStats>
                <StatItem>
                  <div className="icon-wrapper">
                    <Star className="icon" />
                  </div>
                  <div className="text">
                    <h3>{user.points} Points</h3>
                    <p>Total points earned</p>
                  </div>
                </StatItem>

                <StatItem>
                  <div className="icon-wrapper">
                    <Fire className="icon" />
                  </div>
                  <div className="text">
                    <h3>{totalStreaks} Days</h3>
                    <p>Total active streak days</p>
                  </div>
                </StatItem>

                <StatItem>
                  <div className="icon-wrapper">
                    <CheckCircle className="icon" />
                  </div>
                  <div className="text">
                    <h3>{totalCompletedTasks} Tasks</h3>
                    <p>Total tasks completed</p>
                  </div>
                </StatItem>

                <StatItem>
                  <div className="icon-wrapper">
                    <Trophy className="icon" />
                  </div>
                  <div className="text">
                    <h3>{achievements.filter(a => a.unlocked).length} / {achievements.length}</h3>
                    <p>Achievements unlocked</p>
                  </div>
                </StatItem>
              </ProfileCardStats>
            </ProfileCard>
          </ProfileSidebar>

          {/* Main Profile Content */} 
          <ProfileContent>
            {/* Level Progress Section */}
            <Section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <SectionHeader>
                <h2>Level Progress</h2>
              </SectionHeader>

              <LevelProgressSection>
                <div className="progress-visual">
                  <div className="level-badge">
                    {/* Ensure ProgressRing receives a number between 0 and 100 */} 
                    <ProgressRing progress={Math.max(0, Math.min(100, Math.round(xpPercentage)))} size={144} strokeWidth={10} />
                    <div className="level-number">{user.level}</div>
                  </div>
                  <div className="next-level-info">
                    <Star className="icon" />
                    <span>Next level: {user.level + 1}</span>
                  </div>
                </div>

                <div className="progress-details">
                  <div className="progress-info">
                    <span className="xp-label">XP: {currentLevelXP} / {XP_PER_LEVEL}</span>
                    <span className="percentage">{Math.round(xpPercentage)}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <motion.div
                        className="fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                     />
                  </div>

                  <div className="next-reward">
                    <h3>Next Level Reward:</h3>
                    <div className="reward-item">
                      <Tshirt className="icon" />
                      <span>Premium Avatar Outfit</span> {/* Example Reward */} 
                    </div>
                  </div>
                </div>
              </LevelProgressSection>
            </Section>

            {/* Achievements Section */}
            <Section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SectionHeader>
                <h2>Achievements</h2>
              </SectionHeader>

              <AchievementsGrid>
                {achievements.map(achievement => {
                    const IconComponent = achievement.icon;
                    return (
                      <AchievementCard
                        key={achievement.id}
                        $unlocked={achievement.unlocked}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {!achievement.unlocked && (
                          <div className="lock-indicator" aria-hidden="true">
                             <Lock className="icon" />
                          </div>
                        )}
                        <div className="badge">
                           <IconComponent className="icon" />
                        </div>

                        <h3>{achievement.title}</h3>
                        <p>{achievement.description}</p>

                        <div className="progress-text">
                          {achievement.unlocked ? 'Completed!' : `${achievement.progress} / ${achievement.total} completed`}
                        </div>
                      </AchievementCard>
                    );
                })}
              </AchievementsGrid>
            </Section>

            {/* Statistics Section */} 
            <Section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <SectionHeader>
                <h2>Statistics</h2>
              </SectionHeader>

              <StatsGrid>
                 {/* Use MOCK_STATS or calculate real stats */}
                <StatCard>
                  <h3>
                    <CalendarCheck className="icon" />
                    Days Active
                  </h3>
                  <div className="value">{MOCK_STATS.daysActive}</div>
                </StatCard>

                <StatCard>
                  <h3>
                    <Fire className="icon" />
                    Longest Streak
                  </h3>
                  <div className="value">{MOCK_STATS.longestStreak} days</div>
                </StatCard>

                <StatCard>
                  <h3>
                    <CheckCircle className="icon" />
                    Tasks Completed
                  </h3>
                  <div className="value">{totalCompletedTasks}</div>
                </StatCard>

                <StatCard>
                  <h3>
                    <Trophy className="icon" />
                    Challenges Won
                  </h3>
                  <div className="value">{MOCK_STATS.challengesWon}</div>
                </StatCard>

                <StatCard>
                  <h3>
                    <Star className="icon" />
                    Points Earned
                  </h3>
                  <div className="value">{user.points}</div>
                </StatCard>

                <StatCard>
                  <h3>
                    <Tshirt className="icon" />
                    Items Unlocked
                  </h3>
                  <div className="value">{MOCK_STATS.itemsUnlocked}</div>
                </StatCard>
              </StatsGrid>
            </Section>
          </ProfileContent>
        </ProfileGrid>
      </MainContent>
    </PageContainer>
  );
};

export default Profile;
