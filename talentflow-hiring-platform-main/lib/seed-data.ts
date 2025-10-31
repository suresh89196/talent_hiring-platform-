import type { Job, Candidate, Assessment, AssessmentSection, Question } from "./types"

export function generateJobs(): Job[] {
  const jobTitles = [
    "Senior React Developer",
    "Full Stack Engineer",
    "Product Manager",
    "UX Designer",
    "DevOps Engineer",
    "Data Scientist",
    "Backend Engineer",
    "QA Automation Engineer",
    "Frontend Developer",
    "Mobile Developer",
    "Cloud Architect",
    "Security Engineer",
    "Machine Learning Engineer",
    "Solutions Architect",
    "Technical Writer",
    "Engineering Manager",
    "Database Administrator",
    "Systems Engineer",
    "Intern - Software Engineering",
    "Contract Developer",
    "Technical Support Engineer",
    "Release Manager",
    "Site Reliability Engineer",
    "API Developer",
    "Integration Engineer",
  ]

  const tags = [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Remote",
    "On-site",
    "Hybrid",
    "Senior",
    "Junior",
    "Urgent",
  ]

  return jobTitles.map((title, index) => ({
    id: `job-${index + 1}`,
    title,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    description: `We are hiring for ${title}. This is a great opportunity to join our team.`,
    status: Math.random() > 0.2 ? "active" : "archived",
    tags: [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * tags.length)]].filter(
      (v, i, a) => a.indexOf(v) === i,
    ),
    order: index,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }))
}

export function generateCandidates(jobs: Job[]): Candidate[] {
  const firstNames = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Iris",
    "Jack",
    "Karen",
    "Leo",
    "Mia",
    "Noah",
    "Olivia",
    "Paul",
    "Quinn",
    "Rachel",
    "Sam",
    "Tina",
  ]

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]

  const stages: Array<"applied" | "screen" | "tech" | "offer" | "hired" | "rejected"> = [
    "applied",
    "screen",
    "tech",
    "offer",
    "hired",
    "rejected",
  ]

  const candidates: Candidate[] = []

  for (let i = 0; i < 1000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)]

    candidates.push({
      id: `candidate-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      jobId: randomJob.id,
      stage: stages[Math.floor(Math.random() * stages.length)],
      appliedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      notes: Math.random() > 0.7 ? `Strong background in relevant technologies` : undefined,
    })
  }

  return candidates
}

export function generateAssessments(jobs: Job[]): Assessment[] {
  const activeJobs = jobs.filter((j) => j.status === "active").slice(0, 3)

  return activeJobs.map((job, idx) => ({
    id: `assessment-${idx + 1}`,
    jobId: job.id,
    title: `Technical Assessment for ${job.title}`,
    description: `Comprehensive assessment to evaluate candidate skills`,
    sections: [
      generateSection("Technical Skills", [
        generateQuestion("single-choice", "What is your primary language?", ["TypeScript", "Python", "Go", "Rust"]),
        generateQuestion("multi-choice", "Select all technologies you know:", ["React", "Vue", "Angular", "Svelte"]),
        generateQuestion("short-text", "Describe your experience with REST APIs:"),
        generateQuestion("numeric", "Years of professional experience:", undefined, { min: 0, max: 50 }),
      ]),
      generateSection("Problem Solving", [
        generateQuestion("long-text", "Describe a challenging problem you solved:", undefined, { maxLength: 1000 }),
        generateQuestion("single-choice", "What is your approach to debugging?", [
          "Systematic",
          "Trial and error",
          "Print statements",
          "Debugger",
        ]),
      ]),
      generateSection("Communication", [
        generateQuestion("short-text", "How do you prefer to communicate with team members?"),
        generateQuestion("long-text", "Describe your ideal work environment:"),
      ]),
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

function generateSection(title: string, questions: Question[]): AssessmentSection {
  return {
    id: `section-${Math.random().toString(36).substr(2, 9)}`,
    title,
    questions,
  }
}

function generateQuestion(type: string, title: string, options?: string[], constraints?: any): Question {
  const baseQuestion = {
    id: `q-${Math.random().toString(36).substr(2, 9)}`,
    title,
    required: Math.random() > 0.3,
  }

  switch (type) {
    case "single-choice":
      return { ...baseQuestion, type: "single-choice" as const, options: options || [] }
    case "multi-choice":
      return { ...baseQuestion, type: "multi-choice" as const, options: options || [] }
    case "short-text":
      return { ...baseQuestion, type: "short-text" as const, maxLength: 500 }
    case "long-text":
      return { ...baseQuestion, type: "long-text" as const, maxLength: constraints?.maxLength || 2000 }
    case "numeric":
      return { ...baseQuestion, type: "numeric" as const, min: constraints?.min, max: constraints?.max }
    case "file-upload":
      return { ...baseQuestion, type: "file-upload" as const, allowedFormats: ["pdf", "doc"], maxSize: 5 }
    default:
      return { ...baseQuestion, type: "short-text" as const }
  }
}
