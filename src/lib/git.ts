import { exec } from "node:child_process";
import utils from "node:util";

const execAsync = utils.promisify(exec);

/**
 * Check if the git repository is dirty.
 * @param cwd - The current working directory.
 * @returns True if the git repository is dirty, false otherwise.
 */
export async function isGitDirty(cwd = process.cwd()): Promise<boolean> {
	try {
		const { stdout } = await execAsync("git status --short", { cwd });
		return stdout.length > 0;
	} catch (e) {
		return false;
	}
}
