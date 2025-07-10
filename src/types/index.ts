// Types for the Avanticlassic data structures

export interface Artist {
  id: number;
  url: string;
  name: string;
  facebook?: string;
}

export interface Release {
  id: number;
  url: string;
  title: string;
  tracklist: string;
  artists: number[];
  shopUrl: string;
}

export interface Video {
  id: number;
  url: string; // YouTube embed URL
}

export interface Distributor {
  id: number;
  name: string;
  url: string;
}

export type Language = 'en' | 'fr' | 'de';

export interface TranslationData {
  [key: string]: string | TranslationData;
}

export interface Translations {
  [lang: string]: TranslationData;
}