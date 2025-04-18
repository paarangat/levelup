// src/pages/Landing.tsx
import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../styles/theme';
import GradientButton from '../components/GradientButton';
import heroBackground from '@assets/Hero_Image.jpg';
import mobileHeroBackground from '@assets/Mobile_Hero.png'; // Corrected filename assumption
import logoImage from '@assets/logo.png';
import maleAvatar from '@assets/Male_Avatar.png';
import '@fontsource/press-start-2p'; // Import pixel-style font
import { Menu, X, Users, ShieldCheck, Award, Phone, Twitter, Instagram, Send } from 'lucide-react'; // Added icons

// --- Constants ---
const PARTICLE_COUNT = 25;
const NAV_LINKS = ["FEATURES", "ABOUT", "COMMUNITY", "SIGN IN"];
const FOOTER_LINKS = [
    { name: "Features", href: "#features" },
    { name: "About", href: "#" },
    { name: "Community Guidelines", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Contact", href: "#" },
];

// --- Animations ---

// Particle animation keyframes
const move = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.15; }
  50% { transform: translateY(-25px); opacity: 0.5; }
`;

// Framer Motion animation variants
const navItemVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08 + 0.6, duration: 0.4, ease: 'easeOut' }
  })
};

const logoMotionVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.4, duration: 0.5, ease: 'easeOut' }
  }
};

const heroContentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.6 } // Adjusted timing
  }
};

const headingVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const taglineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const buttonContainerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const cardVariants = {
  offscreen: { y: 60, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", bounce: 0.4, duration: 1 }
  }
};

// --- Styled Components ---

/**
 * Main container for the Landing page.
 */
const PageContainer = styled.div`
  background-color: ${theme.colors.white};
  color: ${theme.colors.dark};
  overflow-x: hidden; /* Prevent horizontal scroll */
  font-family: ${theme.fontFamily.poppins}; /* Base font */
`;

/**
 * Hero section with background image and main call to action.
 */
const HeroSection = styled.section`
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Align content towards the top */
  background-image: url(${heroBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  padding-top: 80px; /* Space for Navbar */
  padding-bottom: 4rem; /* Bottom padding */

  /* Mobile-specific background and adjustments */
  @media (max-width: ${theme.breakpoints.md}) {
    background-image: url(${mobileHeroBackground});
    background-position: center bottom; /* Adjust position */
    min-height: 90vh; /* Adjust height */
    padding-top: 60px;
  }
`;

/**
 * Navigation bar container.
 */
const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: absolute; /* Position over Hero */
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  max-width: 1300px; /* Slightly wider max-width */
  margin: 0 auto;
  width: 100%;
  font-family: ${theme.fontFamily.poppins};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0.75rem 1rem; /* Reduced padding on mobile */
  }
`;

/**
 * Container for desktop navigation links.
 */
const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.md}) {
    display: none; /* Hide on mobile */
  }
`;

/**
 * Individual navigation link button (desktop).
 */
const NavLink = styled(motion.button)`
  font-family: ${theme.fontFamily.poppins};
  color: rgba(255, 255, 255, 0.95); /* Brighter text */
  background: none;
  border: none;
  font-weight: ${theme.fontWeight.medium};
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); /* Softer shadow */
  cursor: pointer;
  padding: 0.5rem 0; /* Vertical padding for larger click area */
  font-size: 0.9rem;
  transition: color 0.2s ease, transform 0.2s ease;
  position: relative;

  /* Underline effect on hover */
  &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: ${theme.colors.primary.pink};
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
  }

  &:hover {
    color: ${theme.colors.white};
    transform: translateY(-1px);
    &::after {
        transform: scaleX(1);
    }
  }
`;

/**
 * Button to toggle the mobile menu.
 */
const HamburgerButton = styled(motion.button)`
  display: none; /* Hidden by default */
  background: none;
  border: none;
  color: white;
  font-size: 1.75rem; /* Larger icon */
  cursor: pointer;
  padding: 0.5rem;
  z-index: 110; /* Ensure it's above other elements */

  @media (max-width: ${theme.breakpoints.md}) {
    display: block; /* Visible on mobile */
  }
`;

/**
 * Fullscreen mobile menu overlay.
 */
const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(20, 10, 30, 0.97); /* Dark purple overlay */
  backdrop-filter: blur(5px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem; /* Increased gap */
`;

/**
 * Individual menu item button in the mobile menu.
 */
const MobileMenuItem = styled(motion.button)`
  font-family: ${theme.fontFamily.poppins};
  color: white;
  font-size: 1.3rem; /* Larger text */
  font-weight: ${theme.fontWeight.medium};
  background: none;
  border: none;
  cursor: pointer;
  padding: 1rem;
`;

/**
 * Button to close the mobile menu.
 */
const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.75rem; /* Match hamburger */
  cursor: pointer;
  padding: 0.5rem;
`;

/**
 * Container for the main hero content (heading, tagline, button).
 */
const HeroContent = styled(motion.div)`
  text-align: center;
  padding: 1rem 1.5rem; /* Adjusted padding */
  max-width: 850px; /* Slightly wider */
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  margin-top: 8vh; /* Adjusted margin-top */

  @media (max-width: ${theme.breakpoints.md}) {
     margin-top: 5vh; /* Adjust top margin on mobile */
  }
`;

/**
 * Main heading using the logo image.
 */
const MainHeading = styled(motion.div)` /* Changed to div to hold image */
  line-height: 1.4;
  margin-bottom: 1.5rem;

  /* Logo Image */
  img {
    max-width: clamp(280px, 55vw, 480px); /* Adjusted logo size */
    height: auto;
    display: block;
    margin: 0 auto;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.4)); /* Add shadow to logo */
  }
`;

/**
 * Tagline text below the main heading.
 */
const Tagline = styled(motion.p)`
  font-family: ${theme.fontFamily.poppins};
  font-size: clamp(1.1rem, 2.5vw, 1.4rem); /* Slightly larger */
  color: rgba(255, 255, 255, 0.98); /* Brighter text */
  font-weight: ${theme.fontWeight.medium};
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6); /* Adjusted shadow */
  max-width: 650px;
  line-height: 1.7; /* Adjusted line height */
  margin-bottom: 2.5rem; /* Increased margin */
`;

/**
 * Container for the primary call-to-action button.
 */
const ButtonContainer = styled(motion.div)`
  margin-top: 1rem; /* Adjusted margin */
`;

/**
 * Section displaying the key features of the application.
 */
const FeaturesSection = styled.section`
  /* Gradient background using theme colors */
  background: linear-gradient(180deg, ${theme.colors.primary.pink} 0%, ${theme.colors.secondary.peach} 100%);
  padding: 6rem 2rem 5rem 2rem;
  position: relative;
  font-family: ${theme.fontFamily.poppins};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 4rem 1rem 3rem 1rem;
  }
`;

/**
 * Title styling for sections (e.g., Features, Showcase).
 */
const SectionTitle = styled.h2`
  font-family: ${theme.fontFamily.montserrat}; /* Different font for titles */
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: ${theme.fontWeight.bold};
  text-align: center;
  margin-bottom: 5rem;
  color: ${theme.colors.gray[800]}; /* Darker color for contrast */
  position: relative;

  /* Underline element */
  &:after {
    content: '';
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 5px;
    background: linear-gradient(90deg, ${theme.colors.primary.pink} 0%, ${theme.colors.secondary.peach} 100%); /* Match section gradient */
    border-radius: 3px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    margin-bottom: 4rem;
     &:after {
        bottom: -1rem;
        width: 80px;
        height: 4px;
     }
  }
`;

/**
 * Grid layout for feature cards.
 */
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
`;

/**
 * Individual feature card styling.
 */
const FeatureCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.95); /* Slightly more opaque */
  border-radius: ${theme.borderRadius.xl};
  padding: 2.5rem;
  box-shadow: ${theme.shadows.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
     transform: translateY(-6px); /* Lift effect */
     box-shadow: ${theme.shadows.xl};
  }
`;

/**
 * Container for the feature icon.
 */
const FeatureIcon = styled.div`
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  height: 80px;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  /* Gradient background for icon container */
  background: linear-gradient(135deg, ${theme.colors.primary.pink} 0%, ${theme.colors.secondary.peach} 100%);
  color: ${theme.colors.white};
  box-shadow: 0 8px 16px rgba(229, 183, 105, 0.3); /* Adjusted shadow color */

  .icon { /* Icon size */
      width: 2.5rem;
      height: 2.5rem;
  }
`;

/**
 * Title text for a feature card.
 */
const FeatureTitle = styled.h3`
  font-family: ${theme.fontFamily.montserrat};
  font-size: 1.5rem;
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 1rem;
  color: ${theme.colors.gray[800]}; /* Darker color */
`;

/**
 * Description text for a feature card.
 */
const FeatureDescription = styled.p`
  font-family: ${theme.fontFamily.poppins};
  color: ${theme.colors.gray[600]};
  line-height: 1.7;
  font-size: 1rem; /* Slightly larger */
`;

/**
 * Section showcasing the character/avatar customization.
 */
const CharacterShowcaseSection = styled.section`
  padding: 6rem 2rem;
  background-color: ${theme.colors.gray[50]}; /* Light gray background */
  position: relative;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 4rem 1rem;
  }
`;

/**
 * Container for the showcase content (image + text).
 */
const ShowcaseContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column; /* Stack on mobile */
  align-items: center;
  gap: 3rem; /* Add gap */

  @media (min-width: ${theme.breakpoints.lg}) {
    flex-direction: row; /* Side-by-side on desktop */
    gap: 4rem;
  }
`;

/**
 * Container for the showcase image.
 */
const ShowcaseImageContainer = styled.div`
  width: 100%;
  max-width: 400px;

  img {
    width: 100%;
    height: auto;
    border-radius: ${theme.borderRadius.xl}; /* More rounded */
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); /* Softer shadow */
  }
`;

/**
 * Container for the showcase text content and button.
 */
const ShowcaseContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Adjusted gap */
  text-align: center;

  @media (min-width: ${theme.breakpoints.lg}) {
    text-align: left; /* Align left on desktop */
    align-items: flex-start; /* Align button left */
  }
`;

/**
 * Heading for the showcase section (using pixel font).
 */
const ShowcaseHeading = styled.h3`
  font-family: 'Press Start 2P', cursive; /* Pixel font */
  font-size: clamp(1.3rem, 3vw, 2.1rem); /* Responsive font size */
  color: ${theme.colors.gray[800]};
  margin-bottom: 0.5rem;
`;

/**
 * Description text for the showcase section.
 */
const ShowcaseDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8; /* Increased line height */
  color: ${theme.colors.gray[700]};
  margin-bottom: 1.5rem; /* Adjusted margin */
  max-width: 600px; /* Limit width */

  @media (min-width: ${theme.breakpoints.lg}) {
     max-width: none; /* Remove max-width on larger screens */
  }
`;

/**
 * Footer section of the page.
 */
const Footer = styled.footer`
  background-color: ${theme.colors.gray[800]}; /* Darker footer */
  color: ${theme.colors.gray[300]}; /* Lighter text */
  padding: 4rem 2rem 3rem; /* Adjusted padding */
  text-align: center;
  font-size: 0.9rem;
  font-family: ${theme.fontFamily.poppins};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 3rem 1rem 2.5rem;
  }
`;

/**
 * Container for footer content (logo, links, social, copyright).
 */
const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem; /* Increased gap */
`;

/**
 * Footer logo container.
 */
const FooterLogo = styled(motion.div)`
  margin-bottom: 0.5rem; /* Add space below logo */

  img {
    height: 45px; /* Adjusted size */
    width: auto;
    filter: brightness(1.5) contrast(1.1); /* Make logo slightly brighter */
  }
`;

/**
 * Container for footer navigation links.
 */
const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem 2rem;
  flex-wrap: wrap;
  justify-content: center;

  a {
    color: ${theme.colors.gray[400]}; /* Adjust link color */
    text-decoration: none;
    font-weight: ${theme.fontWeight.medium};
    transition: color 0.2s ease;
    &:hover {
      color: ${theme.colors.white};
      text-decoration: underline;
    }
  }
`;

/**
 * Container for social media icons in the footer.
 */
const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem; /* Increased gap */
  font-size: 1.6rem;
  margin-top: 0.5rem; /* Add space above */

  a {
    color: ${theme.colors.gray[400]};
    transition: color 0.3s ease, transform 0.3s ease;
    &:hover {
      color: ${theme.colors.white};
      transform: scale(1.15); /* Increase hover scale */
    }
  }
`;

/**
 * Copyright text in the footer.
 */
const CopyrightText = styled.p`
    margin-top: 1rem; /* Add space above */
    font-size: 0.85rem;
    color: ${theme.colors.gray[500]};
`;

/**
 * Container for particles in the Hero section.
 */
const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1; /* Below text, above background */
  overflow: hidden;
  pointer-events: none; /* Prevent interference */
`;

/**
 * Individual particle element.
 */
const Particle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  /* Use a theme color for particles, slightly transparent */
  background-color: ${theme.colors.primary.pink}55;
  animation: ${move} infinite ease-in-out; /* Apply animation */
`;

// --- Helper Functions ---

/**
 * Generates an array of particle properties for the Hero section.
 * @param count - The number of particles to generate.
 * @returns An array of particle objects with random properties.
 */
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `particle-${i}`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 1.5, // Random size between 1.5px and 4px
    delay: Math.random() * 5,      // Random animation delay up to 5s
    duration: Math.random() * 6 + 4, // Random animation duration between 4s and 10s
  }));
};

// --- Component ---

/**
 * Landing Page Component
 * Introduces the application, highlights key features, and prompts user signup/login.
 */
const Landing: React.FC = () => {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Generate particles only once using useMemo
  const particles = useMemo(() => generateParticles(PARTICLE_COUNT), []);

  /**
   * Navigates the user to the avatar creation page.
   */
  const handleGetStarted = () => {
    setLocation('/create-avatar');
  };

  /**
   * Scrolls to a specific section on the page.
   * @param sectionId - The ID of the section to scroll to.
   */
  const scrollToSection = (sectionId: string) => {
      const section = document.getElementById(sectionId);
      if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
      }
      setMenuOpen(false); // Close menu after clicking a link
  };

  return (
    <PageContainer>
      {/* Hero Section: Main visual and call to action */}
      <HeroSection>
        {/* Animated Particles Background */} 
        <ParticlesContainer aria-hidden="true">
          {particles.map(p => (
            <Particle
              key={p.id}
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </ParticlesContainer>

        {/* Navigation Bar */} 
        <Navbar>
          {/* Mobile Menu Toggle Button */}
          <HamburgerButton
            aria-label="Toggle mobile menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)} // Toggle menu state
          >
            {menuOpen ? <X /> : <Menu />} {/* Show X or Menu icon */} 
          </HamburgerButton>

          {/* Desktop Navigation Links */} 
          <NavLinks>
            {NAV_LINKS.map((link, index) => (
              <NavLink
                key={link}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // Example: Scroll to features section
                onClick={() => link === 'FEATURES' ? scrollToSection('features') : undefined}
              >
                {link}
              </NavLink>
            ))}
          </NavLinks>
        </Navbar>

        {/* Mobile Menu Overlay */} 
        <AnimatePresence>
          {menuOpen && (
            <MobileMenu
              initial={{ opacity: 0, x: "-100%" }} // Slide in from left
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }} // Slide out to left
              transition={{ type: "tween", duration: 0.3 }}
              role="dialog"
              aria-modal="true"
            >
              <CloseButton
                aria-label="Close mobile menu"
                onClick={() => setMenuOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                 <X />
              </CloseButton>

              {NAV_LINKS.map((link, index) => (
                <MobileMenuItem
                  key={link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05 + 0.1 } // Stagger animation
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  // Example: Scroll to features section
                  onClick={() => link === 'FEATURES' ? scrollToSection('features') : setMenuOpen(false)}
                >
                  {link}
                </MobileMenuItem>
              ))}
            </MobileMenu>
          )}
        </AnimatePresence>

        {/* Hero Content */} 
        <HeroContent variants={heroContentVariants} initial="hidden" animate="visible">
          <MainHeading variants={headingVariants}>
            <img src={logoImage} alt="Level Up Logo" />
          </MainHeading>
          <Tagline variants={taglineVariants}>
            Where Habits Become Quests & You Become the Hero.
          </Tagline>
          <ButtonContainer variants={buttonContainerVariants}>
            <GradientButton onClick={handleGetStarted} large>
              Start Your Quest
            </GradientButton>
          </ButtonContainer>
        </HeroContent>
      </HeroSection>

      {/* Features Section */} 
      <FeaturesSection id="features">
        <SectionTitle>How You'll Level Up</SectionTitle>
        <FeaturesGrid>
          {/* Feature 1: Quest-Based Habits */} 
          <FeatureCard
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }} // Trigger animation slightly earlier
          >
            <FeatureIcon><Award className="icon" /></FeatureIcon>
            <FeatureTitle>Quest-Based Habits</FeatureTitle>
            <FeatureDescription>
              Define your goals and turn them into daily or weekly quests. Earn XP and unlock rewards for consistency.
            </FeatureDescription>
          </FeatureCard>

          {/* Feature 2: Habit Guilds */}
          <FeatureCard
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
          >
            <FeatureIcon><Users className="icon" /></FeatureIcon>
            <FeatureTitle>Join Habit Guilds</FeatureTitle>
            <FeatureDescription>
              Connect with fellow adventurers sharing similar goals in focused Habit Guilds (Lounges). Share progress and motivate each other.
            </FeatureDescription>
          </FeatureCard>

          {/* Feature 3: Avatar Customization */} 
          <FeatureCard
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
          >
            <FeatureIcon><ShieldCheck className="icon" /></FeatureIcon>
            <FeatureTitle>Forge Your Hero</FeatureTitle>
            <FeatureDescription>
              Customize your unique avatar with gear and skins unlocked through achievements and completing challenges.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* Character Showcase Section */} 
      <CharacterShowcaseSection>
        <SectionTitle style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          Customize Your Avatar
        </SectionTitle>
        <ShowcaseContainer>
          <ShowcaseImageContainer>
            <motion.img
                src={maleAvatar}
                alt="Character Avatar Example"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.5 }}
            />
          </ShowcaseImageContainer>
          <ShowcaseContent>
            <ShowcaseHeading>
              Your Hero, Your Journey
            </ShowcaseHeading>
            <ShowcaseDescription>
              Personalize your character to reflect your unique quest. Unlock special outfits, gear, and accessories as you conquer habits and level up.
            </ShowcaseDescription>
            <GradientButton onClick={handleGetStarted}>
              Create Your Character
            </GradientButton>
          </ShowcaseContent>
        </ShowcaseContainer>
      </CharacterShowcaseSection>

      {/* Footer */}
      <Footer>
        <FooterContent>
          <FooterLogo
            variants={logoMotionVariants} // Reuse logo animation
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
          >
            <img src={logoImage} alt="Level Up Logo Small" />
          </FooterLogo>

          <FooterLinks>
            {FOOTER_LINKS.map(link => (
                 <a key={link.name} href={link.href}>{link.name}</a>
            ))}
          </FooterLinks>

          <SocialIcons>
            <a href="#" aria-label="Telegram" title="Telegram"><Send /></a>
            <a href="#" aria-label="Twitter" title="Twitter"><Twitter /></a>
            <a href="#" aria-label="Instagram" title="Instagram"><Instagram /></a>
          </SocialIcons>

          <CopyrightText>
             © {new Date().getFullYear()} LevelUp Habits. Build Your Legend.
          </CopyrightText>
        </FooterContent>
      </Footer>
    </PageContainer>
  );
};

export default Landing;