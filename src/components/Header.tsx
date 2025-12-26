type ViewMode = 'raw' | 'markdown'

interface HeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

function Header({ viewMode, onViewModeChange }: HeaderProps) {
  return (
    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-sm flex items-center justify-between">
      <h1 className="m-0 text-xl font-semibold">Notes</h1>
      <button
        onClick={() => onViewModeChange(viewMode === 'raw' ? 'markdown' : 'raw')}
        className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d2d2d] hover:bg-gray-50 dark:hover:bg-[#3d3d3d] transition-colors"
      >
        {viewMode === 'raw' ? 'Markdown' : 'Raw'}
      </button>
    </div>
  )
}

export default Header
