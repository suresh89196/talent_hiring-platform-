export interface Job {
  id: string
  title: string
  slug: string
  description?: string
  status: "active" | "archived"
  tags: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Candidate {
  id: string
  name: string
  email: string
  jobId: string
  stage: "applied" | "screen" | "tech" | "offer" | "hired" | "rejected"
  appliedAt: Date
  notes?: string
}

export interface TimelineEntry {
  id: string
  candidateId: string
  from: "applied" | "screen" | "tech" | "offer" | "hired" | "rejected" | null
  to: "applied" | "screen" | "tech" | "offer" | "hired" | "rejected"
  timestamp: Date
  reason?: string
}

export interface Assessment {
  id: string
  jobId: string
  title: string
  description?: string
  sections: AssessmentSection[]
  createdAt: Date
  updatedAt: Date
}

export interface AssessmentSection {
  id: string
  title: string
  questions: Question[]
}

export type Question =
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | ShortTextQuestion
  | LongTextQuestion
  | NumericQuestion
  | FileUploadQuestion

interface BaseQuestion {
  id: string
  title: string
  description?: string
  required: boolean
  conditional?: ConditionalLogic
}

interface ConditionalLogic {
  questionId: string
  operator: "equals" | "notEquals" | "contains"
  value: string
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: "single-choice"
  options: string[]
}

export interface MultiChoiceQuestion extends BaseQuestion {
  type: "multi-choice"
  options: string[]
}

export interface ShortTextQuestion extends BaseQuestion {
  type: "short-text"
  maxLength?: number
}

export interface LongTextQuestion extends BaseQuestion {
  type: "long-text"
  maxLength?: number
}

export interface NumericQuestion extends BaseQuestion {
  type: "numeric"
  min?: number
  max?: number
}

export interface FileUploadQuestion extends BaseQuestion {
  type: "file-upload"
  allowedFormats?: string[]
  maxSize?: number
}

export interface AssessmentResponse {
  id: string
  assessmentId: string
  candidateId: string
  responses: Record<string, any>
  submittedAt: Date
  status: "draft" | "submitted"
}
