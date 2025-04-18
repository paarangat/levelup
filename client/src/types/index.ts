export interface User {
  name: string;
  age: number;
  gender: "male" | "female";
  points: number;
  level: number;
  avatar: string;
}

export interface HabitCategory {
  id: string;
  name: string;
  status: "Excellent" | "Good" | "Fair" | "Needs Work";
  streak: number;
  avatarSrc: string;
  tasks: HabitTask[];
}

export interface HabitTask {
  id: string;
  name: string;
  completed: boolean;
  points: number;
  time?: string;
}

export interface Challenge {
  id: string;
  title: string;
  icon: string;
  daysTotal: number;
  daysCompleted: number;
  daysRemaining: number;
  participants: number;
  rewards: {
    points: number;
    item?: string;
    itemIcon?: string;
  };
}

export interface Skin {
  id: string;
  name: string;
  gender: "male" | "female";
  type: "top" | "outfit" | "accessory";
  imageSrc: string;
  cost: number;
  purchased: boolean;
}
