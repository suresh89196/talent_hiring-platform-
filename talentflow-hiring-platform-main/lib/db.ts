let db: IDBDatabase | null = null

const DB_NAME = "talentflow"
const DB_VERSION = 1

const STORES = {
  jobs: "jobs",
  candidates: "candidates",
  timeline: "timeline",
  assessments: "assessments",
  responses: "responses",
}

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // Create object stores
      if (!database.objectStoreNames.contains(STORES.jobs)) {
        const jobsStore = database.createObjectStore(STORES.jobs, { keyPath: "id" })
        jobsStore.createIndex("status", "status", { unique: false })
        jobsStore.createIndex("order", "order", { unique: false })
      }

      if (!database.objectStoreNames.contains(STORES.candidates)) {
        const candidatesStore = database.createObjectStore(STORES.candidates, { keyPath: "id" })
        candidatesStore.createIndex("jobId", "jobId", { unique: false })
        candidatesStore.createIndex("stage", "stage", { unique: false })
        candidatesStore.createIndex("email", "email", { unique: false })
      }

      if (!database.objectStoreNames.contains(STORES.timeline)) {
        database.createObjectStore(STORES.timeline, { keyPath: "id" })
      }

      if (!database.objectStoreNames.contains(STORES.assessments)) {
        const assessmentsStore = database.createObjectStore(STORES.assessments, { keyPath: "id" })
        assessmentsStore.createIndex("jobId", "jobId", { unique: false })
      }

      if (!database.objectStoreNames.contains(STORES.responses)) {
        const responsesStore = database.createObjectStore(STORES.responses, { keyPath: "id" })
        responsesStore.createIndex("assessmentId", "assessmentId", { unique: false })
        responsesStore.createIndex("candidateId", "candidateId", { unique: false })
      }
    }
  })
}

export async function getDB(): Promise<IDBDatabase> {
  if (db) return db
  return initDB()
}

// Generic get operation
export async function dbGet<T>(storeName: string, key: string): Promise<T | undefined> {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.get(key)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

// Generic put operation
export async function dbPut<T>(storeName: string, value: T): Promise<string> {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.put(value)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result as string)
  })
}

// Get all records from a store
export async function dbGetAll<T>(storeName: string): Promise<T[]> {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

// Delete a record
export async function dbDelete(storeName: string, key: string): Promise<void> {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.delete(key)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// Query by index
export async function dbQueryByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const index = store.index(indexName)
    const request = index.getAll(value)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

// Clear a store
export async function dbClear(storeName: string): Promise<void> {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.clear()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}
