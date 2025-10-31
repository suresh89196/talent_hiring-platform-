import { getDB, dbPut } from "./db"
import type { Job, Candidate, Assessment } from "./types"

const SYNC_KEY = "talentflow_sync_state"

interface SyncState {
  lastSync: number
  pendingOperations: Array<{
    id: string
    type: string
    timestamp: number
  }>
}

export const syncManager = {
  async initialize() {
    try {
      const db = await getDB()
      console.log("[v0] Database initialized and ready for sync")
    } catch (error) {
      console.error("[v0] Failed to initialize database:", error)
      throw error
    }
  },

  async getSyncState(): Promise<SyncState> {
    const stored = localStorage.getItem(SYNC_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return { lastSync: 0, pendingOperations: [] }
      }
    }
    return { lastSync: 0, pendingOperations: [] }
  },

  async updateSyncState(state: Partial<SyncState>) {
    const current = await this.getSyncState()
    const updated = { ...current, ...state }
    localStorage.setItem(SYNC_KEY, JSON.stringify(updated))
  },

  async trackOperation(type: string, id: string) {
    const state = await this.getSyncState()
    state.pendingOperations = state.pendingOperations.filter((op) => op.id !== id)
    state.pendingOperations.push({
      id,
      type,
      timestamp: Date.now(),
    })
    await this.updateSyncState(state)
  },

  async recordSync() {
    await this.updateSyncState({
      lastSync: Date.now(),
      pendingOperations: [],
    })
  },

  // Persist data locally after API operations
  async persistJob(job: Job) {
    try {
      await dbPut("jobs", job)
      await this.trackOperation("job_update", job.id)
    } catch (error) {
      console.error("[v0] Failed to persist job:", error)
    }
  },

  async persistCandidate(candidate: Candidate) {
    try {
      await dbPut("candidates", candidate)
      await this.trackOperation("candidate_update", candidate.id)
    } catch (error) {
      console.error("[v0] Failed to persist candidate:", error)
    }
  },

  async persistAssessment(assessment: Assessment) {
    try {
      await dbPut("assessments", assessment)
      await this.trackOperation("assessment_update", assessment.id)
    } catch (error) {
      console.error("[v0] Failed to persist assessment:", error)
    }
  },
}
