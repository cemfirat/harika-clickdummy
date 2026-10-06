import { execFileSync } from "node:child_process";
import { harikaSource } from "../src/harika-source.js";
import { transferState } from "../src/transfer-state.js";

const transferableExact = new Set([
  "index.html",
  "src/main.js",
  "src/ui.js",
  "src/views.js"
]);

const transferablePrefixes = [
  "src/styles/"
];

function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function changedFiles(from, to) {
  const output = git(["diff", "--name-only", from + ".." + to]);
  return output ? output.split("\n").filter(Boolean) : [];
}

function isTransferable(path) {
  return transferableExact.has(path) || transferablePrefixes.some((prefix) => path.startsWith(prefix));
}

const current = git(["rev-parse", "HEAD"]);
const checkpoint = transferState.lastPromotion?.clickdummyCommit ?? transferState.uiBaselineClickdummyCommit;

try {
  git(["merge-base", "--is-ancestor", checkpoint, current]);
} catch {
  throw new Error("Configured clickdummy transfer checkpoint is not an ancestor of HEAD.");
}

const files = changedFiles(checkpoint, current);
const uiFiles = files.filter(isTransferable);
const nonUiFiles = files.filter((path) => !isTransferable(path));

console.log("Harika clickdummy transfer status");
console.log("--------------------------------");
console.log("Harika source baseline: " + harikaSource.commit);
console.log("Clickdummy checkpoint:  " + checkpoint);
console.log("Clickdummy HEAD:        " + current);
console.log("");

if (uiFiles.length === 0) {
  console.log("No pending transferable UI changes.");
} else {
  console.log("Pending transferable UI changes:");
  for (const path of uiFiles) console.log("  - " + path);
}

if (nonUiFiles.length > 0) {
  console.log("");
  console.log("Changed files not auto-classified for Harika transfer:");
  for (const path of nonUiFiles) console.log("  - " + path);
}

console.log("");
console.log("Mock data, transfer metadata and documentation are never promoted automatically.");
