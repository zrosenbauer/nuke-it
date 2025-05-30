import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/cli.ts"],
	outDir: "dist",
	format: ["cjs", "esm"],
	dts: true,
	clean: true,
	treeshake: true,
	splitting: false,
	define: {
		"import.meta.vitest": "undefined",
	},
});
