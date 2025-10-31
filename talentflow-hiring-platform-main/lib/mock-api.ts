import type { Job, Candidate, Assessment, TimelineEntry, AssessmentResponse } from "./types"
import { dbGet, dbPut, dbGetAll, dbClear } from "./db"
import { syncManager } from "./sync-manager"

const STORES = {
  jobs: "jobs",
  candidates: "candidates",
  timeline: "timeline",
  assessments: "assessments",
  responses: "responses",
}

// Simulate network latency
async function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Simulate occasional errors
function shouldError(errorRate = 0.05): boolean {
  return Math.random() < errorRate
}

export const mockAPI = {
  // Jobs API
  async getJobs(search?: string, status?: string, page?: number, pageSize?: number, sort?: string) {
    await delay(200 + Math.random() * 1000)

    let jobs = await dbGetAll<Job>(STORES.jobs)

    if (search) {
      jobs = jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()))
    }

    if (status) {
      jobs = jobs.filter((j) => j.status === status)
    }

    if (sort === "title") {
      jobs.sort((a, b) => a.title.localeCompare(b.title))
    } else {
      jobs.sort((a, b) => a.order - b.order)
    }

    // After successful fetch, track sync
    await syncManager.recordSync()
    return {
      data: jobs,
      total: jobs.length,
      page: page || 1,
      pageSize: pageSize || 25,
    }
  },

  async getJob(id: string) {
    await delay(200 + Math.random() * 500)
    return dbGet<Job>(STORES.jobs, id)
  },

  async createJob(job: Omit<Job, "id" | "createdAt" | "updatedAt">) {
    if (shouldError(0.05)) {
      throw new Error("Failed to create job")
    }

    await delay(300 + Math.random() * 700)

    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await dbPut(STORES.jobs, newJob)
    await syncManager.persistJob(newJob)
    return newJob
  },

  async updateJob(id: string, updates: Partial<Job>) {
    if (shouldError(0.05)) {
      throw new Error("Failed to update job")
    }

    await delay(200 + Math.random() * 600)

    const job = await dbGet<Job>(STORES.jobs, id)
    if (!job) throw new Error("Job not found")

    const updated = { ...job, ...updates, updatedAt: new Date() }
    await dbPut(STORES.jobs, updated)
    await syncManager.persistJob(updated)
    return updated
  },

  async reorderJobs(fromOrder: number, toOrder: number) {
    if (shouldError(0.08)) {
      throw new Error("Failed to reorder jobs")
    }

    await delay(300 + Math.random() * 900)

    const jobs = await dbGetAll<Job>(STORES.jobs)
    const sorted = jobs.sort((a, b) => a.order - b.order)

    if (fromOrder >= sorted.length || toOrder >= sorted.length) {
      throw new Error("Invalid order indices")
    }

    const [job] = sorted.splice(fromOrder, 1)
    sorted.splice(toOrder, 0, job)

    for (let i = 0; i < sorted.length; i++) {
      sorted[i].order = i
      await dbPut(STORES.jobs, sorted[i])
    }

    return sorted
  },

  // Candidates API
  async getCandidates(search?: string, stage?: string, jobId?: string, page?: number, pageSize?: number) {
    await delay(200 + Math.random() * 1000)

    let candidates = await dbGetAll<Candidate>(STORES.candidates)

    if (search) {
      candidates = candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (stage) {
      candidates = candidates.filter((c) => c.stage === stage)
    }

    if (jobId) {
      candidates = candidates.filter((c) => c.jobId === jobId)
    }

    const start = ((page || 1) - 1) * (pageSize || 50)
    const end = start + (pageSize || 50)

    return {
      data: candidates.slice(start, end),
      total: candidates.length,
      page: page || 1,
      pageSize: pageSize || 50,
    }
  },

  async getCandidate(id: string) {
    await delay(200 + Math.random() * 500)
    return dbGet<Candidate>(STORES.candidates, id)
  },

  async getCandidateTimeline(candidateId: string) {
    await delay(200 + Math.random() * 500)
    const timeline = await dbGetAll<TimelineEntry>(STORES.timeline)
    return timeline
      .filter((t) => t.candidateId === candidateId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  },

  async createCandidate(candidate: Omit<Candidate, "id">) {
    if (shouldError(0.05)) {
      throw new Error("Failed to create candidate")
    }

    await delay(300 + Math.random() * 700)

    const newCandidate: Candidate = {
      ...candidate,
      id: `candidate-${Date.now()}`,
    }

    await dbPut(STORES.candidates, newCandidate)
    return newCandidate
  },

  async updateCandidate(id: string, updates: Partial<Candidate>) {
    if (shouldError(0.05)) {
      throw new Error("Failed to update candidate")
    }

    await delay(200 + Math.random() * 600)

    const candidate = await dbGet<Candidate>(STORES.candidates, id)
    if (!candidate) throw new Error("Candidate not found")

    const updated = { ...candidate, ...updates }

    // Record stage change in timeline
    if (updates.stage && updates.stage !== candidate.stage) {
      const timelineEntry: TimelineEntry = {
        id: `timeline-${Date.now()}`,
        candidateId: id,
        from: candidate.stage,
        to: updates.stage,
        timestamp: new Date(),
      }
      await dbPut(STORES.timeline, timelineEntry)
    }

    await dbPut(STORES.candidates, updated)
    await syncManager.persistCandidate(updated)
    return updated
  },

  // Assessments API
  async getAssessment(jobId: string) {
    await delay(200 + Math.random() * 500)
    const assessments = await dbGetAll<Assessment>(STORES.assessments)
    return assessments.find((a) => a.jobId === jobId)
  },

  async updateAssessment(jobId: string, assessment: Assessment) {
    if (shouldError(0.05)) {
      throw new Error("Failed to update assessment")
    }

    await delay(300 + Math.random() * 700)

    const updated = { ...assessment, updatedAt: new Date() }
    await dbPut(STORES.assessments, updated)
    await syncManager.persistAssessment(updated)
    return updated
  },

  async submitAssessmentResponse(response: Omit<AssessmentResponse, "id">) {
    if (shouldError(0.05)) {
      throw new Error("Failed to submit response")
    }

    await delay(300 + Math.random() * 800)

    const newResponse: AssessmentResponse = {
      ...response,
      id: `response-${Date.now()}`,
    }

    await dbPut(STORES.responses, newResponse)
    return newResponse
  },

  // Utility
  async initializeData(jobs: Job[], candidates: Candidate[], assessments: Assessment[]) {
    await dbClear(STORES.jobs)
    await dbClear(STORES.candidates)
    await dbClear(STORES.timeline)
    await dbClear(STORES.assessments)

    for (const job of jobs) {
      await dbPut(STORES.jobs, job)
    }

    for (const candidate of candidates) {
      await dbPut(STORES.candidates, candidate)
      const timelineEntry: TimelineEntry = {
        id: `timeline-${candidate.id}`,
        candidateId: candidate.id,
        from: null,
        to: candidate.stage,
        timestamp: candidate.appliedAt,
      }
      await dbPut(STORES.timeline, timelineEntry)
    }

    for (const assessment of assessments) {
      await dbPut(STORES.assessments, assessment)
    }
  },
}
