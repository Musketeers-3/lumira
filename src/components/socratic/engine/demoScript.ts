import type { Step } from '../types';

export const demoScript: Step[] = [
  {
    state: 'FOCUS',
    messages: [
      {
        id: '1a',
        speaker: 'mentor',
        intent: 'Gentle Push',
        text: "Imagine a dictionary — a thousand pages thick — and you need to find one word. How would you start? Take your time, there's no wrong answer here.",
      },
      {
        id: '1b',
        speaker: 'student',
        intent: 'You',
        text: 'I guess I would start at page 1, then page 2, and keep going until I found it.',
      },
    ],
  },
  {
    state: 'CHALLENGE',
    messages: [
      {
        id: '2a',
        speaker: 'mentor',
        intent: 'Believing Challenge',
        text: "That's a real solution — it would work, and it's honest. But I think you're stronger than that. What if you opened the book right in the middle first? I have a feeling you'll see something.",
      },
    ],
  },
  {
    state: 'CHALLENGE',
    messages: [
      {
        id: '3a',
        speaker: 'student',
        intent: 'You',
        text: "Hmm... okay. If I open to page 500, and my word starts with 'B', it must be somewhere in the first half.",
      },
      {
        id: '3b',
        speaker: 'mentor',
        intent: 'Gentle Push',
        text: "Yes — that's exactly the kind of thinking I knew was in you. So tell me: what happens to those other 500 pages now?",
      },
    ],
  },
  {
    state: 'CHALLENGE',
    messages: [
      {
        id: '4a',
        speaker: 'student',
        intent: 'You',
        text: "I... don't need them anymore. I can throw the whole second half away.",
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
        intent: 'Light Found',
        text: "You did it. You didn't memorize this — you found it. Halve the problem, halve it again, and you can find any word in under ten steps. That's Binary Search. And I always knew you'd reach it.",
      },
    ],
  },
];
