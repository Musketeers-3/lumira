import type { Step } from '../types';

export const demoScript: Step[] = [
  {
    state: 'FOCUS',
    messages: [
      {
        id: '1a',
        speaker: 'mentor',
        intent: 'Socratic Nudge',
        text: "If you need to find a specific word in a 1,000-page dictionary, how would you do it?",
      },
      {
        id: '1b',
        speaker: 'student',
        intent: 'Student',
        text: 'I would check page 1, then page 2... all the way to page 1000.',
      },
    ],
  },
  {
    state: 'CHALLENGE',
    messages: [
      {
        id: '2a',
        speaker: 'mentor',
        intent: 'Socratic Challenge',
        text: 'That works — but it could take all day. What if, instead, you opened the dictionary right in the middle?',
      },
    ],
  },
  {
    state: 'CHALLENGE',
    messages: [
      {
        id: '3a',
        speaker: 'student',
        intent: 'Student',
        text: "Okay... I'd open to page 500. If my word starts with 'B', it must be in the first half.",
      },
      {
        id: '3b',
        speaker: 'mentor',
        intent: 'Socratic Nudge',
        text: "Excellent. So what just happened to the other 500 pages?",
      },
    ],
  },
  {
    state: 'CHALLENGE',
    messages: [
      {
        id: '4a',
        speaker: 'student',
        intent: 'Student',
        text: "I just... threw away the second half. I don't need to look at them at all.",
      },
    ],
  },
  {
    state: 'CELEBRATE',
    celebrate: true,
    messages: [
      {
        id: '5a',
        speaker: 'mentor',
        intent: 'Breakthrough',
        text: "Exactly. And if you repeat that — halving the problem each time — you find any word in under 10 steps. You just independently invented the Binary Search Algorithm.",
      },
    ],
  },
];
