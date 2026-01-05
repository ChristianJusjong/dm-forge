/**
 * SEO & Meta Tag Management
 * Dynamically injects and updates meta tags for SEO and Social Sharing.
 */

interface PageSeoConfig {
    title?: string;
    description?: string;
    image?: string;
}

const BASE_URL = window.location.origin; // Dynamically get current origin
const SITE_NAME = 'Dungeon Master Forge';

const defaultSeo: PageSeoConfig = {
    title: 'Dungeon Master Forge - D&D 5e DM Toolkit',
    description: 'Professional tools for Dungeon Masters: initiative tracking, encounter building, monster stats, NPC generation, and session notes.',
    image: `${BASE_URL}/og-image.jpg` // Ensure this image exists or use a placeholder
};

const routeConfig: Record<string, PageSeoConfig> = {
    '/dashboard.html': {
        title: 'Dashboard | Dungeon Master Forge',
        description: 'Manage your D&D campaigns, track initiative, and organize your sessions.'
    },
    '/monsters.html': {
        title: 'Monster Browser | Dungeon Master Forge',
        description: 'Search and browse D&D 5e monsters. View stats, abilities, and lore.'
    },
    '/encounter-builder.html': {
        title: 'Encounter Builder | Dungeon Master Forge',
        description: 'Build balanced encounters for your party. Calculate CR and XP thresholds.'
    },
    '/initiative.html': {
        title: 'Initiative Tracker | Dungeon Master Forge',
        description: 'Track combat initiative, HP, and conditions for players and monsters.'
    }
};

export function initSeo(): void {
    const path = window.location.pathname;
    // Handle root path or specific files
    const key = Object.keys(routeConfig).find(k => path.endsWith(k)) || 'default';
    const config = routeConfig[key as keyof typeof routeConfig] || {};

    const seo = { ...defaultSeo, ...config };

    updateMetaTags(seo);
    injectFavicons();
    injectPreconnect();
}

function updateMetaTags(seo: PageSeoConfig): void {
    // Title
    document.title = seo.title || defaultSeo.title!;

    // Meta Description
    setMetaTag('name', 'description', seo.description || defaultSeo.description!);
    setMetaTag('name', 'keywords', 'D&D, 5e, Dungeon Master, RPG, Tabletop, Campaign Manager, Initiative Tracker');
    setMetaTag('name', 'author', SITE_NAME);
    setMetaTag('name', 'robots', 'index, follow');
    setMetaTag('name', 'theme-color', '#d4af37');

    // Open Graph
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', window.location.href);
    setMetaTag('property', 'og:title', seo.title || defaultSeo.title!);
    setMetaTag('property', 'og:description', seo.description || defaultSeo.description!);
    setMetaTag('property', 'og:image', seo.image || defaultSeo.image!);
    setMetaTag('property', 'og:site_name', SITE_NAME);

    // Twitter
    setMetaTag('property', 'twitter:card', 'summary_large_image');
    setMetaTag('property', 'twitter:url', window.location.href);
    setMetaTag('property', 'twitter:title', seo.title || defaultSeo.title!);
    setMetaTag('property', 'twitter:description', seo.description || defaultSeo.description!);
    setMetaTag('property', 'twitter:image', seo.image || defaultSeo.image!);

    // Canonical
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
}

function setMetaTag(attrName: string, attrValue: string, content: string): void {
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
}

function injectFavicons(): void {
    // Only inject if not present
    if (!document.querySelector('link[rel="icon"]')) {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = 'favicon.svg'; // Assuming root
        document.head.appendChild(favicon);
    }
}

function injectPreconnect(): void {
    const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://api.open5e.com'
    ];

    domains.forEach(domain => {
        if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            if (domain === 'https://fonts.gstatic.com') link.setAttribute('crossorigin', '');
            document.head.appendChild(link);
        }
    });
}
