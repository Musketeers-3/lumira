export type LearningState = "IDLE" | "FOCUS" | "CHALLENGE" | "CELEBRATE";
export type Intent = "Gentle Push" | "Believing Challenge" | "Light Found" | "You";
export type Speaker = "mentor" | "student";

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
