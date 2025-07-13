'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon,
  UserGroupIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  ListBulletIcon,
  ShoppingBagIcon,
  StarIcon,
  NewspaperIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Artists', href: '/dashboard/artists', icon: UserGroupIcon, count: 19 },
  { name: 'Releases', href: '/dashboard/releases', icon: MusicalNoteIcon, count: 37 },
  { name: 'Videos', href: '/dashboard/videos', icon: VideoCameraIcon, count: 15 },
  { name: 'Playlists', href: '/dashboard/playlists', icon: ListBulletIcon, count: 8 },
  { name: 'Shop', href: '/dashboard/shop', icon: ShoppingBagIcon, count: 12 },
  { name: 'Reviews', href: '/dashboard/reviews', icon: StarIcon, count: 24 },
  { name: 'News', href: '/dashboard/news', icon: NewspaperIcon, count: 6 },
  { name: 'Distributors', href: '/dashboard/distributors', icon: InformationCircleIcon, count: 26 },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

interface AdminSidebarProps {
  children: React.ReactNode
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 flex flex-col bg-black text-white transition-all duration-300 lg:static lg:z-auto
        ${sidebarOpen ? 'w-64' : 'w-0 lg:w-auto'}
        ${collapsed ? 'lg:w-16' : 'lg:w-64'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center">
              <img 
                src="/images/logo.jpeg" 
                alt="Avanti Classic" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-white font-semibold text-lg">Admin</span>
            </div>
          )}
          
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1 rounded-md hover:bg-gray-800 transition-colors"
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-800 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-white text-black' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={`
                  flex-shrink-0 h-5 w-5
                  ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'}
                  ${collapsed ? '' : 'mr-3'}
                `} />
                
                {!collapsed && (
                  <>
                    <span className="truncate">{item.name}</span>
                    {item.count && (
                      <span className={`
                        ml-auto inline-block py-0.5 px-2 text-xs rounded-full
                        ${isActive 
                          ? 'bg-black text-white' 
                          : 'bg-gray-800 text-gray-300 group-hover:bg-gray-700'
                        }
                      `}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4">
          {!collapsed && (
            <div className="text-xs text-gray-400">
              <p>Avanti Classic CMS</p>
              <p>v2.0.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}