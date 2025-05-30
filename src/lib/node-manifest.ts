import { readFile } from "node:fs/promises";
import { P, match } from "ts-pattern";
import type * as TF from "type-fest";

/**
 * Reads the package.json file at the given path and returns null if it fails.
 * @param path - The path to the package.json file.
 * @returns The parsed package.json object or null if the file cannot be read or parsed.
 */
export async function readPackageJson(
	path: string,
): Promise<TF.PackageJson | null> {
	try {
		return await readPackageJsonOrThrow(path);
	} catch (error) {
		return null;
	}
}

/**
 * Reads the package.json file at the given path and throws an error if it fails.
 * @param path - The path to the package.json file.
 * @returns The parsed package.json object.
 * @throws An error if the package.json file cannot be read or parsed.
 */
export async function readPackageJsonOrThrow(
	path: string,
): Promise<TF.PackageJson> {
	const packageJson = await readFile(path, "utf8");
	return JSON.parse(packageJson);
}

if (import.meta.vitest) {
	const { test, expect, vi, describe, beforeEach, beforeAll } = import.meta
		.vitest;

	describe("package.json", () => {
		beforeAll(() => {
			vi.mock("node:fs/promises", () => ({
				readFile: vi.fn(),
			}));
		});

		beforeEach(() => {
			vi.clearAllMocks();
		});

		test("readPackageJson returns package.json object", async () => {
			const mockPackageJson = {
				name: "test-project",
				version: "1.0.0",
				dependencies: {
					"test-dep": "^1.0.0",
				},
			};

			vi.mocked(readFile).mockResolvedValueOnce(
				JSON.stringify(mockPackageJson),
			);

			const result = await readPackageJson("/test/project/package.json");
			expect(result).toEqual(mockPackageJson);
			expect(readFile).toHaveBeenCalledWith(
				"/test/project/package.json",
				"utf8",
			);
		});

		test("readPackageJson returns null if file does not exist or errored", async () => {
			vi.mocked(readFile).mockRejectedValueOnce(new Error("File not found"));

			const result = await readPackageJson("/test/project/does-not-exist.json");
			expect(result).toBeNull();
			expect(readFile).toHaveBeenCalledWith(
				"/test/project/does-not-exist.json",
				"utf8",
			);
		});

		test("readPackageJsonOrThrow throws error if file does not exist or errored", async () => {
			vi.mocked(readFile).mockRejectedValueOnce(new Error("File not found"));

			await expect(
				readPackageJsonOrThrow("/test/project/does-not-exist.json"),
			).rejects.toThrow("File not found");
			expect(readFile).toHaveBeenCalledWith(
				"/test/project/does-not-exist.json",
				"utf8",
			);
		});
	});
}

/**
 * Checks if the file paths contain a lockfile.
 * @param filePaths - The file paths to check.
 * @returns True if the file paths contain a lockfile, false otherwise.
 */
export function hasLockfile(filePaths: string[]) {
	return filePaths.some((filePath) => {
		return match(filePath)
			.with("pnpm-lock.yaml", () => true)
			.with("yarn.lock", () => true)
			.with("package-lock.json", () => true)
			.otherwise(() => false);
	});
}

/**
 * Checks if a dependency is present in the package.json file.
 * @param packageJson - The package.json file to check.
 * @param dependency - The dependency to check for.
 * @returns An object with the types of the dependency and whether it is present.
 */
export function hasDependency(
	packageJson: TF.PackageJson,
	dependency: string,
): boolean {
	const devDeps = packageJson.devDependencies
		? Object.keys(packageJson.devDependencies)
		: [];
	const prodDeps = packageJson.dependencies
		? Object.keys(packageJson.dependencies)
		: [];

	return devDeps.includes(dependency) || prodDeps.includes(dependency);
}

if (import.meta.vitest) {
	const { test, expect, describe } = import.meta.vitest;

	describe("hasDependency", () => {
		test("returns true if dependency is present in devDependencies", () => {
			const packageJson = {
				devDependencies: {
					"test-dep": "^1.0.0",
				},
			};

			const result = hasDependency(packageJson, "test-dep");
			expect(result).toBe(true);
		});

		test("returns false if dependency is not present in devDependencies", () => {
			const packageJson = {
				devDependencies: {
					"test-dep": "^1.0.0",
				},
			};

			const result = hasDependency(packageJson, "not-a-dep");
			expect(result).toBe(false);
		});
	});
}

/**
 * Checks if the package.json file has workspaces.
 * @param packageJson - The package.json file to check.
 * @returns True if the package.json file has workspaces, false otherwise.
 */
export function hasWorkspaces(packageJson: TF.PackageJson): boolean {
	return match(packageJson)
		.with({ workspaces: P.nullish }, () => false)
		.with({ workspaces: P.array() }, ({ workspaces }) => workspaces.length > 0)
		.with(
			{ workspaces: P.shape({ packages: P.array() }) },
			({ workspaces }) => workspaces.packages.length > 0,
		)
		.otherwise(() => false);
}

if (import.meta.vitest) {
	const { test, expect, describe } = import.meta.vitest;

	describe("hasWorkspaces", () => {
		test("returns true if workspaces is an array", () => {
			const packageJson = {
				workspaces: ["packages/*"],
			};

			const result = hasWorkspaces(packageJson);
			expect(result).toBe(true);
		});

		test("returns true if workspaces is an object with packages", () => {
			const packageJson = {
				workspaces: {
					packages: ["packages/*"],
				},
			};

			const result = hasWorkspaces(packageJson);
			expect(result).toBe(true);
		});

		test("returns false if workspaces is not an array or object", () => {
			const packageJson = {
				workspaces: undefined,
			} as TF.PackageJson;

			const result = hasWorkspaces(packageJson);
			expect(result).toBe(false);
		});
	});
}
