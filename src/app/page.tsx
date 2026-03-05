"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Hotel,
  MessageSquare,
  Search,
  Mic,
  FileText,
  Globe,
  Shield,
  Zap,
  Star,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// Animation helpers
// ============================================================

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// Landing Page
// ============================================================

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

// ============================================================
// Navbar
// ============================================================

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Hotel className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">HotelAgent</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Testimonials
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/chat">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/chat">
              Try It Free
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

// ============================================================
// Hero
// ============================================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                AI-Powered Hotel Booking
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
            >
              Book Hotels with{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Conversational AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              Search, compare, and book hotels using natural language. Voice or
              text &mdash; our AI agent handles searches, bookings, and RFP
              management so you can focus on what matters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button size="lg" asChild>
                <Link href="/chat">
                  Try It Out
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </motion.div>

            {/* Quick trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 flex items-center gap-6 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Free to try
              </span>
            </motion.div>
          </div>

          {/* Right: Chat preview mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="rounded-2xl border bg-card shadow-2xl shadow-primary/5 p-6 space-y-4">
              {/* Mock chat header */}
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">HotelAgent</p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>

              {/* Mock messages */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="rounded-2xl bg-muted px-4 py-2 text-sm max-w-[80%]">
                    Hi! I can help you find and book hotels. Where would you like to stay?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm max-w-[80%]">
                    Find me hotels in Paris under &euro;100/night with WiFi
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="rounded-2xl bg-muted px-4 py-2 text-sm max-w-[85%] space-y-2">
                    <p>I found 3 great options in Paris:</p>
                    <div className="rounded-lg bg-background p-2.5 border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-xs">Hotel Le Marais</p>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4].map((i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs font-bold">&euro;89/night</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock input */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <div className="flex-1 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Type or speak...
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mic className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Social proof
// ============================================================

function SocialProof() {
  const companies = [
    "Marriott", "Hilton", "Hyatt", "IHG", "Accor", "Wyndham",
  ];

  return (
    <section className="border-y bg-muted/30 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <FadeUp>
          <p className="text-center text-sm font-medium text-muted-foreground mb-8">
            Trusted by leading hospitality brands worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {companies.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="text-xl font-bold text-muted-foreground/40 tracking-wider"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ============================================================
// Features grid
// ============================================================

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language Search",
    description:
      "Just describe what you need. Our AI understands complex queries like &ldquo;pet-friendly hotel near downtown with a pool under $150.&rdquo;",
  },
  {
    icon: Mic,
    title: "Voice-Powered Booking",
    description:
      "Speak naturally to search and book. Our voice pipeline handles speech-to-text and responds with natural audio.",
  },
  {
    icon: Search,
    title: "Smart Hotel Matching",
    description:
      "AI-powered semantic search matches your needs to the best hotels using embeddings and intelligent scoring.",
  },
  {
    icon: FileText,
    title: "RFP Automation",
    description:
      "Upload event RFPs and get AI-generated hotel proposals with pricing, match scores, and comparison tables.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description:
      "Access hotels worldwide with real-time availability, photos, reviews, and interactive map views.",
  },
  {
    icon: Shield,
    title: "Secure Bookings",
    description:
      "End-to-end encrypted transactions with booking confirmations, modifications, and cancellation support.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeUp className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Features
          </span>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to book smarter
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From conversational search to automated RFP handling, our AI agent
            streamlines every step of the hotel booking process.
          </p>
        </FadeUp>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <ScaleIn key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                />
              </motion.div>
            </ScaleIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// How it works (horizontal scroll-style cards)
// ============================================================

const steps = [
  {
    step: "01",
    title: "Tell Us What You Need",
    description:
      "Type or speak your hotel requirements in natural language. Mention city, dates, budget, amenities &mdash; anything.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "AI Finds the Best Matches",
    description:
      "Our agent searches across hotels using semantic matching, filters by your criteria, and ranks the best options.",
    icon: Search,
  },
  {
    step: "03",
    title: "Review & Compare",
    description:
      "Browse photos, read reviews, compare prices on a map, and ask follow-up questions in the same conversation.",
    icon: Star,
  },
  {
    step: "04",
    title: "Book Instantly",
    description:
      "Confirm your booking through the chat. Get instant confirmation with all details sent to your email.",
    icon: Zap,
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <FadeUp className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            How It Works
          </span>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Book a hotel in 4 simple steps
          </h2>
        </FadeUp>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <FadeUp key={item.step} delay={i * 0.15}>
              <div className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+2rem)] hidden h-0.5 w-full bg-border lg:block" />
                )}

                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    <item.icon className="h-7 w-7" />
                  </motion.div>
                  <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p
                    className="mt-2 text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Stats counter section
// ============================================================

const stats = [
  { value: "10K+", label: "Hotels Available", icon: Building2 },
  { value: "50K+", label: "Happy Guests", icon: Users },
  { value: "99%", label: "Booking Success Rate", icon: TrendingUp },
  { value: "< 3s", label: "Average Response Time", icon: Zap },
];

function StatsSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.1} className="text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-3 opacity-70" />
              <motion.p
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-3xl font-bold md:text-4xl"
              >
                {stat.value}
              </motion.p>
              <p className="mt-1 text-sm opacity-80">{stat.label}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Testimonials
// ============================================================

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Travel Manager, TechCorp",
    quote:
      "HotelAgent transformed how we handle corporate travel. The RFP automation alone saved us 20 hours per week.",
    rating: 5,
  },
  {
    name: "Marcus Weber",
    role: "Event Planner",
    quote:
      "I just describe what I need and the AI finds the perfect venues. The voice feature is incredibly natural.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Frequent Traveler",
    quote:
      "Finally a booking tool that understands what I actually want. No more clicking through 50 filters.",
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeUp className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Loved by hospitality professionals
          </h2>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CTA Section
// ============================================================

function CTASection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <FadeUp>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Ready to transform your
            <br />
            hotel booking experience?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start a conversation with our AI agent today. Search hotels, make
            bookings, or submit RFPs &mdash; all through natural language.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="text-base px-8 py-6" asChild>
                <Link href="/chat">
                  Try It Out &mdash; It&apos;s Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No account required. Start chatting instantly.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ============================================================
// Footer
// ============================================================

function Footer() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">HotelAgent</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered hotel booking assistant. Search, compare, and book
              hotels using conversational AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><Link href="/hotels" className="hover:text-foreground transition-colors">Hotel Search</Link></li>
              <li><Link href="/rfp" className="hover:text-foreground transition-colors">RFP Management</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 HotelAgent. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by open-source AI models
          </p>
        </div>
      </div>
    </footer>
  );
}
