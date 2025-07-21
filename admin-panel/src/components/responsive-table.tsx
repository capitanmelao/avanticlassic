'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface Column<T = Record<string, unknown>> {
  key: string
  title: string
  width?: number
  minWidth?: number
  render?: (value: unknown, item: T) => ReactNode
}

interface ResponsiveTableProps<T = Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  onRowClick?: (item: T) => void
}

export function ResponsiveTable<T = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick
}: ResponsiveTableProps<T>) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

  // Initialize column widths
  useEffect(() => {
    if (tableRef.current) {
      const initialWidths: Record<string, number> = {}
      const tableWidth = tableRef.current.offsetWidth
      const defaultWidth = tableWidth / columns.length

      columns.forEach((column) => {
        initialWidths[column.key] = column.width || Math.max(column.minWidth || 120, defaultWidth)
      })
      
      setColumnWidths(initialWidths)
    }
  }, [columns])

  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault()
    setIsResizing(columnKey)
    startXRef.current = e.clientX
    startWidthRef.current = columnWidths[columnKey] || 120
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    
    const diff = e.clientX - startXRef.current
    const newWidth = Math.max(80, startWidthRef.current + diff)
    
    setColumnWidths(prev => ({
      ...prev,
      [isResizing]: newWidth
    }))
  }

  const handleMouseUp = () => {
    setIsResizing(null)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto max-h-[calc(100vh-200px)]">
        <table ref={tableRef} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 last:border-r-0"
                  style={{ width: columnWidths[column.key] || 'auto' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{column.title}</span>
                    {index < columns.length - 1 && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 dark:hover:bg-blue-400 opacity-0 hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => handleMouseDown(e, column.key)}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => handleRowClick(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                      style={{ width: columnWidths[column.key] || 'auto' }}
                    >
                      <div className="truncate" title={String((item as Record<string, unknown>)[column.key] || '')}>
                        {column.render ? column.render((item as Record<string, unknown>)[column.key], item) : String((item as Record<string, unknown>)[column.key] || '')}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}