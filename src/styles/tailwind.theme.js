// tailwind.theme.js
module.exports = {
    theme: {
        extend: {
            colors: {
                // Background colors
                primary: {
                    DEFAULT: 'var(--color-bg-primary)',
                    subtle: 'var(--color-bg-primary-subtle)',
                },
                secondary: 'var(--color-bg-secondary)',
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    hover: 'var(--color-accent-hover)',
                },

                // Text colors
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                'text-muted': 'var(--color-text-muted)',
                'text-accent': 'var(--color-text-accent)',
                'text-accent-hover': 'var(--color-text-accent-hover)',
            },
        },
    },
    plugins: [
        function({ addBase }) {
            addBase({
                ':root': {
                    // Light theme
                    '--color-bg-primary': '#ffffff',
                    '--color-bg-primary-subtle': '#f3f4f6',
                    '--color-bg-secondary': '#f9fafb',
                    '--color-accent': '#1db954', // Spotify green
                    '--color-accent-hover': '#1ed760',

                    '--color-text-primary': '#1f2937',
                    '--color-text-secondary': '#4b5563',
                    '--color-text-muted': '#6b7280',
                    '--color-text-accent': '#1db954',
                    '--color-text-accent-hover': '#1ed760',
                },
                '.dark': {
                    // Dark theme
                    '--color-bg-primary': '#1E1E24', // Dark background color used in the cards
                    '--color-bg-primary-subtle': '#27272E', // Slightly lighter bg for hover states
                    '--color-bg-secondary': '#18181b', // Zinc-900
                    '--color-accent': '#1db954', // Spotify green
                    '--color-accent-hover': '#1ed760',

                    '--color-text-primary': '#ffffff',
                    '--color-text-secondary': '#d1d5db', // Gray-300
                    '--color-text-muted': '#9ca3af', // Gray-400
                    '--color-text-accent': '#1db954',
                    '--color-text-accent-hover': '#1ed760',
                }
            });
        }
    ],
};