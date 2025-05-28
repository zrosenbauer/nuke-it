#!/usr/bin/env node

import chalk from "chalk";
import consola from "consola";
import { glob } from "glob";
import { match } from "ts-pattern";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import ascii from "#/lib/ascii";
import {
	cleanBackup,
	hasExistingBackups,
	initialize,
	isInitialized,
} from "#/lib/project";
import { printTree } from "#/lib/tree";
import {
	getNukeEverythingGlob,
	nukeBuilds,
	nukeCache,
	nukeEverything,
	nukeNodeModules,
	rejectIgnoredFiles,
} from "#/nuke";
import { isGitDirty } from "./lib/git";

yargs(hideBin(process.argv))
	.scriptName("nuke")
	.usage(
		[
			ascii.logo,
			"\n--------------------------------------------------------------------------\n",
			`${chalk.bold.green("nuke")} - A CLI tool for ${chalk.italic("nuking")} your non-essentials aka your node_modules, cache, and build directories.`,
		].join("\n"),
	)
	.option("no-fun", {
		type: "boolean",
		description: "Do not print ascii art to the console",
	})
	.option("verbose", {
		alias: "V",
		type: "boolean",
		description: "Run with verbose output",
	})
	.showHelpOnFail(false)
	.fail((msg, err, yargs) => {
		consola.error(err.message);
		process.exit(1);
	})
	.command(
		"it",
		`Time to ${chalk.bold("NUKE IT")}! Drop the nuke on your project`,
		(yargs) => {
			return yargs
				.positional("type", {
					describe: "The type of nuke to perform",
					choices: ["all", "node_modules", "cache", "build"] as const,
					default: "all",
				})
				.positional("force", {
					describe:
						"DANGER: Bypassing safety checks is not recommended by Vault-Tec",
					type: "boolean",
					default: false,
				});
		},
		async (argv) => {
			consola.start("Nuking your project...");

			if (await isGitDirty()) {
				if (argv.force === true) {
					consola.warn(
						"You have unsaved changes, but you are forcing the nuke... good luck!",
					);
				} else {
					throw new Error("You have unsaved changes, please commit them first");
				}
			}

			// MUST be after dirty check cause we add files...
			await initialize();

			if (!(await hasExistingBackups())) {
				if (
					!(await consola.prompt(
						"This seems to be the first nuke you've dropped...make sure you know what you're doing! Do you want to continue?",
						{
							type: "confirm",
							default: false,
						},
					))
				) {
					consola.info("Aborting...");
					return;
				}
			}

			const result = true;

			if (result) {
				// const result = await match(argv.type)
				// 	.with("all", () => nukeEverything(process.cwd()))
				// 	.with("node_modules", () => nukeNodeModules(process.cwd()))
				// 	.with("cache", () => nukeCache(process.cwd()))
				// 	.with("build", () => nukeBuilds(process.cwd()))
				// 	.otherwise(() => Promise.resolve(false));

				if (argv.noFun !== true) {
					console.log(ascii.vaultBoy2);
				}
				consola.success("You successfully nuked your project, good job!");
			} else {
				consola.info(
					"Well this is awkward... nothing was nuked. Maybe you should try again?",
				);
			}
		},
	)
	.command(
		"clean",
		"Clean out the backups in the .nuke directory",
		async (argv) => {
			consola.start("Cleaning up backups...");
			await cleanBackup(process.cwd());
			consola.success("Backups cleaned");
		},
	)
	.command(
		"list",
		"List all the files that would be nuked",
		(yargs) => {
			return yargs
				.positional("type", {
					describe: "The type of nuke to perform",
					choices: ["all", "node_modules", "cache", "build"],
					default: "all",
				})
				.option("glob", {
					describe: "Show the glob patterns instead of the files",
					type: "boolean",
					default: false,
				});
		},
		async (argv) => {
			const globbed = getNukeEverythingGlob();
			if (argv.glob) {
				consola.info("The following globs will be nuked:\n");
				printList(globbed, (g) => chalk.cyan(g));
				console.log(
					"\n  (this does not include what is ignored in your .nukeignore file)",
				);
			} else {
				consola.info("The following files & directories will be nuked:\n");
				const finalGlobbed = globbed.map((g) => {
					if (argv.verbose) {
						return `${g}/**/*`;
					}
					return g;
				});

				const found = await glob(finalGlobbed, {
					root: process.cwd(),
					includeChildMatches: argv.verbose,
				});
				printTree(await rejectIgnoredFiles(found, process.cwd()));
			}
		},
	)
	.command("init", "Initialize the project", async (argv) => {
		if (await isInitialized(process.cwd())) {
			consola.success("Project already initialized");
			return;
		}

		await initialize(process.cwd(), true);
		consola.success("Project initialized");
	})
	.parse();

function printList(items: string[], transform = (i: string) => i) {
	console.log(items.map((i) => `  • ${chalk.red(transform(i))}`).join("\n"));
}
