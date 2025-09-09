import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Check, FileText, Brain, Clock, Calendar, Shield, Users, ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function LandingPage() {
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>();

  const screenshots = [
    {
      title: 'Overview Dashboard',
      description: 'Needs Review queue with AI summaries',
      image: '/api/placeholder/800/500'
    },
    {
      title: 'Patient Detail',
      description: 'Reports, Notes, and Appointments in one view',
      image: '/api/placeholder/800/500'
    },
    {
      title: 'Appointments',
      description: 'Off-day aware scheduling with open slots',
      image: '/api/placeholder/800/500'
    },
    {
      title: 'Settings',
      description: 'Availability and practice configuration',
      image: '/api/placeholder/800/500'
    }
  ];

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: 'Needs Review queue',
      description: 'Triage new reports quickly with AI-generated summaries and extracted values'
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: 'AI Summary',
      description: 'Clear, 3–5 bullet insights per report with key findings highlighted'
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: 'Last Doctor Note',
      description: 'Exactly one editable note per patient — no endless scrolling'
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: 'Physical-only scheduling',
      description: 'No video calls, no clutter — just in-person appointments'
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: 'Off days, half days, holidays',
      description: 'Patients only see bookable time slots, never unavailable periods'
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: 'Audit & security',
      description: 'Role-based access controls and comprehensive session management'
    }
  ];

  const faqItems = [
    {
      question: 'Can I book telehealth appointments?',
      answer: 'No — Doctor Dashboard is designed exclusively for physical visits. This keeps the interface clean and focused on in-person care.'
    },
    {
      question: 'Can patients book on off days?',
      answer: 'No. Off days, holidays, and blocked time periods are automatically disabled in the booking interface. Patients only see available slots.'
    },
    {
      question: 'What is the "last doctor note" concept?',
      answer: 'Each patient has exactly one editable note that contains the most recent and relevant information. This eliminates note sprawl and ensures critical information is always front and center.'
    },
    {
      question: 'How does the AI summary work?',
      answer: 'Our AI analyzes lab reports and medical documents to extract key findings, flag abnormal values, and generate 3-5 bullet point summaries. All AI outputs are clearly marked and should be verified by medical professionals.'
    },
    {
      question: 'Is this HIPAA compliant?',
      answer: 'Yes, Doctor Dashboard includes comprehensive security controls, audit logs, and data protection measures designed to meet healthcare compliance requirements.'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetAndScrollToTop = () => {
    setOpenAccordion(undefined);
    setActiveScreenshot(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={resetAndScrollToTop}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-medium text-sm">DD</span>
            </div>
            <span className="text-text font-medium text-lg">Doctor Dashboard</span>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-subtext hover:text-text transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-subtext hover:text-text transition-colors"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('screens')}
              className="text-subtext hover:text-text transition-colors"
            >
              Screens
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-subtext hover:text-text transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-subtext hover:text-text transition-colors"
            >
              FAQ
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="border border-border rounded-2xl text-subtext hover:text-text">
              Sign in
            </Button>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl">
              Try Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-medium text-text mb-6 leading-tight">
              Fast, clear, clinic-ready.
            </h1>
            <p className="text-xl text-subtext mb-12 max-w-3xl mx-auto leading-relaxed">
              A doctor-first dashboard for physical visits: instant report summaries, 
              a single 'last note' per patient, and off-day aware scheduling.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-16">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl px-8 py-4">
                Try the Live Demo
              </Button>
              <Button variant="ghost" size="lg" className="border border-border rounded-2xl text-subtext hover:text-text px-8 py-4">
                <Play className="w-4 h-4 mr-2" />
                Watch 60s Overview
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-surface border border-border rounded-3xl p-8 shadow-lg">
              <ImageWithFallback 
                src="/api/placeholder/800/500" 
                alt="Doctor Dashboard Overview"
                className="w-full rounded-2xl"
              />
            </div>
            
            {/* Floating Drawer Preview */}
            <div className="absolute -right-8 top-16 w-80 bg-surface border border-border rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-text font-medium text-sm">AI Summary</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-text">Lipid panel shows elevated LDL at 165 mg/dL</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-text">HbA1c improved to 6.8% from previous 7.2%</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-text">Blood pressure within normal range</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="text-xs text-subtext mb-2">Extracted Values</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-canvas rounded-lg p-2">
                    <div className="text-subtext">LDL</div>
                    <div className="text-text font-medium">165 mg/dL</div>
                  </div>
                  <div className="bg-canvas rounded-lg p-2">
                    <div className="text-subtext">HbA1c</div>
                    <div className="text-text font-medium">6.8%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Chips */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Badge variant="outline" className="border border-border text-subtext bg-surface rounded-full px-4 py-2">
                AI report summary
              </Badge>
              <Badge variant="outline" className="border border-border text-subtext bg-surface rounded-full px-4 py-2">
                Physical appointments only
              </Badge>
              <Badge variant="outline" className="border border-border text-subtext bg-surface rounded-full px-4 py-2">
                Off-day & waitlist logic
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-subtext text-sm mb-8">Trusted by modern practices</p>
          <div className="flex items-center justify-center gap-12 opacity-40">
            <div className="w-24 h-8 bg-text/10 rounded-lg"></div>
            <div className="w-24 h-8 bg-text/10 rounded-lg"></div>
            <div className="w-24 h-8 bg-text/10 rounded-lg"></div>
            <div className="w-24 h-8 bg-text/10 rounded-lg"></div>
            <div className="w-24 h-8 bg-text/10 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium text-text mb-4">Built for real clinical workflows</h2>
            <p className="text-subtext text-lg max-w-2xl mx-auto">
              Every feature designed to reduce clicks, save time, and keep you focused on patient care.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-surface border border-border rounded-2xl hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-text font-medium mb-3">{feature.title}</h3>
                  <p className="text-subtext leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium text-text mb-4">How it works</h2>
            <p className="text-subtext text-lg">Three simple steps to streamlined patient care</p>
          </div>

          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-text font-medium mb-2">Upload report</h3>
              <p className="text-subtext text-sm">Auto-extract values + flags</p>
            </div>

            <ArrowRight className="w-6 h-6 text-subtext mx-8" />

            {/* Step 2 */}
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-text font-medium mb-2">Review summary</h3>
              <p className="text-subtext text-sm">Add/update the single note</p>
            </div>

            <ArrowRight className="w-6 h-6 text-subtext mx-8" />

            {/* Step 3 */}
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-text font-medium mb-2">Book or confirm visit</h3>
              <p className="text-subtext text-sm">Off-day aware slots</p>
            </div>
          </div>
        </div>
      </section>

      {/* Screens Carousel */}
      <section id="screens" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium text-text mb-4">See it in action</h2>
            <p className="text-subtext text-lg">Real UI screens from the Doctor Dashboard</p>
          </div>

          <div className="relative">
            {/* Main Screenshot */}
            <div className="bg-surface border border-border rounded-3xl p-8 shadow-lg mb-8">
              <ImageWithFallback 
                src={screenshots[activeScreenshot].image}
                alt={screenshots[activeScreenshot].title}
                className="w-full rounded-2xl"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveScreenshot(Math.max(0, activeScreenshot - 1))}
                disabled={activeScreenshot === 0}
                className="border border-border rounded-2xl w-10 h-10 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-center">
                <h3 className="text-text font-medium">{screenshots[activeScreenshot].title}</h3>
                <p className="text-subtext text-sm">{screenshots[activeScreenshot].description}</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveScreenshot(Math.min(screenshots.length - 1, activeScreenshot + 1))}
                disabled={activeScreenshot === screenshots.length - 1}
                className="border border-border rounded-2xl w-10 h-10 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveScreenshot(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeScreenshot ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium text-text mb-4">Simple, transparent pricing</h2>
            <p className="text-subtext text-lg">Choose the plan that fits your practice</p>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="bg-canvas border border-border rounded-2xl">
              <CardContent className="p-8">
                <h3 className="text-text font-medium text-lg mb-2">Starter</h3>
                <p className="text-subtext text-sm mb-6">Solo</p>
                <div className="mb-6">
                  <span className="text-3xl font-medium text-text">$49</span>
                  <span className="text-subtext">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">All core features</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">1 doctor</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">Email support</span>
                  </li>
                </ul>
                <div className="space-y-2">
                  <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl">
                    Start free trial
                  </Button>
                  <Button variant="ghost" className="w-full border border-border rounded-2xl text-subtext hover:text-text">
                    Contact sales
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Clinic */}
            <Card className="bg-canvas border border-primary rounded-2xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground rounded-full px-3 py-1">Popular</Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-text font-medium text-lg mb-2">Clinic</h3>
                <p className="text-subtext text-sm mb-6">Small practice</p>
                <div className="mb-6">
                  <span className="text-3xl font-medium text-text">$149</span>
                  <span className="text-subtext">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">All core features</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">Up to 5 doctors</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">Priority support</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">Advanced reporting</span>
                  </li>
                </ul>
                <div className="space-y-2">
                  <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl">
                    Start free trial
                  </Button>
                  <Button variant="ghost" className="w-full border border-border rounded-2xl text-subtext hover:text-text">
                    Contact sales
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="bg-canvas border border-border rounded-2xl">
              <CardContent className="p-8">
                <h3 className="text-text font-medium text-lg mb-2">Enterprise</h3>
                <p className="text-subtext text-sm mb-6">Large practice</p>
                <div className="mb-6">
                  <span className="text-3xl font-medium text-text">Custom</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">All features</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">Unlimited doctors</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">SSO integration</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-text">Compliance reviews</span>
                  </li>
                </ul>
                <div className="space-y-2">
                  <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl">
                    Start free trial
                  </Button>
                  <Button variant="ghost" className="w-full border border-border rounded-2xl text-subtext hover:text-text">
                    Contact sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium text-text mb-4">Frequently asked questions</h2>
            <p className="text-subtext text-lg">Everything you need to know about Doctor Dashboard</p>
          </div>

          <Accordion 
            type="single" 
            value={openAccordion} 
            onValueChange={setOpenAccordion}
            className="space-y-4"
          >
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-2xl bg-surface">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <span className="text-text font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-subtext leading-relaxed">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-4 gap-8 mb-12">
            {/* Product */}
            <div>
              <h4 className="text-text font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="text-subtext hover:text-text transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('screens')} className="text-subtext hover:text-text transition-colors">Screens</button></li>
                <li><a href="#" className="text-subtext hover:text-text transition-colors">API</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-text font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-subtext hover:text-text transition-colors">About</a></li>
                <li><a href="#" className="text-subtext hover:text-text transition-colors">Careers</a></li>
                <li><a href="#" className="text-subtext hover:text-text transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-text font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-subtext hover:text-text transition-colors">Documentation</a></li>
                <li><a href="#" className="text-subtext hover:text-text transition-colors">Help Center</a></li>
                <li><a href="#" className="text-subtext hover:text-text transition-colors">Status</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-text font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-subtext hover:text-text transition-colors">Privacy</a></li>
                <li><a href="#" className="text-subtext hover:text-text transition-colors">Terms</a></li>
                <li><a href="#" className="text-subtext hover:text-text transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex items-center justify-between">
            <p className="text-subtext text-sm">© 2024 Doctor Dashboard. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-text/10 rounded"></div>
              <div className="w-5 h-5 bg-text/10 rounded"></div>
              <div className="w-5 h-5 bg-text/10 rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}