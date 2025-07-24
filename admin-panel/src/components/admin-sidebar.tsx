'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePermissions } from '@/lib/permissions'
import { useNavCounts } from '@/hooks/use-nav-counts'
import { ThemeToggle } from './theme-toggle'
import { 
  HomeIcon,
  UserGroupIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  ListBulletIcon,
  StarIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  countKey?: keyof ReturnType<typeof useNavCounts>['counts']
  restrictedTo?: 'super_admin' | 'company_admin'
}

const allNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Artists', href: '/dashboard/artists', icon: UserGroupIcon, countKey: 'artists' },
  { name: 'Releases', href: '/dashboard/releases', icon: MusicalNoteIcon, countKey: 'releases' },
  { name: 'Videos', href: '/dashboard/videos', icon: VideoCameraIcon, countKey: 'videos' },
  { name: 'Playlists', href: '/dashboard/playlists', icon: ListBulletIcon, countKey: 'playlists' },
  { name: 'Reviews', href: '/dashboard/reviews', icon: StarIcon, countKey: 'reviews' },
  { name: 'Distributors', href: '/dashboard/distributors', icon: InformationCircleIcon, countKey: 'distributors' },
  // Shop Section
  { name: 'Products', href: '/dashboard/shop/products', icon: CubeIcon, countKey: 'products' },
  { name: 'Orders', href: '/dashboard/shop/orders', icon: ClipboardDocumentListIcon, countKey: 'orders' },
  { name: 'Customers', href: '/dashboard/shop/customers', icon: UserIcon, countKey: 'customers' },
  { name: 'Inventory', href: '/dashboard/shop/inventory', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon, restrictedTo: 'super_admin' },
  { name: 'Migration', href: '/dashboard/admin/migrate-releases', icon: Cog6ToothIcon, restrictedTo: 'super_admin' },
]

interface AdminSidebarProps {
  children: React.ReactNode
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [navigation, setNavigation] = useState<NavItem[]>([])
  const pathname = usePathname()
  const { user, loading } = usePermissions()
  const { counts, loading: countsLoading } = useNavCounts()

  useEffect(() => {
    if (!loading && user) {
      // Filter navigation based on user role
      const filteredNavigation = allNavigation.filter(item => {
        if (!item.restrictedTo) {
          return true // Show unrestricted items to all users
        }
        return user.role === item.restrictedTo
      })
      setNavigation(filteredNavigation)
    }
  }, [user, loading])

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
        fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 lg:static lg:z-auto border-r border-gray-800 dark:border-gray-700
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
                    ? 'bg-white dark:bg-gray-700 text-black dark:text-white' 
                    : 'text-gray-300 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white'
                  }
                `}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={`
                  flex-shrink-0 h-5 w-5
                  ${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-white dark:group-hover:text-white'}
                  ${collapsed ? '' : 'mr-3'}
                `} />
                
                {!collapsed && (
                  <>
                    <span className="truncate">{item.name}</span>
                    {item.countKey && (
                      <span className={`
                        ml-auto inline-block py-0.5 px-2 text-xs rounded-full
                        ${isActive 
                          ? 'bg-black dark:bg-gray-600 text-white dark:text-white' 
                          : 'bg-gray-800 dark:bg-gray-700 text-gray-300 dark:text-gray-400 group-hover:bg-gray-700 dark:group-hover:bg-gray-600'
                        }
                      `}>
                        {countsLoading ? '...' : counts[item.countKey]}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                <p>Avanti Classic CMS</p>
                <p>v2.0.0</p>
              </div>
            )}
            <div className={collapsed ? 'mx-auto' : 'ml-auto'}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  )
}