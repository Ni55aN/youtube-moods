export async function retry<T>({ retries, fn, log }: { retries: number, fn: () => Promise<T>, log: () => void }): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    if (retries > 0) {
      log()
      return await retry({ retries: retries - 1, fn, log })
    } else {
      throw e
    }
  }
}