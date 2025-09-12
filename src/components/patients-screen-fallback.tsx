import { Plus, Filter, Download } from 'lucide-react';
import { Button } from './ui/button';

export function PatientsScreenFallback() {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 py-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-text">Patients</h1>
          <div className="relative w-80">
            <input
              placeholder="Search by name, MRN, or tags..."
              className="w-full px-4 py-2 bg-surface border border-border rounded-2xl"
              disabled
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              disabled
              className="px-4 py-2 rounded-2xl bg-surface text-subtext border border-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              disabled
              className="px-4 py-2 rounded-2xl bg-surface text-subtext border border-border"
            >
              Select
            </Button>
            <Button
              variant="ghost"
              disabled
              className="px-4 py-2 rounded-2xl bg-surface text-subtext border border-border"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
            <Button
              variant="ghost"
              disabled
              className="px-4 py-2 rounded-2xl bg-surface text-subtext border border-border"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Loading State */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-subtext">Loading patients...</p>
              <p className="text-xs text-subtext/60">
                If this takes too long, try refreshing the page
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}