import React, { useState, useMemo, useCallback, memo, useEffect, useRef } from 'react';
import { Plus, Filter, X, Calendar, User, ExternalLink, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Copy, QrCode, Download, Check, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MRNActions } from './mrn-utils';
import { FilterButton } from './filter-button';
import { AddPatientModal } from './add-patient-modal';
import { toast } from 'sonner';
import { patientService, Patient, PatientListResponse } from '../services/patientService';
import { useAuth } from '../contexts/AuthContext';

// Patient interface is now imported from patientService

type SortField = 'mrn' | 'name' | 'age' | 'lastVisit' | 'status';
type SortDirection = 'asc' | 'desc';

// Helper function to calculate age from date of birth
const calculateAge = (dob: string | null): number => {
  if (!dob) return 0;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Helper function to format date for display
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

interface PatientsScreenProps {
  onPatientClick?: (patientId: string) => void;
}

export function PatientsScreen({ onPatientClick }: PatientsScreenProps) {
  // Doctor ID - in a real app, this would come from auth context
  const doctorId = 'test-doctor-123';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [mrnFilter, setMrnFilter] = useState('');
  const [timeRange, setTimeRange] = useState<'24h' | '1d' | '7d' | '30d' | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'ok' | 'inactive'>('all');
  const [sortField, setSortField] = useState<SortField>('lastVisit');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);
  
  // API state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<any[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  
  // Debounced search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Show searching indicator if there's a query but it hasn't been debounced yet
    if (searchQuery && searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300); // 300ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, debouncedSearchQuery]);

  // Load autocomplete suggestions
  const loadAutocomplete = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setAutocompleteSuggestions([]);
      setShowAutocomplete(false);
      return;
    }

    // TODO: Re-enable when autocomplete API is fixed
    // try {
    //   const suggestions = await patientService.autocompletePatients(doctorId, query, 8);
    //   setAutocompleteSuggestions(suggestions);
    //   setShowAutocomplete(true);
    // } catch (error) {
    //   console.error('Failed to load autocomplete suggestions:', error);
    //   setAutocompleteSuggestions([]);
    //   setShowAutocomplete(false);
    // }
  }, [doctorId]);

  // Debounced autocomplete
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadAutocomplete(searchQuery);
    }, 200); // Shorter delay for autocomplete

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadAutocomplete]);

  // Load patients from API
  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        doctor_id: doctorId,
        page: currentPage,
        per_page: itemsPerPage,
        q: debouncedSearchQuery || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort: sortField === 'lastVisit' ? 'last_visit' : sortField,
        order: sortDirection,
        ...(dateRange.from && { last_visit_from: dateRange.from }),
        ...(dateRange.to && { last_visit_to: dateRange.to }),
      };

      // Use regular patients endpoint for both listing and searching
      // The /v1/patients endpoint already supports search with the 'q' parameter
      // TODO: Fix search API endpoint when backend issues are resolved
      const response = await patientService.getPatients(params);
        
      setPatients(response.items);
      setTotalPatients(response.meta.total);
      setTotalPages(response.meta.total_pages);
      
      // Extract all unique tags from patients
      const tags = Array.from(new Set(response.items.flatMap(p => p.tags)));
      setAllTags(tags);
    } catch (err: any) {
      console.error('Failed to load patients:', err);
      setError(err.message || 'Failed to load patients');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [doctorId, currentPage, itemsPerPage, debouncedSearchQuery, selectedTags, statusFilter, sortField, sortDirection, dateRange]);

  // Load patients when dependencies change
  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleTagFilter = (tag: string, checked: boolean) => {
    setSelectedTags(prev => 
      checked ? [...prev, tag] : prev.filter(t => t !== tag)
    );
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDateRangeFilter = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status: 'all' | 'new' | 'ok' | 'inactive') => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering by status
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setMrnFilter('');
    setDateRange({ from: '', to: '' });
    setTimeRange('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || mrnFilter || dateRange.from || dateRange.to || statusFilter !== 'all';
  const hasTimeRangeFilter = timeRange !== 'all';
  const totalActiveFilters = (hasActiveFilters ? 1 : 0) + (hasTimeRangeFilter ? 1 : 0);

  const handleTimeRangeChange = useCallback((range: '24h' | '1d' | '7d' | '30d' | 'all') => {
    setTimeRange(range);
    setCurrentPage(1);
  }, []);

  const timeRangeLabels = {
    '24h': '24 Hours',
    '1d': '1 Day',
    '7d': '7 Days', 
    '30d': '30 Days',
    'all': 'All'
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedPatients([]);
    }
  };

  const togglePatientSelection = (patientId: string) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const selectAllPatients = () => {
    setSelectedPatients(patients.map(p => p.id));
  };

  const selectAllAcrossPages = () => {
    setSelectedPatients(patients.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedPatients([]);
  };

  const handleExport = () => {
    const patientsToExport = selectedPatients.length > 0 
      ? patients.filter(p => selectedPatients.includes(p.id))
      : patients;
    
    toast.success(`Exporting ${patientsToExport.length} patients to CSV...`);
  };

  const exportSelected = () => {
    const patientsToExport = patients.filter(p => selectedPatients.includes(p.id));
    toast.success(`Exporting ${patientsToExport.length} selected patients to CSV...`);
  };

  const handleExportCSV = () => {
    const patientsToExport = selectedPatients.length > 0 
      ? patients.filter(p => selectedPatients.includes(p.id))
      : patients;
    
    toast.success(`Exporting ${patientsToExport.length} patients to CSV...`);
  };

  const handleExportExcel = () => {
    const patientsToExport = selectedPatients.length > 0 
      ? patients.filter(p => selectedPatients.includes(p.id))
      : patients;
    
    toast.success(`Exporting ${patientsToExport.length} patients to Excel...`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };


  const handleRowClick = (patientId: string) => {
    if (onPatientClick) {
      onPatientClick(patientId);
    } else {
      console.log('Navigate to patient:', patientId);
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 py-6 h-full flex flex-col">
        {/* Header */}
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-text">Patients</h1>
            {debouncedSearchQuery && debouncedSearchQuery.trim().length > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Search: "{debouncedSearchQuery}"
              </Badge>
            )}
          </div>
          
          {/* Search Bar */}
          <div className="relative w-80">
            <Input
              placeholder="Search by name, MRN, or tags..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onFocus={() => {
                if (autocompleteSuggestions.length > 0) {
                  setShowAutocomplete(true);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow clicking on suggestions
                setTimeout(() => setShowAutocomplete(false), 200);
              }}
              className="bg-surface border-border rounded-2xl pl-4 pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {isSearching && (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              )}
              {debouncedSearchQuery && debouncedSearchQuery.trim().length > 0 && !isSearching && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                    setShowAutocomplete(false);
                  }}
                  className="h-6 w-6 p-0 text-subtext hover:text-text"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            {/* Autocomplete Dropdown */}
            {showAutocomplete && autocompleteSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
                {autocompleteSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                    onClick={() => {
                      setSearchQuery(suggestion.text || suggestion.name || '');
                      setShowAutocomplete(false);
                      setCurrentPage(1);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-text text-sm">
                          {suggestion.initials || suggestion.name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-text font-medium truncate">
                          {suggestion.name || suggestion.text}
                        </p>
                        {suggestion.mrn && (
                          <p className="text-subtext text-sm font-mono">
                            {suggestion.mrn}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-3">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-4 py-2 rounded-2xl bg-surface text-subtext border border-border hover:bg-accent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-surface border border-border rounded-2xl shadow-sm p-1">
                <DropdownMenuItem 
                  onClick={handleExportCSV}
                  className="rounded-lg cursor-pointer hover:bg-accent focus:bg-accent"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export CSV (.csv)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleExportExcel}
                  className="rounded-lg cursor-pointer hover:bg-accent focus:bg-accent"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Excel (.xlsx)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Select Button */}
            <Button
              variant="ghost"
              onClick={toggleSelectMode}
              className={`px-4 py-2 rounded-2xl border transition-all ${
                selectMode
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-subtext border-border hover:bg-accent'
              }`}
            >
              {selectMode && <Check className="w-4 h-4 mr-2" />}
              Select
            </Button>

            {/* Add Patient Button */}
            <Button
              variant="ghost"
              onClick={() => setAddPatientModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-surface text-subtext border border-border hover:bg-accent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>

            {/* Filters */}
            <FilterButton
              isOpen={filterPopoverOpen}
              onOpenChange={setFilterPopoverOpen}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              totalActiveFilters={totalActiveFilters}
            />
          </div>
        </div>



        {/* Table Container */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Table Header */}
          <div className={`grid gap-4 px-6 py-4 border-b border-border bg-canvas text-subtext text-sm ${
            selectMode ? 'grid-cols-13' : 'grid-cols-12'
          }`}>
            {/* Checkbox Column */}
            {selectMode && (
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={patients.length > 0 && patients.every(p => selectedPatients.includes(p.id))}
                  indeterminate={patients.some(p => selectedPatients.includes(p.id)) && !patients.every(p => selectedPatients.includes(p.id))}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      selectAllPatients();
                    } else {
                      // Clear only the patients on current page
                      const currentPageIds = patients.map(p => p.id);
                      setSelectedPatients(prev => prev.filter(id => !currentPageIds.includes(id)));
                    }
                  }}
                  className="border-border"
                />
              </div>
            )}

            {/* MRN - Sortable (Pinned Left) */}
            <div 
              className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-text transition-colors font-mono"
              onClick={() => handleSort('mrn')}
            >
              <span className={sortField === 'mrn' ? 'text-text font-medium' : ''}>Patient ID (MRN)</span>
              <div className="flex flex-col">
                <ChevronUp className={`w-3 h-3 ${
                  sortField === 'mrn' && sortDirection === 'asc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
                <ChevronDown className={`w-3 h-3 -mt-1 ${
                  sortField === 'mrn' && sortDirection === 'desc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
              </div>
            </div>

            {/* Patient - Sortable */}
            <div 
              className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-text transition-colors"
              onClick={() => handleSort('name')}
            >
              <span className={sortField === 'name' ? 'text-text font-medium' : ''}>Patient</span>
              <div className="flex flex-col">
                <ChevronUp className={`w-3 h-3 ${
                  sortField === 'name' && sortDirection === 'asc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
                <ChevronDown className={`w-3 h-3 -mt-1 ${
                  sortField === 'name' && sortDirection === 'desc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
              </div>
            </div>
            
            {/* Age - Sortable */}
            <div 
              className="col-span-1 flex items-center gap-2 cursor-pointer hover:text-text transition-colors"
              onClick={() => handleSort('age')}
            >
              <span className={sortField === 'age' ? 'text-text font-medium' : ''}>Age</span>
              <div className="flex flex-col">
                <ChevronUp className={`w-3 h-3 ${
                  sortField === 'age' && sortDirection === 'asc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
                <ChevronDown className={`w-3 h-3 -mt-1 ${
                  sortField === 'age' && sortDirection === 'desc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
              </div>
            </div>
            
            <div className="col-span-2">Tags</div>
            
            {/* Last Visit - Sortable */}
            <div 
              className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-text transition-colors"
              onClick={() => handleSort('lastVisit')}
            >
              <span className={sortField === 'lastVisit' ? 'text-text font-medium' : ''}>Last Visit</span>
              <div className="flex flex-col">
                <ChevronUp className={`w-3 h-3 ${
                  sortField === 'lastVisit' && sortDirection === 'asc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
                <ChevronDown className={`w-3 h-3 -mt-1 ${
                  sortField === 'lastVisit' && sortDirection === 'desc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
              </div>
            </div>
            
            {/* Status - Sortable */}
            <div 
              className="col-span-1 flex items-center gap-2 cursor-pointer hover:text-text transition-colors"
              onClick={() => handleSort('status')}
            >
              <span className={sortField === 'status' ? 'text-text font-medium' : ''}>Status</span>
              <div className="flex flex-col">
                <ChevronUp className={`w-3 h-3 ${
                  sortField === 'status' && sortDirection === 'asc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
                <ChevronDown className={`w-3 h-3 -mt-1 ${
                  sortField === 'status' && sortDirection === 'desc' 
                    ? 'text-primary' 
                    : 'text-border'
                }`} />
              </div>
            </div>
            
            {!selectMode && <div className="col-span-1">Action</div>}
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-subtext">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading patients...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 text-subtext">
                <div className="text-center">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Error loading patients</p>
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                  <Button 
                    variant="ghost" 
                    onClick={loadPatients}
                    className="mt-2 text-primary hover:text-primary-hover"
                  >
                    Try again
                  </Button>
                </div>
              </div>
            ) : patients.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-subtext">
                <div className="text-center">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No patients found</p>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      onClick={clearFilters}
                      className="mt-2 text-primary hover:text-primary-hover"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              patients.map((patient, index) => (
                <div
                  key={patient.id}
                  onClick={() => !selectMode && handleRowClick(patient.id)}
                  className={`grid gap-4 px-6 py-4 transition-all duration-200 group ${
                    selectMode ? 'grid-cols-13' : 'grid-cols-12'
                  } ${
                    !selectMode ? 'cursor-pointer hover:bg-canvas hover:shadow-sm' : ''
                  } ${
                    index !== patients.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  {/* Checkbox Column */}
                  {selectMode && (
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={selectedPatients.includes(patient.id)}
                        onCheckedChange={() => togglePatientSelection(patient.id)}
                        className="border-border"
                      />
                    </div>
                  )}

                  {/* MRN (Pinned Left) */}
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-text font-mono text-sm">{patient.mrn}</span>
                      <MRNActions mrn={patient.mrn} patientId={patient.id} size="sm" />
                    </div>
                  </div>

                  {/* Patient */}
                  <div className="col-span-3 flex items-center gap-3">
                      <p className="text-text">{patient.full_name}</p>
                  </div>

                  {/* Age */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-text">{calculateAge(patient.dob)}</span>
                  </div>

                  {/* Tags */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex flex-wrap gap-1">
                      {patient.tags.slice(0, 2).map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="bg-canvas text-subtext border-border rounded-lg text-xs px-2 py-1"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {patient.tags.length > 2 && (
                        <span className="text-subtext text-xs">+{patient.tags.length - 2}</span>
                      )}
                    </div>
                  </div>

                  {/* Last Visit */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-subtext" />
                      <span className="text-text">{formatDate(patient.last_visit_at)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex items-center">
                    <Badge 
                      variant={patient.status === 'new' ? 'destructive' : 'secondary'}
                      className={`rounded-lg text-xs px-2 py-1 ${
                        patient.status === 'new' 
                          ? 'bg-danger/10 text-danger border-danger/20' 
                          : patient.status === 'ok'
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-warning/10 text-warning border-warning/20'
                      }`}
                    >
                      {patient.status === 'new' ? 'New' : patient.status === 'ok' ? 'OK' : 'Inactive'}
                    </Badge>
                  </div>

                  {/* Action (Pinned Right) */}
                  {!selectMode && (
                    <div className="col-span-1 flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-primary hover:text-primary-hover hover:bg-primary/5 px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(patient.id);
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Selection Bar - positioned above table footer */}
          {selectMode && selectedPatients.length > 0 && (
            <div className="border-t border-border bg-canvas px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-text text-sm">
                  {selectedPatients.length} selected
                </span>
                <span className="text-subtext">•</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllAcrossPages}
                  className="text-primary hover:text-primary-hover text-sm p-0 h-auto"
                >
                  Select all across pages
                </Button>
                <span className="text-subtext">•</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportSelected}
                  className="text-primary hover:text-primary-hover text-sm p-0 h-auto"
                >
                  Export CSV
                </Button>
                <span className="text-subtext">•</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-subtext hover:text-text text-sm p-0 h-auto"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {patients.length > 0 && (
            <div className="border-t border-border bg-canvas px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-subtext text-sm">Rows per page</Label>
                  <Select 
                    value={itemsPerPage.toString()} 
                    onValueChange={(value) => {
                      setItemsPerPage(parseInt(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 bg-surface border-border rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border border-border rounded-2xl">
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <span className="text-subtext text-sm">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, totalPatients)} of {totalPatients}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="rounded-xl disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`min-w-8 rounded-xl ${
                        pageNumber === currentPage 
                          ? 'bg-primary text-text hover:bg-primary-hover' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="rounded-xl disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
        <AddPatientModal 
          isOpen={addPatientModalOpen} 
          onOpenChange={setAddPatientModalOpen}
          onPatientAdded={loadPatients}
        />
    </div>
  );
}