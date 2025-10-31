"use client"

import { useState, useEffect } from "react"
import type { Assessment, AssessmentSection } from "@/lib/types"
import { mockAPI } from "@/lib/mock-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AssessmentPreview from "./assessment-preview"
import SectionBuilder from "./section-builder"

interface AssessmentBuilderProps {
  jobId: string
}

export default function AssessmentBuilder({ jobId }: AssessmentBuilderProps) {
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    async function loadAssessment() {
      try {
        setIsLoading(true)
        const existing = await mockAPI.getAssessment(jobId)
        if (existing) {
          setAssessment(existing)
        } else {
          // Create new assessment
          const newAssessment: Assessment = {
            id: `assessment-${Date.now()}`,
            jobId,
            title: "New Assessment",
            description: "",
            sections: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          setAssessment(newAssessment)
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load assessment")
      } finally {
        setIsLoading(false)
      }
    }

    loadAssessment()
  }, [jobId])

  const handleAddSection = () => {
    if (!assessment) return

    const newSection: AssessmentSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      questions: [],
    }

    setAssessment({
      ...assessment,
      sections: [...assessment.sections, newSection],
    })
  }

  const handleUpdateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    if (!assessment) return

    setAssessment({
      ...assessment,
      sections: assessment.sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
    })
  }

  const handleDeleteSection = (sectionId: string) => {
    if (!assessment) return

    setAssessment({
      ...assessment,
      sections: assessment.sections.filter((s) => s.id !== sectionId),
    })
  }

  const handleSaveAssessment = async () => {
    if (!assessment) return

    try {
      setIsLoading(true)
      await mockAPI.updateAssessment(jobId, assessment)
      setError(null)
      alert("Assessment saved successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save assessment")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return <div className="text-destructive">Failed to load assessment</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Builder Side */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessment Builder</h1>
          <p className="text-muted-foreground mt-1">Create assessments for job candidates</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>
        )}

        {/* Assessment Title */}
        <div className="border border-border rounded-lg p-4 bg-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Assessment Title</label>
            <Input value={assessment.title} onChange={(e) => setAssessment({ ...assessment, title: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={assessment.description || ""}
              onChange={(e) => setAssessment({ ...assessment, description: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Optional description for candidates"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Sections</h2>
            <Button onClick={handleAddSection} variant="outline">
              + Add Section
            </Button>
          </div>

          {assessment.sections.map((section, idx) => (
            <SectionBuilder
              key={section.id}
              section={section}
              sectionIndex={idx}
              onUpdate={(updates) => handleUpdateSection(section.id, updates)}
              onDelete={() => handleDeleteSection(section.id)}
            />
          ))}

          {assessment.sections.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No sections yet. Add one to get started.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSaveAssessment} disabled={isLoading}>
            Save Assessment
          </Button>
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Hide" : "Show"} Preview
          </Button>
        </div>
      </div>

      {/* Preview Side */}
      {showPreview && (
        <div className="border border-border rounded-lg p-6 bg-card h-fit sticky top-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Preview</h2>
          <AssessmentPreview assessment={assessment} />
        </div>
      )}
    </div>
  )
}
