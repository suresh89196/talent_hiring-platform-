"use client"

import { use } from "react"
import MainLayout from "@/components/layout/main-layout"
import CandidateDetail from "@/components/candidates/candidate-detail"

interface CandidatePageProps {
  params: Promise<{ id: string }>
}

export default function CandidatePage({ params }: CandidatePageProps) {
  const { id } = use(params)

  return (
    <MainLayout>
      <CandidateDetail candidateId={id} />
    </MainLayout>
  )
}
