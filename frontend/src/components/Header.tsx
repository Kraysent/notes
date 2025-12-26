import { useState, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { ViewMode } from '../types'

interface HeaderProps {
  title: string
  onTitleSubmit: (title: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

function Header({ title, onTitleSubmit, viewMode, onViewModeChange }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(!title)
  const [editValue, setEditValue] = useState(title)

  useEffect(() => {
    setEditValue(title)
    if (!title) {
      setIsEditing(true)
    }
  }, [title])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmedValue = editValue.trim()
      if (trimmedValue) {
        onTitleSubmit(trimmedValue)
        setIsEditing(false)
      }
    } else if (e.key === 'Escape') {
      setEditValue(title)
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    const trimmedValue = editValue.trim()
    if (trimmedValue && trimmedValue !== title) {
      onTitleSubmit(trimmedValue)
    } else if (!trimmedValue && title) {
      setEditValue(title)
    }
    setIsEditing(false)
  }

  const handleClick = () => {
    if (title && !isEditing) {
      setIsEditing(true)
      setEditValue(title)
    }
  }

  return (
    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-sm flex items-center justify-between">
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
          className="flex-1 text-xl font-semibold bg-transparent border-none outline-none focus:outline-none p-0 m-0"
          placeholder="Enter note title..."
        />
      ) : (
        <div
          onClick={handleClick}
          className="flex-1 text-xl font-semibold cursor-text"
        >
          {title}
        </div>
      )}
      <button
        onClick={() => onViewModeChange(viewMode === ViewMode.Raw ? ViewMode.Markdown : ViewMode.Raw)}
        className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d2d2d] hover:bg-gray-50 dark:hover:bg-[#3d3d3d] transition-colors"
      >
        {viewMode === ViewMode.Raw ? 'Markdown' : 'Raw'}
      </button>
    </div>
  )
}

export default Header
