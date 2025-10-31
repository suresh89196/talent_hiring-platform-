"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Job } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface JobModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: Job | null
  onSave: (job: Omit<Job, "id" | "createdAt" | "updatedAt">) => void
}

export default function JobModal({ open, onOpenChange, job, onSave }: JobModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (job) {
      setTitle(job.title)
      setDescription(job.description || "")
      setTags(job.tags.join(", "))
    } else {
      setTitle("")
      setDescription("")
      setTags("")
    }
    setErrors({})
  }, [job, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      title,
      description,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      status: job?.status || "active",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      order: job?.order || 0,
    })

    setTitle("")
    setDescription("")
    setTags("")
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Create New Job"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Job Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior React Developer"
            />
            {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job description..."
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tags (comma-separated)</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., React, TypeScript, Remote"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{job ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
