import { vi } from "vitest";

type MockedFunction<T extends (...args: unknown[]) => unknown> = T &
  vi.Mock<Parameters<T>, ReturnType<T>>;

type Mocked<T> = {
  [P in keyof T]: T[P] extends (...args: unknown[]) => unknown
    ? MockedFunction<T[P]>
    : T[P] extends object
    ? Mocked<T[P]>
    : T[P];
};

declare global {
  namespace vi {
    function mocked<T>(item: T): Mocked<T>;
  }
}
