import React, { useState, useMemo } from 'react';
import { Plus, Filter, X, Calendar, User, ExternalLink, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Copy, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MRNActions } from './mrn-utils';
import { toast } from 'sonner@2.0.3';

interface Patient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  tags: string[];
  lastVisit: string;
  status: 'new-reports' | 'ok';
  avatar?: string;
}

type SortField = 'mrn' | 'name' | 'age' | 'lastVisit' | 'status';
type SortDirection = 'asc' | 'desc';

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Rodriguez',
    mrn: 'MRN-2025-1234',
    age: 34,
    tags: ['Diabetes', 'Hypertension'],
    lastVisit: '2024-01-15',
    status: 'new-reports'
  },
  {
    id: '2',
    name: 'Michael Chen',
    mrn: 'MRN-2025-1235',
    age: 28,
    tags: ['Annual Checkup'],
    lastVisit: '2024-01-12',
    status: 'ok'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    mrn: 'MRN-2025-1236',
    age: 45,
    tags: ['Cardiology', 'Follow-up'],
    lastVisit: '2024-01-10',
    status: 'new-reports'
  },
  {
    id: '4',
    name: 'David Martinez',
    mrn: 'MRN-2025-1237',
    age: 52,
    tags: ['Orthopedic'],
    lastVisit: '2024-01-08',
    status: 'ok'
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    mrn: 'MRN-2025-1238',
    age: 29,
    tags: ['Pregnancy', 'Routine'],
    lastVisit: '2024-01-05',
    status: 'ok'
  },
  {
    id: '6',
    name: 'Robert Kim',
    mrn: 'MRN-2025-1239',
    age: 41,
    tags: ['Gastroenterology'],
    lastVisit: '2024-01-03',
    status: 'new-reports'
  },
  {
    id: '7',
    name: 'Jennifer Wilson',
    mrn: 'MRN-2025-1240',
    age: 37,
    tags: ['Dermatology'],
    lastVisit: '2024-01-01',
    status: 'ok'
  },
  {
    id: '8',
    name: 'James Brown',
    mrn: 'MRN-2025-1241',
    age: 55,
    tags: ['Cardiology', 'Diabetes'],
    lastVisit: '2023-12-28',
    status: 'new-reports'
  },
  {
    id: '9',
    name: 'Maria Garcia',
    mrn: 'MRN-2025-1242',
    age: 42,
    tags: ['Routine'],
    lastVisit: '2023-12-25',
    status: 'ok'
  },
  {
    id: '10',
    name: 'Thomas Johnson',
    mrn: 'MRN-2025-1243',
    age: 31,
    tags: ['Sports Medicine'],
    lastVisit: '2023-12-22',
    status: 'ok'
  },
  {
    id: '11',
    name: 'Susan Davis',
    mrn: 'MRN-2025-1244',
    age: 48,
    tags: ['Endocrinology'],
    lastVisit: '2023-12-20',
    status: 'new-reports'
  },
  {
    id: '12',
    name: 'William Miller',
    mrn: 'MRN-2025-1245',
    age: 39,
    tags: ['Annual Checkup'],
    lastVisit: '2023-12-18',
    status: 'ok'
  }
];

const allTags = Array.from(new Set(mockPatients.flatMap(p => p.tags)));

interface PatientsScreenProps {
  onPatientClick?: (patientId: string) => void;
}

export function PatientsScreen({ onPatientClick }: PatientsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [mrnFilter, setMrnFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('lastVisit');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter, sort, and paginate patients
  const processedPatients = useMemo(() => {
    let filtered = mockPatients;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(query) ||
        patient.mrn.toLowerCase().includes(query) ||
        patient.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(patient => 
        patient.tags.some(tag => selectedTags.includes(tag))
      );
    }

    if (mrnFilter) {
      filtered = filtered.filter(patient => 
        patient.mrn.toLowerCase().includes(mrnFilter.toLowerCase())
      );
    }

    if (dateRange.from) {
      filtered = filtered.filter(patient => 
        new Date(patient.lastVisit) >= new Date(dateRange.from)
      );
    }

    if (dateRange.to) {
      filtered = filtered.filter(patient => 
        new Date(patient.lastVisit) <= new Date(dateRange.to)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'mrn':
          aValue = a.mrn.toLowerCase();
          bValue = b.mrn.toLowerCase();
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'age':
          aValue = a.age;
          bValue = b.age;
          break;
        case 'lastVisit':
          aValue = new Date(a.lastVisit);
          bValue = new Date(b.lastVisit);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [searchQuery, selectedTags, mrnFilter, dateRange, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = processedPatients.slice(startIndex, startIndex + itemsPerPage);

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
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setMrnFilter('');
    setDateRange({ from: '', to: '' });
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || mrnFilter || dateRange.from || dateRange.to;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <h1 className="text-text">Patients</h1>
            
            {/* Search Bar */}
            <div className="relative w-80">
              <Input
                placeholder="Search by name, MRN, or tags..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-surface border-border rounded-2xl pl-4"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="border border-border bg-surface hover:bg-accent rounded-2xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`border border-border bg-surface hover:bg-accent rounded-2xl relative ${
                    hasActiveFilters ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-surface border border-border rounded-2xl shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-text">Filters</h3>
                    {hasActiveFilters && (
                      <Button 
                        variant="ghost" 
                        onClick={clearFilters}
                        className="text-subtext hover:text-text text-sm p-0 h-auto"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  
                  {/* MRN Filter */}
                  <div>
                    <Label className="text-text mb-3 block">Find by MRN</Label>
                    <Input
                      placeholder="Enter MRN (e.g., MRN-2025-1234)"
                      value={mrnFilter}
                      onChange={(e) => {
                        setMrnFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-canvas border-border rounded-xl font-mono"
                    />
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <Label className="text-text mb-3 block">Tags</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {allTags.map(tag => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={tag}
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={(checked) => handleTagFilter(tag, !!checked)}
                            className="border-border"
                          />
                          <Label 
                            htmlFor={tag} 
                            className="text-sm text-subtext cursor-pointer"
                          >
                            {tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div>
                    <Label className="text-text mb-3 block">Last Visit Range</Label>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="from-date" className="text-sm text-subtext">From</Label>
                        <Input
                          id="from-date"
                          type="date"
                          value={dateRange.from}
                          onChange={(e) => handleDateRangeFilter('from', e.target.value)}
                          className="mt-1 bg-canvas border-border rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="to-date" className="text-sm text-subtext">To</Label>
                        <Input
                          id="to-date"
                          type="date"
                          value={dateRange.to}
                          onChange={(e) => handleDateRangeFilter('to', e.target.value)}
                          className="mt-1 bg-canvas border-border rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-canvas text-subtext text-sm">
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
            
            <div className="col-span-1">Action</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto">
            {paginatedPatients.length === 0 ? (
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
              paginatedPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  onClick={() => handleRowClick(patient.id)}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer hover:bg-canvas hover:shadow-sm transition-all duration-200 group ${
                    index !== paginatedPatients.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  {/* MRN (Pinned Left) */}
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-text font-mono text-sm">{patient.mrn}</span>
                      <MRNActions mrn={patient.mrn} patientId={patient.id} size="sm" />
                    </div>
                  </div>

                  {/* Patient */}
                  <div className="col-span-3 flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-text text-sm">
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-text">{patient.name}</p>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-text">{patient.age}</span>
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
                      <span className="text-text">{formatDate(patient.lastVisit)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex items-center">
                    <Badge 
                      variant={patient.status === 'new-reports' ? 'destructive' : 'secondary'}
                      className={`rounded-lg text-xs px-2 py-1 ${
                        patient.status === 'new-reports' 
                          ? 'bg-danger/10 text-danger border-danger/20' 
                          : 'bg-success/10 text-success border-success/20'
                      }`}
                    >
                      {patient.status === 'new-reports' ? 'New' : 'OK'}
                    </Badge>
                  </div>

                  {/* Action (Pinned Right) */}
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
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {processedPatients.length > 0 && (
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
                  Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, processedPatients.length)} of {processedPatients.length}
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
    </div>
  );
}