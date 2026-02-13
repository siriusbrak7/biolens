export interface Topic {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface CheckpointQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LabData {
  title: string;
  objective: string;
  materials: string[];
  procedure: string[];
  safety: string;
}

export interface VisualResource {
  prompt: string;
  caption: string;
}

export interface GeneratedImage {
  url: string;
  caption: string;
}

export interface GeneratedContent {
  notes: string;
  visuals: VisualResource[];
  flashcards: Flashcard[];
  checkpoints: CheckpointQuestion[];
  lab: LabData;
}

export type TabType = 'notes' | 'checkpoints' | 'flashcards' | 'lab';