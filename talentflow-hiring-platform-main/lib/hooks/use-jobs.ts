"use client"

import { useEffect, useState, useCallback } from "react"
import type { Job } from "@/lib/types"
import { mockAPI } from "@/lib/mock-api"

export function useJobs(search?: string, status?: string, sort?: string) {
  const [data, setData] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await mockAPI.getJobs(search, status, 1, 100, sort)
      setData(response.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs")
    } finally {
      setIsLoading(false)
    }
  }, [search, status, sort])

  useEffect(() => {
    fetch()
  }, [fetch])

  const create = useCallback(
    async (job: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
      try {
        const result = await mockAPI.createJob(job)
        await fetch()
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create job")
        throw err
      }
    },
    [fetch],
  )

  const update = useCallback(
    async (id: string, updates: Partial<Job>) => {
      try {
        const result = await mockAPI.updateJob(id, updates)
        await fetch()
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update job")
        throw err
      }
    },
    [fetch],
  )

  const reorder = useCallback(
    async (fromOrder: number, toOrder: number) => {
      try {
        const result = await mockAPI.reorderJobs(fromOrder, toOrder)
        setData(result)
        setError(null)
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reorder jobs")
        // Refetch to reset
        await fetch()
        throw err
      }
    },
    [fetch],
  )

  return { data, isLoading, error, create, update, reorder, refetch: fetch }
}
