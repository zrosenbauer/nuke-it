import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		includeSource: ["src/**/*.ts"],
		environment: "node",
	},
	define: {
		"import.meta.vitest": "undefined",
	},
});
