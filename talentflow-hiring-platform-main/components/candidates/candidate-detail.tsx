"use client"

import { useEffect, useState } from "react"
import type { Candidate, TimelineEntry } from "@/lib/types"
import { mockAPI } from "@/lib/mock-api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface CandidateDetailProps {
  candidateId: string
}

const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"] as const

export default function CandidateDetail({ candidateId }: CandidateDetailProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [cand, timelineData] = await Promise.all([
          mockAPI.getCandidate(candidateId),
          mockAPI.getCandidateTimeline(candidateId),
        ])
        setCandidate(cand || null)
        setTimeline(timelineData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load candidate")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [candidateId])

  const handleMoveCandidate = async (newStage: (typeof STAGES)[number]) => {
    if (!candidate) return

    try {
      setIsLoading(true)
      await mockAPI.updateCandidate(candidate.id, { stage: newStage })
      const updated = await mockAPI.getCandidate(candidateId)
      setCandidate(updated || null)

      const timelineData = await mockAPI.getCandidateTimeline(candidateId)
      setTimeline(timelineData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update candidate")
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground">Loading candidate...</p>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Candidate not found</p>
        <Link href="/candidates">
          <Button>Back to Candidates</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back Button */}
      <Link href="/candidates" className="flex items-center gap-2 text-primary hover:underline">
        <ChevronLeft size={16} />
        Back to Candidates
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{candidate.name}</h1>
        <p className="text-muted-foreground mt-1">{candidate.email}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>
      )}

      {/* Current Status Card */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Current Status</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Stage</p>
            <p
              className={`text-lg font-semibold mt-1 inline-block px-3 py-1 rounded ${getStageColor(candidate.stage)}`}
            >
              {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
            </p>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Move to Stage</label>
            <select
              value={candidate.stage}
              onChange={(e) => handleMoveCandidate(e.target.value as any)}
              disabled={isLoading}
              className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            >
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Progress Timeline</h2>
        <div className="space-y-4">
          {timeline.length === 0 ? (
            <p className="text-muted-foreground">No timeline events yet</p>
          ) : (
            timeline.map((entry, idx) => (
              <div key={entry.id} className="flex gap-4">
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  {idx < timeline.length - 1 && <div className="w-0.5 h-12 bg-border mt-2"></div>}
                </div>

                {/* Timeline content */}
                <div className="pb-4">
                  <p className="text-sm font-medium text-foreground">
                    {entry.from && entry.to ? `${entry.from} → ${entry.to}` : `Started as ${entry.to}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Notes</h2>
        <p className="text-foreground whitespace-pre-wrap">{candidate.notes || "No notes yet"}</p>
      </div>
    </div>
  )
}
