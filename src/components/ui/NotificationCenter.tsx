import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, X, Info, AlertTriangle, Clock } from 'lucide-react'
import { useStore } from '@/data/store'
import { relativeTime } from '@/lib/format'
import { Link } from 'react-router-dom'

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'update' | 'alert' | 'reminder'>('all')

  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore()
  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true
    return n.type === activeTab
  })

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-full text-[#141320] hover:bg-[#2B2644]/6 transition-colors cursor-pointer select-none"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5 text-[#2B2644]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#11101D] text-[10px] font-bold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over Drawer rendered directly in document.body via createPortal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[100] overflow-hidden">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-[#11101D]/40 backdrop-blur-xs transition-opacity"
                />

                {/* Right Panel */}
                <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-[101]">
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                    className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#2B2644]/10"
                  >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-[#2B2644]/8 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-[#141320]">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-[#E9ECF6] text-[#2B2644] font-medium rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-xs text-[#2B2644] hover:underline px-2 py-1 font-semibold cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setIsOpen(false)}
                          className="p-1.5 text-[#64677A] hover:text-[#141320] rounded-full hover:bg-[#2B2644]/6 cursor-pointer"
                          aria-label="Close notifications panel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex px-6 py-3 gap-2 border-b border-[#2B2644]/8 bg-[#F5F6FA]/50">
                      {(['all', 'update', 'alert', 'reminder'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1 text-xs rounded-full capitalize font-medium transition-colors cursor-pointer ${
                            activeTab === tab
                              ? 'bg-[#2B2644] text-white'
                              : 'bg-white border border-[#2B2644]/8 text-[#64677A] hover:bg-[#F5F6FA]'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Notification List */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                      {filteredNotifications.length === 0 ? (
                        <div className="text-center py-16 text-[#64677A]">
                          <Bell className="w-8 h-8 mx-auto text-[#64677A]/30 mb-2" />
                          <p className="text-xs font-medium">No notifications in this view.</p>
                        </div>
                      ) : (
                        filteredNotifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3.5 rounded-[16px] border transition-all cursor-pointer ${
                              !n.read
                                ? 'bg-[#F5F6FA] border-[#C5CBE8]/80 shadow-xs'
                                : 'bg-white border-[#2B2644]/8 hover:bg-[#F5F6FA]/60'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 shrink-0">
                                {n.type === 'update' && <Info className="w-4 h-4 text-blue-600" />}
                                {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                                {n.type === 'reminder' && <Clock className="w-4 h-4 text-purple-600" />}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-xs font-semibold text-[#141320] truncate">{n.title}</h4>
                                  <span className="text-[10px] text-[#64677A] shrink-0">
                                    {relativeTime(n.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs text-[#64677A] mt-1 leading-relaxed">
                                  {n.message}
                                </p>
                                {n.link && (
                                  <Link
                                    to={n.link}
                                    onClick={() => setIsOpen(false)}
                                    className="inline-block mt-2 text-[11px] font-semibold text-[#2B2644] hover:underline"
                                  >
                                    View details →
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
