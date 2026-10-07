import { readFileSync } from "node:fs";
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

const themeEntries = {
  standard: "src/styles/themes/standard.less",
  interface: "src/styles/themes/interface.less",
  "customer-ambra": "src/styles/themes/customers/ambra.less",
  pages: "src/styles/themes/interface.less"
};

const includePattern = /<!--\s*@include\s+([^\s]+)(?:\s+(\{[\s\S]*?\}))?\s*-->/g;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function applyVariables(source, variables) {
  return source.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (_, key) => {
    if (!(key in variables)) throw new Error("Missing HTML partial variable: " + key);
    return escapeHtml(variables[key]);
  });
}

function expandHtmlPartials(source, depth = 0) {
  if (depth > 12) throw new Error("HTML partial nesting is too deep.");

  return source.replace(includePattern, (_, relativePath, rawVariables) => {
    const partialPath = resolve(process.cwd(), relativePath);
    const variables = rawVariables ? JSON.parse(rawVariables) : {};
    const partial = applyVariables(readFileSync(partialPath, "utf8"), variables);
    return expandHtmlPartials(partial, depth + 1);
  });
}

function htmlPartialsPlugin() {
  const partialsDirectory = resolve(process.cwd(), "partials");

  return {
    name: "harika-html-partials",
    enforce: "pre",
    transformIndexHtml(html) {
      return expandHtmlPartials(html);
    },
    configureServer(server) {
      server.watcher.add(partialsDirectory);
      server.watcher.on("change", (file) => {
        if (file.startsWith(partialsDirectory)) {
          server.ws.send({ type: "full-reload" });
        }
      });
    }
  };
}

function resolveThemeEntry(mode) {
  const relative = themeEntries[mode] ?? themeEntries.interface;
  return resolve(process.cwd(), relative);
}

export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/harika-clickdummy/" : "/",
  plugins: [htmlPartialsPlugin()],
  resolve: {
    alias: {
      "@harika-theme": resolveThemeEntry(mode)
    }
  },
  define: {
    __HARIKA_THEME__: JSON.stringify(mode === "pages" ? "interface" : (themeEntries[mode] ? mode : "interface"))
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(htmlEntries).map(([name, file]) => [name, resolve(process.cwd(), file)])
      )
    }
  }
}));
