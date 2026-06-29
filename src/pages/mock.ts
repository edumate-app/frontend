export interface VideoLesson {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  language: string;
  progress: number;
  lastActivity: string;
  sentencesLearned: number;
  totalSentences: number;
}

export const videos: VideoLesson[] = [
  {
    id: "psych-money",
    title: "The Psychology of Money",
    channel: "Swedish Investor",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400&auto=format&fit=crop",
    duration: "18:42",
    language: "English",
    progress: 67,
    lastActivity: "Dzisiaj, 09:14",
    sentencesLearned: 84,
    totalSentences: 126,
  },
  {
    id: "build-habits",
    title: "How to Build Habits That Stick",
    channel: "Ali Abdaal",
    thumbnail:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=400&auto=format&fit=crop",
    duration: "14:05",
    language: "English",
    progress: 43,
    lastActivity: "Wczoraj, 21:02",
    sentencesLearned: 39,
    totalSentences: 91,
  },
  {
    id: "make-your-bed",
    title: "Make Your Bed - Jim Rohn",
    channel: "Goalcast",
    thumbnail:
      "https://images.unsplash.com/photo-1495433324511-bf8e92934d90?q=80&w=400&auto=format&fit=crop",
    duration: "9:58",
    language: "English",
    progress: 21,
    lastActivity: "2 dni temu",
    sentencesLearned: 14,
    totalSentences: 68,
  },
  {
    id: "ted-language",
    title: "The secret to learning a new language",
    channel: "TED",
    thumbnail:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=400&auto=format&fit=crop",
    duration: "12:45",
    language: "English",
    progress: 8,
    lastActivity: "3 dni temu",
    sentencesLearned: 6,
    totalSentences: 74,
  },
  {
    id: "deep-work",
    title: "Deep Work in a Distracted World",
    channel: "Thomas Frank",
    thumbnail:
      "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?q=80&w=400&auto=format&fit=crop",
    duration: "16:21",
    language: "English",
    progress: 0,
    lastActivity: "Nieotwarte",
    sentencesLearned: 0,
    totalSentences: 102,
  },
];
