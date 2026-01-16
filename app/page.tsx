"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummarySection } from "@/components/dashboard/summary-section";
import { TrendsSection } from "@/components/dashboard/trends-section";
import { AnalyzeSection } from "@/components/dashboard/analyze-section";
import { CountySection } from "@/components/dashboard/county-section";
import { MakeModelSection } from "@/components/dashboard/make-model-section";
import { Car, TrendingUp, BarChart3, MapPin, Factory } from "lucide-react";
import Prism from "@/components/Prism";
import PixelBlast from "@/components/PixelBlast";

import Hyperspeed from "@/components/Hyperspeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0 w-screen h-screen">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: "turbulentDistortion",
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xffffff,
              brokenLines: 0xffffff,
              leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
              rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
              sticks: 0x03b3c3,
            },
          }}
        />
      </div>
      <header className="border-b relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Electric Vehicle Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Explore and analyze EV registration data
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="summary" className="gap-2">
              <BarChart3 className="h-4 w-4 hidden sm:block" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-2">
              <TrendingUp className="h-4 w-4 hidden sm:block" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="analyze" className="gap-2">
              <BarChart3 className="h-4 w-4 hidden sm:block" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="county" className="gap-2">
              <MapPin className="h-4 w-4 hidden sm:block" />
              County
            </TabsTrigger>
            <TabsTrigger value="make" className="gap-2">
              <Factory className="h-4 w-4 hidden sm:block" />
              Make
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <SummarySection />
          </TabsContent>

          <TabsContent value="trends">
            <TrendsSection />
          </TabsContent>

          <TabsContent value="analyze">
            <AnalyzeSection />
          </TabsContent>

          <TabsContent value="county">
            <CountySection />
          </TabsContent>

          <TabsContent value="make">
            <MakeModelSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
