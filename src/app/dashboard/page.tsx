"use client"

import React from "react"
import Link from "next/link"
import { FragrancePyramid } from "@/components/dashboard/fragrance-pyramid"
import {
  Search,
  Bell,
  FlaskConical,
  List,
  ShieldCheck,
  Star,
  TrendingUp,
  Edit3,
  Plus,
  Search as SearchIcon,
  Activity,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { usePerfume } from "@/lib/store"

export default function DashboardPage() {
  const { state } = usePerfume()
  const materialsCount = state.inventory.length
  const formulasCount = state.formulas.length

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Top Bar */}
      <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold font-display tracking-tight">Dashboard</h1>
                <p className="text-xs text-primary font-medium tracking-wider uppercase">Computational Perfumery & Compliance Engine</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    className="pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border-transparent focus:bg-background w-64 text-sm"
                    placeholder="Search formulas, CAS numbers..."
                  />
                </div>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
                </Button>
              </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">

              {/* Stats Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Materials Card */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FlaskConical className="w-16 h-16 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-muted-foreground text-sm font-medium mb-1">Materials in DB</p>
                    <h3 className="text-3xl font-bold font-display">{materialsCount.toLocaleString()}</h3>
                    <div className="flex items-center gap-1 mt-2 text-emerald-500 text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12 this week</span>
                    </div>
                  </div>
                </div>

                {/* Active Formulas Card */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <List className="w-16 h-16 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-muted-foreground text-sm font-medium mb-1">Active Formulas</p>
                    <h3 className="text-3xl font-bold font-display">{formulasCount}</h3>
                    <div className="flex items-center gap-1 mt-2 text-primary text-xs font-medium">
                      <Edit3 className="w-3 h-3" />
                      <span>3 in progress</span>
                    </div>
                  </div>
                </div>

                {/* IFRA Compliance Card */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="w-16 h-16 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-muted-foreground text-sm font-medium mb-1">IFRA Compliance</p>
                    <h3 className="text-3xl font-bold font-display text-emerald-500">98%</h3>
                    <div className="w-full bg-secondary h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "98%" }}></div>
                    </div>
                  </div>
                </div>

                {/* Avg Rating Card */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star className="w-16 h-16 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-muted-foreground text-sm font-medium mb-1">Avg Rating</p>
                    <h3 className="text-3xl font-bold font-display">4.2<span className="text-lg text-muted-foreground font-normal">/5</span></h3>
                    <div className="flex mt-2 text-amber-500">
                      {[1, 2, 3, 4].map((i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <Star className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Main Content Area: Quick Start & Pyramid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Quick Actions & Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-xl font-bold font-display flex items-center gap-2">
                    <Activity className="text-primary w-5 h-5" /> Quick Start
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-40">
                    {/* New Formula */}
                    <Link href="/lab" className="block h-full">
                      <div className="flex flex-col items-start p-6 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.01] hover:shadow-xl h-full group cursor-pointer">
                        <div className="bg-white/20 p-2 rounded-lg mb-auto group-hover:bg-white/30 transition-colors">
                          <Plus className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-1">Create New Formula</h3>
                          <p className="text-primary-foreground/80 text-sm">Start a blank canvas or use a template.</p>
                        </div>
                      </div>
                    </Link>

                    {/* Browse Ingredients */}
                    <Link href="/inventory" className="block h-full">
                      <div className="flex flex-col items-start p-6 bg-card border border-border hover:border-primary/50 rounded-xl transition-all h-full group cursor-pointer hover:shadow-md">
                        <div className="bg-primary/10 p-2 rounded-lg mb-auto text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <SearchIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-1">Browse Ingredients</h3>
                          <p className="text-muted-foreground text-sm">Explore the material database.</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Analyze Action */}
                  <Link href="/analysis" className="block">
                    <div className="w-full flex items-center justify-between p-6 bg-card border border-border hover:border-primary/50 rounded-xl transition-all group cursor-pointer hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold">Analyze Current Formula</h3>
                          <p className="text-muted-foreground text-sm">Run strict IFRA 49th Amendment checks.</p>
                        </div>
                      </div>
                      <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors w-5 h-5" />
                    </div>
                  </Link>

                  {/* Recent Activity Table */}
                  <div className="bg-card border border-border rounded-xl overflow-hidden mt-8">
                    <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                      <h3 className="font-bold font-display">Recent Modifications</h3>
                      <Button variant="link" className="text-xs text-primary h-auto p-0">View All</Button>
                    </div>
                    <Table>
                      <TableHeader className="bg-secondary/50">
                        <TableRow>
                          <TableHead className="font-medium">Formula Name</TableHead>
                          <TableHead className="font-medium">Last Edited</TableHead>
                          <TableHead className="font-medium text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-muted/50">
                          <TableCell className="font-medium">Midnight Rose v2</TableCell>
                          <TableCell className="text-muted-foreground">2 hours ago</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 border-amber-200 dark:border-amber-800">Draft</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-muted/50">
                          <TableCell className="font-medium">Oceanic Drift</TableCell>
                          <TableCell className="text-muted-foreground">Yesterday</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800">Compliant</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-muted/50">
                          <TableCell className="font-medium">Accord: Cedar/Musk</TableCell>
                          <TableCell className="text-muted-foreground">3 days ago</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800">Base</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Right Column: Visual Architecture */}
                <div className="lg:col-span-1 h-full">
                  <FragrancePyramid />
                </div>
        </div>
      </div>
    </div>
  )
}
