export type ApiEchoBody = {
  status: number;
  header: Record<string, string>;
  body: SafeAny;
};
