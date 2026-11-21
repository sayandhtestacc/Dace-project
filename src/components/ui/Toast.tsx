import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
  undoAction?: () => void
  duration?: number
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => string
  dismissToast: (id: string) => void
  success: (title: string, message?: string, undoAction?: () => void) => string
  error: (title: string, message?: string) => string
  warning: (title: string, message?: string) => string
  info: (title: string, message?: string) => string
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastItem = { ...toast, id }
    setToasts((prev) => [newToast, ...prev].slice(0, 4))

    const duration = toast.duration ?? 4500
    setTimeout(() => {
      dismissToast(id)
    }, duration)

    return id
  }, [dismissToast])

  const success = (title: string, message?: string, undoAction?: () => void) =>
    showToast({ type: 'success', title, message, undoAction })

  const error = (title: string, message?: string) =>
    showToast({ type: 'error', title, message })

  const warning = (title: string, message?: string) =>
    showToast({ type: 'warning', title, message })

  const info = (title: string, message?: string) =>
    showToast({ type: 'info', title, message })

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, success, error, warning, info }}>
      {children}
      {/* Toast container cleanly positioned top-20 right-6 (z-50) so it NEVER overlaps bottom-right floating role pill */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              drag="x"
              dragConstraints={{ left: 0, right: 150 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80) dismissToast(toast.id)
              }}
              className="pointer-events-auto bg-white border border-[rgba(43,38,68,0.12)] rounded-[20px] p-4 shadow-[0_16px_40px_-8px_rgba(43,38,68,0.18)] relative overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">
                  {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                </span>

                <div className="flex-1 pr-2">
                  <h4 className="text-xs font-bold text-[#141320]">{toast.title}</h4>
                  {toast.message && (
                    <p className="text-xs text-[#64677A] mt-0.5 leading-relaxed">{toast.message}</p>
                  )}
                  {toast.undoAction && (
                    <button
                      onClick={() => {
                        toast.undoAction?.()
                        dismissToast(toast.id)
                      }}
                      className="mt-2 text-xs font-semibold text-[#2B2644] hover:underline"
                    >
                      Undo action
                    </button>
                  )}
                </div>

                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-[#64677A] hover:text-[#141320] p-1 rounded-full transition-colors shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Shrinking progress bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: (toast.duration ?? 4500) / 1000, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-[#2B2644]/20"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
