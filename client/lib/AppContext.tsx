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

interface AppContextType extends AppState {
  dailyStatus: DailyStatus[];
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
  { category: "Health", icon: "heart", score: 78, insight: "Focus on rest and hydration. Avoid strenuous activities after sunset." },
  { category: "Family", icon: "users", score: 85, insight: "Harmonious energy surrounds family matters. Good day for meaningful conversations." },
  { category: "Finance", icon: "dollar-sign", score: 62, insight: "Exercise caution with major purchases. Better opportunities coming mid-week." },
  { category: "Career", icon: "briefcase", score: 91, insight: "Strong momentum for professional growth. Present your ideas with confidence." },
];

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
    "Today brings a harmonious alignment between the Moon and Jupiter, creating favorable conditions for emotional growth and spiritual insights. Your natural intuition is heightened, making this an excellent day for meditation and introspection. Career matters may require patience, but unexpected opportunities could arise in the afternoon hours."
  );
  const [planetaryPositions] = useState(defaultPlanetaryPositions);
  const [auspiciousTimes] = useState(defaultAuspiciousTimes);
  const [dailyStatus] = useState(defaultDailyStatus);

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
