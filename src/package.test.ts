import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// npm "prepares" a git dependency (runs `npm install` inside it) when it has one of these scripts,
// and that fails for this package. Apps install it from git, so none of them may exist.
const PREPARE_TRIGGERS = ["build", "prepare", "prepack", "preinstall", "install", "postinstall"];

describe("package.json", () => {
  it("has no script that makes npm build the package when an app installs it from git", () => {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
      scripts?: Record<string, string>;
    };
    const scripts = Object.keys(pkg.scripts ?? {});
    expect(scripts.filter((s) => PREPARE_TRIGGERS.includes(s))).toEqual([]);
  });
});
