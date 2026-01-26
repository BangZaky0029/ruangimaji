//C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\constants.ts
import type  { NavLink } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Agency', href: '#agency' },
  { label: 'Packages', href: '#packages' },
  { label: 'Contacts', href: '#contact' },
];

export interface HeroSlide {
  id: number;
  location: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  category: string;
}

export const HERO_SLIDES_DATA: HeroSlide[] = [
  {
    id: 1,
    location: 'Switzerland Alps',
    title: 'SAINT ANTÖNIEN',
    description: 'Experience the breathtaking beauty of the Swiss Alps, where emerald valleys meet jagged snow-capped peaks in perfect harmony.',
    imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=2070',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Nature & Motion'
  },
  {
    id: 2,
    location: 'Japan Alps',
    title: 'NAGANO PREFECTURE',
    description: 'Discover the mystical Nagano, home to the snow monkeys and ancient shrines, captured in stunning cinematic 4K.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Cinematic'
  },
  {
    id: 3,
    location: 'Sahara Desert, Morocco',
    title: 'MARRAKECH MERZOUGA',
    description: 'Traverse the golden dunes of Merzouga under a blanket of infinite stars and the quiet hum of the desert wind.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2070',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Documentary'
  }
];

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  aspectRatio: 'landscape' | 'portrait';
  videoUrl?: string;
}

export const PORTFOLIO_DATA: { Photo: PortfolioItem[], Video: PortfolioItem[] } = {
  Photo: [
    { 
      id: 'p1', 
      title: 'Eternal Vows', 
      category: 'Wedding', 
      description: 'Capturing the intimate whispers and timeless emotions of a lifetime commitment.',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', 
      aspectRatio: 'portrait' 
    },
    { 
      id: 'p2', 
      title: 'Urban Flavor', 
      category: 'Food', 
      description: 'A culinary journey through the streets, highlighting the vibrant textures of modern gastronomy.',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000', 
      aspectRatio: 'landscape' 
    },
    { 
      id: 'p3', 
      title: 'Sonic Wave', 
      category: 'Band Music', 
      description: 'The raw energy and electric atmosphere of live performance caught in a single frame.',
      imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800', 
      aspectRatio: 'portrait' 
    },
    { 
      id: 'p4', 
      title: 'Civil Growth', 
      category: 'Project Pemerintah', 
      description: 'Documenting the architectural evolution and infrastructure progress of national developments.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000', 
      aspectRatio: 'landscape' 
    },
    { 
      id: 'p5', 
      title: 'Mountain Silence', 
      category: 'Nature', 
      description: 'Finding peace in the desolate peaks and untouched wilderness of the high altitudes.',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', 
      aspectRatio: 'portrait' 
    },
    { 
      id: 'p6', 
      title: 'City Lights', 
      category: 'Corporate', 
      description: 'The polished precision of corporate identity set against the backdrop of the metropolis.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000', 
      aspectRatio: 'landscape' 
    },
  ],
  Video: [
    { id: 'v1', title: 'Golden Hour', category: 'Traveling', description: 'A cinematic exploration of light and shadow across the worlds most iconic horizons.', imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000', aspectRatio: 'landscape', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 'v2', title: 'Machinery Flux', category: 'Industri', description: 'The rhythmic pulse and heavy textures of industrial manufacturing in motion.', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800', aspectRatio: 'portrait', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { id: 'v3', title: 'Corporate Soul', category: 'Corporate', description: 'Highlighting human connection within the structured world of business and enterprise.', imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000', aspectRatio: 'landscape', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 'v4', title: 'Stage Fire', category: 'Band Music', description: 'Capturing the heat and strobe-lit intensity of a headline performance.', imageUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800', aspectRatio: 'portrait', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 'v5', title: 'Deep Ocean', category: 'Documentary', description: 'An immersive underwater experience revealing the hidden wonders of the marine world.', imageUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=1000', aspectRatio: 'landscape', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  ]
};

export interface PackageFeature {
  photo: string[];
  video: string[];
}

export interface Package {
  name: string;
  price: string;
  deliverables: PackageFeature;
  color: string;
}

export const PACKAGES: Package[] = [
  { 
    name: 'BASIC', 
    price: 'Rp 4,9 JT', 
    deliverables: {
      photo: ['1 Lead Photographer', '4 Hours Session', '50 High-res Edited Photos', 'Online Gallery Access'],
      video: ['1 Minute Highlight Film', '1 Videographer', 'Basic Color Grading', 'Music Licensing']
    }, 
    color: 'border-[#c5a059]/10' 
  },
  { 
    name: 'PREMIUM', 
    price: 'Rp 9,9 JT', 
    deliverables: {
      photo: ['2 Professional Photographers', '8 Hours Full Session', '150 High-res Edited Photos', 'Physical Photo Album'],
      video: ['3-5 Minute Cinematic Film', '2 Videographers', 'Drone Aerial Footage', 'Professional Sound Design']
    }, 
    color: 'border-[#c5a059]' 
  },
  { 
    name: 'PRO', 
    price: 'Rp 19,9 JT', 
    deliverables: {
      photo: ['Lead + 2 Team Photographers', 'Unlimited Hours (12h+)', 'All Best Edited Photos', 'Large Canvas Print'],
      video: ['10+ Minute Mini-Documentary', 'Full Production Crew', '4K Cinema Delivery', 'Social Media Teasers']
    }, 
    color: 'border-[#c5a059]/10' 
  }
];

export const BRANDS_ROW_1 = [
  'Honda', 'Sounsation', 'dr. Mf', 'Beauty Sense Clinic', 'Realme', 'BPN Banten', 'INFINITE Property', 'Sinarmas House', 'H&M', 'Astron Kido'
];
export const BRANDS_ROW_2 = [
  'ZTFF BMX', 'Audio Mobil Jakarta', 'Bain Bakery & Coffee', 'Sate Tegal Laka-Laka', 'Ayam Pak Gembus', 'Onestix Billiard', 'Baso Malang Oasis', 'Es Teller Oyen', 'Pyramid Reflexy'
];
export const CATEGORIES = ['Wedding', 'Food', 'Traveling', 'Band Music', 'Industri', 'Project Pemerintah', 'Corporate'];