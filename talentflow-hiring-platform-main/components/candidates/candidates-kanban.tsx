"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import type { Candidate } from "@/lib/types"
import { mockAPI } from "@/lib/mock-api"
import { Card } from "@/components/ui/card"

const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"] as const

const STAGE_LABELS: Record<string, string> = {
  applied: "Applied",
  screen: "Screening",
  tech: "Technical",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
}

export default function CandidatesKanban() {
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null)

  // Initialize stages
  useEffect(() => {
    const initialized: Record<string, Candidate[]> = {}
    STAGES.forEach((stage) => {
      initialized[stage] = []
    })
    setCandidates(initialized)
  }, [])

  const loadCandidates = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await mockAPI.getCandidates(undefined, undefined, undefined, 1, 1000)

      const organized: Record<string, Candidate[]> = {}
      STAGES.forEach((stage) => {
        organized[stage] = []
      })

      response.data.forEach((candidate) => {
        if (organized[candidate.stage]) {
          organized[candidate.stage].push(candidate)
        }
      })

      setCandidates(organized)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidates")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCandidates()
  }, [loadCandidates])

  const handleMoveCandidate = async (candidate: Candidate, newStage: (typeof STAGES)[number]) => {
    try {
      setIsLoading(true)

      // Optimistic update
      setCandidates((prev) => ({
        ...prev,
        [candidate.stage]: prev[candidate.stage].filter((c) => c.id !== candidate.id),
        [newStage]: [...prev[newStage], { ...candidate, stage: newStage }],
      }))

      // API call
      await mockAPI.updateCandidate(candidate.id, { stage: newStage })

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move candidate")
      // Reload to reset
      await loadCandidates()
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragStart = (candidate: Candidate) => {
    setDraggedCandidate(candidate)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (stage: (typeof STAGES)[number]) => {
    if (draggedCandidate && draggedCandidate.stage !== stage) {
      handleMoveCandidate(draggedCandidate, stage)
    }
    setDraggedCandidate(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Candidates Kanban</h1>
        <p className="text-muted-foreground mt-1">Track candidates across stages with drag and drop</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>
      )}

      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {STAGES.map((stage) => (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage)}
              className="w-80 flex-shrink-0 bg-muted rounded-lg p-4"
            >
              <h2 className="font-semibold text-foreground mb-4">
                {STAGE_LABELS[stage]} ({candidates[stage]?.length || 0})
              </h2>
              <div className="space-y-3">
                {candidates[stage]?.map((candidate) => (
                  <Card
                    key={candidate.id}
                    draggable
                    onDragStart={() => handleDragStart(candidate)}
                    className={`p-3 cursor-move transition-all ${draggedCandidate?.id === candidate.id ? "opacity-50" : "hover:shadow-md"}`}
                  >
                    <p className="font-medium text-foreground">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
