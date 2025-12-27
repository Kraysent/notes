import TextField from './TextField'

interface NotesSidebarHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

function NotesSidebarHeader({ searchQuery, onSearchChange }: NotesSidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-700">
      <TextField
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholderKey="search.placeholder"
      />
    </div>
  )
}

export default NotesSidebarHeader

