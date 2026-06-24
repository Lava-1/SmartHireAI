import { CompanyProfileInfo } from '../types';

export const COMPANY_PROFILES: Record<string, CompanyProfileInfo> = {
  Google: {
    name: 'Google',
    color: '#4285F4',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg',
    tagline: 'Googliness & Extreme Scale Architecture',
    philosophy: 'Thriving in ambiguity, intellectual humility, collaboration, high scalability design, user-first innovation.'
  },
  Amazon: {
    name: 'Amazon',
    color: '#FF9900',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    tagline: '14 Leadership Principles & Customer Obsession',
    philosophy: 'Customer Obsession, Ownership, Invent and Simplify, Bias for Action, Dive Deep, Deliver Results.'
  },
  Microsoft: {
    name: 'Microsoft',
    color: '#00A4EF',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg',
    tagline: 'Growth Mindset & Inclusive Collaboration',
    philosophy: 'Continuous learning, collaboration, diversity & inclusion, customer obsession, enterprise trust.'
  },
  Apple: {
    name: 'Apple',
    color: '#A2AAAD',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg',
    tagline: 'Uncompromising Craft & Pristine Simplicity',
    philosophy: 'Attention to immaculate detail, hardware/software harmony, simplicity, user delight, deep secrecy.'
  },
  Meta: {
    name: 'Meta',
    color: '#0668E1',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/facebook/facebook-original.svg',
    tagline: 'The Hacker Way & Moving Fast',
    philosophy: 'Move fast, build awesome social infrastructure, focus on extreme impact, be bold, open meritocracy.'
  },
  Netflix: {
    name: 'Netflix',
    color: '#E50914',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    tagline: 'Freedom & Responsibility',
    philosophy: 'Stunning colleagues, radical candor, high density of talent, context over control, anti-bureaucracy.'
  },
  Tesla: {
    name: 'Tesla',
    color: '#CC0000',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
    tagline: 'First Principles Physics & Hardcore Engineering',
    philosophy: 'Question every constraint, delete unnecessary parts, extreme speed of iteration, physical reality checks.'
  },
  TCS: {
    name: 'TCS',
    color: '#0054A6',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
    tagline: 'Global Enterprise Reliability & Governance',
    philosophy: 'Structured IT delivery, agile lifecycle governance, enterprise reliability, full-stack client transformation.'
  },
  Startup: {
    name: 'Startup',
    color: '#10B981',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
    tagline: 'YC High-Growth MVP Execution',
    philosophy: 'Extreme resourcefulness, talking directly to users, shipping daily, ruthless prioritization under uncertainty.'
  }
};
