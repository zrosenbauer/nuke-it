// import path from "node:path";
// import { match } from "ts-pattern";
// import { detectPackageManager } from "#/lib/detect/package-manager";
// import { exists } from "#/lib/fs";
// import {
// 	hasDependency,
// 	hasWorkspaces,
// 	readPackageJson,
// } from "#/lib/node-manifest";
// import { inferRootDirectory } from "#/lib/utils";

// export type MonorepoType =
// 	| "turborepo"
// 	| "lerna"
// 	| "nx"
// 	| "yarn"
// 	| "pnpm"
// 	| "npm";

// type MonorepoDetectionResult =
// 	| {
// 			monorepo: true;
// 			type: MonorepoType;
// 	  }
// 	| {
// 			monorepo: false;
// 			type: null;
// 	  };

// /**
//  * Detects if a directory is a monorepo and returns information about it
//  * @param filePaths Array of file paths to check for monorepo configuration
//  */
// export async function detectMonorepo(
// 	filePaths: string[],
// ): Promise<MonorepoDetectionResult> {
// 	const type = match(filePaths)
// 		.returnType<MonorepoType | null>()
// 		.when(detectTurborepo, () => "turborepo")
// 		.when(detectLerna, () => "lerna")
// 		.when(detectNx, () => "nx")
// 		.when(detectNpm, () => "npm")
// 		.when(detectYarn, () => "yarn")
// 		.when(detectPnpm, () => "pnpm")
// 		.otherwise(() => null);

// 	if (type === null) {
// 		return {
// 			monorepo: false,
// 			type: null,
// 		};
// 	}

// 	return {
// 		monorepo: true,
// 		type,
// 	};
// }

// if (import.meta.vitest) {
// 	const { test, expect, describe, vi, beforeEach } = import.meta.vitest;

// 	// Mock dependencies
// 	vi.mock("#/lib/file-system", () => ({
// 		exists: vi.fn(),
// 	}));

// 	vi.mock("#/lib/node-manifest", () => ({
// 		hasDependency: vi.fn(),
// 		hasWorkspaces: vi.fn(),
// 		readPackageJson: vi.fn(),
// 	}));

// 	vi.mock("#/lib/detect-package-manager", () => ({
// 		detectPackageManager: vi.fn(),
// 	}));

// 	vi.mock("#/lib/utils", () => ({
// 		inferRootDirectory: vi.fn(),
// 	}));

// 	describe("detectMonorepo", () => {
// 		beforeEach(() => {
// 			vi.resetAllMocks();
// 		});

// 		describe("non-monorepo cases", () => {
// 			test("returns false for non-monorepo projects", async () => {
// 				vi.mocked(readPackageJson).mockResolvedValue({
// 					name: "test-project",
// 					version: "1.0.0",
// 				});

// 				const result = await detectMonorepo([
// 					"/test/project/package.json",
// 					"/test/project/README.md",
// 				]);
// 				expect(result.monorepo).toBe(false);
// 				expect(result.type).toBeNull();
// 			});

// 			test("handles empty input", async () => {
// 				const result = await detectMonorepo([]);
// 				expect(result.monorepo).toBe(false);
// 				expect(result.type).toBeNull();
// 			});

// 			test("handles invalid package.json", async () => {
// 				vi.mocked(readPackageJson).mockResolvedValue(null);
// 				const result = await detectMonorepo(["/test/project/package.json"]);
// 				expect(result.monorepo).toBe(false);
// 				expect(result.type).toBeNull();
// 			});
// 		});

// 		describe("Turborepo detection", () => {
// 			test("detects via turbo.json", async () => {
// 				const result = await detectMonorepo([
// 					"/test/project/turbo.json",
// 					"/test/project/package.json",
// 				]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("turborepo");
// 			});

// 			test("detects via package.json dependency", async () => {
// 				vi.mocked(readPackageJson).mockResolvedValue({
// 					name: "test-project",
// 					dependencies: { turbo: "^1.0.0" },
// 				});
// 				vi.mocked(hasDependency).mockReturnValue(true);

// 				const result = await detectMonorepo(["/test/project/package.json"]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("turborepo");
// 			});
// 		});

// 		describe("Lerna detection", () => {
// 			test("detects via lerna.json", async () => {
// 				const result = await detectMonorepo([
// 					"/test/project/lerna.json",
// 					"/test/project/package.json",
// 				]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("lerna");
// 			});

// 			test("detects via package.json dependency", async () => {
// 				vi.mocked(readPackageJson).mockResolvedValue({
// 					name: "test-project",
// 					dependencies: { lerna: "^1.0.0" },
// 				});

// 				const result = await detectMonorepo(["/test/project/package.json"]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("lerna");
// 			});
// 		});

// 		describe("Nx detection", () => {
// 			test("detects via nx.json", async () => {
// 				const result = await detectMonorepo([
// 					"/test/project/nx.json",
// 					"/test/project/package.json",
// 				]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("nx");
// 			});

// 			test("detects via workspace.json", async () => {
// 				const result = await detectMonorepo([
// 					"/test/project/workspace.json",
// 					"/test/project/package.json",
// 				]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("nx");
// 			});

// 			test("detects via package.json dependency", async () => {
// 				vi.mocked(readPackageJson).mockResolvedValue({
// 					name: "test-project",
// 					dependencies: { "@nx/workspace": "^1.0.0" },
// 				});

// 				const result = await detectMonorepo(["/test/project/package.json"]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("nx");
// 			});
// 		});

// 		describe("Package manager based detection", () => {
// 			test("detects npm workspaces", async () => {
// 				vi.mocked(detectPackageManager).mockResolvedValue("npm");
// 				vi.mocked(readPackageJson).mockResolvedValue({
// 					name: "test-project",
// 					workspaces: ["packages/*"],
// 				});
// 				vi.mocked(hasWorkspaces).mockReturnValue(true);

// 				const result = await detectMonorepo(["/test/project/package.json"]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("npm");
// 			});

// 			test("detects yarn workspaces", async () => {
// 				vi.mocked(detectPackageManager).mockResolvedValue("yarn");
// 				vi.mocked(readPackageJson).mockResolvedValue({
// 					name: "test-project",
// 					workspaces: ["packages/*"],
// 				});
// 				vi.mocked(hasWorkspaces).mockReturnValue(true);

// 				const result = await detectMonorepo(["/test/project/package.json"]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("yarn");
// 			});

// 			test("detects pnpm workspaces", async () => {
// 				vi.mocked(detectPackageManager).mockResolvedValue("pnpm");
// 				vi.mocked(exists).mockResolvedValue(true);

// 				const result = await detectMonorepo(["/test/project/package.json"]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("pnpm");
// 			});
// 		});

// 		describe("edge cases", () => {
// 			test("handles multiple monorepo configurations", async () => {
// 				// Should detect the first matching type in the match chain
// 				vi.mocked(exists).mockResolvedValue(true);
// 				vi.mocked(detectPackageManager).mockResolvedValue("pnpm");

// 				const result = await detectMonorepo([
// 					"/test/project/turbo.json",
// 					"/test/project/pnpm-workspace.yaml",
// 				]);
// 				expect(result.monorepo).toBe(true);
// 				expect(result.type).toBe("turborepo");
// 			});

// 			test("handles missing root directory", async () => {
// 				const result = await detectMonorepo(["/test/project/package.json"]);
// 				expect(result.monorepo).toBe(false);
// 				expect(result.type).toBeNull();
// 			});
// 		});
// 	});
// }

// /**
//  * Detects if a directory is a Turborepo monorepo
//  */
// async function detectTurborepo(filePaths: string[]): Promise<boolean> {
// 	for (const file of filePaths) {
// 		const fileName = file.split("/").pop();
// 		if (fileName === "turbo.json") return true;

// 		if (fileName === "package.json") {
// 			try {
// 				const pkg = await readPackageJson(file);
// 				if (!pkg) return false;
// 				return hasDependency(pkg, "turbo");
// 			} catch {
// 				return false;
// 			}
// 		}
// 	}
// 	return false;
// }

// /**
//  * Detects if a directory is a Lerna monorepo
//  * @param filePaths Array of file paths to check for monorepo configuration
//  */
// async function detectLerna(filePaths: string[]): Promise<boolean> {
// 	for (const file of filePaths) {
// 		const fileName = file.split("/").pop();
// 		if (fileName === "lerna.json") return true;

// 		if (fileName === "package.json") {
// 			try {
// 				const pkg = await readPackageJson(file);
// 				if (!pkg) return false;
// 				return Boolean(pkg.dependencies?.lerna || pkg.devDependencies?.lerna);
// 			} catch {
// 				return false;
// 			}
// 		}
// 	}
// 	return false;
// }

// /**
//  * Detects if a directory is an Nx monorepo
//  */
// async function detectNx(filePaths: string[]): Promise<boolean> {
// 	for (const file of filePaths) {
// 		const fileName = file.split("/").pop();
// 		if (fileName === "nx.json" || fileName === "workspace.json") return true;

// 		if (fileName === "package.json") {
// 			try {
// 				const pkg = await readPackageJson(file);
// 				if (!pkg) return false;
// 				return Boolean(
// 					pkg.dependencies?.["@nrwl/workspace"] ||
// 						pkg.devDependencies?.["@nrwl/workspace"] ||
// 						pkg.dependencies?.["@nx/workspace"] ||
// 						pkg.devDependencies?.["@nx/workspace"],
// 				);
// 			} catch {
// 				return false;
// 			}
// 		}
// 	}
// 	return false;
// }

// async function detectNpm(filePaths: string[]): Promise<boolean> {
// 	const rootDir = await inferRootDirectory(filePaths);
// 	if (!rootDir) return false;

// 	const packageManager = await detectPackageManager(rootDir);
// 	if (packageManager !== "npm") return false;

// 	const packageJson = await readPackageJson(path.join(rootDir, "package.json"));
// 	if (!packageJson) return false;

// 	return hasWorkspaces(packageJson);
// }

// async function detectYarn(filePaths: string[]): Promise<boolean> {

// 	const packageManager = await detectPackageManager(rootDir);
// 	if (packageManager !== "yarn") return false;

// 	const packageJson = await readPackageJson(path.join(rootDir, "package.json"));
// 	if (!packageJson) return false;

// 	return hasWorkspaces(packageJson);
// }

// async function detectPnpm(filePaths: string[]): Promise<boolean> {
// 	const rootDir = await inferRootDirectory(filePaths);
// 	if (!rootDir) return false;

// 	const packageManager = await detectPackageManager(rootDir);
// 	if (packageManager !== "pnpm") return false;

// 	return await exists(path.join(rootDir, "pnpm-workspace.yaml"));
// }
