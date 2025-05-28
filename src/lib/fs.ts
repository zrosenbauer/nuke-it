import { constants } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";

/**
 * Checks if a file exists.
 * @param filePath - The path to the file.
 * @returns True if the file exists, false otherwise.
 */
export async function exists(filePath: string): Promise<boolean> {
	try {
		await access(filePath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

if (import.meta.vitest) {
	const { test, expect, describe } = import.meta.vitest;

	describe("exists", () => {
		test("returns true if file exists", async () => {
			const rootDir = path.join(import.meta.dirname, "..", "..");
			const result = await exists(path.join(rootDir, "package.json"));
			expect(result).toBe(true);
		});
	});
}
