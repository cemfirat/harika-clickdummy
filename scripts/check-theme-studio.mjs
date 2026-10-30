import { strict as assert } from "node:assert";
import { EventEmitter } from "node:events";
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Exercise the real middleware against a disposable theme family. Rejected
// drafts must not even touch mtime: a write followed by rollback still reloads
// Vite clients and discards the editor's rejected draft and error message.
export async function checkThemeStudio() {
  const cache = fileURLToPath(new URL("../node_modules/.cache/", import.meta.url));
  await mkdir(cache, { recursive: true });
  const fixture = await mkdtemp(resolve(cache, "harika-studio-"));
  const files = {
    "src/themes/harika.less": '@import "harika/variables.less"; .fixture { color: @fixture-color; }',
    "src/themes/harika-light.less": '@import "harika.less";',
    "src/themes/harika-dark.less": '@import "harika.less"; @import "harika/dark.less";',
    "src/themes/harika/variables.less": "@fixture-color: #123456; @fail-in-customer-dark: false;",
    "src/themes/harika/dark.less": ".fixture-dark { background: @fixture-color; }",
    "src/themes/customers/ambra.less": '@import "../harika.less"; @import "ambra/variables.less";',
    "src/themes/customers/ambra-dark.less": '@import "../harika-dark.less"; @import "ambra/variables.less"; .customer-dark-error() when (@fail-in-customer-dark = true) { color: @missing-customer-dark; } .fixture-customer-dark { .customer-dark-error(); }',
    "src/themes/customers/ambra/variables.less": "// Customer fixture.\n"
  };

  try {
    for (const [path, content] of Object.entries(files)) {
      await mkdir(dirname(resolve(fixture, path)), { recursive: true });
      await writeFile(resolve(fixture, path), content);
    }

    const configUrl = new URL("../vite.config.js", import.meta.url);
    configUrl.searchParams.set("studio-fixture", fixture);
    const previousDirectory = process.cwd();
    let createConfig;
    try {
      process.chdir(fixture);
      ({ default: createConfig } = await import(configUrl.href));
    } finally {
      process.chdir(previousDirectory);
    }
    const config = await createConfig({ mode: "harika", command: "serve" });
    let middleware;
    config.plugins.find((plugin) => plugin.name === "harika-theme-studio").configureServer({
      middlewares: { use(handler) { middleware = handler; } }
    });

    function save(path, content) {
      const request = new EventEmitter();
      Object.assign(request, { method: "PUT", url: "/__studio/file", socket: { remoteAddress: "127.0.0.1" } });
      return new Promise((fulfill, reject) => {
        const response = {
          statusCode: 200,
          setHeader() {},
          end(body) { fulfill({ status: response.statusCode, ...JSON.parse(body) }); }
        };
        middleware(request, response, () => reject(new Error("Studio request was not handled.")));
        request.emit("data", JSON.stringify({ path, content }));
        request.emit("end");
      });
    }

    async function expectRejected(path, content, errorName) {
      const before = await stat(resolve(fixture, path), { bigint: true });
      const result = await save(path, content);
      assert.equal(result.status, 422, "Invalid drafts must be rejected before saving.");
      assert.equal(result.unchanged, true, "A rejected save must report an untouched file.");
      assert.ok(result.error.includes(errorName), "The affected Dark entry must actually be compiled.");
      assert.equal(await readFile(resolve(fixture, path), "utf8"), files[path]);
      assert.equal((await stat(resolve(fixture, path), { bigint: true })).mtimeNs, before.mtimeNs,
        "Rejected drafts must not trigger the file watcher through a temporary write.");
    }

    // This imported Harika edit fails only in the downstream customer Dark build.
    const variables = "src/themes/harika/variables.less";
    await expectRejected(variables, files[variables] + "\n@fail-in-customer-dark: true;", "missing-customer-dark");
    // Explicit appearance entry edits also need the unsaved source as input.
    for (const entry of ["src/themes/harika-dark.less", "src/themes/customers/ambra-dark.less"]) {
      await expectRejected(entry, files[entry] + "\n.invalid-draft { color: @missing-entry-draft; }", "missing-entry-draft");
    }

    const acceptedContent = files[variables] + "\n@fixture-color: #abcdef;";
    const accepted = await save(variables, acceptedContent);
    assert.equal(accepted.status, 200);
    assert.deepEqual(new Set(accepted.compiled), new Set([
      "src/themes/harika-light.less", "src/themes/harika-dark.less",
      "src/themes/customers/ambra.less", "src/themes/customers/ambra-dark.less"
    ]), "Harika saves must validate both appearances of every dependent family.");
    for (const [path, original] of Object.entries(files)) {
      assert.equal(await readFile(resolve(fixture, path), "utf8"), path === variables ? acceptedContent : original,
        "Successful validation must write only the edited file.");
    }
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
}
