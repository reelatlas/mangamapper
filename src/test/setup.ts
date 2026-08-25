import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// RTL does not auto-cleanup when globals are enabled via vitest config alone.
afterEach(() => cleanup());
