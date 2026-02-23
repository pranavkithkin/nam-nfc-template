/* ═══════════════════════════════════════════════════════════════
   NFC LANDING PAGE — MAIN APPLICATION LOGIC
   Reads data.js config and dynamically renders all sections.
   ═══════════════════════════════════════════════════════════════ */

import { profile } from './data.js';

// ─── SOCIAL PLATFORM ICONS (inline SVG) ───
const platformIcons = {
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
    snapchat: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.076-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></svg>`,
    behance: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.609.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.63.159-1.31.243-2.035.243H0v-15.15h6.938zm-.71 6.294c.58 0 1.06-.14 1.44-.435.38-.29.56-.75.56-1.36 0-.35-.07-.64-.18-.87-.12-.23-.29-.41-.5-.54-.21-.13-.46-.22-.74-.27-.27-.06-.57-.08-.88-.08H3.37v3.55h2.86zm.18 6.597c.33 0 .65-.03.96-.09.3-.06.57-.17.8-.33.23-.16.41-.37.55-.65.13-.27.2-.62.2-1.04 0-.81-.24-1.4-.71-1.74-.48-.34-1.1-.51-1.85-.51H3.37v4.36h3.04zm10.76 1.42c.48.37 1.13.56 1.93.56.57 0 1.06-.14 1.49-.42.43-.28.7-.58.82-.89h2.72c-.44 1.32-1.11 2.26-2.01 2.83-.9.57-1.99.85-3.27.85-0.89 0-1.69-.14-2.42-.44-.73-.29-1.35-.71-1.86-1.25-.51-.54-.9-1.18-1.18-1.94-.28-.75-.42-1.58-.42-2.48 0-.87.14-1.68.43-2.42.29-.74.69-1.38 1.2-1.93.51-.54 1.12-.97 1.83-1.27.71-.31 1.49-.46 2.34-.46.94 0 1.76.18 2.46.56.7.37 1.27.88 1.73 1.52.45.65.78 1.39.99 2.24.21.85.28 1.75.22 2.68h-8.1c-.05.96.24 1.83.71 2.2zM19.5 11.5c-.4-.38-1-.57-1.76-.57-.51 0-.94.1-1.29.3-.34.19-.62.44-.82.74-.2.3-.34.63-.42.97-.08.35-.13.67-.14.97h5.13c-.07-.84-.3-1.81-.7-2.41zm-5.5-5.7h5.8v1.57h-5.8V5.8z"/></svg>`,
    github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    telegram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
    dribbble: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.81zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-2.09-1.86-4.845-2.99-7.84-2.99-.46 0-.915.03-1.36.1zm10.019 3.015c-.21.288-1.91 2.48-5.69 4.012.22.448.43.9.62 1.357.067.16.13.32.19.477 3.4-.427 6.777.258 7.11.33-.02-2.33-.88-4.48-2.23-6.18z"/></svg>`,
    pinterest: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z"/></svg>`,
    spotify: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
    website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};


// ─── INITIALIZE ───
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    renderProfile();
    renderActions();
    renderSocialLinks();
    renderCompanyDetails();
    initScrollReveal();
    initRippleEffects();
});


// ─── APPLY THEME FROM CONFIG ───
function applyTheme() {
    const { theme } = profile;
    if (!theme) return;

    const root = document.documentElement;
    if (theme.primary) root.style.setProperty('--primary', theme.primary);
    if (theme.secondary) root.style.setProperty('--secondary', theme.secondary);
    if (theme.accent) root.style.setProperty('--accent', theme.accent);
    if (theme.accentHover) root.style.setProperty('--accent-hover', theme.accentHover);
    if (theme.accentGradient) root.style.setProperty('--accent-gradient', theme.accentGradient);
    if (theme.textPrimary) root.style.setProperty('--text-primary', theme.textPrimary);
    if (theme.textSecondary) root.style.setProperty('--text-secondary', theme.textSecondary);

    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && theme.primary) meta.content = theme.primary;

    // Update page title
    document.title = `${profile.name} — Digital Business Card | Powered by NAM`;
}


// ─── RENDER PROFILE ───
function renderProfile() {
    // Cover image
    const coverEl = document.getElementById('heroCover');
    if (profile.cover) {
        coverEl.style.backgroundImage = `url('${profile.cover}')`;
    }

    // Avatar
    const avatarEl = document.getElementById('heroAvatar');
    if (profile.avatar) {
        avatarEl.src = profile.avatar;
        avatarEl.alt = `${profile.name}'s profile photo`;
    } else {
        // Fallback: generate initial avatar
        const ring = document.getElementById('avatarRing');
        ring.innerHTML = `<div class="hero__avatar hero__avatar--initials" style="display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:48px;font-weight:800;background:var(--secondary);color:var(--accent);">${getInitials(profile.name)}</div>`;
    }

    // Text
    document.getElementById('heroName').textContent = profile.name || '';
    document.getElementById('heroTitle').textContent = profile.title || '';
    document.getElementById('heroCompany').textContent = profile.company || '';
    document.getElementById('heroBio').textContent = profile.bio || '';

    // Hide empty fields
    if (!profile.bio) document.getElementById('heroBio').style.display = 'none';
}


// ─── RENDER QUICK ACTIONS ───
function renderActions() {
    const callBtn = document.getElementById('btnCall');
    const emailBtn = document.getElementById('btnEmail');

    if (profile.phone) {
        callBtn.href = `tel:${profile.phone.replace(/\s/g, '')}`;
    } else {
        callBtn.style.display = 'none';
    }

    if (profile.email) {
        emailBtn.href = `mailto:${profile.email}`;
    } else {
        emailBtn.style.display = 'none';
    }

    // Save Contact
    document.getElementById('btnSaveContact').addEventListener('click', downloadVCard);

    // Share
    document.getElementById('btnShare').addEventListener('click', shareProfile);
}


// ─── RENDER SOCIAL LINKS ───
function renderSocialLinks() {
    const grid = document.getElementById('socialGrid');
    const links = profile.socialLinks || [];

    if (links.length === 0) {
        document.getElementById('social').style.display = 'none';
        return;
    }

    links.forEach((link, index) => {
        if (!link.url) return;

        const card = document.createElement('a');
        card.className = 'social__card reveal';
        card.href = link.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.style.transitionDelay = `${index * 0.08}s`;

        const icon = platformIcons[link.platform] || platformIcons.website;
        const label = link.label || capitalize(link.platform);

        card.innerHTML = `
      <div class="social__card-icon social__card-icon--${link.platform}">
        ${icon}
      </div>
      <span class="social__card-label">${label}</span>
      <div class="social__card-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    `;

        grid.appendChild(card);
    });
}


// ─── RENDER COMPANY DETAILS ───
function renderCompanyDetails() {
    const details = profile.companyDetails;

    if (!details) {
        document.getElementById('company').style.display = 'none';
        return;
    }

    // Logo
    const logoEl = document.getElementById('companyLogo');
    if (profile.companyLogo) {
        logoEl.src = profile.companyLogo;
        logoEl.alt = `${details.name} logo`;
    } else {
        logoEl.style.display = 'none';
    }

    // Info
    document.getElementById('companyName').textContent = details.name || '';
    document.getElementById('companyIndustry').textContent = details.industry || '';
    document.getElementById('companyDescription').textContent = details.description || '';

    // Address
    const addressEl = document.getElementById('companyAddress');
    if (details.address) {
        addressEl.querySelector('span').textContent = details.address;
    } else {
        addressEl.style.display = 'none';
    }

    // Website
    const websiteEl = document.getElementById('companyWebsite');
    if (details.website) {
        websiteEl.href = details.website;
        websiteEl.querySelector('span').textContent = details.website.replace(/^https?:\/\//, '');
    } else {
        websiteEl.style.display = 'none';
    }

    // Map
    const mapEl = document.getElementById('companyMap');
    if (details.mapUrl) {
        mapEl.href = details.mapUrl;
    } else {
        mapEl.style.display = 'none';
    }
}


// ─── SCROLL REVEAL (Intersection Observer) ───
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    });

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Also observe major sections
    document.querySelectorAll('.company__card, .section-title').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}


// ─── RIPPLE EFFECT ───
function initRippleEffects() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left - 10}px`;
            ripple.style.top = `${e.clientY - rect.top - 10}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}


// ─── vCARD GENERATION ───
function downloadVCard() {
    const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${profile.name}`,
        `TITLE:${profile.title || ''}`,
        `ORG:${profile.company || ''}`,
        profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : '',
        profile.email ? `EMAIL:${profile.email}` : '',
        profile.website ? `URL:${profile.website}` : '',
        profile.location ? `ADR;TYPE=WORK:;;${profile.location}` : '',
        profile.bio ? `NOTE:${profile.bio}` : '',
        'END:VCARD',
    ].filter(Boolean).join('\n');

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '_')}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
}


// ─── SHARE PROFILE ───
async function shareProfile() {
    const shareData = {
        title: `${profile.name} — Digital Business Card`,
        text: `${profile.name} | ${profile.title} at ${profile.company}`,
        url: window.location.href,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            // User cancelled or share failed — fall back to clipboard
            copyToClipboard();
        }
    } else {
        copyToClipboard();
    }
}

function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard!');
    }).catch(() => {
        showToast('Could not copy link');
    });
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent-gradient);
    color: var(--primary);
    padding: 12px 24px;
    border-radius: 50px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    z-index: 1000;
    animation: fadeInUp 0.3s ease-out;
    box-shadow: 0 4px 20px rgba(212,168,83,0.4);
  `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}


// ─── UTILITIES ───
function getInitials(name) {
    return name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
