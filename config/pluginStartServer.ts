import type { RsbuildPlugin } from '@rsbuild/core';
import { type ChildProcess, spawn } from 'node:child_process';
import { once } from 'node:events';

interface StartServerOptions {
  /** Environment whose output is the server bundle */
  environmentName: string;
  /** Built server file to run */
  serverScript: string;
  /** Port the server should listen on */
  serverPort: number;
}

/**
 * Runs the built SSR server in dev, and restarts it after each server rebuild.
 *
 * Replaces Razzle's StartServerPlugin. It restarts the process instead of
 * using server-side HMR. Set `INSPECT` or `INSPECT_BRK` to pass that flag to node.
 *
 * @example
 * ```ts
 * pluginStartServer({
 *   environmentName: 'node',
 *   serverScript: 'build/server.js',
 *   serverPort: 3001,
 * });
 * ```
 */
export function pluginStartServer(options: StartServerOptions): RsbuildPlugin {
  const { environmentName, serverScript, serverPort } = options;
  return {
    name: 'cord:start-server',
    apply: 'serve',
    setup(api) {
      let serverProcess: ChildProcess | undefined;
      let serverExited: Promise<unknown> = Promise.resolve();

      async function stopServer() {
        const isRunning =
          serverProcess?.exitCode === null && serverProcess.signalCode === null;
        if (isRunning) {
          serverProcess?.kill('SIGTERM');
        }
        await serverExited;
      }

      async function restartServer() {
        await stopServer();
        const inspectFlag = process.env.INSPECT_BRK || process.env.INSPECT;
        serverProcess = spawn(
          process.execPath,
          [...(inspectFlag ? [inspectFlag] : []), serverScript],
          {
            stdio: 'inherit',
            env: { ...process.env, SERVER_PORT: String(serverPort) },
          }
        );
        // Created at spawn, so it still resolves if the exit already happened
        serverExited = once(serverProcess, 'exit');
      }

      api.onAfterEnvironmentCompile(async ({ environment, stats }) => {
        if (environment.name !== environmentName || stats?.hasErrors()) {
          return;
        }
        await restartServer();
      });

      api.onCloseDevServer(stopServer);
      api.onExit(() => {
        serverProcess?.kill('SIGKILL');
      });
    },
  };
}
