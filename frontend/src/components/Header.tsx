import { useState, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { MdOutlinePreview, MdOutlineViewHeadline, MdAdd, MdOutlineFormatIndentIncrease, MdOutlineFormatIndentDecrease } from 'react-icons/md'
import { ViewMode } from '../types'
import Button from './core/Button'
import TextField from './core/TextField'
import Text, { TextSize, TextColor } from './core/Text'

interface HeaderProps {
  title: string
  onTitleSubmit: (title: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onNewNote: () => void
  isSidebarCollapsed: boolean
  onSidebarToggle: () => void
}

function Header({ title, onTitleSubmit, viewMode, onViewModeChange, onNewNote, isSidebarCollapsed, onSidebarToggle }: HeaderProps) {
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
    <div className="px-4 py-2 border-b border-gray-700 bg-[#1e1e1e]/95 backdrop-blur-sm flex items-center justify-between">
      {isEditing ? (
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
          placeholderKey="header.input.placeholder"
        />
      ) : (
        <Text
          size={TextSize.Large}
          color={TextColor.Primary}
          className="flex-1 cursor-text"
          onClick={handleClick}
        >
          {title}
        </Text>
      )}
      <div className="flex items-center gap-2">
        <Button
          onClick={onSidebarToggle}
          tooltipKey={isSidebarCollapsed ? 'header.sidebar.expand' : 'header.sidebar.collapse'}
        >
          {isSidebarCollapsed ? (
            <MdOutlineFormatIndentDecrease className="text-lg" />
          ) : (
            <MdOutlineFormatIndentIncrease className="text-lg" />
          )}
        </Button>
        <Button
          onClick={onNewNote}
          tooltipKey="header.newNote.tooltip"
        >
          <MdAdd className="text-lg" />
        </Button>
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
    </div>
  )
}

export default Header
