import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'wouter';
import theme from '../styles/theme';
import GradientButton from '../components/GradientButton';
import { useUser } from '../contexts/UserContext';
import MaleDefault from '@assets/Male_Avatar.png';
import FemaleDefault from '@assets/Female_Avatar.png';

/**
 * Color palette used for the background gradient.
 */
const PALETTE = {
  mauve: "#EDC9FF",
  mimiPink: "#FED4E7",
  apricot: "#F2B79F",
  earthYellow: "#E5B769",
  citrine: "#D8CC34",
};

/**
 * Default values for new users.
 */
const DEFAULT_USER_POINTS = 250;
const DEFAULT_USER_LEVEL = 1;

/**
 * Represents the structure of the form data.
 */
interface FormData {
  name: string;
  age: string; // Kept as string for input handling, parsed on submit
  gender: 'male' | 'female';
}

/**
 * Represents the structure of the user object.
 */
interface User {
  name: string;
  age: number;
  gender: 'male' | 'female';
  points: number;
  level: number;
  avatar: string; // Assuming avatar is a path/URL string
}

/**
 * Container for the entire page with an animated gradient background.
 */
const PageContainer = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg,
    ${PALETTE.mauve} 0%,
    ${PALETTE.mimiPink} 25%,
    ${PALETTE.apricot} 50%,
    ${PALETTE.earthYellow} 75%,
    ${PALETTE.citrine} 100%
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite; /* Background animation */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @keyframes gradient-shift {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
`;

/**
 * Wrapper for the main form content with styling.
 */
const FormWrapper = styled.div`
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${theme.shadows.lg};
  padding: 3rem;
  max-width: 960px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

/**
 * Main heading for the form.
 */
const Heading = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-family: ${theme.fontFamily.poppins};
  font-weight: ${theme.fontWeight.bold};
`;

/**
 * Span to apply gradient styling to text.
 */
const GradientText = styled.span`
  background: ${theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

/**
 * Subheading text below the main heading.
 */
const Subheading = styled.p`
  text-align: center;
  color: ${theme.colors.gray[600]};
  margin-bottom: 1rem;
`;

/**
 * Grid layout for form and preview sections.
 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Container for the form input elements.
 */
const FormSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

/**
 * Styles for a single form input group (label + input).
 */
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  input {
    padding: 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid ${theme.colors.gray[300]};
    font-size: 1rem;

    &:focus {
      border-color: ${theme.colors.primary.pink};
      outline: none;
    }
  }
`;

/**
 * Container for the gender selection cards.
 */
const GenderContainer = styled.div`
  display: flex;
  gap: 1.5rem;
`;

/**
 * Clickable card for selecting gender, highlights when selected.
 */
const GenderCard = styled.div<{ selected: boolean }>`
  border: 3px solid ${({ selected }) => (selected ? theme.colors.primary.pink : 'transparent')};
  border-radius: 1rem;
  padding: 0.5rem;
  background-color: transparent;
  cursor: pointer;
  width: 130px;
  height: 170px;
  text-align: center;
  box-shadow: ${theme.shadows.sm};
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  img {
    width: 120px;
    height: 120px;
    border-radius: 1rem;
    object-fit: cover;
    background-color: ${theme.colors.gray[100]};
  }

  span {
    margin-top: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    color: ${theme.colors.gray[800]};
  }

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;


/**
 * Container for the avatar preview section.
 */
const PreviewSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/**
 * Circular container for displaying the selected avatar preview.
 */
const AvatarCircle = styled.div`
  background: linear-gradient(135deg, #f9f9f9 60%, #dbeafe 100%);
  border-radius: 50%;
  width: 13rem;
  height: 13rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(60, 80, 220, 0.06);
  margin: 0 auto;
  position: relative;

  img {
    width: 11rem;
    height: 11rem;
    border-radius: 50%;
    object-fit: cover;
    background: #f5f5f5;
    border: 4px solid #fff;
    box-shadow: 0 4px 16px rgba(120, 120, 200, 0.07);
  }
`;


/**
 * Container for displaying the user's name and age below the avatar preview.
 */
const Info = styled.div`
  margin-top: 1rem;
  text-align: center;

  h3 {
    margin: 0.5rem 0 0.25rem;
    font-size: 1.2rem;
    font-weight: 600;
  }

  p {
    font-size: 0.875rem;
    color: ${theme.colors.gray[500]};
  }
`;

/**
 * Wrapper for the submit button.
 */
const ButtonWrapper = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

/**
 * Avatar Creation page component.
 * Allows users to input their name, age, select a gender,
 * see a preview, and submit to create their initial user profile.
 */
const AvatarCreation: React.FC = () => {
  const [, setLocation] = useLocation();
  const { setUser } = useUser(); // Access user context update function

  // State for managing form input values
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: 'male',
  });

  /**
   * Handles changes in the name and age input fields.
   * @param e - The input change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles selection of gender.
   * @param gender - The selected gender ('male' or 'female').
   */
  const handleGenderChange = (gender: 'male' | 'female') => {
    setFormData(prev => ({ ...prev, gender }));
  };

  /**
   * Handles form submission.
   * Prevents submission if required fields are empty.
   * Creates a new user object, updates the user context,
   * and navigates the user to the home page.
   * @param e - The form submit event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Basic validation
    if (!formData.name || !formData.age) {
      console.warn("Name and age are required."); // Added a simple warning
      return;
    }

    // Create the user object using defined types and constants
    const user: User = {
      name: formData.name,
      age: parseInt(formData.age, 10), // Ensure age is parsed as integer
      gender: formData.gender,
      points: DEFAULT_USER_POINTS,
      level: DEFAULT_USER_LEVEL,
      avatar: formData.gender === 'male' ? MaleDefault : FemaleDefault,
    };

    setUser(user); // Update user state in context
    setLocation('/'); // Navigate to the home page
  };

  // Determine which avatar to display based on selected gender
  const previewAvatar = formData.gender === 'male' ? MaleDefault : FemaleDefault;

  return (
    <PageContainer>
      <FormWrapper>
        <Heading><GradientText>Create Your Avatar</GradientText></Heading>
        <Subheading>Start your journey by creating your hero!</Subheading>

        {/* Form element with onSubmit handler */}
        <form onSubmit={handleSubmit}>
          <Grid>
            {/* Form Inputs Section */}
            <FormSide>
              <FormGroup>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your character's name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="age">Age</label>
                <input
                  type="number" // Use type="number" for age input
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="How old is your hero?"
                  required
                  min="1" // Optional: Add minimum age validation
                />
              </FormGroup>

              <FormGroup>
                <label>Gender</label>
                <GenderContainer>
                  {/* Male Gender Selection Card */}
                  <GenderCard
                    selected={formData.gender === 'male'}
                    onClick={() => handleGenderChange('male')}
                  >
                    <img src={MaleDefault} alt="Male Avatar Option" />
                    <span>Male</span>
                  </GenderCard>
                  {/* Female Gender Selection Card */}
                  <GenderCard
                    selected={formData.gender === 'female'}
                    onClick={() => handleGenderChange('female')}
                  >
                    <img src={FemaleDefault} alt="Female Avatar Option" />
                    <span>Female</span>
                  </GenderCard>
                </GenderContainer>
              </FormGroup>
            </FormSide>

            {/* Avatar Preview Section */}
            <PreviewSide>
              <AvatarCircle>
                <img src={previewAvatar} alt="Selected Avatar Preview" />
              </AvatarCircle>
              {/* Display name and age if available */}
              {(formData.name || formData.age) && (
                <Info>
                  <h3>{formData.name || "Hero Name"}</h3>
                  {formData.age && <p>Age: {formData.age}</p>}
                </Info>
              )}
            </PreviewSide>
          </Grid>

          {/* Submit Button */}
          <ButtonWrapper>
            <GradientButton type="submit">
              Create Character & Start Quest!
            </GradientButton>
          </ButtonWrapper>
        </form>
      </FormWrapper>
    </PageContainer>
  );
};

export default AvatarCreation;
