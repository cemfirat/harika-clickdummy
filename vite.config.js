import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import less from "less";
import { defineConfig } from "vite";

const rootDirectory = process.cwd();

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
  standard: { light: "src/themes/standard.less", dark: "src/themes/standard-dark.less" },
  harika: { light: "src/themes/harika-light.less", dark: "src/themes/harika-dark.less" },
  "customer-ambra": { light: "src/themes/customers/ambra.less", dark: "src/themes/customers/ambra-dark.less" },
  pages: { light: "src/themes/harika-light.less", dark: "src/themes/harika-dark.less" }
};

// Keep full UIkit builds in separate assets: bundling both as JS CSS imports
// would let the dark component rules override the light rules unconditionally.
function appearanceStylesheetsPlugin(mode) {
  const entries = themeEntries[mode] ?? themeEntries.harika;
  const developmentPrefix = "/__harika-appearance/";
  const assets = {};
  let config;
  const compile = async (appearance) => {
    const filename = resolve(rootDirectory, entries[appearance]);
    const result = await less.render(readFileSync(filename, "utf8"), {
      filename,
      javascriptEnabled: false,
      rewriteUrls: "all",
      compress: true,
      paths: [rootDirectory, resolve(rootDirectory, "node_modules")]
    });
    return result.css;
  };

  return {
    name: "harika-appearance-stylesheets",
    configResolved(resolvedConfig) { config = resolvedConfig; },
    async buildStart() {
      if (config.command !== "build") return;
      const compiled = await Promise.all(["light", "dark"].map(async (appearance) => ({ appearance, css: await compile(appearance) })));
      for (const { appearance, css } of compiled) {
        const hash = createHash("sha256").update(css).digest("hex").slice(0, 12);
        const fileName = `assets/uikit-${mode === "pages" ? "harika" : mode}-${appearance}-${hash}.css`;
        this.emitFile({ type: "asset", fileName, source: css });
        assets[appearance] = config.base + fileName;
      }
    },
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const marker = "<!-- harika:appearance-stylesheets -->";
        if (!html.includes(marker)) throw new Error("Page is missing the early Harika appearance bootstrap.");
        const links = ["light", "dark"].map((appearance) => {
          const href = config.command === "build" ? assets[appearance] : `${developmentPrefix}${appearance}.css`;
          return `<link rel="stylesheet" href="${href}" data-harika-appearance="${appearance}" media="(prefers-color-scheme: ${appearance})" blocking="render">`;
        }).join("\n  ");
        return html.replace(marker, links);
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = new URL(req.url ?? "/", "http://127.0.0.1").pathname;
        const appearance = pathname === `${developmentPrefix}light.css` ? "light" : pathname === `${developmentPrefix}dark.css` ? "dark" : null;
        if (!appearance) return next();
        compile(appearance).then((css) => {
          res.setHeader("Content-Type", "text/css; charset=utf-8");
          res.setHeader("Cache-Control", "no-cache");
          res.end(css);
        }).catch((error) => {
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end("Harika theme compilation failed. Inspect the LESS compiler output.");
          server.config.logger.error(String(error));
        });
      });
      server.watcher.on("change", (file) => {
        if (file.endsWith(".less") && (file.startsWith(resolve(rootDirectory, "src/themes")) || file.startsWith(resolve(rootDirectory, "src/styles")))) {
          server.ws.send({ type: "full-reload" });
        }
      });
    }
  };
}

const includePattern = /<!--\s*@include\s+([^\s]+)(?:\s+(\{[\s\S]*?\}))?\s*-->/g;
const includeCodePattern = /<!--\s*@include-code\s+([^\s]+)(?:\s+(\{[\s\S]*?\}))?\s*-->/g;

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

function readPartial(relativePath, rawVariables) {
  const partialPath = resolve(rootDirectory, relativePath);
  const variables = rawVariables ? JSON.parse(rawVariables) : {};
  return applyVariables(readFileSync(partialPath, "utf8"), variables);
}

function expandHtmlPartials(source, depth = 0) {
  if (depth > 12) throw new Error("HTML partial nesting is too deep.");

  return source.replace(includePattern, (_, relativePath, rawVariables) => {
    const partial = readPartial(relativePath, rawVariables);
    return expandHtmlPartials(partial, depth + 1);
  });
}

function expandCodePartials(source) {
  return source.replace(includeCodePattern, (_, relativePath, rawVariables) => {
    const partial = readPartial(relativePath, rawVariables).trim();
    return escapeHtml(partial);
  });
}

function htmlPartialsPlugin() {
  const partialsDirectory = resolve(rootDirectory, "partials");

  return {
    name: "harika-html-partials",
    enforce: "pre",
    transformIndexHtml(html) {
      return expandHtmlPartials(expandCodePartials(html));
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

function normalizeStudioPath(value) {
  return String(value ?? "").replaceAll("\\", "/").replace(/^\.\//, "");
}

function listThemeStudioFiles() {
  const files = ["src/themes/harika.less", "src/themes/harika-light.less", "src/themes/harika-dark.less"];
  const harikaDirectory = resolve(rootDirectory, "src/themes/harika");

  for (const entry of readdirSync(harikaDirectory, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".less")) {
      files.push("src/themes/harika/" + entry.name);
    }
  }

  const customersDirectory = resolve(rootDirectory, "src/themes/customers");
  for (const entry of readdirSync(customersDirectory, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".less")) {
      files.push("src/themes/customers/" + entry.name);
    }

    if (!entry.isDirectory()) continue;

    const customerDirectory = resolve(customersDirectory, entry.name);
    for (const child of readdirSync(customerDirectory, { withFileTypes: true })) {
      if (child.isFile() && child.name.endsWith(".less")) {
        files.push("src/themes/customers/" + entry.name + "/" + child.name);
      }
    }
  }

  return [...new Set(files)].sort();
}

function assertThemeStudioFile(value) {
  const relativePath = normalizeStudioPath(value);
  if (!listThemeStudioFiles().includes(relativePath)) {
    throw new Error("Theme Studio path is not editable: " + relativePath);
  }
  return relativePath;
}

function customerThemeEntries() {
  const customersDirectory = resolve(rootDirectory, "src/themes/customers");
  return readdirSync(customersDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".less"))
    .map((entry) => "src/themes/customers/" + entry.name)
    .sort();
}

function affectedThemeEntries(relativePath) {
  if (["src/themes/harika.less", "src/themes/harika-light.less", "src/themes/harika-dark.less"].includes(relativePath) || relativePath.startsWith("src/themes/harika/")) {
    return ["src/themes/harika-light.less", "src/themes/harika-dark.less", ...customerThemeEntries()];
  }

  const customerMatch = relativePath.match(/^src\/themes\/customers\/([^/]+)(?:\/|\.less$)/);
  if (customerMatch) {
    const family = customerMatch[1].replace(/-dark$/, "");
    return customerThemeEntries().filter((entry) => entry === `src/themes/customers/${family}.less` || entry === `src/themes/customers/${family}-dark.less`);
  }

  return [];
}

async function compileThemeEntry(relativePath, draft) {
  const filename = resolve(rootDirectory, relativePath);
  // Resolve imports through Less itself, then substitute only the edited file.
  // No provisional disk write means rejected drafts cannot trigger a reload.
  const draftPlugin = {
    install(lessApi, pluginManager) {
      const urlFiles = new lessApi.UrlFileManager();
      class DraftFileManager extends lessApi.FileManager {
        supports(...args) { return !urlFiles.supports(...args); }
        supportsSync() { return false; }
        async loadFile(...args) {
          const file = await super.loadFile(...args);
          return resolve(file.filename) === draft.filename
            ? { ...file, contents: draft.content }
            : file;
        }
      }
      pluginManager.addFileManager(new DraftFileManager());
    }
  };
  await less.render(filename === draft.filename ? draft.content : readFileSync(filename, "utf8"), {
    filename,
    javascriptEnabled: false,
    rewriteUrls: "all",
    plugins: [draftPlugin],
    paths: [
      rootDirectory,
      resolve(rootDirectory, "node_modules")
    ]
  });
}

function gitRaw(args) {
  return execFileSync("git", args, {
    cwd: rootDirectory,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function git(args) {
  return gitRaw(args).trim();
}

function gitOptional(args) {
  try {
    return git(args);
  } catch {
    return "";
  }
}

function gitRawOptional(args) {
  try {
    return gitRaw(args);
  } catch {
    return "";
  }
}

function readHeadFile(relativePath) {
  return gitRawOptional(["show", "HEAD:" + relativePath]);
}

function studioFilePayload(relativePath) {
  const absolutePath = resolve(rootDirectory, relativePath);
  const content = readFileSync(absolutePath, "utf8");
  const headContent = readHeadFile(relativePath);

  return {
    path: relativePath,
    content,
    headContent,
    modified: content !== headContent,
    gitStatus: gitOptional(["status", "--short", "--", relativePath]),
    diff: gitOptional(["diff", "--", relativePath])
  };
}

function isLoopbackRequest(req) {
  const address = String(req.socket.remoteAddress ?? "").replace(/^::ffff:/, "");
  return address === "127.0.0.1" || address === "::1";
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 512 * 1024) {
        rejectBody(new Error("Theme Studio request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolveBody(raw ? JSON.parse(raw) : {});
      } catch {
        rejectBody(new Error("Invalid JSON request."));
      }
    });

    req.on("error", rejectBody);
  });
}

function themeStudioPlugin(mode) {
  return {
    name: "harika-theme-studio",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestUrl = new URL(req.url ?? "/", "http://127.0.0.1");
        if (!requestUrl.pathname.startsWith("/__studio/")) {
          next();
          return;
        }

        const handle = async () => {
          if (!isLoopbackRequest(req)) {
            sendJson(res, 403, { ok: false, error: "Theme Studio is local-only." });
            return;
          }

          if (req.method === "GET" && requestUrl.pathname === "/__studio/status") {
            const files = listThemeStudioFiles();
            sendJson(res, 200, {
              ok: true,
              mode,
              branch: gitOptional(["branch", "--show-current"]),
              head: gitOptional(["rev-parse", "--short", "HEAD"]),
              files,
              modifiedFiles: files.filter((path) => Boolean(gitOptional(["status", "--short", "--", path])))
            });
            return;
          }

          if (req.method === "GET" && requestUrl.pathname === "/__studio/file") {
            const relativePath = assertThemeStudioFile(requestUrl.searchParams.get("path"));
            sendJson(res, 200, { ok: true, file: studioFilePayload(relativePath) });
            return;
          }

          if (req.method === "PUT" && requestUrl.pathname === "/__studio/file") {
            const body = await readJsonBody(req);
            const relativePath = assertThemeStudioFile(body.path);
            const nextContent = String(body.content ?? "");
            const absolutePath = resolve(rootDirectory, relativePath);
            const previousContent = readFileSync(absolutePath, "utf8");

            if (nextContent === previousContent) {
              sendJson(res, 200, {
                ok: true,
                compiled: [],
                file: studioFilePayload(relativePath)
              });
              return;
            }

            const compiled = affectedThemeEntries(relativePath);
            try {
              for (const entry of compiled) {
                await compileThemeEntry(entry, { filename: absolutePath, content: nextContent });
              }
            } catch (error) {
              sendJson(res, 422, {
                ok: false,
                error: error instanceof Error ? error.message : String(error),
                unchanged: true,
                file: studioFilePayload(relativePath)
              });
              return;
            }

            writeFileSync(absolutePath, nextContent, "utf8");
            sendJson(res, 200, {
              ok: true,
              compiled,
              file: studioFilePayload(relativePath)
            });
            return;
          }

          sendJson(res, 404, { ok: false, error: "Unknown Theme Studio endpoint." });
        };

        handle().catch((error) => {
          sendJson(res, 500, {
            ok: false,
            error: error instanceof Error ? error.message : String(error)
          });
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/harika-clickdummy/" : "/",
  plugins: [
    htmlPartialsPlugin(),
    appearanceStylesheetsPlugin(mode),
    themeStudioPlugin(mode)
  ],
  define: {
    __HARIKA_THEME__: JSON.stringify(mode === "pages" ? "harika" : (themeEntries[mode] ? mode : "harika"))
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(htmlEntries).map(([name, file]) => [name, resolve(rootDirectory, file)])
      )
    }
  }
}));
