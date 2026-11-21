import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Printer, Shield, Clock, MapPin } from 'lucide-react'
import { useStore } from '@/data/store'
import { formatDuration, relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function GateHistory() {
  const { gateLogs, currentStudentId, students } = useStore()
  const { success } = useToast()

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]
  const myLogs = gateLogs.filter((l) => l.studentId === currentStudent.id)

  const handleExportCSV = () => {
    const headers = ['ID,Purpose,Destination,EntryTime,ExitTime,DurationMinutes\n']
    const rows = myLogs.map((l) => {
      const duration = l.exitTime ? Math.round((l.exitTime - l.entryTime) / 60000) : 'Active'
      return `"${l.id}","${l.purpose}","${l.destination}","${new Date(l.entryTime).toISOString()}","${
        l.exitTime ? new Date(l.exitTime).toISOString() : 'Active'
      }","${duration}"\n`
    })
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gate-logs-${currentStudent.id}.csv`
    a.click()
    URL.revokeObjectURL(url)
    success('Exported gate log CSV')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/app/gate"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64677A] hover:text-[#141320]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gate Pass</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            iconLeft={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            iconLeft={<Printer className="w-3.5 h-3.5" />}
          >
            Print
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
          My Gate Log History
        </h1>
        <p className="text-xs sm:text-sm text-[#64677A] mt-1">
          Historical record of entries and departures for {currentStudent.name}. Auto-expires after 90 days.
        </p>
      </div>

      {/* Log Table */}
      <Card variant="elevated" className="p-6">
        {myLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64677A]">
            No gate access history recorded yet. Use the Gate QR Pass to log entry.
          </div>
        ) : (
          <div className="divide-y divide-[rgba(43,38,68,0.06)]">
            {myLogs.map((log) => {
              const isCurrentlyInside = log.exitTime === null
              const duration = log.exitTime
                ? formatDuration(log.exitTime - log.entryTime)
                : 'Still on campus'

              return (
                <div
                  key={log.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5F6FA] px-2 rounded-[14px] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isCurrentlyInside ? 'bg-emerald-50 text-emerald-600' : 'bg-[#E9ECF6] text-[#2B2644]'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#141320]">{log.purpose}</h4>
                        <Badge variant={isCurrentlyInside ? 'success' : 'neutral'} pulse={isCurrentlyInside}>
                          {isCurrentlyInside ? 'On Campus' : 'Completed'}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#64677A] mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{log.destination}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs">
                    <span className="text-[#141320] font-medium block">
                      In: {new Date(log.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {log.exitTime && (
                        <> · Out: {new Date(log.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                      )}
                    </span>
                    <span className="text-[11px] text-[#64677A] block mt-0.5">
                      Duration: {duration} ({relativeTime(log.entryTime)})
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
