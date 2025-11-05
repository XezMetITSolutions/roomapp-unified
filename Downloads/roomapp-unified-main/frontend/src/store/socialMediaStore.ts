import { create } from 'zustand';

interface SocialMediaLinks {
  instagram: string;
  facebook: string;
  twitter: string;
  googleMaps: string;
}

interface SocialMediaStore {
  links: SocialMediaLinks;
  setLinks: (links: Partial<SocialMediaLinks>) => void;
  getLink: (platform: keyof SocialMediaLinks) => string;
}

const defaultLinks: SocialMediaLinks = {
  instagram: 'https://www.instagram.com/grandhotelistanbul',
  facebook: 'https://www.facebook.com/grandhotelistanbul',
  twitter: 'https://www.twitter.com/grandhotelistanbul',
  googleMaps: 'https://www.google.com/maps/search/?api=1&query=Grand+Hotel+Istanbul'
};

export const useSocialMediaStore = create<SocialMediaStore>((set, get) => ({
  links: defaultLinks,
  
  setLinks: (newLinks) => set((state) => ({
    links: { ...state.links, ...newLinks }
  })),
  
  getLink: (platform) => {
    const { links } = get();
    return links[platform] || defaultLinks[platform];
  }
}));
