"use client"

import { useEffect, useState, useCallback } from "react"
import type { Candidate } from "@/lib/types"
import { mockAPI } from "@/lib/mock-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"] as const

export default function CandidatesList() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<string | "all">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const pageSize = 50

  // Load candidates
  const loadCandidates = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await mockAPI.getCandidates(
        search || undefined,
        stageFilter === "all" ? undefined : stageFilter,
        undefined,
        page,
        pageSize,
      )
      setCandidates(response.data)
      setTotal(response.total)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidates")
    } finally {
      setIsLoading(false)
    }
  }, [search, stageFilter, page])

  useEffect(() => {
    setPage(1)
  }, [search, stageFilter])

  useEffect(() => {
    loadCandidates()
  }, [loadCandidates])

  const handleMoveCandidate = async (candidate: Candidate, newStage: (typeof STAGES)[number]) => {
    try {
      setIsLoading(true)
      await mockAPI.updateCandidate(candidate.id, { stage: newStage })
      await loadCandidates()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move candidate")
    } finally {
      setIsLoading(false)
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "screen":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "tech":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "offer":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
        <p className="text-muted-foreground mt-1">Manage and track candidate progress</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">Search</label>
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Stage</label>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          >
            <option value="all">All Stages</option>
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>
      )}

      {/* Candidates Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No candidates found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Stage</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/candidates/${candidate.id}`} className="font-medium text-primary hover:underline">
                        {candidate.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{candidate.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded ${getStageColor(candidate.stage)}`}
                      >
                        {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={candidate.stage}
                        onChange={(e) => handleMoveCandidate(candidate, e.target.value as any)}
                        className="px-2 py-1 text-sm border border-input rounded bg-background text-foreground"
                      >
                        {STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage.charAt(0).toUpperCase() + stage.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} candidates
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * pageSize >= total || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
