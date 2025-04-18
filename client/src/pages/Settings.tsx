import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../styles/theme';
import Navbar from '../components/Navbar';
import GradientButton from '../components/GradientButton';
import { useUser } from '../contexts/UserContext';
import { useLocation } from 'wouter';
import { Skin } from '../types';
import { User, UserCircle, Bell, Shield, Lock, Trash2 } from 'lucide-react';

// --- Constants ---
const PALETTE = {
  mauve: "#EDC9FF",
  mimiPink: "#FED4E7",
  apricot: "#F2B79F",
  earthYellow: "#E5B769",
  citrine: "#D8CC34",
};

/**
 * Type definition for the settings navigation tabs.
 */
type SettingTab = 'profile' | 'avatar' | 'notifications' | 'account';

/**
 * Interface for the profile form state.
 */
interface ProfileFormState {
  name: string;
  age: string;
  bio: string;
}

// --- Styled Components ---

/**
 * Main container for the Settings page with gradient background.
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
 * Grid layout for the settings page (Sidebar + Content).
 */
const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 18rem 1fr; /* Fixed sidebar width */
  }
`;

/**
 * Container for the settings sidebar navigation.
 * Becomes sticky on larger screens.
 */
const SettingsSidebar = styled.div`
  @media (min-width: ${theme.breakpoints.lg}) {
    position: sticky;
    top: 6rem; /* Adjust based on Navbar height */
    height: max-content; /* Ensure it doesn't overflow */
  }
`;

/**
 * Card styling for the sidebar.
 */
const SidebarCard = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
`;

/**
 * Container for the menu items within the sidebar.
 */
const SidebarMenu = styled.nav` /* Changed to nav for semantics */
  padding: 1rem 0;
`;

/**
 * Individual menu item button in the sidebar.
 * Styles change based on the `$active` prop.
 */
const MenuItem = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 0.85rem 1.5rem; /* Adjusted padding */
  text-align: left;
  background-color: ${props => props.$active ? theme.colors.gray[100] : 'transparent'};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: ${theme.transitions.default};
  border-left: 3px solid ${props => props.$active ? theme.colors.primary.pink : 'transparent'};
  margin-bottom: 0.25rem; /* Add spacing between items */

  /* Icon styling */
  .icon {
    width: 1.25rem; /* Lucide icon size */
    height: 1.25rem;
    margin-right: 0.85rem;
    color: ${props => props.$active ? theme.colors.primary.pink : theme.colors.gray[500]};
    transition: color 0.2s;
  }

  span {
    font-weight: ${props => props.$active ? theme.fontWeight.semibold : theme.fontWeight.medium};
    color: ${props => props.$active ? theme.colors.gray[900] : theme.colors.gray[700]};
    transition: color 0.2s;
  }

  &:hover {
    background-color: ${theme.colors.gray[50]};

    .icon, span {
      color: ${theme.colors.primary.pink};
    }
  }
`;

/**
 * Main container for the settings content area.
 */
const SettingsContent = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
`;

/**
 * Header for each settings section (e.g., Profile, Avatar).
 */
const SettingsSectionHeader = styled.div` /* Renamed for clarity */
  padding: 1.5rem 2rem; /* Increased padding */
  border-bottom: 1px solid ${theme.colors.gray[200]};

  h2 {
    font-size: 1.375rem; /* Adjusted size */
    font-weight: ${theme.fontWeight.bold};
  }
`;

/**
 * Body container for the content within each settings section.
 */
const SettingsSectionBody = styled.div` /* Renamed for clarity */
  padding: 2rem; /* Increased padding */
`;

/**
 * Styling for a form group (label + input/textarea).
 */
const FormGroup = styled.div`
  margin-bottom: 1.75rem; /* Increased margin */

  label {
    display: block;
    margin-bottom: 0.6rem; /* Increased margin */
    font-size: 0.9rem; /* Adjusted size */
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.colors.gray[700]};
  }

  input,
  textarea {
    width: 100%;
    padding: 0.85rem 1rem; /* Adjusted padding */
    border: 1px solid ${theme.colors.gray[300]};
    border-radius: ${theme.borderRadius.lg};
    font-size: 1rem;
    color: ${theme.colors.gray[900]};
    background-color: ${theme.colors.white};
    transition: ${theme.transitions.default};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.pink};
      box-shadow: 0 0 0 2px ${theme.colors.primary.pink}33; /* Focus ring */
    }

    &::placeholder {
      color: ${theme.colors.gray[400]};
    }

    &:disabled {
        background-color: ${theme.colors.gray[100]};
        cursor: not-allowed;
        opacity: 0.7;
    }
  }

  textarea {
    min-height: 7rem; /* Increased height */
    resize: vertical;
  }
`;

/**
 * Container for previewing the user's avatar in profile settings.
 */
const PreviewAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem; /* Increased margin */

  .avatar-image-wrapper { /* Renamed for clarity */
    width: 9rem; /* Increased size */
    height: 9rem;
    border-radius: ${theme.borderRadius.full};
    overflow: hidden;
    margin-bottom: 1.25rem; /* Increased margin */
    border: 4px solid ${theme.colors.gray[200]};
    box-shadow: ${theme.shadows.sm};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .avatar-name {
    font-size: 1.375rem; /* Adjusted size */
    font-weight: ${theme.fontWeight.semibold};
    margin-bottom: 0.3rem;
  }

  .avatar-level {
    font-size: 0.9rem; /* Adjusted size */
    color: ${theme.colors.gray[600]};
  }
`;

/**
 * Container for form action buttons (Save, Cancel).
 */
const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 1.5rem; /* Increased padding */
  gap: 0.75rem; /* Use gap instead of margin */
`;

/**
 * Styling for the Cancel button in forms.
 */
const CancelButton = styled.button`
  background-color: ${theme.colors.gray[100]};
  color: ${theme.colors.gray[700]};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: 0.75rem 1.5rem;
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};

  &:hover {
    background-color: ${theme.colors.gray[200]};
  }
`;

/**
 * Grid layout for displaying avatar/skin options.
 */
const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* Adjusted minmax */
  gap: 1.5rem; /* Increased gap */
  margin-bottom: 2rem; /* Increased margin */
`;

/**
 * Individual avatar/skin option card.
 * Styles change based on `$active` and `$locked` props.
 */
const AvatarOption = styled(motion.div)<{ $active: boolean; $locked: boolean }>`
  position: relative;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  cursor: ${props => props.$locked ? 'not-allowed' : 'pointer'};
  border: 3px solid ${props => props.$active ? theme.colors.primary.pink : 'transparent'};
  transition: border-color 0.2s ease;
  box-shadow: ${theme.shadows.sm};

  /* Dimming overlay for locked skins */
  ${props => props.$locked && `
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: inherit; /* Match parent border radius */
      z-index: 1;
    }
  `}

  .image-container {
    height: 160px; /* Adjusted height */
    background-color: ${theme.colors.gray[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem; /* Add padding */

    img {
      max-width: 100%;
      max-height: 100%; /* Ensure image fits */
      object-fit: contain; /* Use contain for better aspect ratio */
    }
  }

  .avatar-option-name { /* Renamed */
    padding: 0.75rem; /* Adjusted padding */
    text-align: center;
    font-size: 0.9rem; /* Adjusted size */
    font-weight: ${props => props.$active ? theme.fontWeight.semibold : theme.fontWeight.medium};
    color: ${props => props.$active ? theme.colors.primary.pink : theme.colors.gray[700]};
    background-color: ${theme.colors.white};
  }

  /* Lock icon for locked skins */
  ${props => props.$locked && `
    .lock-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -70%); /* Adjust vertical position */
      width: 3rem; /* Increased size */
      height: 3rem;
      border-radius: ${theme.borderRadius.full};
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;

      /* Using Lucide icon */
      .icon {
        color: ${theme.colors.white};
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  `}
`;

/**
 * Message displayed when no skins are available/unlocked.
 */
const NoSkinsMessage = styled.div`
  text-align: center;
  padding: 3rem 1.5rem; /* Increased padding */
  color: ${theme.colors.gray[500]};
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.lg};

  /* Icon styling */
  .icon {
    width: 3rem;
    height: 3rem;
    opacity: 0.4;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
    font-size: 1rem; /* Adjusted size */
  }
`;

/**
 * Container for notification settings options.
 */
const NotificationSettings = styled.div`
  .notification-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 0; /* Increased padding */
    border-bottom: 1px solid ${theme.colors.gray[100]}; /* Lighter border */

    &:last-child {
      border-bottom: none;
    }

    .option-text {
      padding-right: 1rem; /* Add spacing */
      h3 {
        font-size: 1rem;
        font-weight: ${theme.fontWeight.medium};
        margin-bottom: 0.3rem; /* Adjusted margin */
      }

      p {
        font-size: 0.875rem;
        color: ${theme.colors.gray[600]};
        line-height: 1.4;
      }
    }
  }
`;

/**
 * Custom switch component for toggling settings.
 */
const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 3.5rem;
  height: 1.75rem;
  flex-shrink: 0; /* Prevent shrinking */

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background: ${theme.gradients.primary};
    }

    &:checked + .slider:before {
      transform: translateX(1.75rem);
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${theme.colors.gray[300]};
    transition: ${theme.transitions.default};
    border-radius: ${theme.borderRadius.full};

    &:before {
      position: absolute;
      content: "";
      height: 1.25rem;
      width: 1.25rem;
      left: 0.25rem;
      bottom: 0.25rem;
      background-color: white;
      transition: ${theme.transitions.default};
      border-radius: ${theme.borderRadius.full};
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  }
`;

/**
 * Container for the "Danger Zone" actions (e.g., Reset Account).
 */
const DangerZone = styled.div`
  margin-top: 2rem; /* Add spacing */
  padding: 1.5rem; /* Increased padding */
  border: 1px solid ${theme.colors.status.needsWork}40; /* Adjusted opacity */
  background-color: ${theme.colors.status.needsWork}0A; /* Very light red background */
  border-radius: ${theme.borderRadius.lg};

  .danger-header {
    font-size: 1.1rem; /* Adjusted size */
    font-weight: ${theme.fontWeight.bold}; /* Bolder */
    color: ${theme.colors.status.needsWork};
    margin-bottom: 0.75rem; /* Increased margin */
    display: flex;
    align-items: center;

    .icon { /* Icon for header */
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.5rem;
    }
  }

  p {
    font-size: 0.9rem; /* Adjusted size */
    color: ${theme.colors.gray[700]}; /* Slightly darker */
    margin-bottom: 1.25rem; /* Increased margin */
    line-height: 1.5;
  }
`;

/**
 * Button styling for actions within the Danger Zone.
 */
const DangerButton = styled.button`
  background-color: ${theme.colors.status.needsWork};
  color: ${theme.colors.white};
  border: none; /* Removed border */
  border-radius: ${theme.borderRadius.lg};
  padding: 0.75rem 1.5rem; /* Adjusted padding */
  font-size: 0.9rem; /* Adjusted size */
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: ${theme.transitions.default};

  &:hover {
    background-color: ${theme.colors.status.needsWork}D9; /* Darken on hover */
    box-shadow: ${theme.shadows.sm};
  }
`;

// --- Modal Components (Shared Styles) ---

/**
 * Overlay for modal dialogs.
 */
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100; /* Ensure overlay is on top */
  padding: 1rem;
`;

/**
 * Content container for modal dialogs.
 */
const ModalContent = styled(motion.div)`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  width: 100%;
  max-width: 34rem; /* Slightly wider */
  box-shadow: ${theme.shadows.xl};
  overflow: hidden;
`;

/**
 * Header section for modal dialogs.
 */
const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex; /* For potential close button */
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 1.5rem;
    font-weight: ${theme.fontWeight.bold};
    color: ${props => props.color || theme.colors.gray[900]}; /* Allow color override */
  }
`;

/**
 * Body section for modal dialogs.
 */
const ModalBody = styled.div`
  padding: 1.5rem 2rem;

  p {
    margin-bottom: 1rem;
    color: ${theme.colors.gray[700]};
    line-height: 1.6;
  }

  ul {
      list-style-type: disc;
      padding-left: 1.5rem; /* Indent list */
      margin-bottom: 1rem;
      color: ${theme.colors.gray[700]};
      line-height: 1.6;
  }

  .warning {
    color: ${theme.colors.status.needsWork};
    font-weight: ${theme.fontWeight.semibold}; /* Bolder warning */
  }
`;

/**
 * Footer section for modal dialogs, containing action buttons.
 */
const ModalFooter = styled.div`
  padding: 1.25rem 2rem; /* Adjusted padding */
  border-top: 1px solid ${theme.colors.gray[100]}; /* Lighter border */
  background-color: ${theme.colors.gray[50]}; /* Light background */
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

// --- Component ---

/**
 * Settings Page Component
 * Allows users to manage profile information, customize their avatar,
 * configure notifications, and manage account settings.
 */
const Settings: React.FC = () => {
  const { user, skins, resetUser, setUser, setActiveSkin } = useUser();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<SettingTab>('profile');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Initial bio text (could be fetched or default)
  const DEFAULT_BIO = "I'm on a journey to build better habits and become the best version of myself!";

  // Form state initialized with user data and default bio
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    name: user.name,
    age: user.age.toString(),
    bio: user.bio || DEFAULT_BIO, // Use saved bio or default
  });

  // Update form state if user data changes externally
  useEffect(() => {
    setProfileForm({
      name: user.name,
      age: user.age.toString(),
      bio: user.bio || DEFAULT_BIO,
    });
  }, [user.name, user.age, user.bio]); // Depend on specific user fields

  /**
   * Handles changes in the profile form inputs.
   * @param e - The input or textarea change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles saving the profile form changes.
   * Updates the user context with new name, age, and bio.
   * @param e - The form submit event.
   */
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update user profile in context
    setUser({
      ...user,
      name: profileForm.name,
      age: parseInt(profileForm.age, 10) || user.age, // Parse age, fallback to current if invalid
      bio: profileForm.bio,
    });
    // Optionally show a success message here
  };

  /**
   * Handles selecting a different avatar skin.
   * Only allows selection if the skin is purchased.
   * @param skin - The skin object to select.
   */
  const handleAvatarSelect = (skin: Skin) => {
    if (!skin.purchased) return; // Prevent selecting locked skins
    setActiveSkin(skin.id);
  };

  /**
   * Handles the final confirmation of resetting the account.
   * Calls resetUser from context and navigates to the home page.
   */
  const handleResetAccount = () => {
    setConfirmModalOpen(false);
    resetUser();
    setLocation('/'); // Navigate to home or landing page after reset
  };

  // Filter skins available for the user's gender
  const userGenderSkins = skins.filter(skin => skin.gender === user.gender);

  // Filter purchased skins from the gender-specific list
  const purchasedSkins = userGenderSkins.filter(skin => skin.purchased);

  return (
    <PageContainer>
      <Navbar activeTab="profile" /> {/* Changed activeTab to profile */} 

      <MainContent>
        <PageHeader>
          <h1><GradientText>Settings</GradientText></h1>
          <p>Manage your profile, avatar, and account preferences.</p>
        </PageHeader>

        <SettingsGrid>
          {/* Sidebar Navigation */}
          <SettingsSidebar>
            <SidebarCard>
              <SidebarMenu aria-label="Settings Navigation">
                <MenuItem
                  $active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="icon" />
                  <span>Profile Settings</span>
                </MenuItem>

                <MenuItem
                  $active={activeTab === 'avatar'}
                  onClick={() => setActiveTab('avatar')}
                >
                  <UserCircle className="icon" />
                  <span>Avatar Customization</span>
                </MenuItem>

                <MenuItem
                  $active={activeTab === 'notifications'}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="icon" />
                  <span>Notifications</span>
                </MenuItem>

                <MenuItem
                  $active={activeTab === 'account'}
                  onClick={() => setActiveTab('account')}
                >
                  <Shield className="icon" />
                  <span>Account</span>
                </MenuItem>
              </SidebarMenu>
            </SidebarCard>
          </SettingsSidebar>

          {/* Settings Content Area */}
          <SettingsContent>
            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <SettingsSectionHeader>
                  <h2>Profile Settings</h2>
                </SettingsSectionHeader>

                <SettingsSectionBody>
                  <form onSubmit={handleProfileSubmit}>
                    <PreviewAvatar>
                      <div className="avatar-image-wrapper">
                        <img src={user.avatar} alt={`${profileForm.name}'s avatar`} />
                      </div>
                      <div className="avatar-name">{profileForm.name || user.name}</div>
                      <div className="avatar-level">Level {user.level} Adventurer</div>
                    </PreviewAvatar>

                    <FormGroup>
                      <label htmlFor="profile-name">Display Name</label>
                      <input
                        type="text"
                        id="profile-name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleInputChange}
                        placeholder="Enter your display name"
                        required
                        aria-required="true"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label htmlFor="profile-age">Age</label>
                      <input
                        type="number"
                        id="profile-age"
                        name="age"
                        value={profileForm.age}
                        onChange={handleInputChange}
                        min="1" // Basic validation
                        max="120"
                        placeholder="Enter your age"
                        required
                        aria-required="true"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label htmlFor="profile-bio">Bio</label>
                      <textarea
                        id="profile-bio"
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us a bit about your quest..."
                        rows={4} /* Suggest number of rows */
                      />
                    </FormGroup>

                    <FormActions>
                      <CancelButton
                        type="button"
                        onClick={() => setProfileForm({ name: user.name, age: user.age.toString(), bio: user.bio || DEFAULT_BIO })} // Reset form on cancel
                      >
                        Cancel
                      </CancelButton>
                      <GradientButton type="submit">
                        Save Changes
                      </GradientButton>
                    </FormActions>
                  </form>
                </SettingsSectionBody>
              </motion.div>
            )}

            {/* Avatar Customization Tab */}
            {activeTab === 'avatar' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <SettingsSectionHeader>
                  <h2>Avatar Customization</h2>
                </SettingsSectionHeader>

                <SettingsSectionBody>
                  <PreviewAvatar>
                    <div className="avatar-image-wrapper">
                      <img src={user.avatar} alt="Current avatar preview" />
                    </div>
                    <div className="avatar-name">Current Avatar</div>
                  </PreviewAvatar>

                  <h3 className="mb-4 font-semibold text-lg">Your Unlocked Skins</h3>

                  {purchasedSkins.length > 0 ? (
                    <AvatarGrid>
                      {/* Display purchased skins first, then locked ones */} 
                      {[...purchasedSkins, ...userGenderSkins.filter(skin => !skin.purchased)].map(skin => (
                        <AvatarOption
                          key={skin.id}
                          $active={user.avatar === skin.imageSrc}
                          $locked={!skin.purchased}
                          onClick={() => handleAvatarSelect(skin)}
                          whileHover={skin.purchased ? { scale: 1.05, boxShadow: theme.shadows.md } : {}}
                          transition={{ duration: 0.2 }}
                          role="button"
                          aria-label={`Select ${skin.name} avatar ${skin.purchased ? '' : '(Locked)'}`}
                          tabIndex={skin.purchased ? 0 : -1}
                        >
                          <div className="image-container">
                            <img src={skin.imageSrc} alt={skin.name} />
                          </div>
                          <div className="avatar-option-name">{skin.name}</div>

                          {!skin.purchased && (
                            <div className="lock-icon" aria-hidden="true">
                              <Lock className="icon" />
                            </div>
                          )}
                        </AvatarOption>
                      ))}
                    </AvatarGrid>
                  ) : (
                    <NoSkinsMessage>
                      <UserCircle className="icon" />
                      <p>You haven't unlocked any custom skins yet.</p>
                      <GradientButton onClick={() => setLocation('/rewards')}>
                        Visit Rewards Shop
                      </GradientButton>
                    </NoSkinsMessage>
                  )}
                </SettingsSectionBody>
              </motion.div>
            )}

            {/* Notifications Tab */} 
            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <SettingsSectionHeader>
                  <h2>Notification Settings</h2>
                </SettingsSectionHeader>

                <SettingsSectionBody>
                  <NotificationSettings>
                    {/* Example Notification Options */} 
                    <div className="notification-option">
                      <div className="option-text">
                        <h3>Daily Reminders</h3>
                        <p>Receive push notifications for your daily tasks.</p>
                      </div>
                      <Switch>
                        <input type="checkbox" defaultChecked aria-label="Toggle Daily Reminders" />
                        <span className="slider"></span>
                      </Switch>
                    </div>

                    <div className="notification-option">
                      <div className="option-text">
                        <h3>Streak Alerts</h3>
                        <p>Get notified when your habit streak is at risk.</p>
                      </div>
                      <Switch>
                        <input type="checkbox" defaultChecked aria-label="Toggle Streak Alerts" />
                        <span className="slider"></span>
                      </Switch>
                    </div>

                    <div className="notification-option">
                      <div className="option-text">
                        <h3>Challenge Updates</h3>
                        <p>Receive updates about your active challenges (progress, completion).</p>
                      </div>
                      <Switch>
                        <input type="checkbox" defaultChecked aria-label="Toggle Challenge Updates" />
                        <span className="slider"></span>
                      </Switch>
                    </div>

                    <div className="notification-option">
                      <div className="option-text">
                        <h3>Lounge Messages</h3>
                        <p>Get notified about new messages in your joined lounges.</p>
                      </div>
                      <Switch>
                        <input type="checkbox" aria-label="Toggle Lounge Messages" />
                        <span className="slider"></span>
                      </Switch>
                    </div>

                     <div className="notification-option">
                      <div className="option-text">
                        <h3>Level Up Celebrations</h3>
                        <p>Celebrate when you level up and earn rewards.</p>
                      </div>
                      <Switch>
                        <input type="checkbox" defaultChecked aria-label="Toggle Level Up Celebrations" />
                        <span className="slider"></span>
                      </Switch>
                    </div>

                     <div className="notification-option">
                      <div className="option-text">
                        <h3>Email Newsletter</h3>
                        <p>Receive occasional updates and tips via email.</p>
                      </div>
                      <Switch>
                        <input type="checkbox" aria-label="Toggle Email Newsletter" />
                        <span className="slider"></span>
                      </Switch>
                    </div>
                  </NotificationSettings>

                  <FormActions>
                    <GradientButton type="button"> {/* Make type button if not submitting */} 
                      Save Notification Preferences
                    </GradientButton>
                  </FormActions>
                </SettingsSectionBody>
              </motion.div>
            )}

            {/* Account Tab */} 
            {activeTab === 'account' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <SettingsSectionHeader>
                  <h2>Account Settings</h2>
                </SettingsSectionHeader>

                <SettingsSectionBody>
                  <FormGroup>
                    <label htmlFor="account-email">Email Address</label>
                    <input
                      type="email"
                      id="account-email"
                      name="email"
                      value="user@example.com" /* Placeholder - fetch actual email */
                      readOnly
                      disabled
                      aria-label="Email Address (read-only)"
                    />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor="account-password">Password</label>
                    <input
                      type="password"
                      id="account-password"
                      name="password"
                      value="********" /* Placeholder */
                      readOnly
                      disabled
                      aria-label="Password (read-only)"
                    />
                    {/* Add a button/link to change password here */} 
                  </FormGroup>

                  <DangerZone>
                    <div className="danger-header">
                        <Trash2 className="icon" />
                        Danger Zone
                    </div>
                    <p>
                      Resetting your account will permanently delete all your data,
                      including progress, habits, achievements, and unlocked items.
                      <strong className="text-red-600"> This action cannot be undone.</strong>
                    </p>
                    <DangerButton onClick={() => setConfirmModalOpen(true)}>
                      Reset Account
                    </DangerButton>
                  </DangerZone>
                </SettingsSectionBody>
              </motion.div>
            )}
          </SettingsContent>
        </SettingsGrid>
      </MainContent>

      {/* Confirmation Modal for Account Reset */}
      <AnimatePresence>
        {confirmModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmModalOpen(false)} // Close on overlay click
            aria-labelledby="reset-modal-title"
            aria-modal="true"
            role="dialog"
          >
            <ModalContent
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <ModalHeader color={theme.colors.status.needsWork}>
                <h2 id="reset-modal-title">Confirm Account Reset</h2>
                {/* Optional: Add a close button here */}
              </ModalHeader>

              <ModalBody>
                <p>
                  Are you absolutely sure you want to reset your LevelUp account? This will permanently delete:
                </p>
                <ul>
                  <li>All your saved habits and task progress</li>
                  <li>All accumulated streaks and achievements</li>
                  <li>All unlocked avatar skins and reward items</li>
                  <li>Your current level and points balance</li>
                </ul>
                <p className="warning">
                  This action is irreversible. Your journey will start over from scratch.
                </p>
              </ModalBody>

              <ModalFooter>
                <CancelButton onClick={() => setConfirmModalOpen(false)}>
                  Cancel
                </CancelButton>
                <DangerButton onClick={handleResetAccount}>
                  Yes, Reset My Account
                </DangerButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Settings;
