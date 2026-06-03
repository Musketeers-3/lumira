import type { Step } from "../types";

export const demoScript: Step[] = [
  {
    state: "FOCUS",
    messages: [
      {
        id: "1a",
        speaker: "mentor",
        intent: "Gentle Push",
        text: "If I drop an apple, it falls to the ground. The Moon feels Earth's gravity too — it's pulled toward us with the same force. So tell me… why doesn't the Moon just fall down and crash into Earth? Take your time.",
      },
      {
        id: "1b",
        speaker: "student",
        intent: "You",
        text: "Maybe the Moon is too far away for gravity to reach it that strongly?",
      },
    ],
  },
  {
    state: "CHALLENGE",
    messages: [
      {
        id: "2a",
        speaker: "mentor",
        intent: "Believing Challenge",
        text: "That's a fair guess — but gravity does reach the Moon. It's what holds it near us. Try this thought experiment instead: imagine standing on a tall mountain and throwing a ball. Throw it a little harder. Then harder. Then impossibly hard. What happens?",
      },
    ],
  },
  {
    state: "CHALLENGE",
    messages: [
      {
        id: "3a",
        speaker: "student",
        intent: "You",
        text: "It would fly farther each time before landing… and if I threw it hard enough, maybe it would go really, really far?",
      },
      {
        id: "3b",
        speaker: "mentor",
        intent: "Gentle Push",
        text: "You're seeing it. Now remember — the Earth is round. As the ball flies forward, the ground beneath it isn't flat. What does the surface of the Earth do while the ball is falling?",
      },
    ],
  },
  {
    state: "CHALLENGE",
    messages: [
      {
        id: "4a",
        speaker: "student",
        intent: "You",
        text: "The Earth curves away from it… so the ball keeps falling, but the ground keeps dropping away too. It never quite lands.",
      },
    ],
  },
  {
    state: "CELEBRATE",
    celebrate: true,
    messages: [
      {
        id: "5a",
        speaker: "mentor",
        intent: "Light Found",
        text: "You discovered it yourself. The Moon is falling — constantly — but it's moving sideways so fast that Earth keeps curving away beneath it. An orbit is just a fall that never lands. Every satellite, every planet, stays up the same way. That understanding is yours now.",
      },
    ],
  },
];
