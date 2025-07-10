// Data loading utilities for Astro

import type { Artist, Release, Video, Distributor, Translations } from '../types';

// Import JSON data files directly
import artistsData from '../data/artists.json';
import releasesData from '../data/releases.json';
import videosData from '../data/videos.json';
import distributorsData from '../data/distributors.json';

// Import translations
import enTranslations from '../i18n/en.json';
import frTranslations from '../i18n/fr.json';
import deTranslations from '../i18n/de.json';

// Export data
export const artists: Artist[] = artistsData;
export const releases: Release[] = releasesData;
export const videos: Video[] = videosData;
export const distributors: Distributor[] = distributorsData;

// Export translations
export const translations: Translations = {
  en: enTranslations,
  fr: frTranslations,
  de: deTranslations,
};

// Helper functions
export function getArtistById(id: number): Artist | undefined {
  return artists.find(artist => artist.id === id);
}

export function getReleasesByArtist(artistId: number): Release[] {
  return releases.filter(release => release.artists.includes(artistId));
}

export function getArtistsByRelease(release: Release): Artist[] {
  return release.artists.map(id => getArtistById(id)).filter(Boolean) as Artist[];
}

// Translation helper
export function translate(lang: string, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Pagination helper
export function paginate<T>(items: T[], page: number, itemsPerPage: number) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  return {
    items: items.slice(startIndex, endIndex),
    currentPage: page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}