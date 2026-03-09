/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';
import path from 'path';

Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((currentConfig) => {
  const config = enableTailwind(currentConfig);
  const projectRoot = process.cwd();
  config.resolve ??= {};
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(projectRoot, 'src/imported-site/site'),
    next: path.resolve(projectRoot, 'src/imported-site/site/runtime/next'),
  };
  return config;
});
