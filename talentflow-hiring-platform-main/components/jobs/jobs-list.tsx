"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import type { Job } from "@/lib/types"
import { mockAPI } from "@/lib/mock-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import JobCard from "./job-card"
import JobModal from "./job-modal"

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("active")
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [draggedJob, setDraggedJob] = useState<Job | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load jobs
  const loadJobs = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await mockAPI.getJobs(search || undefined, statusFilter === "all" ? undefined : statusFilter)
      setJobs(response.data)
      setFilteredJobs(response.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs")
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  // Handle drag start
  const handleDragStart = (job: Job) => {
    setDraggedJob(job)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // Handle drop
  const handleDrop = async (targetJob: Job) => {
    if (!draggedJob || draggedJob.id === targetJob.id) {
      setDraggedJob(null)
      return
    }

    const fromIndex = jobs.findIndex((j) => j.id === draggedJob.id)
    const toIndex = jobs.findIndex((j) => j.id === targetJob.id)

    if (fromIndex === -1 || toIndex === -1) return

    try {
      setIsLoading(true)
      const reorderedJobs = await mockAPI.reorderJobs(fromIndex, toIndex)
      setJobs(reorderedJobs)
      setFilteredJobs(reorderedJobs)
      setDraggedJob(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder jobs")
      // Reload to reset state
      await loadJobs()
    } finally {
      setIsLoading(false)
    }
  }

  // Handle create/update job
  const handleSaveJob = async (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsLoading(true)

      let result
      if (selectedJob) {
        result = await mockAPI.updateJob(selectedJob.id, jobData)
      } else {
        result = await mockAPI.createJob(jobData)
      }

      await loadJobs()
      setIsModalOpen(false)
      setSelectedJob(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle archive/unarchive
  const handleToggleStatus = async (job: Job) => {
    try {
      setIsLoading(true)
      await mockAPI.updateJob(job.id, {
        status: job.status === "active" ? "archived" : "active",
      })
      await loadJobs()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs Board</h1>
          <p className="text-muted-foreground mt-1">Manage job postings and track applicants</p>
        </div>
        <Button
          onClick={() => {
            setSelectedJob(null)
            setIsModalOpen(true)
          }}
        >
          + New Job
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">Search</label>
          <Input
            placeholder="Search jobs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="col-span-1 text-center py-8 text-muted-foreground">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="col-span-1 text-center py-8 text-muted-foreground">No jobs found</div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              draggable
              onDragStart={() => handleDragStart(job)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(job)}
              className={`cursor-move transition-all ${draggedJob?.id === job.id ? "opacity-50" : ""}`}
            >
              <JobCard
                job={job}
                onEdit={() => {
                  setSelectedJob(job)
                  setIsModalOpen(true)
                }}
                onToggleStatus={() => handleToggleStatus(job)}
              />
            </div>
          ))
        )}
      </div>

      {/* Job Modal */}
      <JobModal open={isModalOpen} onOpenChange={setIsModalOpen} job={selectedJob} onSave={handleSaveJob} />
    </div>
  )
}
