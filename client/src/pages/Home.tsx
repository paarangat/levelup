import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import theme from "../styles/theme"; // Assuming theme provides breakpoints, fonts, grays, etc.
import Navbar from "../components/Navbar";
import HabitCard from "../components/HabitCard";
import HabitModal from "../components/HabitModal";
import ProgressRing from "../components/ProgressRing";
import ChallengeCard from "../components/ChallengeCard";
import { useUser } from "../contexts/UserContext";
import { HabitCategory, Challenge } from "../types";
import { Link } from "wouter"; // Added Link for navigation
import { TrendingUp, CheckSquare, Award, ChevronRight, Gift } from "lucide-react"; // Added icons

// --- Constants ---
const PALETTE = {
  mauve: "#EDC9FF",
  mimiPink: "#FED4E7",
  apricot: "#F2B79F",
  earthYellow: "#E5B769",
  citrine: "#D8CC34",
  // Complementary Dark Shades
  darkPurple: "#6b21a8",
  darkOrange: "#9a3412",
  darkYellow: "#854d0e",
  // Base background (slightly off-white)
  background: "#FFFBFD",
};

// Example XP calculation constants (replace with actual logic if needed)
const XP_PER_LEVEL = 500;
const MOCK_USER_XP = 350; // Example data
const MOCK_STREAK = 5; // Example data
const MOCK_NEXT_REWARD = "Premium Avatar Outfit"; // Example

// --- Styled Components ---

/**
 * Main container for the Home page with gradient background.
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
  width: 100%;
  max-width: 1300px; /* Slightly wider */
  margin: 0 auto;
  padding: 4.5rem 1.5rem 3rem; /* Adjusted padding for Navbar */

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 5rem 2rem 3.5rem;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 5.5rem 2.5rem 4rem;
  }
`;

/**
 * Section containing the welcome message.
 */
const WelcomeSection = styled.div`
  margin-bottom: 3rem; /* Increased margin */
  padding: 0.5rem;
`;

/**
 * Main heading (Welcome message).
 */
const Heading = styled.h1`
  font-size: clamp(2rem, 5vw, 2.75rem); /* Responsive font size */
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 0.75rem; /* Adjusted margin */
  color: ${theme.colors.gray[800]};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

/**
 * Span to apply gradient styling to text (e.g., username).
 */
const GradientText = styled.span`
  background: linear-gradient(90deg, #8B5CF6, #EC4899, #F97316, #F59E0B, #EAB308); /* Updated gradient */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: ${theme.fontWeight.extrabold}; /* Bolder gradient text */
`;

/**
 * Subheading text below the welcome message.
 */
const Subheading = styled.p`
  font-size: 1.1rem; /* Slightly smaller */
  color: ${theme.colors.gray[700]};
  max-width: 700px; /* Adjusted width */
  line-height: 1.6;
`;

/**
 * Grid layout for the statistics cards (Streak, Tasks, Level).
 */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem; /* Adjusted gap */
  margin-bottom: 3.5rem; /* Increased margin */

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
`;

/**
 * Individual card for displaying a key statistic.
 */
const StatCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.97); /* Less transparent */
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg};
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(237, 201, 255, 0.2); /* Subtle border */
  overflow: hidden;
  position: relative;
  display: flex; /* Use flexbox */
  flex-direction: column; /* Stack header and content */
  height: 100%; /* Ensure cards have same height in grid row */

  /* Top accent border */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.3rem; /* Thicker accent */
    background: ${PALETTE.mauve};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.xl};
  }
`;

/**
 * Header section within a StatCard (Title + Badge).
 */
const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem; /* Adjusted margin */

  h3 {
    font-size: 1.25rem; /* Adjusted size */
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.gray[800]};
  }
`;

/**
 * Badge component used within StatCard headers.
 */
const StatBadge = styled.div`
  background: linear-gradient(
    to right,
    rgba(237, 201, 255, 0.2),
    rgba(242, 187, 159, 0.1)
  );
  color: ${PALETTE.darkPurple};
  font-size: 0.9rem; /* Adjusted size */
  font-weight: ${theme.fontWeight.semibold};
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Use gap */
  box-shadow: inset 0 0 0 1px rgba(237, 201, 255, 0.3);

  .icon { /* Icon size */
      width: 1em;
      height: 1em;
      opacity: 0.9;
  }
`;

/**
 * Main content area within a StatCard.
 */
const StatContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem; /* Adjusted gap */
  flex-grow: 1; /* Allow content to fill space */
`;

/**
 * Text content within the StatCard (description + link).
 */
const StatText = styled.div`
  flex: 1;
  p {
    color: ${theme.colors.gray[700]};
    margin-bottom: 1.25rem; /* Increased margin */
    font-size: 1rem; /* Adjusted size */
    line-height: 1.6;
  }

  /* Link styling using Wouter Link */
  a {
    color: ${PALETTE.darkPurple};
    font-weight: ${theme.fontWeight.semibold};
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: rgba(237, 201, 255, 0.15);
    border-radius: ${theme.borderRadius.lg};
    transition: all 0.2s ease;
    font-size: 0.9rem;

    &:hover {
      background-color: rgba(237, 201, 255, 0.3);
      transform: translateX(2px);
      color: ${PALETTE.darkPurple}; /* Keep color on hover */
    }

    .icon { /* Chevron icon */
        width: 0.9em;
        height: 0.9em;
        margin-left: 0.375rem;
    }
  }
`;

/**
 * Container specifically for the list of tasks in the Tasks StatCard.
 */
const TasksPreviewList = styled.div` /* Renamed */
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Add gap between items */

  .task-item {
    display: flex;
    align-items: center;
    padding: 0.6rem 0.5rem; /* Adjusted padding */
    border-radius: ${theme.borderRadius.lg};
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(216, 204, 52, 0.075); /* Light Citrine hover */
    }

    .indicator {
      width: 1.1rem; /* Slightly larger */
      height: 1.1rem;
      border-radius: ${theme.borderRadius.md}; /* Squarer */
      margin-right: 0.85rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid transparent;

      &.completed {
        background-color: ${PALETTE.citrine};
        border-color: ${PALETTE.darkYellow}33;
        .icon { color: ${PALETTE.darkYellow}; } /* Check icon */
      }

      &.pending {
        background-color: ${theme.colors.gray[200]};
        border: 1px solid ${theme.colors.gray[300]};
      }

      .icon { /* Check icon size */
          width: 0.8em;
          height: 0.8em;
      }
    }

    .task-text { /* Renamed */
      color: ${theme.colors.gray[800]};
      font-size: 1rem; /* Adjusted size */
      font-weight: ${theme.fontWeight.medium};
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem; /* Add gap */

      &.pending {
        color: ${theme.colors.gray[500]};
      }

      .time-tag { /* Renamed */
        font-size: 0.8rem;
        font-weight: normal;
        color: ${PALETTE.darkOrange};
        background-color: rgba(242, 187, 159, 0.2);
        padding: 0.25rem 0.6rem;
        border-radius: ${theme.borderRadius.full};
        white-space: nowrap; /* Prevent wrapping */
      }
    }
  }
`;

/**
 * Container for the level progress content in the Level StatCard.
 */
const LevelProgressContent = styled.div` /* Renamed */
    display: flex; /* Use flex */
    flex-direction: column;
    height: 100%; /* Fill card height */

  .level-info {
    margin-bottom: 1.5rem; /* Adjusted margin */

    .level-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: ${theme.colors.gray[700]};
      margin-bottom: 0.6rem; /* Adjusted margin */
      font-weight: ${theme.fontWeight.medium};
    }

    .progress-bar-container { /* Renamed */
      height: 0.875rem;
      background-color: rgba(242, 187, 159, 0.2); /* Light Apricot background */
      border-radius: ${theme.borderRadius.full};
      overflow: hidden;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);

      .fill {
        height: 100%;
        background: ${PALETTE.apricot}; /* Solid Apricot fill */
        border-radius: ${theme.borderRadius.full};
        box-shadow: 0 1px 3px rgba(154, 52, 18, 0.2); /* darkOrange alpha */
        transition: width 0.6s ease;
      }
    }
  }

  .reward-info {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: linear-gradient(
      to right,
      rgba(229, 183, 105, 0.15),
      rgba(216, 204, 52, 0.1)
    );
    border-radius: ${theme.borderRadius.xl};
    box-shadow: inset 0 0 0 1px rgba(229, 183, 105, 0.2);
    margin-top: auto; /* Push to bottom */
    gap: 1rem; /* Use gap */

    .icon { /* Gift icon */
      font-size: 1.75rem; /* Adjusted size */
      color: ${PALETTE.earthYellow};
      flex-shrink: 0;
      width: 2rem; /* Fixed width */
      height: 2rem;
    }

    div {
      p:first-child {
        color: ${theme.colors.gray[700]};
        margin-bottom: 0.25rem; /* Adjusted margin */
        font-size: 0.85rem;
      }

      p:last-child {
        font-weight: ${theme.fontWeight.semibold};
        color: ${theme.colors.gray[900]};
        font-size: 1rem; /* Adjusted size */
      }
    }
  }
`;

/**
 * Header for main content sections (Habits, Challenges).
 */
const SectionHeader = styled.div`
  margin-bottom: 2rem; /* Adjusted margin */
  position: relative;
  padding-left: 1.25rem; /* Increased padding */

  /* Accent line */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.25rem;
    bottom: 0.25rem;
    width: 0.3rem; /* Thicker accent */
    background: ${PALETTE.mauve};
    border-radius: ${theme.borderRadius.full};
  }

  h2 {
    font-size: 1.75rem;
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.gray[800]};
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 2rem;
    }
  }
`;

/**
 * Grid layout for Habit Cards.
 */
const HabitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Responsive columns */
  gap: 1.75rem; /* Adjusted gap */
  margin-bottom: 3.5rem; /* Increased margin */
`;

/**
 * Header for the Challenges section, includes a "View All" link.
 */
const ChallengesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem; /* Adjusted margin */
  position: relative;
  padding-left: 1.25rem; /* Match SectionHeader */

  /* Accent line */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.25rem;
    bottom: 0.25rem;
    width: 0.3rem; /* Match SectionHeader */
    background: ${PALETTE.mauve};
    border-radius: ${theme.borderRadius.full};
  }

  h2 {
    font-size: 1.75rem;
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.gray[800]};
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 2rem;
    }
  }

  /* "View All" Link */
  a {
    color: ${PALETTE.darkPurple};
    font-weight: ${theme.fontWeight.semibold};
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    padding: 0.5rem 1rem;
    background-color: rgba(237, 201, 255, 0.15);
    border-radius: ${theme.borderRadius.lg};
    transition: all 0.2s ease;
    font-size: 0.9rem;

    &:hover {
      background-color: rgba(237, 201, 255, 0.3);
      transform: translateX(2px);
      color: ${PALETTE.darkPurple};
    }

    .icon { /* Chevron icon */
        width: 1em;
        height: 1em;
        margin-left: 0.375rem;
    }
  }
`;

/**
 * Grid layout for Challenge Cards.
 */
const ChallengesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
`;

// --- Component Logic ---

/**
 * Home Page Component
 * Dashboard view displaying user stats, habits, and challenges.
 */
const Home: React.FC = () => {
  const { user, habitCategories, challenges, updateHabitTask } = useUser(); // Added updateHabitTask
  const [selectedHabit, setSelectedHabit] = useState<HabitCategory | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Opens the habit details modal.
   * @param habit - The habit category clicked.
   */
  const handleHabitClick = (habit: HabitCategory) => {
    setSelectedHabit(habit);
    setModalOpen(true);
  };

  /**
   * Closes the habit details modal.
   */
  const closeModal = () => {
    setSelectedHabit(null);
    setModalOpen(false);
  };

  // Calculate total tasks and completed tasks safely
  const totalTasks = habitCategories?.reduce(
    (acc, cat) => acc + (cat.tasks?.length || 0),
    0
  ) ?? 0;
  const completedTasks = habitCategories?.reduce(
    (acc, cat) => acc + (cat.tasks?.filter((task) => task.completed).length || 0),
    0
  ) ?? 0;

  // Calculate XP percentage towards next level
  const currentLevelXP = user.points % XP_PER_LEVEL;
  const xpPercentage = (currentLevelXP / XP_PER_LEVEL) * 100;

  // Determine which challenges to display (e.g., first 2 ongoing/available)
  const ongoingChallenges = challenges.filter(c => c.daysCompleted > 0 && c.daysCompleted < c.daysTotal);
  const displayedChallenges = ongoingChallenges.slice(0, 2);

  return (
    <PageContainer>
      <Navbar activeTab="home" />

      <MainContent>
        {/* Welcome Section */}
        <WelcomeSection>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading>
              Welcome back, <GradientText>{user.name}</GradientText>!
            </Heading>
            <Subheading>
              Your habit journey continues. Today is a new opportunity to level up!
            </Subheading>
          </motion.div>
        </WelcomeSection>

        {/* Statistics Grid */}
        <StatsGrid>
          {/* Streak Card */}
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <StatHeader>
              <h3>Streak Progress</h3>
              <StatBadge>
                 <TrendingUp className="icon" /> {MOCK_STREAK} days {/* Example */} 
              </StatBadge>
            </StatHeader>
            <StatContent>
               {/* Use Mauve for Streak */}
              <ProgressRing progress={75} size={96} color={PALETTE.mauve} strokeWidth={8}/>
              <StatText>
                <p>
                  Keep the momentum going! Consistent streaks unlock awesome rewards.
                </p>
                 {/* Link could go to a dedicated streak/stats page */}
                <Link href="/profile#streaks">
                  View details <ChevronRight className="icon" />
                </Link>
              </StatText>
            </StatContent>
          </StatCard>

          {/* Today's Tasks Card */}
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <StatHeader>
              <h3>Today's Tasks</h3>
              {/* Use Citrine for Tasks */}
              <StatBadge
                style={{
                  background: `linear-gradient(to right, rgba(216, 204, 52, 0.15), rgba(229, 183, 105, 0.05))`,
                  color: PALETTE.darkYellow,
                  boxShadow: `inset 0 0 0 1px rgba(216, 204, 52, 0.3)`,
                }}
              >
                 <CheckSquare className="icon" /> {completedTasks}/{totalTasks} done
              </StatBadge>
            </StatHeader>
            <TasksPreviewList>
              {/* Display first few tasks (example) */}
              {habitCategories?.slice(0, 4).flatMap(category => category.tasks?.slice(0, 1) ?? []).map((task, idx) => (
                <motion.div
                  key={`${task.id}-${idx}`}
                  className="task-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * idx }}
                >
                  <div className={`indicator ${task.completed ? "completed" : "pending"}`}>
                      {task.completed && <CheckSquare className="icon" />}
                  </div>
                  <p className={`task-text ${task.completed ? "" : "pending"}`}>
                    {task.name}
                    {task.time && <span className="time-tag">{task.time}</span>}
                  </p>
                </motion.div>
              ))}
               {/* Add Link to Tasks page */}
              <Link href="/todo" className="mt-auto pt-2 self-end">
                 <StatText><a>View all tasks <ChevronRight className="icon" /></a></StatText>
              </Link>
            </TasksPreviewList>
          </StatCard>

           {/* Level Progress Card */}
           <StatCard
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             whileHover={{ y: -5 }}
           >
              <StatHeader>
                <h3>Level Progress</h3>
                 {/* Use Apricot for Level */}
                <StatBadge
                  style={{
                    background: `linear-gradient(to right, rgba(242, 187, 159, 0.2), rgba(237, 201, 255, 0.05))`,
                    color: PALETTE.darkOrange,
                    boxShadow: `inset 0 0 0 1px rgba(242, 187, 159, 0.3)`,
                  }}
                >
                   <Award className="icon" /> Level {user.level}
                </StatBadge>
              </StatHeader>
              <LevelProgressContent>
                <div className="level-info">
                  <div className="level-stats">
                    <span>XP: {currentLevelXP}/{XP_PER_LEVEL}</span>
                    <span>{xpPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <motion.div
                      className="fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercentage}%` }} 
                      transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                    />
                  </div>
                </div>
                <motion.div
                  className="reward-info"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                   <Gift className="icon" />
                  <div>
                    <p>Next reward at Level {user.level + 1}:</p>
                    <p>{MOCK_NEXT_REWARD}</p>
                  </div>
                </motion.div>
              </LevelProgressContent>
            </StatCard>
        </StatsGrid>

        {/* Habit Quests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SectionHeader>
            <h2>Your Habit Quests</h2>
          </SectionHeader>
          <HabitsGrid>
            {habitCategories?.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                <HabitCard habit={habit} onClick={() => handleHabitClick(habit)} />
              </motion.div>
            ))}
            {/* Consider adding a "Create New Habit" card here */} 
          </HabitsGrid>
        </motion.div>

        {/* Active Challenges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ChallengesHeader>
            <h2>Active Challenges</h2>
            <Link href="/challenge">
              View all <ChevronRight className="icon" />
            </Link>
          </ChallengesHeader>
          <ChallengesGrid>
            {displayedChallenges.length > 0 ? (
                displayedChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 * index }}
                  >
                    {/* Pass necessary props to ChallengeCard */}
                    <ChallengeCard challenge={challenge} />
                  </motion.div>
                ))
            ) : (
                <p className="text-center text-gray-600 py-4">No active challenges right now. <Link href="/challenge" className="text-pink-600 font-medium hover:underline">Explore available challenges!</Link></p>
            )}
          </ChallengesGrid>
        </motion.div>
      </MainContent>

      {/* Habit Modal */} 
      <HabitModal
        habit={selectedHabit}
        isOpen={modalOpen}
        onClose={closeModal}
        onUpdateTask={updateHabitTask} // Pass update function to modal
      />
    </PageContainer>
  );
};

export default Home;