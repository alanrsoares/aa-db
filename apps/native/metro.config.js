const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch the entire workspace
config.watchFolders = [workspaceRoot];

// Resolve node_modules from both the project and workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Disable hierarchical lookup to prevent conflicts
config.resolver.disableHierarchicalLookup = true;

module.exports = withNativeWind(config, {
  input: "./global.css",
});
