import { glob } from "glob";
import ignore from "ignore";
import { rimraf } from "rimraf";
import { P, match } from "ts-pattern";
import { readIgnoreFile } from "#/lib/project";
import { toGlob, unique } from "#/lib/utils";

/**
 * Nuke everything.
 * @param rootDir - The root directory of the project.
 * @returns The paths to the directories that should be nuked.
 */
export async function nukeEverything(rootDir = process.cwd()) {
	const cache = await nukeCache(rootDir);
	const builds = await nukeBuilds(rootDir);
	// MUST BE LAST or this breaks it cause we are NUKING node_modules
	const nodeModules = await nukeNodeModules(rootDir);
	return [cache, builds, nodeModules].every((result) => result);
}

/**
 * Nuke the node_modules directories.
 * @param rootDir - The root directory of the project.
 * @returns The paths to the node_modules directories that should be nuked.
 */
export async function nukeNodeModules(rootDir = process.cwd()) {
	const found = await glob(getNukeNodeModulesGlob(), {
		root: rootDir,
	});
	return await rimraf(await rejectIgnoredFiles(found, rootDir), {
		glob: true,
	});
}

/**
 * Nuke the cache directories.
 * @param rootDir - The root directory of the project.
 * @returns The paths to the cache directories that should be nuked.
 */
export async function nukeCache(rootDir = process.cwd()) {
	const found = await glob(getNukeCacheGlob(), {
		root: rootDir,
	});
	return await rimraf(await rejectIgnoredFiles(found, rootDir), {
		glob: false,
	});
}

/**
 * Nuke the build directories.
 * @param rootDir - The root directory of the project.
 * @returns The paths to the build directories that should be nuked.
 */
export async function nukeBuilds(rootDir = process.cwd()) {
	const found = await glob(getNukeBuildsGlob(), {
		root: rootDir,
	});
	return await rimraf(await rejectIgnoredFiles(found, rootDir), {
		glob: false,
	});
}

/**
 * Nuke everything.
 * @returns The glob patterns to the directories that should be nuked.
 */
export function getNukeEverythingGlob() {
	return unique([
		...getNukeNodeModulesGlob(),
		...getNukeCacheGlob(),
		...getNukeBuildsGlob(),
	]);
}

/**
 * Get the glob patterns to the node_modules.
 * @returns The glob patterns to the directories that should be nuked.
 */
export function getNukeNodeModulesGlob() {
	return toGlob(["node_modules"]);
}

/**
 * Get the glob patterns to the cache.
 * @returns The glob patterns to the directories that should be nuked.
 */
export function getNukeCacheGlob() {
	return toGlob([".turbo", ".nx/cache"]);
}

/**
 * Get the glob patterns to the builds.
 * @returns The glob patterns to the directories that should be nuked.
 */
export function getNukeBuildsGlob() {
	return toGlob([
		"dist",
		"out",
		"output",
		"outputs",
		"bundle",

		// Frameworks
		".vercel",
		".next",
		".nuxt",
		".svelte-kit",
		".vinxi",
		".vuepress/dist",
		"storybook-static",
		"coverage",
		"public/build",
	]);
}

/**
 * Reject ignored files.
 * @param filePaths - The file paths to check.
 * @param rootDir - The root directory of the project.
 * @returns The file paths that should be nuked.
 */
export async function rejectIgnoredFiles(
	filePaths: string[],
	rootDir = process.cwd(),
) {
	const ignoreFile = await readIgnoreFile(rootDir);
	if (!ignoreFile) {
		return filePaths;
	}

	// return filePaths;
	return ignore().add(ignoreFile).filter(filePaths);
}
