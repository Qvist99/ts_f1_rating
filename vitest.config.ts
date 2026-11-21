import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "node", // default for lib tests; override per-file with jsdom
    },
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./"),
        },
    },
});
