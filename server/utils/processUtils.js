export const runProcessWithTimeout = (
  spawnProcess,
  timeoutMs = 60 * 1000,
) => {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    let finished = false;

    const timer = setTimeout(() => {
      if (finished) {
        return;
      }

      finished = true;

      /*
       * Forcefully stop the external process.
       */
      try {
        spawnProcess.kill("SIGKILL");
      } catch {
        // Ignore process termination errors
      }

      reject(
        new Error(
          "Compression timed out. Please try a smaller or simpler file.",
        ),
      );
    }, timeoutMs);

    spawnProcess.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    spawnProcess.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    spawnProcess.on("error", (error) => {
      if (finished) {
        return;
      }

      finished = true;
      clearTimeout(timer);

      reject(error);
    });

    spawnProcess.on("close", (code) => {
      if (finished) {
        return;
      }

      finished = true;
      clearTimeout(timer);

      resolve({
        code,
        stdout,
        stderr,
      });
    });
  });
};