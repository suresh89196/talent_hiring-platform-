"use client"

import type { Job } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Archive, Edit2, ArchiveRestore } from "lucide-react"

interface JobCardProps {
  job: Job
  onEdit: () => void
  onToggleStatus: () => void
}

export default function JobCard({ job, onEdit, onToggleStatus }: JobCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
          <div className="flex gap-2 mt-3">
            {job.tags.map((tag) => (
              <span key={tag} className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-3">
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                job.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              {job.status === "active" ? "Active" : "Archived"}
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit2 size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={onToggleStatus}>
            {job.status === "active" ? <Archive size={16} /> : <ArchiveRestore size={16} />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
