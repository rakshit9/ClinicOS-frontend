import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Check, 
  FileText, 
  Brain, 
  Clock, 
  Calendar, 
  Shield, 
  Users, 
  ArrowRight, 
  ChevronDown, 
  Upload, 
  Copy, 
  RotateCcw, 
  ExternalLink, 
  Zap, 
  Target, 
  Flag,
  X,
  Heart,
  Star,
  MapPin,
  ArrowUp,
  Menu
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AILandingPageProps {
  onTryDemo: () => void;
  onSignIn?: () => void;
}

export function AILandingPage({ onTryDemo, onSignIn }: AILandingPageProps) {
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>();
  const [aiDemoState, setAiDemoState] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [aiProgress, setAiProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [visibleBullets, setVisibleBullets] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);
  const [heroCardHover, setHeroCardHover] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const nav = document.querySelector('nav');
      if (isMobileMenuOpen && nav && !nav.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const screenshots = [
    {
      title: 'Overview Dashboard',
      description: 'Needs Review queue with AI summaries',
      image: '/api/placeholder/800/500'
    },
    {
      title: 'Patient Detail',
      description: 'Reports + Last Note + Appointments',
      image: '/api/placeholder/800/500'
    },
    {
      title: 'Appointments',
      description: 'Off day aware scheduling',
      image: '/api/placeholder/800/500'
    },
    {
      title: 'Settings',
      description: 'Availability configuration',
      image: '/api/placeholder/800/500'
    }
  ];

  const aiSteps = ['OCR', 'Extract', 'Summarize'];
  
  const sampleReports = [
    { name: 'CBC Report', type: 'Complete Blood Count' },
    { name: 'Lipid Panel', type: 'Cholesterol & Triglycerides' },
    { name: 'Metabolic Panel', type: 'Basic Metabolic Profile' }
  ];

  const aiSummaryBullets = [
    'HbA1c at 7.1% indicates suboptimal diabetes control',
    'LDL cholesterol elevated at 165 mg/dL - dietary intervention needed',
    'Fasting glucose within normal range suggests good acute control',
    'Follow-up recommended in 3 months for HbA1c reassessment',
    'Consider statin therapy for lipid management'
  ];

  const extractedValues = [
    { name: 'Glucose (Fasting)', value: '95', unit: 'mg/dL', range: '70-99', flag: 'Normal' },
    { name: 'HbA1c', value: '7.1', unit: '%', range: '<7.0', flag: 'Elevated' },
    { name: 'Total Cholesterol', value: '185', unit: 'mg/dL', range: '<200', flag: 'Normal' },
    { name: 'LDL Cholesterol', value: '110', unit: 'mg/dL', range: '<100', flag: 'Elevated' }
  ];

  const marqueeItems = [
    'Needs Review queue',
    'One last note per patient',
    'Off-day aware slots',
    'MRN instant lookup',
    'AI summary bullets',
    'Clinical flag priorities'
  ];

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: 'Needs Review queue',
      description: 'AI-powered triage prioritizes reports by clinical urgency and abnormal findings'
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: 'AI Summary',
      description: 'Instant plain-language summaries with key findings and clinical implications'
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: 'Single "Last Doctor Note"',
      description: 'One editable note per patient — no endless scrolling through historical notes'
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: 'Physical-only scheduling',
      description: 'Clean interface focused on in-person visits, no telehealth clutter'
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: 'Off days & holidays',
      description: 'Smart scheduling that only shows available slots to patients'
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: 'Audit & security',
      description: 'Role-based access with comprehensive session management and audit trails'
    }
  ];

  const workflowSteps = [
    {
      title: 'OCR & layout parsing',
      description: 'Extract values and reference ranges from lab documents with medical-grade accuracy',
      detail: 'Advanced optical character recognition identifies test names, numerical values, units, and reference ranges with 99.7% accuracy for standard lab formats.'
    },
    {
      title: 'Clinical mapping',
      description: 'Map results to normal/abnormal flags using evidence-based reference ranges',
      detail: 'Clinical algorithms cross-reference extracted values against age-adjusted, gender-specific reference ranges to generate accurate Normal/High/Low/Critical flags.'
    },
    {
      title: 'Plain-language summary',
      description: 'Generate concise bullet points highlighting key findings and next steps',
      detail: 'Natural language processing creates 3-5 actionable summary points focusing on abnormal findings, clinical significance, and recommended follow-up actions.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Internal Medicine',
      quote: 'AI summaries save me 15 minutes per report. The single note system keeps everything organized.',
      avatar: 'https://images.unsplash.com/photo-1576669801945-7a346954da5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFsJTIwd29tYW4lMjBkb2N0b3J8ZW58MXx8fHwxNzU3MTAxMTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Family Practice',
      quote: 'Off-day scheduling finally works. Patients can\'t book when I\'m unavailable anymore.',
      avatar: 'https://images.unsplash.com/photo-1645066928295-2506defde470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFsJTIwbWFsZSUyMGRvY3RvciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzEwMTE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Dr. Emily Park',
      role: 'Preventive Care',
      quote: 'The Needs Review queue helped us catch critical values we might have missed.',
      avatar: 'https://images.unsplash.com/photo-1632054224659-280be3239aff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBjbGluaWNpYW4lMjBoZWFkc2hvdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTcxMDExNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const faqItems = [
    {
      question: 'Do you support telehealth appointments?',
      answer: 'No — Doctor Dashboard is designed exclusively for physical visits. This keeps the interface clean and focused on in-person care.'
    },
    {
      question: 'What is the "last doctor note" concept?',
      answer: 'Each patient has exactly one editable note that contains the most recent and relevant information. This eliminates note sprawl and ensures critical information is always accessible.'
    },
    {
      question: 'How does the AI summary work?',
      answer: 'Our AI analyzes lab reports using OCR and clinical mapping to extract values, flag abnormalities, and generate plain-language summaries. All outputs are clearly marked for clinical review.'
    },
    {
      question: 'Can patients book appointments on my off days?',
      answer: 'No. Off days, holidays, and blocked periods are automatically hidden from patient booking. They only see truly available slots.'
    },
    {
      question: 'Is this HIPAA compliant?',
      answer: 'Yes, ClinicPilot includes comprehensive security controls, audit logs, and data protection measures designed to meet healthcare compliance requirements.'
    }
  ];

  const runAIDemo = async (reportType?: string) => {
    setAiDemoState('processing');
    setAiProgress(0);
    setCurrentStep(0);
    setVisibleBullets(0);
    setShowTyping(false);

    // Step 1: OCR
    for (let i = 0; i <= 33; i++) {
      setAiProgress(i);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    setCurrentStep(1);

    // Step 2: Extract
    for (let i = 34; i <= 66; i++) {
      setAiProgress(i);
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    setCurrentStep(2);

    // Step 3: Summarize
    for (let i = 67; i <= 100; i++) {
      setAiProgress(i);
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    setAiDemoState('complete');
    setShowTyping(true);

    // Show bullets one by one
    for (let i = 0; i < aiSummaryBullets.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setVisibleBullets(i + 1);
    }
    setShowTyping(false);
  };

  const resetDemo = () => {
    setAiDemoState('idle');
    setAiProgress(0);
    setCurrentStep(0);
    setVisibleBullets(0);
    setShowTyping(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const resetAndScrollToTop = () => {
    setOpenAccordion(undefined);
    setActiveScreenshot(0);
    resetDemo();
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'Elevated':
      case 'High':
      case 'Critical':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'Low':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-success/10 text-success border-success/20';
    }
  };

  return (
    <div className="min-h-screen bg-canvas relative">
      {/* Subtle noise texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px'
        }}
      />

      {/* Navigation - Glass */}
      <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={resetAndScrollToTop}
            className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground text-sm sm:text-lg">CP</span>
            </div>
            <span className="text-text text-lg sm:text-xl">ClinicPilot</span>
          </button>

          {/* Navigation Links - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-subtext hover:text-text transition-colors text-sm xl:text-base"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-subtext hover:text-text transition-colors text-sm xl:text-base"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('live-ai-demo')}
              className="text-primary hover:text-primary-hover transition-colors text-sm xl:text-base"
            >
              Live AI
            </button>
            <button 
              onClick={() => scrollToSection('screens')}
              className="text-subtext hover:text-text transition-colors text-sm xl:text-base"
            >
              Screens
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-subtext hover:text-text transition-colors text-sm xl:text-base"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-subtext hover:text-text transition-colors text-sm xl:text-base"
            >
              FAQ
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onSignIn}
              className="border border-border rounded-3xl text-subtext hover:text-text px-6 py-3 text-sm"
            >
              Sign in
            </Button>
            <Button 
              onClick={onTryDemo}
              className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-3xl px-6 py-3 shadow-lg shadow-primary/20 text-sm"
            >
              Try Demo
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Button 
              onClick={onTryDemo}
              className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl px-4 py-2 shadow-lg shadow-primary/20 text-sm"
            >
              Demo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-primary/10 rounded-2xl"
            >
              <Menu className="w-5 h-5 text-text" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-md border-b border-border shadow-2xl mobile-menu-enter">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="mobile-nav-item w-full text-left text-text hover:text-primary transition-colors py-3 px-4 rounded-2xl hover:bg-primary/5 active:bg-primary/10"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="mobile-nav-item w-full text-left text-text hover:text-primary transition-colors py-3 px-4 rounded-2xl hover:bg-primary/5 active:bg-primary/10"
                >
                  How it works
                </button>
                <button 
                  onClick={() => scrollToSection('live-ai-demo')}
                  className="mobile-nav-item w-full text-left text-primary py-3 px-4 rounded-2xl bg-primary/10 hover:bg-primary/15 active:bg-primary/20"
                >
                  Live AI Demo
                </button>
                <button 
                  onClick={() => scrollToSection('screens')}
                  className="mobile-nav-item w-full text-left text-text hover:text-primary transition-colors py-3 px-4 rounded-2xl hover:bg-primary/5 active:bg-primary/10"
                >
                  Screens
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="mobile-nav-item w-full text-left text-text hover:text-primary transition-colors py-3 px-4 rounded-2xl hover:bg-primary/5 active:bg-primary/10"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="mobile-nav-item w-full text-left text-text hover:text-primary transition-colors py-3 px-4 rounded-2xl hover:bg-primary/5 active:bg-primary/10"
                >
                  FAQ
                </button>
              </div>

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-border space-y-3">
                <Button 
                  onClick={() => { onSignIn(); setIsMobileMenuOpen(false); }}
                  variant="ghost"
                  className="w-full justify-center border border-border rounded-2xl text-subtext hover:text-text py-3 touch-target-48"
                >
                  Sign in
                </Button>
                <Button 
                  onClick={() => { onTryDemo(); setIsMobileMenuOpen(false); }}
                  className="w-full justify-center bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl py-3 shadow-lg shadow-primary/20 touch-target-48"
                >
                  Try Live Demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Kinetic */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-40 sm:opacity-60"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1631507623112-0092cef9c70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGluaWMlMjBhYnN0cmFjdCUyMGJyaWdodCUyMG1lZGljYWx8ZW58MXx8fHwxNzU3MTAxMTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.5}px)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-canvas opacity-40" />
          <div className="absolute inset-0 bg-canvas/90" />
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Text Stack */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-4 py-2 w-fit mx-auto lg:mx-0">
                Doctor-first
              </Badge>
              
              <div className="space-y-4 lg:space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight text-text">
                  See your reports<br />
                  <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                    think for you.
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-subtext leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Instant AI summaries for lab reports, a single last note for every patient, 
                  and off-day aware scheduling.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 justify-center lg:justify-start">
                <Button 
                  size="lg"
                  onClick={onTryDemo}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-3xl px-6 py-3 lg:px-8 lg:py-4 text-base lg:text-lg shadow-2xl shadow-primary/30 w-full sm:w-auto"
                >
                  Try Live Demo
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="border border-border rounded-3xl text-subtext hover:text-text px-6 py-3 lg:px-8 lg:py-4 text-base lg:text-lg w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                  Watch 60s
                </Button>
              </div>
            </div>

            {/* Right: 3-Layer Parallax Stack */}
            <div className="relative order-first lg:order-last">
              {/* Back layer: Radial glow */}
              <div 
                className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl scale-150 hidden lg:block"
                style={{ transform: `translateY(${scrollY * -0.1}px)` }}
              />

              {/* Mid layer: Tilted laptop */}
              <div 
                className="relative transform rotate-0 lg:rotate-12 perspective-1000"
                style={{ transform: `rotate(0deg) ${window.innerWidth >= 1024 ? 'rotate(12deg)' : ''} translateY(${scrollY * -0.15}px)` }}
              >
                <div className="bg-surface border border-border rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-2xl shadow-primary/10">
                  <div className="bg-canvas rounded-xl lg:rounded-2xl p-3 lg:p-4 aspect-video">
                    <ImageWithFallback 
                      src="/api/placeholder/640/400" 
                      alt="Doctor Dashboard Interface"
                      className="w-full h-full object-cover rounded-lg lg:rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Foreground: Floating glass cards - Hidden on mobile for better performance */}
              <div className="absolute inset-0 hidden lg:block">
                {/* AI Summary Card */}
                <div 
                  className={`absolute -right-8 top-12 w-80 bg-surface/90 backdrop-blur-md border border-border rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
                    heroCardHover === 'ai' ? 'transform translate-y-[-4px] shadow-3xl' : ''
                  }`}
                  style={{ transform: `translateY(${scrollY * -0.2}px) ${heroCardHover === 'ai' ? 'translateY(-4px)' : ''}` }}
                  onMouseEnter={() => setHeroCardHover('ai')}
                  onMouseLeave={() => setHeroCardHover(null)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-text">AI Summary</span>
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-text">HbA1c at 7.1% indicates suboptimal control</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-text">LDL cholesterol elevated - intervention needed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-text">Fasting glucose within normal range</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-text">Follow-up recommended in 3 months</span>
                    </div>
                  </div>
                </div>

                {/* Extracted Values Mini-Table */}
                <div 
                  className={`absolute -left-6 bottom-8 w-72 bg-surface/90 backdrop-blur-md border border-border rounded-3xl p-5 shadow-xl transition-all duration-300 ${
                    heroCardHover === 'values' ? 'transform translate-y-[-4px] shadow-2xl' : ''
                  }`}
                  style={{ transform: `translateY(${scrollY * -0.25}px) ${heroCardHover === 'values' ? 'translateY(-4px)' : ''}` }}
                  onMouseEnter={() => setHeroCardHover('values')}
                  onMouseLeave={() => setHeroCardHover(null)}
                >
                  <h4 className="text-text text-sm mb-4">Extracted Values</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-2 px-3 bg-canvas/60 rounded-xl">
                      <div>
                        <div className="text-text">Glucose</div>
                        <div className="text-subtext">70-99</div>
                      </div>
                      <div className="text-right">
                        <div className="text-text tabular-nums">95</div>
                        <Badge className="bg-success/10 text-success border-success/20 text-xs">Normal</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-canvas/60 rounded-xl">
                      <div>
                        <div className="text-text">HbA1c</div>
                        <div className="text-subtext">&lt;7.0</div>
                      </div>
                      <div className="text-right">
                        <div className="text-text tabular-nums">7.1%</div>
                        <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">Elevated</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MRN Chip */}
                <div 
                  className={`absolute right-24 -bottom-4 bg-surface/90 backdrop-blur-md border border-border rounded-full px-4 py-2 shadow-lg transition-all duration-300 ${
                    heroCardHover === 'mrn' ? 'transform translate-y-[-4px] shadow-xl' : ''
                  }`}
                  style={{ transform: `translateY(${scrollY * -0.3}px) ${heroCardHover === 'mrn' ? 'translateY(-4px)' : ''}` }}
                  onMouseEnter={() => setHeroCardHover('mrn')}
                  onMouseLeave={() => setHeroCardHover(null)}
                >
                  <span className="text-text text-sm font-mono">MRN-2025-1234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE AI Demo Section - Holographic Console */}
      <section id="live-ai-demo" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text mb-4 lg:mb-6">See AI in Action</h2>
            <p className="text-lg sm:text-xl text-subtext">Watch our AI analyze a real lab report in real-time</p>
          </div>

          {/* Hologram Strip */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl border border-primary/20">
              {aiSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                      index < currentStep ? 'bg-primary scale-110' :
                      index === currentStep && aiDemoState === 'processing' ? 'bg-primary animate-pulse scale-125 shadow-lg shadow-primary/50' :
                      'bg-border scale-100'
                    }`} />
                    <span className={`text-lg ${
                      index <= currentStep && aiDemoState === 'processing' ? 'text-text' : 'text-subtext'
                    }`}>
                      {step}
                    </span>
                  </div>
                  {index < aiSteps.length - 1 && (
                    <div className="flex items-center">
                      <div className="w-12 h-0.5 bg-gradient-to-r from-border to-transparent mx-4" />
                      <ArrowRight className="w-4 h-4 text-subtext" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-surface/80 backdrop-blur-md border border-border rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Upload Console */}
                <div className="p-6 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-border">
                  <h3 className="text-text text-lg lg:text-xl mb-6 lg:mb-8">Upload a report</h3>
                  
                  {/* Dropzone */}
                  <div className="border-2 border-dashed border-border rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-center mb-6 lg:mb-8 hover:border-primary/50 transition-colors cursor-pointer bg-canvas/30">
                    <Upload className="w-8 h-8 lg:w-12 lg:h-12 text-subtext mx-auto mb-4 lg:mb-6" />
                    <p className="text-text mb-2 text-sm lg:text-base">Drop files here or click to upload</p>
                    <p className="text-subtext text-sm">PDF, JPG, PNG up to 10MB</p>
                  </div>

                  {/* Sample Reports */}
                  <div className="space-y-3 lg:space-y-4">
                    <p className="text-subtext text-sm lg:text-base">Or use a sample report:</p>
                    {sampleReports.map((report, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => runAIDemo(report.name)}
                        disabled={aiDemoState === 'processing'}
                        className="w-full justify-start border border-border rounded-2xl lg:rounded-3xl text-left p-4 lg:p-6 h-auto hover:bg-primary/5 transition-all"
                      >
                        <div>
                          <div className="text-text text-sm lg:text-base">{report.name}</div>
                          <div className="text-subtext text-xs lg:text-sm">{report.type}</div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-warning/5 border border-warning/20 rounded-xl lg:rounded-2xl">
                    <p className="text-warning text-xs lg:text-sm">Privacy note: Files stay local in this demo.</p>
                  </div>
                </div>

                {/* Right: AI Analysis Panel */}
                <div className="p-6 sm:p-8 lg:p-12">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
                    <h3 className="text-text text-lg lg:text-xl">AI Summary</h3>
                    {aiDemoState === 'complete' && (
                      <div className="flex items-center gap-2 lg:gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetDemo}
                          className="border border-border rounded-xl lg:rounded-2xl px-3 py-2 lg:px-4 text-xs lg:text-sm"
                        >
                          <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                          Re-run
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(aiSummaryBullets.join('\n'))}
                          className="border border-border rounded-xl lg:rounded-2xl px-3 py-2 lg:px-4 text-xs lg:text-sm"
                        >
                          <Copy className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>

                  {aiDemoState === 'idle' && (
                    <div className="text-center py-16">
                      <Brain className="w-16 h-16 text-subtext/20 mx-auto mb-6" />
                      <p className="text-subtext text-lg">Select a sample report to see AI analysis</p>
                    </div>
                  )}

                  {aiDemoState === 'processing' && (
                    <div className="space-y-8">
                      <Progress value={aiProgress} className="h-3 rounded-full" />
                      
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                        </div>
                        <span className="text-subtext">Analyzing report...</span>
                      </div>
                    </div>
                  )}

                  {aiDemoState === 'complete' && (
                    <div className="space-y-8">
                      {/* AI Summary Bullets */}
                      <div className="space-y-4">
                        {aiSummaryBullets.slice(0, visibleBullets).map((bullet, index) => (
                          <div key={index} className="flex items-start gap-3 text-sm animate-fade-in">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-text leading-relaxed">{bullet}</span>
                          </div>
                        ))}
                        {showTyping && visibleBullets < aiSummaryBullets.length && (
                          <div className="flex items-center gap-3">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Extracted Values Table */}
                      <div className="border-t border-border pt-8">
                        <h4 className="text-text mb-6">Extracted Values</h4>
                        <div className="space-y-3">
                          {extractedValues.map((value, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-canvas/50 rounded-2xl">
                              <div className="flex-1">
                                <div className="text-text">{value.name}</div>
                                <div className="text-subtext text-sm">Ref: {value.range}</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-text tabular-nums">{value.value} {value.unit}</span>
                                <Badge className={`${getFlagColor(value.flag)} rounded-full px-3 py-1`}>
                                  {value.flag}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center gap-4 pt-6">
                        <Button
                          onClick={onTryDemo}
                          className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-3xl px-6 py-3 shadow-lg shadow-primary/20"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in app shell
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="mt-12 p-4 bg-subtext/5 rounded-2xl">
                    <p className="text-subtext text-sm">
                      AI Summary • From: Lab Report • Jan 15, 2024
                    </p>
                    <p className="text-subtext text-xs mt-1">For clinical support only; not a diagnosis.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why It's Different - Marquee */}
      <section className="py-24 overflow-hidden bg-gradient-to-r from-primary/5 to-transparent">
        <div 
          className="flex items-center space-x-12 animate-marquee"
          style={{
            animationPlayState: isMarqueeHovered ? 'paused' : 'running',
            animationDuration: '30s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
          onMouseEnter={() => setIsMarqueeHovered(true)}
          onMouseLeave={() => setIsMarqueeHovered(false)}
        >
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="whitespace-nowrap border-primary/30 text-primary bg-primary/5 rounded-full px-6 py-3 text-lg"
            >
              {item}
            </Badge>
          ))}
        </div>
      </section>

      {/* How It Works - Scroll-Pinned */}
      <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text mb-4 lg:mb-6">How it works</h2>
            <p className="text-lg sm:text-xl text-subtext">Three steps from lab report to actionable insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Steps */}
            <div className="space-y-8 lg:space-y-12">
              {workflowSteps.map((step, index) => (
                <div key={index} className="space-y-3 lg:space-y-4">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 flex-shrink-0">
                      <span className="text-primary text-sm lg:text-base">{index + 1}</span>
                    </div>
                    <h3 className="text-text text-lg lg:text-xl">{step.title}</h3>
                  </div>
                  <p className="text-subtext text-base lg:text-lg leading-relaxed ml-11 lg:ml-14">{step.description}</p>
                  <p className="text-subtext text-sm leading-relaxed ml-11 lg:ml-14 opacity-75">{step.detail}</p>
                </div>
              ))}

              {/* Safety Panel */}
              <div className="ml-11 lg:ml-14 p-4 lg:p-6 bg-surface border border-border rounded-2xl lg:rounded-3xl">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  <h4 className="text-text text-base lg:text-lg">Safety & Accuracy</h4>
                </div>
                <p className="text-subtext text-sm">
                  All AI outputs are clearly labeled for clinical review. Risk-sensitive values are flagged 
                  for immediate attention with evidence-based thresholds.
                </p>
              </div>
            </div>

            {/* Right: Animated Diagram */}
            <div className="relative order-first lg:order-last">
              <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl lg:rounded-3xl p-8 lg:p-12 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl lg:rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-16 h-16 lg:w-24 lg:h-24 text-primary mx-auto mb-4 lg:mb-6" />
                    <p className="text-text text-lg lg:text-xl">AI Analysis Engine</p>
                    <p className="text-subtext text-sm lg:text-base">Processing lab data with clinical intelligence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screens - 3D Rail */}
      <section id="screens" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text mb-4 lg:mb-6">Explore the screens</h2>
            <p className="text-lg sm:text-xl text-subtext">See every part of the ClinicPilot interface</p>
          </div>

          <div className="relative">
            <div className="flex items-center gap-10 overflow-x-auto pb-8 scroll-smooth screens-scroll">
              {screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 transition-all duration-700 cursor-pointer group ${
                    index === activeScreenshot ? 'z-10' : 'z-0'
                  }`}
                  onClick={() => setActiveScreenshot(index)}
                  style={{
                    transform: `perspective(1200px) rotateY(${index === activeScreenshot ? '0deg' : '25deg'}) scale(${index === activeScreenshot ? 1.1 : 0.85})`,
                    opacity: index === activeScreenshot ? 1 : 0.6
                  }}
                >
                  {/* Glow effect for active card */}
                  {index === activeScreenshot && (
                    <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-3xl blur-2xl scale-110 -z-10" />
                  )}
                  
                  <div className={`w-80 sm:w-96 bg-surface/95 backdrop-blur-md border transition-all duration-700 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl group-hover:shadow-3xl ${
                    index === activeScreenshot 
                      ? 'border-primary/30 shadow-primary/10' 
                      : 'border-border hover:border-primary/20'
                  }`}>
                    {/* Screen mockup with enhanced depth */}
                    <div className="relative bg-gradient-to-br from-canvas to-canvas/80 rounded-xl lg:rounded-2xl p-3 lg:p-5 aspect-video mb-4 lg:mb-6 overflow-hidden">
                      {/* Screen bezel effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-xl lg:rounded-2xl pointer-events-none" />
                      
                      <ImageWithFallback 
                        src={screenshot.image}
                        alt={screenshot.title}
                        className="w-full h-full object-cover rounded-lg lg:rounded-xl shadow-lg relative z-10"
                      />
                      
                      {/* Screen reflection */}
                      <div className="absolute inset-2 bg-gradient-to-tr from-white/10 to-transparent rounded-lg lg:rounded-xl pointer-events-none" />
                    </div>
                    
                    {/* Enhanced text section */}
                    <div className="space-y-2 lg:space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-text text-lg lg:text-xl">{screenshot.title}</h3>
                        {index === activeScreenshot && (
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-subtext leading-relaxed text-sm lg:text-base">{screenshot.description}</p>
                      
                      {/* Interactive indicator */}
                      <div className={`w-full h-1 bg-gradient-to-r from-border to-transparent rounded-full transition-all duration-500 ${
                        index === activeScreenshot ? 'from-primary/50 to-primary/10' : ''
                      }`} />
                    </div>
                  </div>
                  
                  {/* Hover enhancement */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Enhanced Navigation */}
            <div className="flex items-center justify-center gap-6 mt-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveScreenshot(Math.max(0, activeScreenshot - 1))}
                disabled={activeScreenshot === 0}
                className="rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-3 px-4 py-2 bg-surface/50 backdrop-blur-sm rounded-full border border-border/30">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveScreenshot(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === activeScreenshot 
                        ? 'w-8 h-3 bg-primary shadow-lg shadow-primary/30' 
                        : 'w-3 h-3 bg-border hover:bg-primary/40'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveScreenshot(Math.min(screenshots.length - 1, activeScreenshot + 1))}
                disabled={activeScreenshot === screenshots.length - 1}
                className="rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Contrast Band */}
      <section id="pricing" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-primary/8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text mb-4 lg:mb-6">Simple pricing</h2>
            <p className="text-lg sm:text-xl text-subtext">Choose the plan that fits your practice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: 'Starter',
                price: '$99',
                period: '/month',
                description: 'Perfect for solo practitioners',
                features: ['Up to 100 reports/month', 'AI summaries', 'Basic scheduling', 'Email support'],
                cta: 'Start free trial'
              },
              {
                name: 'Clinic',
                price: '$299',
                period: '/month',
                description: 'For small to medium practices',
                features: ['Up to 500 reports/month', 'Advanced AI insights', 'Team scheduling', 'Priority support', 'Custom workflows'],
                cta: 'Most popular',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                description: 'For large healthcare organizations',
                features: ['Unlimited reports', 'Custom AI models', 'Advanced integrations', 'Dedicated support', 'Custom training'],
                cta: 'Contact sales'
              }
            ].map((plan, index) => (
              <Card key={index} className={`bg-surface/80 backdrop-blur-sm border rounded-2xl lg:rounded-3xl hover:shadow-2xl transition-all duration-300 ${plan.popular ? 'border-primary shadow-2xl shadow-primary/20 md:scale-105' : 'border-border'}`}>
                <CardContent className="p-6 lg:p-8">
                  {plan.popular && (
                    <Badge className="bg-primary text-primary-foreground rounded-full px-3 py-1 mb-4">
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="text-text text-xl lg:text-2xl mb-2">{plan.name}</h3>
                  <p className="text-subtext mb-4 lg:mb-6 text-sm lg:text-base">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-2 mb-6 lg:mb-8">
                    <span className="text-text text-3xl lg:text-4xl">{plan.price}</span>
                    <span className="text-subtext text-sm lg:text-base">{plan.period}</span>
                  </div>

                  <ul className="space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-subtext text-sm lg:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full rounded-2xl lg:rounded-3xl text-sm lg:text-base ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary-hover text-primary-foreground' 
                        : 'border border-border text-subtext hover:text-text'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text mb-4 lg:mb-6">Trusted by doctors</h2>
            <p className="text-lg sm:text-xl text-subtext">See what healthcare professionals say about ClinicPilot</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-surface border border-border rounded-2xl lg:rounded-3xl hover:shadow-lg transition-shadow">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                    <div className="relative">
                      <ImageWithFallback
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-success rounded-full border-2 border-surface flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-text text-sm lg:text-base">{testimonial.name}</h4>
                      <p className="text-subtext text-xs lg:text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <blockquote className="text-text leading-relaxed text-sm lg:text-base">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text mb-4 lg:mb-6">Frequently asked questions</h2>
            <p className="text-lg sm:text-xl text-subtext">Everything you need to know about ClinicPilot</p>
          </div>

          <Accordion 
            type="single" 
            collapsible 
            value={openAccordion} 
            onValueChange={setOpenAccordion}
            className="space-y-4"
          >
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={index.toString()} className="border border-border rounded-2xl lg:rounded-3xl px-4 sm:px-6 lg:px-8">
                <AccordionTrigger className="text-left text-text hover:no-underline py-4 lg:py-6 text-sm lg:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-subtext leading-relaxed pb-4 lg:pb-6 text-sm lg:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-text/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 lg:mb-16">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-4 lg:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-3xl flex items-center justify-center">
                  <span className="text-primary-foreground text-base lg:text-lg">CP</span>
                </div>
                <span className="text-text text-lg lg:text-xl">ClinicPilot</span>
              </div>
              <p className="text-subtext text-sm leading-relaxed">
                AI-powered lab report analysis and practice management for modern healthcare.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-text mb-4 lg:mb-6 text-sm lg:text-base">Product</h4>
              <ul className="space-y-2 lg:space-y-3 text-subtext text-xs lg:text-sm">
                <li><button className="hover:text-text transition-colors">Features</button></li>
                <li><button className="hover:text-text transition-colors">Pricing</button></li>
                <li><button className="hover:text-text transition-colors">AI Demo</button></li>
                <li><button className="hover:text-text transition-colors">Security</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-text mb-4 lg:mb-6 text-sm lg:text-base">Company</h4>
              <ul className="space-y-2 lg:space-y-3 text-subtext text-xs lg:text-sm">
                <li><button className="hover:text-text transition-colors">About</button></li>
                <li><button className="hover:text-text transition-colors">Blog</button></li>
                <li><button className="hover:text-text transition-colors">Careers</button></li>
                <li><button className="hover:text-text transition-colors">Press</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-text mb-4 lg:mb-6 text-sm lg:text-base">Resources</h4>
              <ul className="space-y-2 lg:space-y-3 text-subtext text-xs lg:text-sm">
                <li><button className="hover:text-text transition-colors">Documentation</button></li>
                <li><button className="hover:text-text transition-colors">Help Center</button></li>
                <li><button className="hover:text-text transition-colors">Webinars</button></li>
                <li><button className="hover:text-text transition-colors">Community</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-text mb-4 lg:mb-6 text-sm lg:text-base">Legal</h4>
              <ul className="space-y-2 lg:space-y-3 text-subtext text-xs lg:text-sm">
                <li><button className="hover:text-text transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-text transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-text transition-colors">HIPAA Compliance</button></li>
                <li><button className="hover:text-text transition-colors">Security</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 lg:pt-8 border-t border-border">
            <p className="text-subtext text-xs lg:text-sm text-center sm:text-left">© 2025 ClinicPilot. All rights reserved.</p>
            <div className="flex items-center gap-4 lg:gap-6 justify-center sm:justify-end">
              <button className="text-subtext hover:text-text transition-colors">
                <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <button className="text-subtext hover:text-text transition-colors">
                <Star className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <button className="text-subtext hover:text-text transition-colors">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}