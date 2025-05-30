import { writeFile } from "node:fs/promises";
import path from "node:path";
import { tempo } from "@joggr/tempo";
import {
	getNukeBuildsGlob,
	getNukeCacheGlob,
	getNukeNodeModulesGlob,
} from "#/nuke";

const doc = tempo()
	.h1("Globs")
	.paragraph(
		"Nuka-Code uses glob patterns to determine what to nuke. You can find the list of supported globs below.",
	)
	.alert(
		"If certain files or directories in the globs should not be nuked, you can add a `.nukeignore` file to your project to exclude them.",
		"tip",
	);

const globs = [
	{
		name: "node_modules",
		description:
			"The directory(s) where your project's dependencies are installed.",
		glob: getNukeNodeModulesGlob(),
	},
	{
		name: "build",
		description:
			"The directory(s) where your project's build artifacts are stored, such as `dist`, `out`, `build`, `bundle`, etc.",
		glob: getNukeBuildsGlob(),
	},
	{
		name: "cache",
		description:
			"The directory(s) where your project's cache is stored, such as `.turbo`, `.vite`, `.next`, etc.",
		glob: getNukeCacheGlob(),
	},
];

for (const { name, description, glob } of globs) {
	doc
		.h2(name)
		.paragraph(description)
		.bulletList(glob.map((glob) => (txt) => txt.code(glob)));
}

await writeFile(
	path.join(import.meta.dirname, "..", "docs", "globs.md"),
	doc.toString(),
);
