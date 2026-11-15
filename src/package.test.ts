import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type PackageJson = {
  name?: string;
  private?: boolean;
  version?: string;
  scripts?: Record<string, string>;
  repository?: { url?: string };
  publishConfig?: { registry?: string };
  files?: string[];
};

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as PackageJson;

// npm runs `npm install` inside a git dependency, and runs these scripts on `npm publish`, when
// they exist. Neither is wanted: dist/ is committed and checked by CI instead.
const PREPARE_TRIGGERS = ["build", "prepare", "prepack", "preinstall", "install", "postinstall"];

describe("package.json", () => {
  it("has no script that makes npm build the package on install or publish", () => {
    const scripts = Object.keys(pkg.scripts ?? {});
    expect(scripts.filter((s) => PREPARE_TRIGGERS.includes(s))).toEqual([]);
  });

  it("publishes to GitHub Packages under the organization's scope", () => {
    // GitHub Packages only accepts a package whose scope is the owner of the repository.
    expect(pkg.name).toBe("@isaly-web/app-foundation");
    expect(pkg.private).toBeUndefined();
    expect(pkg.publishConfig?.registry).toBe("https://npm.pkg.github.com");
    expect(pkg.repository?.url).toBe("git+https://github.com/Isaly-web/isaly-app-foundation.git");
  });

  it("ships only the built files", () => {
    expect(pkg.files).toEqual(["dist"]);
  });

  it("has a plain semver version, so the release tag v<version> can be checked", () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/);
  });
});
