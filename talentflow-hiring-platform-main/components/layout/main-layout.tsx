"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const navigation = [
    { name: "Jobs", href: "/jobs", icon: "briefcase" },
    { name: "Candidates", href: "/candidates", icon: "users" },
    { name: "Candidates Kanban", href: "/candidates-kanban", icon: "kanban" },
    { name: "Assessments", href: "/assessments", icon: "clipboard" },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {isSidebarOpen && <h1 className="font-bold text-lg text-sidebar-foreground">TalentFlow</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-sidebar-accent rounded text-sidebar-foreground"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              title={!isSidebarOpen ? item.name : undefined}
            >
              <span className="text-lg">
                {item.icon === "briefcase" && "💼"}
                {item.icon === "users" && "👥"}
                {item.icon === "kanban" && "📊"}
                {item.icon === "clipboard" && "📋"}
              </span>
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
