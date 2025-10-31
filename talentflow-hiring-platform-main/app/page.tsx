"use client"

import { useEffect, useState } from "react"
import { initDB } from "@/lib/db"
import { generateJobs, generateCandidates, generateAssessments } from "@/lib/seed-data"
import { mockAPI } from "@/lib/mock-api"
import MainLayout from "@/components/layout/main-layout"
import JobsList from "@/components/jobs/jobs-list"

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initialize() {
      try {
        // Initialize database
        await initDB()

        // Check if we need to seed data
        const jobs = await mockAPI.getJobs()
        if (jobs.data.length === 0) {
          // Generate and initialize seed data
          const seedJobs = generateJobs()
          const seedCandidates = generateCandidates(seedJobs)
          const seedAssessments = generateAssessments(seedJobs)

          await mockAPI.initializeData(seedJobs, seedCandidates, seedAssessments)
          console.log("[v0] Data initialized successfully")
        }

        setIsLoading(false)
      } catch (err) {
        console.error("[v0] Initialization error:", err)
        setError(err instanceof Error ? err.message : "Failed to initialize app")
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-foreground">Initializing TalentFlow...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <JobsList />
    </MainLayout>
  )
}
