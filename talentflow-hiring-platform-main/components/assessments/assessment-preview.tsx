"use client"

import type { Assessment } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AssessmentPreviewProps {
  assessment: Assessment
}

export default function AssessmentPreview({ assessment }: AssessmentPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-foreground">{assessment.title}</h3>
        {assessment.description && <p className="text-sm text-muted-foreground mt-1">{assessment.description}</p>}
      </div>

      <div className="space-y-6">
        {assessment.sections.map((section) => (
          <div key={section.id} className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>

            <div className="space-y-4">
              {section.questions.map((question) => (
                <div key={question.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {question.title}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </label>

                  {question.description && <p className="text-xs text-muted-foreground mb-3">{question.description}</p>}

                  {/* Single Choice */}
                  {question.type === "single-choice" && (
                    <div className="space-y-2">
                      {(question as any).options?.map((option: string, idx: number) => (
                        <label key={idx} className="flex items-center gap-2 text-sm">
                          <input type="radio" name={question.id} className="rounded" disabled />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Multi Choice */}
                  {question.type === "multi-choice" && (
                    <div className="space-y-2">
                      {(question as any).options?.map((option: string, idx: number) => (
                        <label key={idx} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" disabled />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Short Text */}
                  {question.type === "short-text" && <Input placeholder="Your answer" disabled />}

                  {/* Long Text */}
                  {question.type === "long-text" && (
                    <textarea
                      placeholder="Your answer"
                      disabled
                      className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-foreground text-sm"
                      rows={4}
                    />
                  )}

                  {/* Numeric */}
                  {question.type === "numeric" && (
                    <Input
                      type="number"
                      placeholder={`${(question as any).min || "Min"} - ${(question as any).max || "Max"}`}
                      disabled
                    />
                  )}

                  {/* File Upload */}
                  {question.type === "file-upload" && (
                    <div className="border border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground">
                      Click to upload file
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full" disabled>
        Submit Assessment
      </Button>
    </div>
  )
}
