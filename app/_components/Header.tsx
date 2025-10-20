"use client"

import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./ui/button"
import { FiTruck, FiArrowLeft } from "react-icons/fi"
import { useRouter } from "next/navigation"

interface HeaderProps {
  title?: string
  showBackButton?: boolean
  showCarRegistryButton?: boolean
  onCarRegistryClick?: () => void
  children?: React.ReactNode
}

export function Header({
  title = "Körjournal",
  showBackButton = false,
  showCarRegistryButton = false,
  onCarRegistryClick,
  children,
}: HeaderProps) {
  const router = useRouter()

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Tillbaka</span>
          </Button>
        )}
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      <div className="flex gap-2 items-center">
        {children}
        {showCarRegistryButton && onCarRegistryClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCarRegistryClick}
            className="hidden sm:flex gap-2"
          >
            <FiTruck className="w-4 h-4" />
            <span>Mina bilar</span>
          </Button>
        )}
        <ThemeToggle />
      </div>
    </div>
  )
}
