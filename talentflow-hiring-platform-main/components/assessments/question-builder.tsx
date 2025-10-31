"use client"

import type { Question } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, X } from "lucide-react"

interface QuestionBuilderProps {
  question: Question
  questionIndex: number
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
}

const QUESTION_TYPES = [
  { value: "single-choice", label: "Single Choice" },
  { value: "multi-choice", label: "Multiple Choice" },
  { value: "short-text", label: "Short Text" },
  { value: "long-text", label: "Long Text" },
  { value: "numeric", label: "Numeric" },
  { value: "file-upload", label: "File Upload" },
]

export default function QuestionBuilder({ question, questionIndex, onUpdate, onDelete }: QuestionBuilderProps) {
  const handleAddOption = () => {
    if (question.type === "single-choice" || question.type === "multi-choice") {
      const options = (question as any).options || []
      onUpdate({
        ...question,
        options: [...options, ""],
      })
    }
  }

  const handleUpdateOption = (optionIdx: number, value: string) => {
    if (question.type === "single-choice" || question.type === "multi-choice") {
      const options = (question as any).options || []
      onUpdate({
        ...question,
        options: options.map((o: string, idx: number) => (idx === optionIdx ? value : o)),
      })
    }
  }

  const handleRemoveOption = (optionIdx: number) => {
    if (question.type === "single-choice" || question.type === "multi-choice") {
      const options = (question as any).options || []
      onUpdate({
        ...question,
        options: options.filter((_: string, idx: number) => idx !== optionIdx),
      })
    }
  }

  return (
    <Card className="p-4 bg-muted/30">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-2">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Input
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Question title"
                className="flex-1 font-medium"
              />
              <select
                value={question.type}
                onChange={(e) => onUpdate({ type: e.target.value as Question["type"] })}
                className="px-2 py-1 border border-input rounded-lg bg-background text-foreground text-sm"
              >
                {QUESTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <Input
              value={(question as any).description || ""}
              onChange={(e) => onUpdate({ description: e.target.value } as any)}
              placeholder="Description (optional)"
              className="text-sm"
            />
          </div>

          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
            <Trash2 size={16} />
          </Button>
        </div>

        {/* Question Type Specific Fields */}
        {(question.type === "single-choice" || question.type === "multi-choice") && (
          <div className="space-y-2 border-t border-border pt-4">
            <label className="text-sm font-medium text-foreground">Options</label>
            {((question as any).options || []).map((option: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <Input value={option} onChange={(e) => handleUpdateOption(idx, e.target.value)} placeholder="Option" />
                <Button variant="ghost" size="sm" onClick={() => handleRemoveOption(idx)}>
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button onClick={handleAddOption} variant="outline" size="sm" className="w-full bg-transparent">
              <Plus size={14} className="mr-1" /> Add Option
            </Button>
          </div>
        )}

        {(question.type === "short-text" || question.type === "long-text") && (
          <div className="space-y-2 border-t border-border pt-4">
            <label className="text-sm font-medium text-foreground">Max Length</label>
            <Input
              type="number"
              value={(question as any).maxLength || ""}
              onChange={(e) => onUpdate({ maxLength: Number.parseInt(e.target.value) || undefined } as any)}
              placeholder="Leave blank for unlimited"
            />
          </div>
        )}

        {question.type === "numeric" && (
          <div className="space-y-2 border-t border-border pt-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Min Value</label>
                <Input
                  type="number"
                  value={(question as any).min || ""}
                  onChange={(e) => onUpdate({ min: Number.parseInt(e.target.value) || undefined } as any)}
                  placeholder="Min"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Max Value</label>
                <Input
                  type="number"
                  value={(question as any).max || ""}
                  onChange={(e) => onUpdate({ max: Number.parseInt(e.target.value) || undefined } as any)}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        )}

        {/* Common Options */}
        <div className="border-t border-border pt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            id={`required-${question.id}`}
            className="rounded"
          />
          <label htmlFor={`required-${question.id}`} className="text-sm text-foreground cursor-pointer">
            Required Question
          </label>
        </div>
      </div>
    </Card>
  )
}
