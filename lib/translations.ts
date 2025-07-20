export type Language = 'en' | 'fr' | 'de'

export interface Translations {
  // Navigation & Header
  navigation: {
    followUs: string
    releases: string
    artists: string
    playlists: string
    shop: string
    videos: string
    aboutUs: string
    search: string
    myAccount: string
    toggleMenu: string
    language: {
      english: string
      deutsch: string
      francais: string
    }
  }
  
  // Homepage
  home: {
    featuredReleases: string
    viewDetails: string
    viewAllReleases: string
  }
  
  // About Page
  about: {
    title: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
    paragraph4: string
    paragraph5: string
    distributorsTitle: string
    website: string
    email: string
    phone: string
  }
  
  // Cart & Shop
  cart: {
    title: string
    empty: string
    continueShopping: string
    proceedToCheckout: string
    viewCart: string
    clearCart: string
    subtotal: string
    shipping: string
    total: string
    calculatedAtCheckout: string
    each: string
  }
  
  // General UI
  ui: {
    loading: string
    error: string
    retry: string
    back: string
    next: string
    previous: string
    save: string
    cancel: string
    delete: string
    edit: string
    close: string
  }
  
  // Content Types
  content: {
    artist: string
    artists: string
    release: string
    releases: string
    video: string
    videos: string
    playlist: string
    playlists: string
    track: string
    tracks: string
    composer: string
    composers: string
    variousArtists: string
  }
  
  // Metadata & SEO
  meta: {
    siteTitle: string
    siteDescription: string
    homeTitle: string
    homeDescription: string
    releasesTitle: string
    releasesDescription: string
    artistsTitle: string
    artistsDescription: string
    playlistsTitle: string
    playlistsDescription: string
    shopTitle: string
    shopDescription: string
    videosTitle: string
    videosDescription: string
    aboutTitle: string
    aboutDescription: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    navigation: {
      followUs: "FOLLOW US",
      releases: "RELEASES",
      artists: "ARTISTS",
      playlists: "PLAYLISTS",
      shop: "SHOP",
      videos: "VIDEOS",
      aboutUs: "ABOUT US",
      search: "Search",
      myAccount: "My Account",
      toggleMenu: "Toggle navigation menu",
      language: {
        english: "English",
        deutsch: "Deutsch",
        francais: "Français"
      }
    },
    home: {
      featuredReleases: "Featured Releases",
      viewDetails: "View Details",
      viewAllReleases: "View All Releases"
    },
    about: {
      title: "About Avanti Classic",
      paragraph1: "Avanti Classic and AvantiJazz have been created with the aim of re-establishing a relationship between artist and record company that, in the current music industry, practically no longer exists. We believe in fostering a true partnership with our artists, providing them with comprehensive support throughout their careers.",
      paragraph2: "Active in the fields of classical music and jazz, our labels are committed not only to recording and promoting artists we believe in, but also to offering them real support in all facets of their career, from artistic development to global distribution.",
      paragraph3: "To achieve this goal, Avanticlassic and AvantiJazz leverage the best available technology at every level, from the selection of recording studios and advanced recording techniques to the final production process. Our commitment to excellence ensures that every product we offer meets the highest standards of quality.",
      paragraph4: "Our releases are presented in the highest quality formats, including CD/SACD hybrid music carriers, attractively packaged in a contemporary, fresh, and modern style. Each release includes insightful liner notes written by specialists, providing a deeper understanding of the music. We also offer high-resolution streaming and downloads (96kHz/24bits) for an unparalleled listening experience.",
      paragraph5: "We work closely with our distributors and all major streaming and download online services to ensure the widest possible visibility for the exceptional talents we represent. Our goal is to connect passionate listeners with extraordinary music.",
      distributorsTitle: "List of Distributors",
      website: "Website",
      email: "Email",
      phone: "Phone"
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      continueShopping: "Continue Shopping",
      proceedToCheckout: "Proceed to Checkout",
      viewCart: "View Cart",
      clearCart: "Clear Cart",
      subtotal: "Subtotal",
      shipping: "Shipping",
      total: "Total",
      calculatedAtCheckout: "Calculated at checkout",
      each: "each"
    },
    ui: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      back: "Back",
      next: "Next",
      previous: "Previous",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close"
    },
    content: {
      artist: "Artist",
      artists: "Artists",
      release: "Release",
      releases: "Releases",
      video: "Video",
      videos: "Videos",
      playlist: "Playlist",
      playlists: "Playlists",
      track: "Track",
      tracks: "Tracks",
      composer: "Composer",
      composers: "Composers",
      variousArtists: "Various Artists"
    },
    meta: {
      siteTitle: "Avanti Classic - Classical Music Label",
      siteDescription: "Discover exceptional classical music releases from Avanti Classic. Premium recordings, extraordinary artists, and unparalleled quality in classical music.",
      homeTitle: "Avanti Classic - Premium Classical Music Recordings",
      homeDescription: "Explore our curated collection of exceptional classical music releases featuring world-renowned artists and emerging talents.",
      releasesTitle: "Classical Music Releases - Avanti Classic",
      releasesDescription: "Browse our complete catalog of classical music releases featuring exceptional recordings from renowned and emerging artists.",
      artistsTitle: "Artists - Avanti Classic",
      artistsDescription: "Meet the extraordinary classical music artists featured in our catalog of premium recordings.",
      playlistsTitle: "Playlists - Avanti Classic",
      playlistsDescription: "Curated classical music playlists featuring selections from our premium recordings catalog.",
      shopTitle: "Shop - Avanti Classic",
      shopDescription: "Purchase premium classical music recordings in CD, SACD, and digital formats from Avanti Classic.",
      videosTitle: "Videos - Avanti Classic",
      videosDescription: "Watch performances and interviews featuring our classical music artists.",
      aboutTitle: "About - Avanti Classic",
      aboutDescription: "Learn about Avanti Classic, our mission to support classical music artists, and our worldwide distribution network."
    }
  },
  fr: {
    navigation: {
      followUs: "SUIVEZ-NOUS",
      releases: "PUBLICATIONS",
      artists: "ARTISTES",
      playlists: "LISTES DE LECTURE",
      shop: "BOUTIQUE",
      videos: "VIDÉOS",
      aboutUs: "À PROPOS",
      search: "Rechercher",
      myAccount: "Mon Compte",
      toggleMenu: "Basculer le menu de navigation",
      language: {
        english: "English",
        deutsch: "Deutsch",
        francais: "Français"
      }
    },
    home: {
      featuredReleases: "Publications en Vedette",
      viewDetails: "Voir les Détails",
      viewAllReleases: "Voir Toutes les Publications"
    },
    about: {
      title: "À Propos d'Avanti Classic",
      paragraph1: "Avanti Classic et AvantiJazz ont été créés dans le but de rétablir une relation entre l'artiste et la maison de disques qui, dans l'industrie musicale actuelle, n'existe pratiquement plus. Nous croyons en l'établissement d'un véritable partenariat avec nos artistes, en leur offrant un soutien complet tout au long de leur carrière.",
      paragraph2: "Actifs dans les domaines de la musique classique et du jazz, nos labels s'engagent non seulement à enregistrer et promouvoir les artistes en lesquels nous croyons, mais aussi à leur offrir un véritable soutien dans toutes les facettes de leur carrière, du développement artistique à la distribution mondiale.",
      paragraph3: "Pour atteindre cet objectif, Avanticlassic et AvantiJazz exploitent la meilleure technologie disponible à tous les niveaux, de la sélection des studios d'enregistrement et des techniques d'enregistrement avancées au processus de production finale. Notre engagement envers l'excellence garantit que chaque produit que nous offrons répond aux plus hauts standards de qualité.",
      paragraph4: "Nos publications sont présentées dans les formats de la plus haute qualité, y compris les supports musicaux hybrides CD/SACD, magnifiquement emballés dans un style contemporain, frais et moderne. Chaque publication comprend des notes de pochette perspicaces écrites par des spécialistes, offrant une compréhension plus profonde de la musique. Nous offrons également du streaming et des téléchargements haute résolution (96kHz/24bits) pour une expérience d'écoute inégalée.",
      paragraph5: "Nous travaillons en étroite collaboration avec nos distributeurs et tous les principaux services de streaming et de téléchargement en ligne pour assurer la visibilité la plus large possible aux talents exceptionnels que nous représentons. Notre objectif est de connecter les auditeurs passionnés avec une musique extraordinaire.",
      distributorsTitle: "Liste des Distributeurs",
      website: "Site Web",
      email: "E-mail",
      phone: "Téléphone"
    },
    cart: {
      title: "Panier d'Achat",
      empty: "Votre panier est vide",
      continueShopping: "Continuer les Achats",
      proceedToCheckout: "Procéder au Paiement",
      viewCart: "Voir le Panier",
      clearCart: "Vider le Panier",
      subtotal: "Sous-total",
      shipping: "Livraison",
      total: "Total",
      calculatedAtCheckout: "Calculé lors du paiement",
      each: "chacun"
    },
    ui: {
      loading: "Chargement...",
      error: "Une erreur s'est produite",
      retry: "Réessayer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      close: "Fermer"
    },
    content: {
      artist: "Artiste",
      artists: "Artistes",
      release: "Publication",
      releases: "Publications",
      video: "Vidéo",
      videos: "Vidéos",
      playlist: "Liste de Lecture",
      playlists: "Listes de Lecture",
      track: "Piste",
      tracks: "Pistes",
      composer: "Compositeur",
      composers: "Compositeurs",
      variousArtists: "Artistes Divers"
    },
    meta: {
      siteTitle: "Avanti Classic - Label de Musique Classique",
      siteDescription: "Découvrez des publications exceptionnelles de musique classique d'Avanti Classic. Enregistrements premium, artistes extraordinaires et qualité inégalée en musique classique.",
      homeTitle: "Avanti Classic - Enregistrements Premium de Musique Classique",
      homeDescription: "Explorez notre collection curatée de publications exceptionnelles de musique classique mettant en vedette des artistes de renommée mondiale et des talents émergents.",
      releasesTitle: "Publications de Musique Classique - Avanti Classic",
      releasesDescription: "Parcourez notre catalogue complet de publications de musique classique présentant des enregistrements exceptionnels d'artistes renommés et émergents.",
      artistsTitle: "Artistes - Avanti Classic",
      artistsDescription: "Rencontrez les artistes extraordinaires de musique classique présentés dans notre catalogue d'enregistrements premium.",
      playlistsTitle: "Listes de Lecture - Avanti Classic",
      playlistsDescription: "Listes de lecture curatées de musique classique présentant des sélections de notre catalogue d'enregistrements premium.",
      shopTitle: "Boutique - Avanti Classic",
      shopDescription: "Achetez des enregistrements premium de musique classique en formats CD, SACD et numérique chez Avanti Classic.",
      videosTitle: "Vidéos - Avanti Classic",
      videosDescription: "Regardez des performances et des entretiens mettant en vedette nos artistes de musique classique.",
      aboutTitle: "À Propos - Avanti Classic",
      aboutDescription: "Découvrez Avanti Classic, notre mission de soutenir les artistes de musique classique, et notre réseau de distribution mondial."
    }
  },
  de: {
    navigation: {
      followUs: "FOLGEN SIE UNS",
      releases: "VERÖFFENTLICHUNGEN",
      artists: "KÜNSTLER",
      playlists: "WIEDERGABELISTEN",
      shop: "SHOP",
      videos: "VIDEOS",
      aboutUs: "ÜBER UNS",
      search: "Suchen",
      myAccount: "Mein Konto",
      toggleMenu: "Navigationsmenü umschalten",
      language: {
        english: "English",
        deutsch: "Deutsch",
        francais: "Français"
      }
    },
    home: {
      featuredReleases: "Ausgewählte Veröffentlichungen",
      viewDetails: "Details anzeigen",
      viewAllReleases: "Alle Veröffentlichungen anzeigen"
    },
    about: {
      title: "Über Avanti Classic",
      paragraph1: "Avanti Classic und AvantiJazz wurden mit dem Ziel geschaffen, eine Beziehung zwischen Künstler und Plattenfirma wiederherzustellen, die in der heutigen Musikindustrie praktisch nicht mehr existiert. Wir glauben an die Förderung einer wahren Partnerschaft mit unseren Künstlern und bieten ihnen umfassende Unterstützung während ihrer gesamten Laufbahn.",
      paragraph2: "Aktiv in den Bereichen klassische Musik und Jazz sind unsere Labels nicht nur darauf verpflichtet, Künstler, an die wir glauben, aufzunehmen und zu fördern, sondern ihnen auch echte Unterstützung in allen Facetten ihrer Karriere zu bieten, von der künstlerischen Entwicklung bis zur globalen Distribution.",
      paragraph3: "Um dieses Ziel zu erreichen, nutzen Avanticlassic und AvantiJazz die beste verfügbare Technologie auf allen Ebenen, von der Auswahl der Aufnahmestudios und fortschrittlichen Aufnahmetechniken bis hin zum finalen Produktionsprozess. Unser Engagement für Exzellenz stellt sicher, dass jedes Produkt, das wir anbieten, den höchsten Qualitätsstandards entspricht.",
      paragraph4: "Unsere Veröffentlichungen werden in höchster Qualität präsentiert, einschließlich CD/SACD-Hybrid-Musikträgern, attraktiv verpackt in einem zeitgemäßen, frischen und modernen Stil. Jede Veröffentlichung enthält aufschlussreiche Liner Notes von Spezialisten geschrieben, die ein tieferes Verständnis der Musik vermitteln. Wir bieten auch hochauflösendes Streaming und Downloads (96kHz/24bits) für ein unvergleichliches Hörerlebnis.",
      paragraph5: "Wir arbeiten eng mit unseren Distributoren und allen großen Streaming- und Download-Online-Services zusammen, um die größtmögliche Sichtbarkeit für die außergewöhnlichen Talente zu gewährleisten, die wir vertreten. Unser Ziel ist es, leidenschaftliche Hörer mit außergewöhnlicher Musik zu verbinden.",
      distributorsTitle: "Liste der Distributoren",
      website: "Webseite",
      email: "E-Mail",
      phone: "Telefon"
    },
    cart: {
      title: "Warenkorb",
      empty: "Ihr Warenkorb ist leer",
      continueShopping: "Weiter einkaufen",
      proceedToCheckout: "Zur Kasse gehen",
      viewCart: "Warenkorb anzeigen",
      clearCart: "Warenkorb leeren",
      subtotal: "Zwischensumme",
      shipping: "Versand",
      total: "Gesamt",
      calculatedAtCheckout: "Wird an der Kasse berechnet",
      each: "je"
    },
    ui: {
      loading: "Laden...",
      error: "Ein Fehler ist aufgetreten",
      retry: "Wiederholen",
      back: "Zurück",
      next: "Weiter",
      previous: "Vorherige",
      save: "Speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      close: "Schließen"
    },
    content: {
      artist: "Künstler",
      artists: "Künstler",
      release: "Veröffentlichung",
      releases: "Veröffentlichungen",
      video: "Video",
      videos: "Videos",
      playlist: "Wiedergabeliste",
      playlists: "Wiedergabelisten",
      track: "Titel",
      tracks: "Titel",
      composer: "Komponist",
      composers: "Komponisten",
      variousArtists: "Verschiedene Künstler"
    },
    meta: {
      siteTitle: "Avanti Classic - Klassisches Musik Label",
      siteDescription: "Entdecken Sie außergewöhnliche klassische Musikveröffentlichungen von Avanti Classic. Premium-Aufnahmen, außergewöhnliche Künstler und unvergleichliche Qualität in klassischer Musik.",
      homeTitle: "Avanti Classic - Premium Klassische Musikaufnahmen",
      homeDescription: "Erkunden Sie unsere kuratierte Sammlung außergewöhnlicher klassischer Musikveröffentlichungen mit weltbekannten Künstlern und aufstrebenden Talenten.",
      releasesTitle: "Klassische Musikveröffentlichungen - Avanti Classic",
      releasesDescription: "Durchsuchen Sie unseren kompletten Katalog klassischer Musikveröffentlichungen mit außergewöhnlichen Aufnahmen von renommierten und aufstrebenden Künstlern.",
      artistsTitle: "Künstler - Avanti Classic",
      artistsDescription: "Lernen Sie die außergewöhnlichen klassischen Musikkünstler kennen, die in unserem Katalog von Premium-Aufnahmen vorgestellt werden.",
      playlistsTitle: "Wiedergabelisten - Avanti Classic",
      playlistsDescription: "Kuratierte klassische Musik-Wiedergabelisten mit Auswahlen aus unserem Premium-Aufnahmenkatalog.",
      shopTitle: "Shop - Avanti Classic",
      shopDescription: "Kaufen Sie Premium-Aufnahmen klassischer Musik in CD-, SACD- und digitalen Formaten von Avanti Classic.",
      videosTitle: "Videos - Avanti Classic",
      videosDescription: "Sehen Sie Aufführungen und Interviews mit unseren klassischen Musikkünstlern.",
      aboutTitle: "Über uns - Avanti Classic",
      aboutDescription: "Erfahren Sie mehr über Avanti Classic, unsere Mission zur Unterstützung klassischer Musikkünstler und unser weltweites Vertriebsnetzwerk."
    }
  }
}

// Translation hook utility
export function useTranslations(language: Language) {
  return translations[language]
}

// Helper function to get text by key path
export function getTranslation(language: Language, key: string): string {
  const t = translations[language]
  const keys = key.split('.')
  let result: any = t
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      // Fallback to English if translation not found
      const fallback = translations.en
      let fallbackResult: any = fallback
      for (const fallbackKey of keys) {
        if (fallbackResult && typeof fallbackResult === 'object' && fallbackKey in fallbackResult) {
          fallbackResult = fallbackResult[fallbackKey]
        } else {
          return key // Return key if not found in fallback either
        }
      }
      return fallbackResult
    }
  }
  
  return typeof result === 'string' ? result : key
}