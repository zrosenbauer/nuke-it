import path from "node:path";
import { exists } from "#/lib/fs.js";

export type PackageManager = "pnpm" | "yarn" | "npm";

/**
 * Detects the package manager used in a directory.
 * @param directory - The directory to detect the package manager in.
 * @returns The package manager used in the directory.
 */
export async function detectPackageManager(
	directory: string,
): Promise<PackageManager> {
	if (await exists(path.join(directory, "pnpm-lock.yaml"))) {
		return "pnpm";
	}

	if (await exists(path.join(directory, "yarn.lock"))) {
		return "yarn";
	}

	return "npm";
}

if (import.meta.vitest) {
	const { test, expect, beforeEach, describe, vi } = import.meta.vitest;

	vi.mock("#/lib/file-system.js", () => ({
		exists: vi.fn(),
	}));

	describe("detectPackageManager", () => {
		beforeEach(() => {
			vi.resetAllMocks();
		});

		test("detects pnpm when pnpm-lock.yaml exists", async () => {
			vi.mocked(exists).mockImplementation(async (path) => {
				return path.endsWith("pnpm-lock.yaml");
			});

			const result = await detectPackageManager("/test/project");
			expect(result).toBe("pnpm");
		});

		test("detects yarn when yarn.lock exists", async () => {
			vi.mocked(exists).mockImplementation(async (path) => {
				return path.endsWith("yarn.lock");
			});

			const result = await detectPackageManager("/test/project");
			expect(result).toBe("yarn");
		});

		test("defaults to npm when no lock files exist", async () => {
			vi.mocked(exists).mockImplementation(async () => false);

			const result = await detectPackageManager("/test/project");
			expect(result).toBe("npm");
		});
	});
}
