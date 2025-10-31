"use client"

import { useState } from "react"
import MainLayout from "@/components/layout/main-layout"
import AssessmentBuilder from "@/components/assessments/assessment-builder"

export default function AssessmentsPage() {
  const [selectedJobId, setSelectedJobId] = useState("job-1")

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessment Builder</h1>
          <p className="text-muted-foreground mt-1">Create and manage job assessments</p>
        </div>

        <div className="max-w-xs">
          <label className="block text-sm font-medium text-foreground mb-2">Select Job</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          >
            {[...Array(25)].map((_, i) => (
              <option key={`job-${i + 1}`} value={`job-${i + 1}`}>
                Job {i + 1}
              </option>
            ))}
          </select>
        </div>

        <AssessmentBuilder key={selectedJobId} jobId={selectedJobId} />
      </div>
    </MainLayout>
  )
}
