"use client"

import { useEffect, useState, useCallback } from "react"
import type { Assessment, AssessmentResponse } from "@/lib/types"
import { mockAPI } from "@/lib/mock-api"

export function useAssessment(jobId: string) {
  const [data, setData] = useState<Assessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true)
      const assessment = await mockAPI.getAssessment(jobId)
      setData(assessment || null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assessment")
    } finally {
      setIsLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    fetch()
  }, [fetch])

  const update = useCallback(
    async (assessment: Assessment) => {
      try {
        const result = await mockAPI.updateAssessment(jobId, assessment)
        setData(result)
        setError(null)
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update assessment")
        throw err
      }
    },
    [jobId],
  )

  const submit = useCallback(async (response: Omit<AssessmentResponse, "id">) => {
    try {
      const result = await mockAPI.submitAssessmentResponse(response)
      setError(null)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit response")
      throw err
    }
  }, [])

  return { data, isLoading, error, update, submit, refetch: fetch }
}
