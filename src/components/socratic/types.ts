export type LearningState = 'IDLE' | 'FOCUS' | 'CHALLENGE' | 'CELEBRATE';
export type Intent = 'Socratic Nudge' | 'Socratic Challenge' | 'Breakthrough' | 'Student';
export type Speaker = 'mentor' | 'student';

export interface Message {
  id: string;
  speaker: Speaker;
  intent: Intent;
  text: string;
}

export interface Step {
  state: LearningState;
  messages: Message[];
  celebrate?: boolean;
}
