"use client"

import React, { useState } from "react"
import { perfumes, Perfume } from "@/lib/encyclopedia-data"
import { noteImages, getNoteImage } from "@/lib/note-images"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Search,
  Grid,
  Settings2,
  ArrowLeft,
  Share2,
  Bookmark,
  X,
  Info,
  Hexagon,
  CheckCircle,
  History,
  Sparkles,
  Triangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function EncyclopediaPage() {
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPerfumes = perfumes.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  }

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur z-20 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight text-primary">ENCYCLOPEDIA</h1>
          <div className="h-4 w-[1px] bg-border"></div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            LIVE DATABASE V3.0
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="pl-9 pr-4 py-1.5 h-9 rounded-full bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary text-sm w-64 lg:w-96"
              placeholder="Search by accord, molecule, or nose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Settings2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Grid className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Grid Content */}
      <ScrollArea className="flex-1 p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredPerfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="group relative bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedPerfume(perfume)}
            >
              {perfume.matchScore && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur border-primary/20 text-primary font-bold tracking-wider uppercase text-[10px]">
                    {perfume.matchScore}% Match
                  </Badge>
                </div>
              )}
              <div className="h-48 bg-secondary/30 flex items-center justify-center p-4 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 font-bold text-4xl select-none">
                    {perfume.name.charAt(0)}
                 </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{perfume.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{perfume.brand} • {perfume.releaseYear}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-mono text-muted-foreground border border-border">
                    {perfume.concentration}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {perfume.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="px-4 pb-4 pt-0">
                <Button className="w-full text-xs font-medium uppercase tracking-wider" variant="secondary">
                  Analyze
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Detailed View Overlay */}
      {selectedPerfume && (
        <div className="absolute inset-4 lg:inset-8 bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-primary/20">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 backdrop-blur shrink-0">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPerfume(null)} className="text-muted-foreground hover:text-primary gap-2">
                <ArrowLeft className="w-4 h-4" />
                BACK TO GRID
              </Button>
              <div className="h-4 w-[1px] bg-border"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Technical Analysis</span>
                <span className="text-[10px] font-mono text-muted-foreground">ID: #{selectedPerfume.id}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSelectedPerfume(null)} className="text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
             {/* Left Panel */}
             <div className="w-full lg:w-1/3 xl:w-1/4 p-6 overflow-y-auto border-r border-border bg-muted/10">
               <div className="relative w-full aspect-square mb-6 bg-secondary/20 rounded-xl flex items-center justify-center p-6 border border-border">
                  <div className="text-6xl font-bold text-muted-foreground/20">{selectedPerfume.name.charAt(0)}</div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Concentration</span>
                      <span className="text-sm font-mono font-bold">{selectedPerfume.concentration === 'EdP' ? 'Eau de Parfum' : 'Extrait de Parfum'}</span>
                    </div>
                  </div>
               </div>

               <div className="mb-8">
                 <h2 className="text-3xl font-bold mb-1">{selectedPerfume.name}</h2>
                 <p className="text-primary font-medium mb-4">{selectedPerfume.brand}</p>
                 <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                   {selectedPerfume.description}
                 </p>
                 <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground border-t border-border pt-4">
                   <div>
                     <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">Release</span>
                     {selectedPerfume.releaseYear}
                   </div>
                   <div>
                     <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">Gender</span>
                     {selectedPerfume.gender}
                   </div>
                   <div>
                     <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">Family</span>
                     {selectedPerfume.family}
                   </div>
                 </div>
               </div>

               <div>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                   <Sparkles className="w-4 h-4" /> Inspiration Flow
                 </h3>
                 <div className="relative pl-4 border-l-2 border-primary/30 space-y-6">
                   <div className="relative">
                     <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background"></span>
                     <p className="text-xs text-muted-foreground mb-0.5">The Nose</p>
                     <p className="font-bold text-sm">{selectedPerfume.inspiration.nose}</p>
                   </div>
                   <div className="relative">
                     <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-yellow-500 ring-4 ring-background"></span>
                     <p className="text-xs text-muted-foreground mb-0.5">The Muse</p>
                     <p className="font-bold text-sm">{selectedPerfume.inspiration.muse}</p>
                   </div>
                   <div className="relative">
                     <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-500 ring-4 ring-background"></span>
                     <p className="text-xs text-muted-foreground mb-0.5">The Predecessor</p>
                     <p className="font-bold text-sm">{selectedPerfume.inspiration.predecessor}</p>
                   </div>
                 </div>
               </div>
             </div>

             {/* Right Panel */}
             <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-background">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Composition Card */}
                  <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
                     <Tabs defaultValue="composition" className="w-full flex-1 flex flex-col">
                       <div className="flex items-center px-5 pt-4 border-b border-border gap-6">
                         <TabsList className="bg-transparent p-0 h-auto gap-6">
                           <TabsTrigger
                             value="composition"
                             className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-primary"
                           >
                             Molecular Composition
                           </TabsTrigger>
                           <TabsTrigger
                             value="pyramid"
                             className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-primary"
                           >
                             Notes Pyramid
                           </TabsTrigger>
                         </TabsList>
                         <div className="flex-1"></div>
                         <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary mb-3">
                           <Info className="w-4 h-4" />
                         </Button>
                       </div>

                       <div className="flex-1 p-5">
                         <TabsContent value="composition" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                           {selectedPerfume.composition.map((comp) => (
                             <div key={comp.name} className="group cursor-pointer">
                               <div className="flex justify-between text-xs mb-1">
                                 <span className="font-medium group-hover:text-primary transition-colors">{comp.name}</span>
                                 <span className="font-mono text-muted-foreground">{comp.percentage}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                 <div
                                   className={cn("h-full rounded-full transition-all duration-1000 ease-out w-0 group-hover:brightness-110", comp.color)}
                                   style={{ width: `${comp.percentage}%` }}
                                 ></div>
                               </div>
                               <p className="h-0 group-hover:h-auto overflow-hidden text-[10px] text-muted-foreground mt-1 transition-all">
                                 {comp.description}
                               </p>
                             </div>
                           ))}
                           <div className="mt-6 pt-4 border-t border-border flex items-center gap-3 opacity-60">
                             <Hexagon className="w-4 h-4 text-muted-foreground" />
                             <span className="text-[10px] font-mono text-muted-foreground">Detailed Formula available for subscribers</span>
                           </div>
                         </TabsContent>

                         <TabsContent value="pyramid" className="mt-0 h-full overflow-y-auto pr-2">
                           <div className="flex flex-col gap-6 py-4">
                             {/* Top Notes */}
                             <div className="space-y-3">
                               <div className="flex items-center gap-2">
                                 <Triangle className="w-4 h-4 text-primary fill-primary/20" />
                                 <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Notes</h4>
                               </div>
                               <div className="flex flex-wrap gap-2">
                                 {selectedPerfume.pyramid.top.notes.map(note => {
                                   const imgUrl = getNoteImage(note);
                                   return (
                                     <div key={note} className="flex items-center gap-2 p-1 pr-3 rounded-full bg-secondary/50 border border-border/50 hover:bg-secondary/80 transition-colors group/note relative">
                                       <div className="w-8 h-8 rounded-full overflow-hidden bg-white shrink-0 border border-border flex items-center justify-center shadow-sm">
                                         {imgUrl ? (
                                           <img src={imgUrl} alt={note} className="w-full h-full object-cover transition-transform group-hover/note:scale-110 duration-500" />
                                         ) : (
                                           <span className="text-[8px] text-muted-foreground font-mono">N/A</span>
                                         )}
                                       </div>
                                       <span className="text-xs font-medium leading-none text-foreground/90 whitespace-nowrap">{note}</span>
                                     </div>
                                   );
                                 })}
                               </div>
                             </div>

                             {/* Middle Notes */}
                             <div className="space-y-3">
                               <div className="flex items-center gap-2">
                                 <Triangle className="w-4 h-4 text-primary fill-primary/20 rotate-90" />
                                 <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Heart Notes</h4>
                               </div>
                               <div className="flex flex-wrap gap-2">
                                 {selectedPerfume.pyramid.middle.notes.map(note => {
                                   const imgUrl = getNoteImage(note);
                                   return (
                                     <div key={note} className="flex items-center gap-2 p-1 pr-3 rounded-full bg-secondary/50 border border-border/50 hover:bg-secondary/80 transition-colors group/note relative">
                                       <div className="w-8 h-8 rounded-full overflow-hidden bg-white shrink-0 border border-border flex items-center justify-center shadow-sm">
                                         {imgUrl ? (
                                           <img src={imgUrl} alt={note} className="w-full h-full object-cover transition-transform group-hover/note:scale-110 duration-500" />
                                         ) : (
                                           <span className="text-[8px] text-muted-foreground font-mono">N/A</span>
                                         )}
                                       </div>
                                       <span className="text-xs font-medium leading-none text-foreground/90 whitespace-nowrap">{note}</span>
                                     </div>
                                   );
                                 })}
                               </div>
                             </div>

                             {/* Base Notes */}
                             <div className="space-y-3">
                               <div className="flex items-center gap-2">
                                 <Triangle className="w-4 h-4 text-primary fill-primary/20 rotate-180" />
                                 <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Notes</h4>
                               </div>
                               <div className="flex flex-wrap gap-2">
                                 {selectedPerfume.pyramid.base.notes.map(note => {
                                   const imgUrl = getNoteImage(note);
                                   return (
                                     <div key={note} className="flex items-center gap-2 p-1 pr-3 rounded-full bg-secondary/50 border border-border/50 hover:bg-secondary/80 transition-colors group/note relative">
                                       <div className="w-8 h-8 rounded-full overflow-hidden bg-white shrink-0 border border-border flex items-center justify-center shadow-sm">
                                         {imgUrl ? (
                                           <img src={imgUrl} alt={note} className="w-full h-full object-cover transition-transform group-hover/note:scale-110 duration-500" />
                                         ) : (
                                           <span className="text-[8px] text-muted-foreground font-mono">N/A</span>
                                         )}
                                       </div>
                                       <span className="text-xs font-medium leading-none text-foreground/90 whitespace-nowrap">{note}</span>
                                     </div>
                                   );
                                 })}
                               </div>
                             </div>

                             <div className="mt-2 text-center pt-4 border-t border-border/50">
                               <p className="text-[10px] text-muted-foreground font-medium italic">"{selectedPerfume.pyramid.description}"</p>
                             </div>
                           </div>
                         </TabsContent>
                       </div>
                     </Tabs>
                  </div>

                  {/* Performance Heatmap */}
                  <div className="bg-card rounded-xl p-5 border border-border shadow-sm relative overflow-hidden flex flex-col">
                     <div className="flex items-center justify-between mb-4 z-10 relative">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Performance Heatmap</h3>
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                         <span className="text-[10px] text-muted-foreground">Crowd Data</span>
                       </div>
                     </div>
                     <div className="h-48 relative border-l border-b border-border ml-4 mb-4 flex-1">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                           {Array.from({ length: 16 }).map((_, i) => (
                             <div key={i} className="border-r border-t border-border/20"></div>
                           ))}
                        </div>
                        {/* Heatmap Blob */}
                        <div
                            className="absolute rounded-full bg-yellow-500/30 blur-xl transition-all duration-1000"
                            style={{
                                width: '6rem',
                                height: '6rem',
                                left: `${(selectedPerfume.performance.sillage / 10) * 80}%`,
                                top: `${(1 - (selectedPerfume.performance.longevity / 10)) * 80}%`
                            }}
                        ></div>
                         <div
                            className="absolute rounded-full bg-yellow-500/60 blur-lg transition-all duration-1000"
                            style={{
                                width: '4rem',
                                height: '4rem',
                                left: `${(selectedPerfume.performance.sillage / 10) * 85}%`,
                                top: `${(1 - (selectedPerfume.performance.longevity / 10)) * 85}%`
                            }}
                        ></div>

                        {/* Labels */}
                        <span className="absolute -bottom-6 left-0 text-[10px] text-muted-foreground">Intimate</span>
                        <span className="absolute -bottom-6 right-0 text-[10px] text-muted-foreground">Room-Filling</span>
                        <span className="absolute bottom-[-24px] w-full text-center text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Sillage</span>

                        <span className="absolute -left-8 bottom-0 text-[10px] text-muted-foreground rotate-[-90deg] origin-right">Weak</span>
                        <span className="absolute -left-8 top-4 text-[10px] text-muted-foreground rotate-[-90deg] origin-right">Eternal</span>
                        <span className="absolute left-[-30px] top-[50%] -translate-y-1/2 text-[10px] uppercase text-muted-foreground font-bold tracking-wider rotate-[-90deg]">Longevity</span>
                     </div>
                     <div className="text-center mt-2">
                        <p className="text-xs text-muted-foreground italic">{selectedPerfume.performance.description}</p>
                     </div>
                  </div>
               </div>

               {/* History Section */}
               <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                   <History className="w-5 h-5" /> Historical Context
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {selectedPerfume.history.map((item, idx) => (
                     <div key={idx}>
                       <h4 className="font-bold mb-2 text-sm">{item.title}</h4>
                       <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                         {item.content}
                       </p>
                       <div className="flex gap-2 flex-wrap">
                         {item.tags.map(tag => (
                           <Badge key={tag} variant="outline" className="text-[10px]">
                             {tag}
                           </Badge>
                         ))}
                       </div>
                     </div>
                   ))}
                   <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8">
                     <h4 className="font-bold mb-2 text-sm">Trivia & Heritage</h4>
                     <ul className="space-y-3">
                       {selectedPerfume.trivia.map((triv, i) => (
                         <li key={i} className="flex items-start gap-3">
                           <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                           <p className="text-xs text-muted-foreground">{triv}</p>
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
