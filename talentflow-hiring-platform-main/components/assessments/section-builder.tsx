"use client"

import { useState } from "react"
import type { AssessmentSection, Question } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import QuestionBuilder from "./question-builder"
import { Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface SectionBuilderProps {
  section: AssessmentSection
  sectionIndex: number
  onUpdate: (updates: Partial<AssessmentSection>) => void
  onDelete: () => void
}

export default function SectionBuilder({ section, sectionIndex, onUpdate, onDelete }: SectionBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: "short-text",
      title: "New Question",
      required: true,
    } as Question

    onUpdate({
      questions: [...section.questions, newQuestion],
    })
  }

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    onUpdate({
      questions: section.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
    })
  }

  const handleDeleteQuestion = (questionId: string) => {
    onUpdate({
      questions: section.questions.filter((q) => q.id !== questionId),
    })
  }

  return (
    <Card className="border-2">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-foreground hover:bg-muted rounded p-1">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <div className="flex-1">
            <Input
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Section title"
              className="font-semibold"
            />
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
          <Trash2 size={16} />
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {section.questions.map((question, idx) => (
            <QuestionBuilder
              key={question.id}
              question={question}
              questionIndex={idx}
              onUpdate={(updates) => handleUpdateQuestion(question.id, updates)}
              onDelete={() => handleDeleteQuestion(question.id)}
            />
          ))}

          {section.questions.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No questions in this section</p>
          )}

          <Button onClick={handleAddQuestion} variant="outline" className="w-full bg-transparent">
            + Add Question
          </Button>
        </div>
      )}
    </Card>
  )
}
