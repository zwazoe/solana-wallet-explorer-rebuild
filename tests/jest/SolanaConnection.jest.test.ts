import { afterEach, expect, jest, test } from "@jest/globals";

import { SolanaConnection } from "../../src/SolanaConnection";

// Restore real times after each test.
afterEach(() => {
  jest.useRealTimers();
});

// Test 1: Scuceeds immidiately

test("RPC succeeds on first attempt", async () => {
  const connection = new SolanaConnection();

  const operation = jest.fn(async () => "Success");

  const result = await connection.retry(operation);

  expect(result).toBe("Success");
  expect(operation).toHaveBeenCalledTimes(1);
});

// Test 2: Failes once, the succeeds.
test("RPC succeeds after one retry", async () => {
  jest.useFakeTimers();

  const connection = new SolanaConnection();
  let attempt = 0;

  const operation = jest.fn(async () => {
    attempt++;
    if (attempt === 1) {
      throw new Error("Temporary RPC failure");
    }
    return "Success";
  });

  const resultPromise = connection.retry(operation);

  // Advance past our first Finoacci delay
  await jest.advanceTimersByTimeAsync(1000);

  const result = await resultPromise;

  expect(result).toBe("Success");
  expect(operation).toHaveBeenCalledTimes(2);
});

// Test 3: Faills after all retry attempts.

test("RPC fails after all attempts", async () => {
  jest.useFakeTimers();
  const connection = new SolanaConnection();

  const operation = jest.fn(async () => {
    throw new Error("RPC unavailable");
  });
  const resultPromise = connection.retry(operation);

  const failure = expect(resultPromise).rejects.toThrow(
    "RPC requests failed after all attempts",
  );

  // Simulate every fibonaccie retry delay

  const delays = [1000, 2000, 3000, 5000, 8000, 16000];

  for (const delay of delays) {
    await jest.advanceTimersByTimeAsync(delay);
  }

  await failure;

  expect(operation).toHaveBeenCalledTimes(7);
});
