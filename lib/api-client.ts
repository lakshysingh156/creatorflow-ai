import type { GenerationInput, GenerationResult } from "./types"

export class ApiError extends Error {
  code?: string
  status: number

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function fetchGeneration(
  input: GenerationInput
): Promise<GenerationResult & { aiPowered?: boolean }> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(
      data.error ?? "Generation failed",
      response.status,
      data.code
    )
  }

  return data
}
