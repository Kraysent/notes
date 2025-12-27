import { useState, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { MdOutlinePreview, MdOutlineViewHeadline } from 'react-icons/md'
import { ViewMode } from '../types'
import Button from './Button'
import Input from './Input'

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
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
          placeholderKey="header.input.placeholder"
        />
      ) : (
        <div
          onClick={handleClick}
          className="flex-1 text-xl font-semibold cursor-text"
        >
          {title}
        </div>
      )}
      <Button
        onClick={() => onViewModeChange(viewMode === ViewMode.Raw ? ViewMode.Markdown : ViewMode.Raw)}
        tooltipKey={viewMode === ViewMode.Raw ? 'view.button.tooltip.raw' : 'view.button.tooltip.markdown'}
      >
        {viewMode === ViewMode.Raw ? (
          <MdOutlinePreview className="text-lg" />
        ) : (
          <MdOutlineViewHeadline className="text-lg" />
        )}
      </Button>
    </div>
  )
}

export default Header
