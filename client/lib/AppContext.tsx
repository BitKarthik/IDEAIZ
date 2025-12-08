import React, { createContext, useContext, useState, ReactNode } from "react";

interface BirthDetails {
  date: Date;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface User {
  id: string;
  name: string;
  birthDetails: BirthDetails | null;
  isSubscribed: boolean;
  trialEndsAt: Date | null;
  questionsAsked: number;
  dailyStreak: number;
}

interface AppState {
  user: User | null;
  messages: Message[];
  isOnboarded: boolean;
  dailyHoroscope: string;
  planetaryPositions: PlanetPosition[];
  auspiciousTimes: AuspiciousTime[];
}

interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
}

interface AuspiciousTime {
  name: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface DailyStatus {
  category: string;
  icon: string;
  score: number;
  insight: string;
}

interface DailyAdvice {
  dos: string[];
  donts: string[];
}

interface AppContextType extends AppState {
  dailyStatus: DailyStatus[];
  dailyAdvice: DailyAdvice;
  setUser: (user: User | null) => void;
  addMessage: (content: string, isUser: boolean) => void;
  clearMessages: () => void;
  setOnboarded: (value: boolean) => void;
  updateBirthDetails: (details: BirthDetails) => void;
  setSubscribed: (value: boolean) => void;
}

const defaultPlanetaryPositions: PlanetPosition[] = [
  { planet: "Sun", sign: "Sagittarius", degree: 15, house: 1 },
  { planet: "Moon", sign: "Pisces", degree: 22, house: 4 },
  { planet: "Mars", sign: "Leo", degree: 8, house: 9 },
  { planet: "Mercury", sign: "Sagittarius", degree: 10, house: 1 },
  { planet: "Jupiter", sign: "Taurus", degree: 28, house: 6 },
  { planet: "Venus", sign: "Scorpio", degree: 5, house: 12 },
  { planet: "Saturn", sign: "Aquarius", degree: 18, house: 3 },
  { planet: "Rahu", sign: "Pisces", degree: 12, house: 4 },
  { planet: "Ketu", sign: "Virgo", degree: 12, house: 10 },
];

const defaultAuspiciousTimes: AuspiciousTime[] = [
  { name: "Brahma Muhurta", startTime: "4:30 AM", endTime: "5:18 AM", description: "Best for meditation and spiritual practices" },
  { name: "Abhijit Muhurta", startTime: "11:48 AM", endTime: "12:36 PM", description: "Highly auspicious for important tasks" },
  { name: "Vijaya Muhurta", startTime: "2:12 PM", endTime: "3:00 PM", description: "Good for new ventures" },
];

const defaultDailyStatus: DailyStatus[] = [
  { category: "Health", icon: "heart", score: 78, insight: "Rest well today" },
  { category: "Family", icon: "users", score: 85, insight: "Harmony at home" },
  { category: "Finance", icon: "dollar-sign", score: 62, insight: "Be cautious" },
  { category: "Career", icon: "briefcase", score: 91, insight: "Great momentum" },
  { category: "Safety", icon: "shield", score: 74, insight: "Stay alert on roads" },
];

const defaultDailyAdvice: DailyAdvice = {
  dos: [
    "Wear something green today",
    "Start new projects after 11 AM",
    "Connect with an old friend",
    "Practice gratitude before sleep",
  ],
  donts: [
    "Avoid important decisions before noon",
    "Skip arguments with loved ones",
    "Don't lend money today",
    "Avoid traveling north",
  ],
};

const defaultUser: User = {
  id: "1",
  name: "Seeker",
  birthDetails: {
    date: new Date(1990, 5, 15),
    time: "10:30 AM",
    place: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
  },
  isSubscribed: true,
  trialEndsAt: null,
  questionsAsked: 12,
  dailyStreak: 7,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnboarded, setOnboarded] = useState(true);
  const [dailyHoroscope] = useState(
    "Good morning, dear one! The Moon and Jupiter are dancing beautifully for you today. Trust your intuition \u2014 something lovely awaits this afternoon."
  );
  const [planetaryPositions] = useState(defaultPlanetaryPositions);
  const [auspiciousTimes] = useState(defaultAuspiciousTimes);
  const [dailyStatus] = useState(defaultDailyStatus);
  const [dailyAdvice] = useState(defaultDailyAdvice);

  const addMessage = (content: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const updateBirthDetails = (details: BirthDetails) => {
    if (user) {
      setUser({ ...user, birthDetails: details });
    }
  };

  const setSubscribed = (value: boolean) => {
    if (user) {
      setUser({ ...user, isSubscribed: value });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        messages,
        isOnboarded,
        dailyHoroscope,
        planetaryPositions,
        auspiciousTimes,
        dailyStatus,
        dailyAdvice,
        setUser,
        addMessage,
        clearMessages,
        setOnboarded,
        updateBirthDetails,
        setSubscribed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
