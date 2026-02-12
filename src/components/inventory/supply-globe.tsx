"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import dynamic from "next/dynamic"
import { Ingredient } from "@/lib/types"
import { getIngredientOrigin, GeoPoint } from "@/lib/geo-data"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, MapPin, Factory, AlertTriangle } from "lucide-react"

// Dynamically import Globe with SSR disabled
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-primary animate-pulse">Initializing Geospatial View...</div>
})

interface SupplyGlobeProps {
  ingredients: Ingredient[]
}

interface MappedPoint extends GeoPoint {
  id: string;
  name: string;
  vendor: string;
  ingredient: Ingredient;
}

export function SupplyGlobe({ ingredients }: SupplyGlobeProps) {
  const globeEl = useRef<any>(undefined);
  const [selectedPoint, setSelectedPoint] = useState<MappedPoint | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Map ingredients to points
  const pointsData = useMemo(() => {
    const points: MappedPoint[] = [];
    ingredients.forEach(ing => {
      const origin = getIngredientOrigin(ing.name);
      if (origin) {
        points.push({
          ...origin,
          id: ing.id,
          name: ing.name,
          vendor: ing.vendor,
          ingredient: ing
        });
      }
    });
    return points;
  }, [ingredients]);

  // Create arcs (simulating supply chain to a central hub, e.g., Paris/Grasse)
  // Paris coordinates: 48.8566, 2.3522
  const arcsData = useMemo(() => {
    return pointsData.map(point => ({
      startLat: point.lat,
      startLng: point.lng,
      endLat: 48.8566,
      endLng: 2.3522,
      color: ['#ffff00', '#ff00ff'] // Gradient
    }));
  }, [pointsData]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect to re-center or auto-rotate?
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <div className="relative w-full h-full bg-[#000011] overflow-hidden rounded-lg border border-border/20" ref={containerRef}>
      {dimensions.width > 0 && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="/images/globe/earth-dark.jpg"
          bumpImageUrl="/images/globe/earth-topology.png"
          backgroundImageUrl="/images/globe/night-sky.png"

          pointsData={pointsData}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#00ff88"}
          pointAltitude={0.02}
          pointRadius={0.4}
          pointLabel={(d: any) => `
            <div style="background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">
              <b>${d.name}</b><br/>${d.country}
            </div>
          `}
          onPointClick={(point: any) => {
            setSelectedPoint(point);
            if (globeEl.current) {
              globeEl.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 2.5 }, 1000);
            }
          }}

          arcsData={arcsData}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcStroke={0.5}

          atmosphereColor="#11a4d4"
          atmosphereAltitude={0.15}
        />
      )}

      {/* Cyberpunk Overlay UI */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-black/40 backdrop-blur border border-primary/30 p-4 rounded-lg shadow-lg">
           <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Active Routes</h3>
           <div className="flex items-end gap-2">
             <span className="text-2xl font-bold text-white">{pointsData.length}</span>
             <span className="text-xs text-muted-foreground mb-1">SUPPLIERS MAPPED</span>
           </div>
        </div>
      </div>

      {/* Detail Side Panel */}
      {selectedPoint && (
        <div className="absolute right-4 top-4 bottom-4 w-80 z-20 animate-in slide-in-from-right-10 duration-300">
          <Card className="h-full bg-black/80 backdrop-blur-md border-primary/20 text-white overflow-hidden flex flex-col shadow-2xl shadow-primary/10">
            {/* Header */}
            <div className="p-6 border-b border-primary/10 relative">
               <Button
                 variant="ghost"
                 size="icon"
                 className="absolute top-2 right-2 text-slate-400 hover:text-white"
                 onClick={() => setSelectedPoint(null)}
               >
                 <X className="w-4 h-4" />
               </Button>
               <div className="flex items-center gap-2 mb-2">
                 <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 text-[10px] tracking-widest uppercase">
                   {selectedPoint.id}
                 </Badge>
                 <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10 text-[10px] tracking-widest uppercase">
                   Verified
                 </Badge>
               </div>
               <h2 className="text-xl font-bold font-display text-white">{selectedPoint.name}</h2>
               <div className="flex items-center text-xs text-slate-400 font-mono gap-4 mt-2">
                 <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedPoint.region}, {selectedPoint.country}</span>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">

              {/* Image Placeholder */}
              <div className="aspect-video w-full bg-slate-900 rounded border border-slate-700 relative overflow-hidden group">
                 <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                    <span className="text-xs uppercase">Sourcing Imagery</span>
                 </div>
                 {/* Decorative overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                   <span className="text-[10px] text-white uppercase tracking-wider">Ref: SAT-2024</span>
                 </div>
              </div>

              {/* Vendor Info */}
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Supplier</span>
                <div className="flex items-center gap-2 font-medium">
                  <Factory className="w-4 h-4 text-primary" />
                  {selectedPoint.vendor}
                </div>
              </div>

              {/* Details from Geo Data */}
              {selectedPoint.details && (
                <div className="border-l-2 border-primary/50 pl-3">
                   <p className="text-sm text-slate-300 leading-relaxed">{selectedPoint.details}</p>
                </div>
              )}

              {/* Fake Risk Metric */}
              <div className="border border-amber-500/30 bg-amber-500/5 rounded p-3 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2 text-amber-500">
                   <AlertTriangle className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">Supply Risk</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Moderate delay expected due to seasonal logistics constraints in {selectedPoint.region}.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-primary/10 bg-black/40">
               <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold uppercase tracking-wider text-xs">
                 View Full Dossier
               </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
