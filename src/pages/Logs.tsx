import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, ChevronDown, ChevronRight, FileText, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface LogEntry {
  timestamp: string
  action: string
  reason: string
  result?: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

interface LogSession {
  id: string
  name: string
  createdAt: string
  updatedAt?: string
  entries: LogEntry[]
  summary?: {
    totalApplications: number
    successful: number
    needsReview: number
    skipped: number
  }
}

const API_BASE_URL = '/api'

export default function Logs() {
  const [sessions, setSessions] = useState<LogSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/logs`)
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Failed to load logs:', error)
      setSessions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this log session?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/logs/${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId))
      } else {
        throw new Error('Failed to delete session')
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
      alert('Failed to delete session. Please try again.')
    }
  }

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions)
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId)
    } else {
      newExpanded.add(sessionId)
    }
    setExpandedSessions(newExpanded)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const getEntryIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Application Logs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View detailed logs of AI actions during job applications
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {isLoading ? 'Loading...' : `${sessions.length} session${sessions.length !== 1 ? 's' : ''}`}
        </div>
      </div>

      {isLoading ? (
        <Card className="border-gray-200 dark:border-stone-700 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </CardContent>
        </Card>
      ) : sessions.length === 0 ? (
        <Card className="border-gray-200 dark:border-stone-700 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No logs yet</p>
              <p className="text-sm">Logs will appear here after AI completes job applications</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const isExpanded = expandedSessions.has(session.id)

            return (
              <Card key={session.id} className="border-gray-200 dark:border-stone-700 shadow-sm">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors"
                  onClick={() => toggleSession(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {session.name || `Session ${session.id.slice(0, 8)}`}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(session.createdAt)}
                          </span>
                          {session.entries && (
                            <span>{session.entries.length} entries</span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {session.summary && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-green-600 dark:text-green-400">
                            {session.summary.successful} applied
                          </span>
                          {session.summary.needsReview > 0 && (
                            <span className="text-yellow-600 dark:text-yellow-400">
                              {session.summary.needsReview} review
                            </span>
                          )}
                          {session.summary.skipped > 0 && (
                            <span className="text-gray-500 dark:text-gray-400">
                              {session.summary.skipped} skipped
                            </span>
                          )}
                        </div>
                      )}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSession(session.id)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && session.entries && session.entries.length > 0 && (
                  <CardContent className="pt-0 pb-4">
                    <div className="border-t border-gray-200 dark:border-stone-700 pt-4">
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {session.entries.map((entry, index) => (
                          <div
                            key={index}
                            className="flex gap-3 p-3 bg-gray-50 dark:bg-stone-900/50 rounded-lg text-sm"
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {getEntryIcon(entry.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {entry.action}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                  {formatTime(entry.timestamp)}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400">
                                {entry.reason}
                              </p>
                              {entry.result && (
                                <p className="mt-1 text-gray-500 dark:text-gray-500 text-xs">
                                  Result: {entry.result}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}

                {isExpanded && (!session.entries || session.entries.length === 0) && (
                  <CardContent className="pt-0 pb-4">
                    <div className="border-t border-gray-200 dark:border-stone-700 pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No entries in this session
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
