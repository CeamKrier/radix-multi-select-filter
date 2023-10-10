import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
    // base: "/radix-multi-select-filter/",
    plugins: [
        react(),
        eslintPlugin({
            cache: false,
            include: ["./src/**/*.{js,ts,jsx,tsx}"],
            exclude: []
        })
    ]
});
