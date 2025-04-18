import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../styles/theme';
import Navbar from '../components/Navbar';
import GradientButton from '../components/GradientButton';
import { useUser } from '../contexts/UserContext';
import { Skin } from '../types';
import { Star, Coins, ThLarge, Tshirt, UserTie, Glasses, Lock, CheckCircle, Tag } from 'lucide-react';
import MaleSkin1 from '@assets/Skin1_Male.png';
import FemaleSkin1 from '@assets/Skin1_Female.png';
import MaleBusinessSuit from '@assets/Skin2.png';
import YellowCap from '@assets/Skin3.png';
import Sunglasses from '@assets/Skin4.png';

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
  padding: 4rem 1rem 2rem;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 5rem 2rem 3rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  padding-left: 1rem;
  position: relative;

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
    font-size: 2rem;
    font-weight: ${theme.fontWeight.bold};
    margin-bottom: 0.75rem;
  }

  p {
    color: ${theme.colors.gray[600]};
    font-size: 1.1rem;
  }
`;

const GradientText = styled.span`
  background: ${theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const UserPoints = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  padding: 1.5rem 2rem;
  margin-bottom: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  .points-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .icon-wrapper {
      width: 3rem;
      height: 3rem;
      border-radius: ${theme.borderRadius.full};
      background: ${theme.gradients.primary};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .icon {
        color: ${theme.colors.white};
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .text {
      h3 {
        font-size: 1.25rem;
        font-weight: ${theme.fontWeight.bold};
        margin-bottom: 0.25rem;
        color: ${theme.colors.gray[900]};
      }

      p {
        color: ${theme.colors.gray[600]};
        font-size: 0.9rem;
      }
    }
  }

  .points-display {
    background-color: ${theme.colors.gray[50]};
    border: 1px solid ${theme.colors.gray[200]};
    border-radius: ${theme.borderRadius.full};
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon {
      color: ${theme.colors.secondary.gold};
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    span {
      font-size: 1.375rem;
      font-weight: ${theme.fontWeight.bold};
      color: ${theme.colors.gray[800]};
    }
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  margin-bottom: 2.5rem;
  overflow-x: auto;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  padding: 0 1rem;

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
  border-bottom: 3px solid ${props => props.$active ? theme.colors.primary.pink : 'transparent'};
  font-weight: ${props => props.$active ? theme.fontWeight.semibold : theme.fontWeight.medium};
  color: ${props => props.$active ? theme.colors.primary.pink : theme.colors.gray[600]};
  cursor: pointer;
  transition: ${theme.transitions.default};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: -1px;

  .icon {
      width: 1.1rem;
      height: 1.1rem;
      opacity: ${props => props.$active ? 1 : 0.7};
      transition: opacity 0.2s;
  }

  &:hover {
    color: ${theme.colors.primary.pink};
    .icon { opacity: 1; }
  }
`;

const SkinsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.75rem;
`;

const SkinCard = styled(motion.div)<{ $locked: boolean }>`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;

  ${props => props.$locked && `
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      pointer-events: none;
    }
  `}

  &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.lg};
  }
`;

const SkinImage = styled.div`
  height: 220px;
  background-color: ${theme.colors.gray[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1rem;
  position: relative;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const SkinDetails = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-top: 1px solid ${theme.colors.gray[100]};
`;

const SkinName = styled.h3`
  font-size: 1.125rem;
  font-weight: ${theme.fontWeight.semibold};
  margin-bottom: 0.5rem;
  color: ${theme.colors.gray[800]};
`;

const SkinType = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.gray[600]};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  .icon {
      width: 1rem;
      height: 1rem;
      opacity: 0.8;
  }
`;

const SkinActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
`;

const CostDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  .icon {
    color: ${theme.colors.secondary.gold};
    width: 1.1rem;
    height: 1.1rem;
  }

  span {
    font-weight: ${theme.fontWeight.semibold};
    color: ${theme.colors.gray[800]};
    font-size: 1rem;
  }
`;

const PurchaseButton = styled.button<{ $disabled: boolean }>`
  background: ${props => props.$disabled ? theme.colors.gray[300] : theme.gradients.primary};
  color: ${props => props.$disabled ? theme.colors.gray[500] : theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: 0.6rem 1.2rem;
  font-size: 0.875rem;
  font-weight: ${theme.fontWeight.medium};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: ${theme.transitions.default};
  opacity: ${props => props.$disabled ? 0.7 : 1};

  &:not(:disabled):hover {
    box-shadow: ${theme.shadows.md};
    filter: brightness(1.1);
  }
`;

const PurchasedBadge = styled.div`
  background-color: ${theme.colors.status.excellent}1A;
  color: ${theme.colors.status.excellent};
  border-radius: ${theme.borderRadius.lg};
  padding: 0.6rem 1.2rem;
  font-size: 0.875rem;
  font-weight: ${theme.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: 0.375rem;

  .icon {
      width: 1rem;
      height: 1rem;
  }
`;

const UnlockBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.full};
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;

  .icon {
      width: 1.25rem;
      height: 1.25rem;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  width: 100%;
  max-width: 34rem;
  box-shadow: ${theme.shadows.xl};
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 1.5rem;
    font-weight: ${theme.fontWeight.bold};
    color: ${props => props.color || theme.colors.gray[900]};
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .skin-preview {
    background-color: ${theme.colors.gray[100]};
    height: 220px;
    width: 220px;
    border-radius: ${theme.borderRadius.xl};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid ${theme.colors.gray[200]};

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .confirm-text {
    text-align: center;
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.375rem;
      font-weight: ${theme.fontWeight.semibold};
      margin-bottom: 0.75rem;
    }

    p {
      color: ${theme.colors.gray[600]};
      font-size: 1rem;
    }

    .cost-display {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.5rem;
      gap: 0.5rem;

      .icon {
        color: ${theme.colors.secondary.gold};
        width: 1.5rem;
        height: 1.5rem;
      }

      span {
        font-size: 1.5rem;
        font-weight: ${theme.fontWeight.bold};
        color: ${theme.colors.gray[800]};
      }
    }
  }
`;

const ModalFooter = styled.div`
  padding: 1.25rem 2rem;
  border-top: 1px solid ${theme.colors.gray[100]};
  background-color: ${theme.colors.gray[50]};
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const ButtonSecondary = styled.button`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${theme.colors.white}A0;
  border-radius: ${theme.borderRadius.xl};
  margin-top: 1rem;

  .icon {
      width: 3rem;
      height: 3rem;
      color: ${theme.colors.gray[400]};
      margin-bottom: 1rem;
      opacity: 0.6;
  }

  h3 {
    font-size: 1.375rem;
    font-weight: ${theme.fontWeight.semibold};
    margin-bottom: 0.75rem;
    color: ${theme.colors.gray[700]};
  }

  p {
    color: ${theme.colors.gray[600]};
    max-width: 26rem;
    margin: 0 auto;
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const additionalSkins: Skin[] = [
  {
    id: "male-fitness-outfit",
    name: "Athletic Fitness Outfit",
    gender: "male",
    type: "top",
    imageSrc: MaleSkin1,
    cost: 150,
    purchased: false,
  },
  {
    id: "female-fitness-outfit",
    name: "Pink Fitness Top",
    gender: "female",
    type: "top",
    imageSrc: FemaleSkin1,
    cost: 150,
    purchased: false,
  },
  {
    id: "male-business-suit",
    name: "Professional Business Suit",
    gender: "male",
    type: "outfit",
    imageSrc: MaleBusinessSuit,
    cost: 300,
    purchased: false,
  },
  {
    id: "yellow-baseball-cap-male",
    name: "Yellow Baseball Cap",
    gender: "male",
    type: "accessory",
    imageSrc: YellowCap,
    cost: 100,
    purchased: false,
  },
  {
    id: "yellow-baseball-cap-female",
    name: "Yellow Baseball Cap",
    gender: "female",
    type: "accessory",
    imageSrc: YellowCap,
    cost: 100,
    purchased: false,
  },
  {
    id: "designer-sunglasses-male",
    name: "Designer Sunglasses",
    gender: "male",
    type: "accessory",
    imageSrc: Sunglasses,
    cost: 200,
    purchased: false,
  },
  {
    id: "designer-sunglasses-female",
    name: "Designer Sunglasses",
    gender: "female",
    type: "accessory",
    imageSrc: Sunglasses,
    cost: 200,
    purchased: false,
  }
];

type RewardTabType = 'all' | 'tops' | 'outfits' | 'accessories';

const Rewards: React.FC = () => {
  const { user, skins: contextSkins, purchaseSkin } = useUser();
  const [activeTab, setActiveTab] = useState<RewardTabType>('all');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);

  const allAvailableSkins = React.useMemo(() => {
    const combined = [...contextSkins, ...additionalSkins];
    const uniqueSkins = Array.from(new Map(combined.map(skin => [skin.id, skin])).values());
    return uniqueSkins;
  }, [contextSkins]);

  const filteredSkins = allAvailableSkins.filter(skin => {
    if (skin.gender !== user.gender) return false;

    if (activeTab === 'all') return true;
    return skin.type === activeTab;
  });

  const handlePurchaseClick = (skin: Skin) => {
    if (!skin.purchased) {
        setSelectedSkin(skin);
        setConfirmModalOpen(true);
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedSkin) return;

    if (user.points >= selectedSkin.cost) {
      purchaseSkin(selectedSkin.id);
      setConfirmModalOpen(false);
      setSelectedSkin(null);
    } else {
      console.error("Insufficient points to purchase this skin.");
      setConfirmModalOpen(false);
    }
  };

  const getTypeIcon = (type: Skin['type']) => {
    switch (type) {
      case 'top': return Tshirt;
      case 'outfit': return UserTie;
      case 'accessory': return Glasses;
      default: return Tshirt;
    }
  };

  return (
    <PageContainer>
      <Navbar activeTab="rewards" />
      
      <MainContent>
        <PageHeader>
          <h1>Avatar <GradientText>Rewards</GradientText></h1>
          <p>Spend your hard-earned points to customize your hero!</p>
        </PageHeader>
        
        <UserPoints>
          <div className="points-info">
            <div className="icon-wrapper">
              <Star className="icon" />
            </div>
            <div className="text">
              <h3>Your Points Balance</h3>
              <p>Earn more by completing quests & challenges.</p>
            </div>
          </div>
          
          <div className="points-display">
            <Coins className="icon" />
            <span>{user.points} Points</span>
          </div>
        </UserPoints>
        
        <Tabs>
          <Tab 
            $active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            <ThLarge className="icon" /> All Items
          </Tab>
          <Tab 
            $active={activeTab === 'tops'}
            onClick={() => setActiveTab('tops')}
          >
            <Tshirt className="icon" /> Tops
          </Tab>
          <Tab 
            $active={activeTab === 'outfits'}
            onClick={() => setActiveTab('outfits')}
          >
            <UserTie className="icon" /> Outfits
          </Tab>
          <Tab 
            $active={activeTab === 'accessories'}
            onClick={() => setActiveTab('accessories')}
          >
            <Glasses className="icon" /> Accessories
          </Tab>
        </Tabs>
        
        {filteredSkins.length > 0 ? (
          <SkinsGrid>
            {filteredSkins.map(skin => {
              const isLocked = !skin.purchased;
              const canAfford = user.points >= skin.cost;
              const IconComponent = getTypeIcon(skin.type);

              return (
                <SkinCard
                  key={skin.id}
                  $locked={isLocked}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  {isLocked && (
                    <UnlockBadge aria-hidden="true">
                      <Lock className="icon" />
                    </UnlockBadge>
                  )}
                  
                  <SkinImage>
                    <img src={skin.imageSrc} alt={`Preview of ${skin.name}`} />
                  </SkinImage>
                  
                  <SkinDetails>
                    <SkinName>{skin.name}</SkinName>
                    <SkinType>
                      <IconComponent className="icon" />
                      {skin.type.charAt(0).toUpperCase() + skin.type.slice(1)}
                    </SkinType>
                    
                    <SkinActions>
                      <CostDisplay>
                        <Coins className="icon" />
                        <span>{skin.cost}</span>
                      </CostDisplay>
                      
                      {isLocked ? (
                        <PurchaseButton
                          onClick={() => handlePurchaseClick(skin)}
                          $disabled={!canAfford}
                          disabled={!canAfford}
                          aria-label={`Unlock ${skin.name} for ${skin.cost} points`}
                        >
                          Unlock
                        </PurchaseButton>
                      ) : (
                        <PurchasedBadge>
                          <CheckCircle className="icon" />
                          Owned
                        </PurchasedBadge>
                      )}
                    </SkinActions>
                  </SkinDetails>
                </SkinCard>
              );
            })}
          </SkinsGrid>
        ) : (
          <EmptyState>
            <Tag className="icon" />
            <h3>No items found</h3>
            <p>
              {activeTab === 'all'
                ? `No rewards available for ${user.gender} avatars right now. Keep earning points!`
                : `No ${activeTab} available for ${user.gender} avatars. Check other categories!`}
            </p>
          </EmptyState>
        )}
      </MainContent>
      
      <AnimatePresence>
        {confirmModalOpen && selectedSkin && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmModalOpen(false)}
            aria-labelledby="confirm-purchase-title"
            aria-modal="true"
            role="dialog"
          >
            <ModalContent
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h2 id="confirm-purchase-title">Confirm Purchase</h2>
              </ModalHeader>
              
              <ModalBody>
                <div className="skin-preview">
                  <img src={selectedSkin.imageSrc} alt={selectedSkin.name} />
                </div>
                
                <div className="confirm-text">
                  <h3>{selectedSkin.name}</h3>
                  <p>Unlock this item for your avatar?</p>
                  
                  <div className="cost-display">
                    <Coins className="icon" />
                    <span>{selectedSkin.cost} Points</span>
                  </div>
                </div>
              </ModalBody>
              
              <ModalFooter>
                <ButtonSecondary onClick={() => setConfirmModalOpen(false)}>
                  Cancel
                </ButtonSecondary>
                <GradientButton
                   onClick={handleConfirmPurchase}
                   disabled={user.points < selectedSkin.cost}
                >
                   Confirm Purchase
                </GradientButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Rewards;
