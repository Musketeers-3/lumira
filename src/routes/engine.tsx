import { createFileRoute } from '@tanstack/react-router';
import { SocraticEngine } from '@/components/socratic/engine/SocraticEngine';

export const Route = createFileRoute('/engine')({
  head: () => ({
    meta: [
      { title: 'The Socratic Engine — AI-Native Learning' },
      { name: 'description', content: 'Immersive Socratic dialogue. Invent ideas instead of memorizing them.' },
      { property: 'og:title', content: 'The Socratic Engine — AI-Native Learning' },
      { property: 'og:description', content: 'Immersive Socratic dialogue. Invent ideas instead of memorizing them.' },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl">
      <SocraticEngine />
    </div>
  ),
});
