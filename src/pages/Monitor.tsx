import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2, Building2, ExternalLink } from 'lucide-react'

interface MonitoredCompany {
  id: string
  name: string
  link: string
  addedAt: string
}

export default function Monitor() {
  const [monitoredCompanies, setMonitoredCompanies] = useState<MonitoredCompany[]>([])
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newCompanyLink, setNewCompanyLink] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load monitored companies from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/monitored-companies')
        const data = await response.json()
        setMonitoredCompanies(Array.isArray(data.companies) ? data.companies : [])
      } catch (error) {
        console.error('Failed to load data:', error)
        setMonitoredCompanies([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Add new company to monitor
  const handleAddCompany = async () => {
    const trimmedName = newCompanyName.trim()
    const trimmedLink = newCompanyLink.trim()

    if (!trimmedName) {
      alert('Please enter a company name')
      return
    }

    if (!trimmedLink) {
      alert('Please enter a link')
      return
    }

    // Check if company already exists
    if (monitoredCompanies.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert('This company is already being monitored')
      return
    }

    const newCompany: MonitoredCompany = {
      id: `company-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: trimmedName,
      link: trimmedLink,
      addedAt: new Date().toISOString()
    }

    try {
      const updatedCompanies = [...monitoredCompanies, newCompany]
      const response = await fetch('/api/monitored-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies: updatedCompanies })
      })

      if (response.ok) {
        setMonitoredCompanies(updatedCompanies)
        setNewCompanyName('')
        setNewCompanyLink('')
      } else {
        alert('Failed to add company')
      }
    } catch (error) {
      console.error('Failed to add company:', error)
      alert('Failed to add company')
    }
  }

  // Remove company from monitoring
  const handleRemoveCompany = async (companyId: string) => {
    try {
      const updatedCompanies = monitoredCompanies.filter(c => c.id !== companyId)
      const response = await fetch('/api/monitored-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies: updatedCompanies })
      })

      if (response.ok) {
        setMonitoredCompanies(updatedCompanies)
      } else {
        alert('Failed to remove company')
      }
    } catch (error) {
      console.error('Failed to remove company:', error)
      alert('Failed to remove company')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Company Monitor</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Maintain a list of companies and their job listing pages to monitor
        </p>
      </div>

      {/* Add Company Section */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCompanyName.trim() && newCompanyLink.trim()) {
                      handleAddCompany()
                    }
                  }}
                  placeholder="e.g., Google"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Listing URL
                </label>
                <input
                  type="url"
                  value={newCompanyLink}
                  onChange={(e) => setNewCompanyLink(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCompanyName.trim() && newCompanyLink.trim()) {
                      handleAddCompany()
                    }
                  }}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddCompany}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add Company
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitored Companies List */}
      {monitoredCompanies.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Building2 size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No companies monitored yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add companies above to start monitoring their job listings
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Job Listing URL</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monitoredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 size={18} className="text-primary-600 dark:text-primary-400" />
                          {company.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={company.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 max-w-md truncate"
                        >
                          <span className="truncate">{company.link}</span>
                          <ExternalLink size={14} className="flex-shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {new Date(company.addedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleRemoveCompany(company.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Remove company"
                        >
                          <Trash2 size={18} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
