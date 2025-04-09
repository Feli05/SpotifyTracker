import { Question } from "./types";

export const questions: Question[] = [
  {
    id: "mood",
    text: "What type of music are you in the mood for today?",
    options: [
      {
        id: "energetic",
        text: "Energetic and upbeat",
        value: "energetic"
      },
      {
        id: "calm",
        text: "Calm and relaxing",
        value: "calm"
      },
      {
        id: "focus",
        text: "Focus and concentration",
        value: "focus"
      },
      {
        id: "party",
        text: "Party and social",
        value: "party"
      }
    ]
  },
  {
    id: "discovery",
    text: "Do you prefer to discover new artists or hear familiar ones?",
    options: [
      {
        id: "new",
        text: "Mostly new discoveries",
        value: "new"
      },
      {
        id: "mixed",
        text: "Mix of new and familiar",
        value: "mixed"
      },
      {
        id: "familiar",
        text: "Mostly familiar artists",
        value: "familiar"
      }
    ]
  },
  {
    id: "importance",
    text: "What's most important to you in music recommendations?",
    options: [
      {
        id: "rhythm",
        text: "Beat and rhythm",
        value: "rhythm"
      },
      {
        id: "lyrics",
        text: "Lyrics and message",
        value: "lyrics"
      },
      {
        id: "melody",
        text: "Melody and harmony",
        value: "melody"
      },
      {
        id: "vibe",
        text: "Overall vibe",
        value: "vibe"
      }
    ]
  },
  {
    id: "vibe",
    text: "What vibe are you looking for right now?",
    options: [
      {
        id: "happy",
        text: "Happy and positive",
        value: "happy"
      },
      {
        id: "emotional",
        text: "Emotional and deep",
        value: "emotional"
      },
      {
        id: "nostalgic",
        text: "Nostalgic",
        value: "nostalgic"
      },
      {
        id: "experimental",
        text: "Experimental",
        value: "experimental"
      }
    ]
  }
];

export const loadingMessages = [
  "Analyzing your musical preferences...",
  "Finding the perfect tracks for your mood...",
  "Hold on tight, we're cooking something special for you...",
  "Exploring the vast universe of music just for you...",
  "Creating a personalized musical journey...",
  "Just a few more seconds and we'll surprise you...",
  "Discovering hidden gems based on your taste...",
  "Curating the ultimate playlist experience...",
  "Synchronizing with your musical wavelength..."
]; 