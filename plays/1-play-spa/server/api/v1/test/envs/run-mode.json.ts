// server/api/test/envs/run-mode.json.ts
export default defineEventHandler(() => {
  const mode = process.env.RUN_MODE ?? process.env.NODE_ENV ?? 'Nothing';
  return {
    success: true,
    data: mode,
  };
});
