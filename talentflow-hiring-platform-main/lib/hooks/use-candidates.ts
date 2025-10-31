"use client"

import { useEffect, useState, useCallback } from "react"
import type { Candidate } from "@/lib/types"
import { mockAPI } from "@/lib/mock-api"

export function useCandidates(search?: string, stage?: string, jobId?: string, page?: number, pageSize?: number) {
  const [data, setData] = useState<Candidate[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await mockAPI.getCandidates(search, stage, jobId, page, pageSize)
      setData(response.data)
      setTotal(response.total)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch candidates")
    } finally {
      setIsLoading(false)
    }
  }, [search, stage, jobId, page, pageSize])

  useEffect(() => {
    fetch()
  }, [fetch])

  const update = useCallback(
    async (id: string, updates: Partial<Candidate>) => {
      try {
        await mockAPI.updateCandidate(id, updates)
        // Refetch to get fresh data
        await fetch()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update candidate")
        throw err
      }
    },
    [fetch],
  )

  return { data, total, isLoading, error, update, refetch: fetch }
}
