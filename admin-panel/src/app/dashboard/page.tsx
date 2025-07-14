'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  UserGroupIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  ListBulletIcon,
  ShoppingBagIcon,
  StarIcon,
  NewspaperIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ClockIcon,
  TrendingUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  artists: number
  releases: number
  videos: number
  playlists: number
  reviews: number
  news: number
  distributors: number
  recentActivity: any[]
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    artists: 0,
    releases: 0,
    videos: 0,
    playlists: 0,
    reviews: 0,
    news: 0,
    distributors: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all counts in parallel
      const [
        artistsCount,
        releasesCount,
        videosCount,
        playlistsCount,
        reviewsCount,
        newsCount,
        distributorsCount,
        recentChanges
      ] = await Promise.all([
        supabase.from('artists').select('id', { count: 'exact', head: true }),
        supabase.from('releases').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('playlists').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('news').select('id', { count: 'exact', head: true }),
        supabase.from('distributors').select('id', { count: 'exact', head: true }),
        supabase.from('content_changes').select('*').order('changed_at', { ascending: false }).limit(5)
      ])

      setStats({
        artists: artistsCount.count || 0,
        releases: releasesCount.count || 0,
        videos: videosCount.count || 0,
        playlists: playlistsCount.count || 0,
        reviews: reviewsCount.count || 0,
        news: newsCount.count || 0,
        distributors: distributorsCount.count || 0,
        recentActivity: recentChanges.data || []
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { name: 'Add Artist', href: '/dashboard/artists/new', icon: UserGroupIcon, color: 'bg-blue-500' },
    { name: 'Add Release', href: '/dashboard/releases/new', icon: MusicalNoteIcon, color: 'bg-green-500' },
    { name: 'Add Video', href: '/dashboard/videos/new', icon: VideoCameraIcon, color: 'bg-purple-500' },
    { name: 'Create Playlist', href: '/dashboard/playlists/new', icon: ListBulletIcon, color: 'bg-yellow-500' },
  ]

  const statsCards = [
    { name: 'Artists', value: stats.artists, icon: UserGroupIcon, href: '/dashboard/artists', change: '+2 this month' },
    { name: 'Releases', value: stats.releases, icon: MusicalNoteIcon, href: '/dashboard/releases', change: '+1 this week' },
    { name: 'Videos', value: stats.videos, icon: VideoCameraIcon, href: '/dashboard/videos', change: '+3 this month' },
    { name: 'Playlists', value: stats.playlists, icon: ListBulletIcon, href: '/dashboard/playlists', change: 'No change' },
    { name: 'Reviews', value: stats.reviews, icon: StarIcon, href: '/dashboard/reviews', change: '+5 this month' },
    { name: 'News Articles', value: stats.news, icon: NewspaperIcon, href: '/dashboard/news', change: '+1 this week' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your Avanti Classic website today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center">
                <div className={`${action.color} p-3 rounded-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{action.name}</p>
                  <p className="text-sm text-gray-500">Create new content</p>
                </div>
                <PlusIcon className="absolute top-4 right-4 h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action} in {activity.table_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.changed_at && new Date(activity.changed_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.action === 'INSERT' ? 'bg-green-100 text-green-800' :
                  activity.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {activity.action}
                </span>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>

        {/* Site Health */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Site Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Website Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-900">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage Used</span>
              <span className="text-sm text-gray-900">2.3 GB / 10 GB</span>
            </div>
          </div>
        </div>
      </div>
    )
  }