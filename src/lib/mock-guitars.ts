import { Guitar } from '@/types/Guitar';

export const mockGuitars: Guitar[] = [
  {
    slug: 'lp-special',
    name: 'Les Paul Special',
    description: 'Transparent Red with Rosewood fingerboard, 25" scale', strings: {
      size: '9',
      lastChanged: '2025-01-01'
    }
  },
  {
    slug: 'kingfish-tele-deluxe',
    name: 'Kingfish Telecaster Deluxe',
    description: 'Purple sparkle awesome, Rosewood fingerboard',
    strings: {
      size: '9',
      lastChanged: '2025-01-01'
    }
  },
  {
    slug: 'player-strat',
    name: 'Player Stratocaster',
    description: 'Needs a setup and a new whammy bar',
    strings: {
      size: '9',
      lastChanged: '2025-01-01'
    }
  },
  {
    slug: 'player-nashville-tele',
    name: 'Player Telecaster Nashville',
    description: 'Tuned open G',
    strings: {
      size: '9',
      lastChanged: '2025-01-01'
    }
  },
  {
    slug: 'squier-mustang-hh',
    name: 'Squier Mustang HH',
    description: 'Green, 24" scale, missing a machine screw in a humbucker',
    strings: {
      size: '9',
      lastChanged: '2025-01-01'
    }
  },
];