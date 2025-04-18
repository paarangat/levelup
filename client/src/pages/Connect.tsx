/**
 * src/pages/Connect.tsx
 *
 * This component renders the Connect page, allowing users to join or create
 * chat lounges (study groups) and interact with other users in real-time.
 */

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../styles/theme';
import Navbar from '../components/Navbar';
import { useUser } from '../contexts/UserContext';
import GradientButton from '../components/GradientButton';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import { Input } from '../components/ui/input';
import { MessageCircle, Users, LogOut, Send, Clock, Calendar, Search, Plus, X, UsersRound, Dumbbell, Brain, LaptopCode } from 'lucide-react';
import { DefaultTheme } from 'styled-components';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaUserPlus, FaSignInAlt, FaPlus, FaTimes } from 'react-icons/fa';

/**
 * Represents a message within a chat lounge.
 */
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: Date;
}

/**
 * Represents a member within a chat lounge.
 */
interface LoungeMember {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

/**
 * Represents a chat lounge.
 */
interface Lounge {
  id: string;
  title: string;
  category: string;
  categoryIcon: React.ElementType;
  membersCount: number;
  description: string;
  createdBy: {
    name: string;
    avatar: string;
  };
  joined: boolean;
  messages?: Message[];
  membersList?: LoungeMember[];
}

/**
 * Represents the state for the create lounge form.
 */
interface CreateLoungeFormState {
    title: string;
    category: string;
    description: string;
}

/**
 * Type definition for the filter tabs.
 */
type LoungeTabType = 'discover' | 'joined';

const PALETTE = {
  mauve: "#EDC9FF",
  mimiPink: "#FED4E7",
  apricot: "#F2B79F",
  earthYellow: "#E5B769",
  citrine: "#D8CC34",
};

const INITIAL_CREATE_LOUNGE_STATE: CreateLoungeFormState = {
    title: '',
    category: 'Fitness',
    description: '',
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
    max-width: 600px;
  }
`;

const GradientText = styled.span`
  background: ${theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  margin-bottom: 2.5rem;
  overflow-x: auto;
  background-color: ${theme.colors.white}A0;
  border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  padding: 0 1rem;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
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
  border-bottom: 3px solid ${(props: { $active: boolean; theme: DefaultTheme }) => props.$active ? props.theme.colors.primary.pink : 'transparent'};
  font-weight: ${(props: { $active: boolean; theme: DefaultTheme }) => props.$active ? props.theme.fontWeight.semibold : props.theme.fontWeight.medium};
  color: ${(props: { $active: boolean; theme: DefaultTheme }) => props.$active ? props.theme.colors.primary.pink : props.theme.colors.gray[700]};
  cursor: pointer;
  transition: ${(props: { theme: DefaultTheme }) => props.theme.transitions.default};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: -1px;

  .icon {
      width: 1.1rem;
      height: 1.1rem;
      opacity: ${(props: { $active: boolean }) => props.$active ? 1 : 0.8};
      transition: opacity 0.2s;
  }

  &:hover {
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.primary.pink};
    .icon { opacity: 1; }
  }
`;

const LoungesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    gap: 2rem;
  }
`;

const LoungeCard = styled(motion.div)`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg};
  overflow: hidden;
  transition: ${theme.transitions.default};
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: ${theme.shadows.xl};
    transform: translateY(-4px);
  }
`;

const LoungeHeader = styled.div`
  padding: 1.5rem 1.75rem;
  border-bottom: 1px solid ${theme.colors.gray[100]};
  
  h3 {
    font-size: 1.3rem;
    font-weight: ${theme.fontWeight.bold};
    margin-bottom: 0.75rem;
    color: ${theme.colors.gray[800]};
  }
  
  .meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;

    .category, .members {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .icon {
          width: 1rem;
          height: 1rem;
          opacity: 0.9;
      }
      .category .icon { color: ${theme.colors.primary.blue}; }
      .members .icon { color: ${theme.colors.primary.pink}; }

      span {
        font-size: 0.875rem;
        color: ${theme.colors.gray[600]};
        font-weight: ${theme.fontWeight.medium};
      }
    }
  }
`;

const LoungeBody = styled.div`
  padding: 1.5rem 1.75rem;
  flex-grow: 1;
  
  p {
    color: ${theme.colors.gray[700]};
    line-height: 1.6;
    font-size: 0.95rem;
  }
`;

const LoungeFooter = styled.div`
  padding: 1.25rem 1.75rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid ${theme.colors.gray[100]};
  background-color: ${theme.colors.gray[50]};
  
  .created-by {
    display: flex;
    align-items: center;
    gap: 0.6rem;

    .avatar {
      width: 2.25rem;
      height: 2.25rem;
    }

    .info {
      .label {
        font-size: 0.75rem;
        color: ${theme.colors.gray[500]};
      }
      .name {
        font-size: 0.875rem;
        font-weight: ${theme.fontWeight.medium};
        color: ${theme.colors.gray[800]};
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button<{$primary?: boolean; $danger?: boolean}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.$primary ? theme.gradients.primary : 'transparent'};
  color: ${props => props.$primary ? theme.colors.white : props.$danger ? theme.colors.status.needsWork : theme.colors.gray[700]};
  border: 1px solid ${props => props.$primary ? 'transparent' : props.$danger ? theme.colors.status.needsWork + '55' : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  padding: 0.6rem 1.2rem;
  font-size: 0.875rem;
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};

  .icon {
      width: 1rem;
      height: 1rem;
  }

  &:hover {
    box-shadow: ${theme.shadows.sm};
    background: ${props => props.$primary
        ? theme.gradients.primary
        : props.$danger
            ? theme.colors.status.needsWork + '15'
            : theme.colors.gray[100]};
    border-color: ${props => props.$primary
        ? 'transparent'
        : props.$danger
            ? theme.colors.status.needsWork + '88'
            : theme.colors.gray[400]};
    color: ${props => props.$primary
        ? theme.colors.white
        : props.$danger
            ? theme.colors.status.needsWork
            : theme.colors.gray[800]};
    filter: ${props => props.$primary ? 'brightness(1.1)' : 'none'};
  }
`;

const CreateLoungeButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.75rem;
  height: 3.75rem;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.gradients.primary};
  color: ${theme.colors.white};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${theme.shadows.lg};
  z-index: 10;

  .icon {
      width: 1.75rem;
      height: 1.75rem;
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
  padding: 1rem;
`;

const BaseModalContent = styled(motion.div)`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.xl};
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

const CreateLoungeModalContent = styled(BaseModalContent)`
  width: 100%;
  max-width: 34rem;
`;

const ChatRoomModalContent = styled(BaseModalContent)`
  width: 100%;
  max-width: 60rem;
  height: 85vh;
  max-height: 850px;
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${theme.colors.gray[100]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  h2 {
    font-size: 1.5rem;
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.gray[800]};
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .icon {
        width: 1.25em;
        height: 1.25em;
        color: ${theme.colors.primary.blue};
    }
  }

  .close-button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: ${theme.colors.gray[400]};
    padding: 0.25rem;
    border-radius: ${theme.borderRadius.full};
    transition: all 0.2s;

    &:hover {
      color: ${theme.colors.gray[700]};
      background-color: ${theme.colors.gray[100]};
    }

    .icon {
        width: 1.5rem;
        height: 1.5rem;
    }
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1.75rem;
  
  label {
    display: block;
    margin-bottom: 0.6rem;
    font-size: 0.9rem;
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.colors.gray[700]};
  }
  
  input,
  select,
  textarea {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid ${theme.colors.gray[300]};
    border-radius: ${theme.borderRadius.lg};
    font-size: 1rem;
    color: ${theme.colors.gray[900]};
    background-color: ${theme.colors.white};
    transition: ${theme.transitions.default};
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.pink};
      box-shadow: 0 0 0 2px ${theme.colors.primary.pink}33;
    }
    
    &::placeholder {
      color: ${theme.colors.gray[400]};
    }
  }
  
  textarea {
    min-height: 7rem;
    resize: vertical;
  }
`;

const ModalFooter = styled.div`
  padding: 1.25rem 2rem;
  border-top: 1px solid ${theme.colors.gray[100]};
  background-color: ${theme.colors.gray[50]};
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const ButtonSecondary = styled.button`
  background-color: ${theme.colors.gray[100]};
  color: ${theme.colors.gray[700]};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  padding: 0.75rem 1.5rem;
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${theme.colors.gray[200]};
    border-color: ${theme.colors.gray[300]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  background-color: ${theme.colors.white}A0;
  border-radius: ${theme.borderRadius.xl};
  margin-top: 1rem;

  .icon {
      width: 3.5rem;
      height: 3.5rem;
      color: ${theme.colors.gray[300]};
      margin-bottom: 1.5rem;
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
    margin: 0 auto 1.5rem;
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const ChatRoomBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  background-color: ${theme.colors.gray[50]};
`;

const ChatRoomSidebar = styled.aside`
  width: 250px;
  border-right: 1px solid ${theme.colors.gray[100]};
  background-color: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.md}) {
      display: none;
  }
`;

const ChatRoomContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatMessagesList = styled(ScrollArea)`
  flex: 1;
  padding: 1.5rem;
  background-color: ${theme.colors.gray[50]};
`;

const ChatMessage = styled.div<{ $isUser?: boolean }>`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  max-width: 85%;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};

  .avatar-container {
    flex-shrink: 0;
    .avatar {
        width: 2.25rem;
        height: 2.25rem;
    }
  }

  .message-content {
    background-color: ${props => props.$isUser ? theme.colors.primary.pink + 'E0' : theme.colors.white};
    color: ${props => props.$isUser ? theme.colors.white : theme.colors.gray[800]};
    padding: 0.75rem 1rem;
    border-radius: ${props => props.$isUser
      ? `${theme.borderRadius.lg} ${theme.borderRadius.sm} ${theme.borderRadius.lg} ${theme.borderRadius.lg}`
      : `${theme.borderRadius.sm} ${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.lg}`};
    box-shadow: ${theme.shadows.sm};
    word-break: break-word;

    .name {
      font-weight: ${theme.fontWeight.semibold};
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
      color: ${props => props.$isUser ? theme.colors.white + 'CC' : theme.colors.primary.pink};
      display: ${props => props.$isUser ? 'none' : 'block'};
    }

    .text {
      line-height: 1.5;
    }

    .time {
      font-size: 0.75rem;
      color: ${props => props.$isUser ? theme.colors.white + 'AA' : theme.colors.gray[400]};
      margin-top: 0.3rem;
      text-align: right;
    }
  }
`;

const ChatInputContainer = styled.form`
  border-top: 1px solid ${theme.colors.gray[100]};
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: ${theme.colors.white};
  flex-shrink: 0;
`;

const SendButton = styled.button`
  background: ${theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.full};
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  .icon {
      width: 1.25rem;
      height: 1.25rem;
  }

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: scale(1.05);
    filter: brightness(1.1);
  }

  &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
      filter: none;
  }
`;

const MembersList = styled.div`
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;

  h3 {
    font-size: 0.9rem;
    font-weight: ${theme.fontWeight.semibold};
    color: ${theme.colors.gray[500]};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon {
        width: 1em;
        height: 1em;
    }
  }
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${theme.borderRadius.md};
  transition: all 0.2s;
  margin-bottom: 0.25rem;

  &:hover {
    background-color: ${theme.colors.gray[100]};
  }

  .avatar {
      width: 2rem;
      height: 2rem;
  }

  .name {
    font-size: 0.9rem;
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.colors.gray[800]};
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${theme.colors.status.excellent};
    flex-shrink: 0;
    box-shadow: 0 0 3px ${theme.colors.status.excellent}80;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[800]};
  cursor: pointer;
  appearance: none;
  background-image: url('data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3e%3cpath stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/%3e%3c/svg%3e');
  background-position: right 0.7rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
  }

  option[disabled] {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Connect: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<LoungeTabType>('discover');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [chatRoomOpen, setChatRoomOpen] = useState(false);
  const [currentLounge, setCurrentLounge] = useState<Lounge | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [lounges, setLounges] = useState<Lounge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for "Create Lounge" Modal
  const [newLoungeData, setNewLoungeData] = useState<CreateLoungeFormState>(INITIAL_CREATE_LOUNGE_STATE);
  const [currentMembers, setCurrentMembers] = useState<LoungeMember[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling
  const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
  const username = localStorage.getItem('username'); // Assuming username is stored

  const handleJoinLeaveLounge = (loungeId: string) => {
    setLounges(prevLounges =>
      prevLounges.map(lounge =>
        lounge.id === loungeId
          ? { ...lounge,
              joined: !lounge.joined,
              membersCount: lounge.joined ? lounge.membersCount - 1 : lounge.membersCount + 1 }
          : lounge
      )
    );
  };

  const handleViewLounge = (loungeId: string) => {
    const loungeToView = lounges.find(l => l.id === loungeId);
    const loungeWithChatData = generateDummyChatData(loungeToView, user);
    if (loungeWithChatData) {
      setCurrentLounge(loungeWithChatData);
      setChatRoomOpen(true);
      setNewMessage('');
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !currentLounge) return;

    const newMsg: Message = {
      id: `msg-${currentLounge.id}-${Date.now()}`,
      senderId: user.id || 'user-1',
      senderName: user.name,
      senderAvatar: user.avatar,
      text: newMessage.trim(),
      timestamp: new Date(),
    };

    setCurrentLounge(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...(prev.messages || []), newMsg],
      };
    });

    setNewMessage('');

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    chatInputRef.current?.focus();
  };

  const handleCreateLoungeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLoungeData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateLoungeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoungeData.title || !newLoungeData.description) return;

    const newLoungeObj: Lounge = {
      id: `lounge-${Date.now()}`,
      title: newLoungeData.title,
      category: newLoungeData.category,
      categoryIcon: getCategoryIcon(newLoungeData.category),
      membersCount: 1,
      description: newLoungeData.description,
      createdBy: { name: user.name, avatar: user.avatar },
      joined: true,
    };

    setLounges(prev => [newLoungeObj, ...prev]);
    setCreateModalOpen(false);
    setNewLoungeData(INITIAL_CREATE_LOUNGE_STATE);
    setActiveTab('joined');

    handleViewLounge(newLoungeObj.id);
  };

  useEffect(() => {
    if (chatRoomOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [currentLounge?.messages, chatRoomOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (chatRoomOpen) setChatRoomOpen(false);
        if (createModalOpen) setCreateModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chatRoomOpen, createModalOpen]);

  const filteredLounges = activeTab === 'joined'
    ? lounges.filter(lounge => lounge.joined)
    : lounges;

  return (
    <PageContainer>
      <Navbar activeTab="connect" />
      
      <MainContent>
        <PageHeader>
          <h1>Habit <GradientText>Lounges</GradientText></h1>
          <p>Connect with like-minded people & support each other's journeys.</p>
        </PageHeader>
        
        <Tabs>
          <Tab 
            $active={activeTab === 'discover'}
            onClick={() => setActiveTab('discover')}
          >
            <Search className="icon" /> Discover Lounges
          </Tab>
          <Tab 
            $active={activeTab === 'joined'}
            onClick={() => setActiveTab('joined')}
          >
            <Users className="icon" /> Joined Lounges
          </Tab>
        </Tabs>
        
        {filteredLounges.length > 0 ? (
          <LoungesGrid>
            {filteredLounges.map(lounge => {
              const IconComponent = lounge.categoryIcon;
              return (
                <LoungeCard
                  key={lounge.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoungeHeader>
                    <h3>{lounge.title}</h3>
                    <div className="meta">
                      <div className="category">
                         <IconComponent className="icon" />
                        <span>{lounge.category}</span>
                      </div>
                      <div className="members">
                        <Users className="icon" />
                        <span>{lounge.membersCount} members</span>
                      </div>
                    </div>
                  </LoungeHeader>
                  
                  <LoungeBody>
                    <p>{lounge.description}</p>
                  </LoungeBody>
                  
                  <LoungeFooter>
                    <div className="created-by">
                      <Avatar className="avatar">
                        <AvatarImage src={lounge.createdBy.avatar} alt={`${lounge.createdBy.name}'s avatar`} />
                        <AvatarFallback>{lounge.createdBy.name.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="info">
                        <div className="label">Created by</div>
                        <div className="name">{lounge.createdBy.name}</div>
                      </div>
                    </div>
                    
                    <ActionButtons>
                      {lounge.joined ? (
                        <>
                          <ActionButton $primary onClick={() => handleViewLounge(lounge.id)}>
                            <MessageCircle size={16} className="icon" />
                            View Lounge
                          </ActionButton>
                          <ActionButton $danger onClick={() => handleJoinLeaveLounge(lounge.id)}>
                            <LogOut size={16} className="icon" />
                            Leave
                          </ActionButton>
                        </>
                      ) : (
                        <ActionButton $primary onClick={() => handleJoinLeaveLounge(lounge.id)}>
                           <Plus size={16} className="icon" />
                           Join Lounge
                        </ActionButton>
                      )}
                    </ActionButtons>
                  </LoungeFooter>
                </LoungeCard>
              );
            })}
          </LoungesGrid>
        ) : (
          <EmptyState>
             <UsersRound className="icon" />
            <h3>No lounges found</h3>
            <p>
              {activeTab === 'joined'
                ? "You haven't joined any lounges yet. Discover some interesting ones!"
                : "No lounges available in this category. Why not create one?"}
            </p>
            {activeTab === 'discover' && (
                <GradientButton onClick={() => setCreateModalOpen(true)}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }}/> Create a Lounge
                </GradientButton>
            )}
          </EmptyState>
        )}
      </MainContent>
      
      <CreateLoungeButton
        aria-label="Create new lounge"
        title="Create new lounge"
        onClick={() => setCreateModalOpen(true)}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.95 }}
      >
         <Plus className="icon" />
      </CreateLoungeButton>
      
      <AnimatePresence>
        {createModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCreateModalOpen(false)}
            aria-labelledby="create-lounge-title"
            aria-modal="true"
            role="dialog"
          >
            <CreateLoungeModalContent
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleCreateLoungeSubmit}>
                <ModalHeader>
                  <h2 id="create-lounge-title">Create a New Lounge</h2>
                  <button type="button" className="close-button" onClick={() => setCreateModalOpen(false)} aria-label="Close create lounge modal">
                     <X className="icon" />
                  </button>
                </ModalHeader>
                
                <ModalBody>
                  <FormGroup>
                    <label htmlFor="lounge-title">Lounge Name</label>
                    <Input
                      type="text"
                      id="lounge-title"
                      name="title"
                      value={newLoungeData.title}
                      onChange={handleCreateLoungeInputChange}
                      placeholder="E.g., Morning Workout Warriors"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="lounge-category">Category</label>
                    <StyledSelect
                      id="lounge-category"
                      name="category"
                      value={newLoungeData.category}
                      onChange={handleCreateLoungeInputChange}
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="Career">Career</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Health">Health</option>
                    </StyledSelect>
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="lounge-description">Description</label>
                    <textarea
                      id="lounge-description"
                      name="description"
                      value={newLoungeData.description}
                      onChange={handleCreateLoungeInputChange}
                      placeholder="Describe the purpose and vibe of your lounge..."
                      required
                      rows={4}
                    />
                  </FormGroup>
                </ModalBody>
                
                <ModalFooter>
                  <ButtonSecondary type="button" onClick={() => setCreateModalOpen(false)}>
                    Cancel
                  </ButtonSecondary>
                  <GradientButton type="submit">
                    Create Lounge
                  </GradientButton>
                </ModalFooter>
              </form>
            </CreateLoungeModalContent>
          </ModalOverlay>
        )}

        {chatRoomOpen && currentLounge && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setChatRoomOpen(false)}
            aria-labelledby={`chat-room-title-${currentLounge.id}`}
            aria-modal="true"
            role="dialog"
          >
            <ChatRoomModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h2 id={`chat-room-title-${currentLounge.id}`}>
                   {currentLounge.categoryIcon && <currentLounge.categoryIcon className="icon" />}
                  {currentLounge.title}
                </h2>
                 <button type="button" className="close-button" onClick={() => setChatRoomOpen(false)} aria-label="Close chat room">
                     <X className="icon" />
                  </button>
              </ModalHeader>
              
              <ChatRoomBody>
                <ChatRoomSidebar>
                  <MembersList>
                    <h3>
                      <Users className="icon" />
                      Members ({currentLounge.membersList?.length || 0})
                    </h3>
                    <Separator className="mb-2"/>
                    {currentLounge.membersList?.map(member => (
                      <Member key={member.id}>
                        <Avatar className="avatar">
                          <AvatarImage src={member.avatar} alt={`${member.name}'s avatar`} />
                          <AvatarFallback>{member.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <span className="name" title={member.name}>{member.name}</span>
                        {member.online && <span className="status-indicator" title="Online"></span>}
                      </Member>
                    ))}
                  </MembersList>
                </ChatRoomSidebar>
                
                <ChatRoomContent>
                  <ChatMessagesList>
                    <div style={{ height: '0.5rem' }}></div>
                    {currentLounge.messages?.map((message) => (
                      <ChatMessage
                        key={message.id}
                        $isUser={message.senderId === (user.id || 'user-1')}
                      >
                        <div className="avatar-container">
                           {message.senderId !== (user.id || 'user-1') && (
                            <Avatar className="avatar">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback>{message.senderName.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <div className="message-content">
                           {message.senderId !== (user.id || 'user-1') && (
                              <div className="name">{message.senderName}</div>
                          )}
                          <div className="text">{message.text}</div>
                          <div className="time">{formatTime(message.timestamp)}</div>
                        </div>
                      </ChatMessage>
                    ))}
                    <div ref={messagesEndRef} style={{ height: '1px' }} />
                  </ChatMessagesList>
                  
                  <ChatInputContainer onSubmit={handleSendMessage}>
                    <Input
                      ref={chatInputRef}
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      aria-label="Chat message input"
                      autoComplete="off"
                      maxLength={500}
                    />
                    <SendButton type="submit" aria-label="Send message" disabled={!newMessage.trim()}>
                      <Send className="icon" />
                    </SendButton>
                  </ChatInputContainer>
                </ChatRoomContent>
              </ChatRoomBody>
            </ChatRoomModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Connect;
