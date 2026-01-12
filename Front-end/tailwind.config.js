/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#1e40af", // deep blue
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#f3f4f6", // gray-100
                    foreground: "#111827", // gray-900
                },
                destructive: {
                    DEFAULT: "#ef4444", // red-500
                    foreground: "#ffffff",
                },
            },
        },
    },
    plugins: [],
}
