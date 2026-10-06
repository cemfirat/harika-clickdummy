import { resolve } from "node:path";
import { defineConfig } from "vite";

const htmlEntries = {
  overview: "index.html",
  kunden: "kunden.html",
  websites: "websites.html",
  searchSeo: "search-seo.html",
  ads: "ads.html",
  aiVisibility: "ai-visibility.html",
  promptCenter: "prompt-center.html",
  entwicklung: "entwicklung.html",
  einstellungen: "einstellungen.html",
  styleguide: "styleguide.html"
};

export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/harika-clickdummy/" : "/",
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(htmlEntries).map(([name, file]) => [name, resolve(process.cwd(), file)])
      )
    }
  }
}));
