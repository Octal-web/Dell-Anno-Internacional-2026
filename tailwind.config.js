import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['roboto', ...defaultTheme.fontFamily.sans],
                secondary: ['helvetica-neue-lt-pro', 'sans-serif'],
                admin: ['Inter', 'sans-serif'],
            },
            container: {
                center: true,
                padding: '5%',
                screens: {
                    sm: '90%',
                    md: '90%',
                    lg: '90%',
                    xl: '90%',
                },
            },
            maxWidth: {
                'small': '58rem',
                'medium': '90rem',
                'large': '108rem',
                'x-large': '117rem',
            },
            spacing: {
                '15': '3.75rem',
                '30': '7rem',
                '40': '9.375rem',
                '50': '12.5rem',
            },
            keyframes: {
                'slide-in-bottom': {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                'fade-in-down': {
                    '0%': { opacity: '0', transform: 'translate3d(0,-100px,0)' },
                    '100%': { opacity: '1', transform: 'none' },
                },
                'fade-out-down': {
                    '0%': { opacity: '1', transform: 'none' },
                    '100%': { opacity: '0', transform: 'translate3d(0, 100px,0)' },
                }
            },
            animation: {
                'slide-in-bottom': 'slide-in-bottom 300ms ease-out',
                'fade-in-down': 'fade-in-down 200ms linear',
                'fade-out-down': 'fade-out-down 200ms linear'
            },
        },
    },

    plugins: [
        forms,
        function({ addComponents }) {
            addComponents({
                'p + p': {
                    marginTop: '0.6rem',
                },
                'ul > li > p': {
                    display: 'contents',
                },
                'strong, b': {
                    fontWeight: 'bold'
                }
            })
        }
    ],
};
