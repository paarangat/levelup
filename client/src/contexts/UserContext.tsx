import React, { createContext, useContext, useState, useEffect } from "react";
import { User, HabitCategory, Challenge, Skin } from "../types";
import MaleFitnessAvatar from "@assets/Male_Fitness_Avatar.png";
import MaleJournalingAvatar from "@assets/Male_Journaling_Avatar.png";
import MaleMeditatingAvatar from "@assets/Male_Meditating_Avatar.png";
import MaleSkin1 from "@assets/Male_Skin1.png";
import FemaleSkin1 from "@assets/Skin1_Female.png";

interface UserContextType {
  user: User;
  habitCategories: HabitCategory[];
  challenges: Challenge[];
  skins: Skin[];
  setUser: (user: User) => void;
  resetUser: () => void;
  updateHabitTask: (categoryId: string, taskId: string, completed: boolean) => void;
  purchaseSkin: (skinId: string) => void;
  setActiveSkin: (skinId: string) => void;
}

const defaultUser: User = {
  name: "",
  age: 0,
  gender: "male",
  points: 0,
  level: 1,
  avatar: "",
};

const defaultHabitCategories: HabitCategory[] = [
  {
    id: "fitness",
    name: "Fitness",
    status: "Excellent",
    streak: 7,
    avatarSrc: MaleFitnessAvatar,
    tasks: [
      { id: "morning-workout", name: "Morning Workout (20 mins)", completed: true, points: 10, time: "7:00 AM" },
      { id: "evening-yoga", name: "Evening Yoga (15 mins)", completed: false, points: 10, time: "6:00 PM" },
      { id: "steps", name: "10,000 Steps", completed: false, points: 15 },
    ],
  },
  {
    id: "journaling",
    name: "Journaling",
    status: "Good",
    streak: 5,
    avatarSrc: MaleJournalingAvatar,
    tasks: [
      { id: "morning-journal", name: "Morning Journal", completed: true, points: 10, time: "8:30 AM" },
      { id: "gratitude-list", name: "Gratitude List", completed: false, points: 5, time: "9:00 PM" },
    ],
  },
  {
    id: "mental-health",
    name: "Mental Health",
    status: "Good",
    streak: 4,
    avatarSrc: MaleMeditatingAvatar,
    tasks: [
      { id: "meditation", name: "Meditation (10 mins)", completed: true, points: 10, time: "9:00 AM" },
      { id: "deep-breathing", name: "Deep Breathing Exercise", completed: false, points: 5, time: "2:00 PM" },
      { id: "mindfulness", name: "Mindfulness Practice", completed: false, points: 5, time: "8:00 PM" },
    ],
  },
  {
    id: "career",
    name: "Career",
    status: "Fair",
    streak: 2,
    avatarSrc: MaleSkin1,
    tasks: [
      { id: "skill-learning", name: "Career Learning (30 mins)", completed: false, points: 15, time: "6:00 PM" },
      { id: "networking", name: "Professional Networking", completed: false, points: 10 },
    ],
  },
  {
    id: "everyday",
    name: "Everyday Tasks",
    status: "Needs Work",
    streak: 0,
    avatarSrc: MaleSkin1,
    tasks: [
      { id: "read-book", name: "Read Book (20 mins)", completed: false, points: 10, time: "8:00 PM" },
      { id: "clean-room", name: "Clean Room", completed: false, points: 5 },
      { id: "meal-prep", name: "Meal Prep", completed: false, points: 10 },
    ],
  },
];

const defaultChallenges: Challenge[] = [
  {
    id: "fitness-challenge",
    title: "30-Day Fitness Challenge",
    icon: "dumbbell",
    daysTotal: 30,
    daysCompleted: 12,
    daysRemaining: 18,
    participants: 245,
    rewards: {
      points: 150,
      item: "Exclusive outfit",
      itemIcon: "tshirt",
    },
  },
  {
    id: "journal-challenge",
    title: "Daily Journaling Sprint",
    icon: "book",
    daysTotal: 15,
    daysCompleted: 5,
    daysRemaining: 10,
    participants: 178,
    rewards: {
      points: 100,
      item: "Writing badge",
      itemIcon: "crown",
    },
  },
];

const defaultSkins: Skin[] = [
  {
    id: "male-blue-top",
    name: "Blue Nike Top",
    gender: "male",
    type: "top",
    imageSrc: "@assets/Skin1_Male.png",
    cost: 100,
    purchased: false,
  },
  {
    id: "female-pink-top",
    name: "Pink Nike Top",
    gender: "female",
    type: "top",
    imageSrc: "@assets/Skin1_Female.png",
    cost: 100,
    purchased: false,
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User>(() => {
    const savedUser = localStorage.getItem("levelup-user");
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });
  
  const [habitCategories, setHabitCategories] = useState<HabitCategory[]>(defaultHabitCategories);
  const [challenges, setChallenges] = useState<Challenge[]>(defaultChallenges);
  
  // Load skins from localStorage if available
  const [skins, setSkins] = useState<Skin[]>(() => {
    const savedSkins = localStorage.getItem("levelup-skins");
    return savedSkins ? JSON.parse(savedSkins) : defaultSkins;
  });

  useEffect(() => {
    localStorage.setItem("levelup-user", JSON.stringify(user));
    
    // Update avatars based on gender
    if (user.gender) {
      updateAvatarsForGender(user.gender);
    }
  }, [user]);

  // Save skins to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("levelup-skins", JSON.stringify(skins));
  }, [skins]);

  const updateAvatarsForGender = (gender: "male" | "female") => {
    const updatedCategories = habitCategories.map(category => {
      // In a real app, we would have female versions of all avatars
      // For simplicity in this demo, we'll keep the male avatars
      return {
        ...category,
        avatarSrc: category.avatarSrc // In a real app, change based on gender
      };
    });
    
    setHabitCategories(updatedCategories);
  };

  const setUser = (updatedUser: User) => {
    setUserState(updatedUser);
  };

  const resetUser = () => {
    setUserState(defaultUser);
    localStorage.removeItem("levelup-user");
  };

  const updateHabitTask = (categoryId: string, taskId: string, completed: boolean) => {
    setHabitCategories(prev => 
      prev.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            tasks: category.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, completed };
              }
              return task;
            }),
          };
        }
        return category;
      })
    );
    
    // Add points if completed
    if (completed) {
      const category = habitCategories.find(c => c.id === categoryId);
      const task = category?.tasks.find(t => t.id === taskId);
      
      if (task && !task.completed) {
        setUserState(prev => ({
          ...prev,
          points: prev.points + task.points
        }));
      }
    }
  };

  const purchaseSkin = (skinId: string) => {
    const skin = skins.find(s => s.id === skinId);
    
    if (skin && !skin.purchased && user.points >= skin.cost) {
      // Update user points - deduct the cost of the skin
      setUserState(prev => ({
        ...prev,
        points: prev.points - skin.cost
      }));
      
      // Mark skin as purchased
      setSkins(prev => 
        prev.map(s => {
          if (s.id === skinId) {
            return { ...s, purchased: true };
          }
          return s;
        })
      );
      
      // Set this as the active skin if the user doesn't have one already
      if (!user.avatar || user.avatar === "") {
        setActiveSkin(skinId);
      }
    }
  };

  const setActiveSkin = (skinId: string) => {
    const skin = skins.find(s => s.id === skinId);
    
    if (skin && skin.purchased) {
      setUserState(prev => ({
        ...prev,
        avatar: skin.imageSrc
      }));
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        habitCategories, 
        challenges, 
        skins,
        setUser, 
        resetUser,
        updateHabitTask,
        purchaseSkin,
        setActiveSkin
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
