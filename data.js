// ═══════════════════════════════════════════════════════════════
//  NFC LANDING PAGE — CLIENT CONFIGURATION
//  Edit this file for each new NFC card client.
//  No other code changes are needed.
// ═══════════════════════════════════════════════════════════════

export const profile = {
  // ─── PERSONAL INFO ───
  name: "John Doe",
  title: "Marketing Director",
  company: "Global Innovations Inc.",
  bio: "Passionate about building brands and driving growth through creative strategy and digital innovation.",
  phone: "+971 50 123 4567",
  email: "john.doe@globalinnovations.com",
  website: "https://globalinnovations.com",
  location: "Business Bay, Dubai, UAE",

  // ─── ASSETS (place files in public/ folder) ───
  avatar: "./avatar.jpg",       // Profile photo — square, min 400x400px recommended
  cover: "./cover.jpg",         // Cover/banner image — wide, min 1200x400px recommended
  companyLogo: "./logo.png",    // Client company logo — transparent PNG recommended

  // ─── THEME (customize colors per client) ───
  theme: {
    primary: "#0a1628",                                         // Dark base / background
    secondary: "#111d33",                                       // Card / surface color
    accent: "#d4a853",                                          // Gold accent
    accentHover: "#f0c56e",                                     // Accent hover state
    accentGradient: "linear-gradient(135deg, #d4a853, #f5cf8a)", // Gradient for buttons/highlights
    textPrimary: "#ffffff",                                     // Main text
    textSecondary: "rgba(255,255,255,0.7)",                     // Subtle text
  },

  // ─── SOCIAL LINKS (only add platforms that apply — grid adapts automatically) ───
  socialLinks: [
    { platform: "linkedin",  url: "https://linkedin.com/in/johndoe",     label: "LinkedIn" },
    { platform: "instagram", url: "https://instagram.com/johndoe",       label: "Instagram" },
    { platform: "twitter",   url: "https://x.com/johndoe",              label: "X / Twitter" },
    { platform: "whatsapp",  url: "https://wa.me/971501234567",          label: "WhatsApp" },
    { platform: "facebook",  url: "https://facebook.com/johndoe",       label: "Facebook" },
    { platform: "youtube",   url: "https://youtube.com/@johndoe",       label: "YouTube" },
    // { platform: "tiktok",    url: "https://tiktok.com/@johndoe",      label: "TikTok" },
    // { platform: "snapchat",  url: "https://snapchat.com/add/johndoe", label: "Snapchat" },
    // { platform: "behance",   url: "https://behance.net/johndoe",      label: "Behance" },
    // { platform: "github",    url: "https://github.com/johndoe",       label: "GitHub" },
    // { platform: "telegram",  url: "https://t.me/johndoe",             label: "Telegram" },
    // { platform: "dribbble",  url: "https://dribbble.com/johndoe",     label: "Dribbble" },
    // { platform: "pinterest", url: "https://pinterest.com/johndoe",    label: "Pinterest" },
    // { platform: "spotify",   url: "https://open.spotify.com/...",     label: "Spotify" },
  ],

  // ─── COMPANY DETAILS ───
  companyDetails: {
    name: "Global Innovations Inc.",
    industry: "Technology & Digital Solutions",
    description: "A leading innovator in digital transformation, helping businesses across the UAE leverage technology for sustainable growth.",
    address: "Office 1205, Bay Square, Business Bay, Dubai, UAE",
    mapUrl: "https://maps.google.com/?q=Business+Bay+Dubai",
    website: "https://globalinnovations.com",
  },
};
