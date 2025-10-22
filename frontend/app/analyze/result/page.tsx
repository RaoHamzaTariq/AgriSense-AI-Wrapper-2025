'use client'

import { useEffect, useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { 
  Thermometer, 
  Droplets, 
  CloudRain, 
  AlertTriangle, 
  Sprout, 
  Calendar,
  Shield,
  Download,
  ArrowLeft,
  Sun,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3
} from 'lucide-react'

interface AnalysisData {
  weather?: {
    avg_temperature?: number;
    humidity?: number;
    rainfall_mm?: number;
    climate_type?: string;
    location?: string;
    forecast_summary?: string;
    risk_alerts?: string[];
  };
  weather_analysis?: AnalysisData['weather'];
  crop?: {
    suggested_crops?: string[];
    unsuitable_crops?: string[];
    water_requirement_level?: string;
    expected_yield_potential?: string;
    reasoning?: string;
  };
  crop_analysis?: AnalysisData['crop'];
  plan?: {
    primary_crop?: string;
    primary?: string;
    sowing_schedule?: string;
    harvest_time?: string;
    soil_preparation_steps?: string[];
    irrigation_guidelines?: string[];
    fertilizer_recommendations?: string[];
    risk_precautions?: string[];
    storage_advice?: string[];
    overall_summary?: string;
  };
  city?: string;
}

export default function AnalyzeResultPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalysisData | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('analysisResult')
      if (!stored) {
        router.replace('/analyze')
        return
      }
      setData(JSON.parse(stored))
    } catch {
      router.replace('/analyze')
    }
  }, [router])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your farming plan...</p>
        </div>
      </div>
    )
  }

  const weather = data?.weather ?? data?.weather_analysis ?? {}
  const crop = data?.crop ?? data?.crop_analysis ?? {}
  const plan = data?.plan ?? {}
  const city = data?.city ?? weather?.location ?? '—'

  const weatherMetrics = [
    { 
      icon: Thermometer, 
      label: 'Temperature', 
      value: `${weather?.avg_temperature ?? '—'}°C`,
      description: 'Average daily temperature'
    },
    { 
      icon: Droplets, 
      label: 'Humidity', 
      value: `${weather?.humidity ?? '—'}%`,
      description: 'Relative humidity level'
    },
    { 
      icon: CloudRain, 
      label: 'Rainfall', 
      value: `${weather?.rainfall_mm ?? '—'}mm`,
      description: 'Monthly precipitation'
    },
    { 
      icon: Sun, 
      label: 'Climate', 
      value: weather?.climate_type ?? '—',
      description: 'Climate classification'
    }
  ]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/analyze')}
              className="gap-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Farming Plan</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                Recommendations for {city}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              onClick={() => router.push('/analyze')}
            >
              New Analysis
            </Button>
          </div>
        </div>

        <Separator />

        {/* Weather Summary */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CloudRain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                Weather Conditions
                <CardDescription className="text-base">
                  Current climate analysis for your location
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Weather Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weatherMetrics.map((metric, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-background rounded-lg">
                        <metric.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {metric.label}
                        </p>
                        <p className="text-2xl font-semibold">{metric.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Forecast & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {weather?.forecast_summary && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Forecast Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {weather.forecast_summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {!!(weather?.risk_alerts?.length) && (
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      Important Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(weather.risk_alerts || []).map((alert: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-orange-700">{alert}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Crop Recommendations */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-50 rounded-lg">
                <Sprout className="w-5 h-5 text-green-600" />
              </div>
              <div>
                Crop Recommendations
                <CardDescription className="text-base">
                  Best suited crops for your conditions
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Crop Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recommended Crops */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <h3 className="font-semibold">Recommended</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(crop?.suggested_crops || []).map((cropName: string, index: number) => (
                    <Card key={index} className="border-green-200 bg-green-50/50 hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">🌱</div>
                        <p className="font-medium text-green-900">{cropName}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Unsuitable Crops */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <h3 className="font-semibold">Not Recommended</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(crop?.unsuitable_crops || []).map((cropName: string, index: number) => (
                    <Card key={index} className="border-red-100 bg-red-50/30 opacity-70">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">🚫</div>
                        <p className="font-medium text-red-700">{cropName}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Crop Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Water Requirement</p>
                  <p className="font-semibold text-lg">{crop?.water_requirement_level ?? '—'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Yield Potential</p>
                  <p className="font-semibold text-lg">{crop?.expected_yield_potential ?? '—'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Growth Cycle</p>
                  <p className="font-semibold text-lg">Optimal</p>
                </CardContent>
              </Card>
            </div>

            {/* Reasoning */}
            {crop?.reasoning && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {crop.reasoning}
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Farming Plan */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                Farming Plan
                <CardDescription className="text-base">
                  Step-by-step cultivation guide
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Primary Crop</p>
                  <p className="font-semibold text-lg">{plan?.primary_crop ?? plan?.primary ?? '—'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Sowing Schedule</p>
                  <p className="font-semibold text-lg">{plan?.sowing_schedule ?? '—'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Harvest Time</p>
                  <p className="font-semibold text-lg">{plan?.harvest_time ?? '—'}</p>
                </CardContent>
              </Card>
            </div>

            {/* Plan Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {!!plan?.soil_preparation_steps?.length && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Soil Preparation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(plan.soil_preparation_steps || []).map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {!!plan?.irrigation_guidelines?.length && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Irrigation Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(plan.irrigation_guidelines || []).map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {!!plan?.fertilizer_recommendations?.length && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Fertilizer Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(plan.fertilizer_recommendations || []).map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {!!plan?.risk_precautions?.length && (
                  <Card className="border-red-100 bg-red-50/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-600" />
                        Risk Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(plan.risk_precautions || []).map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-red-700">{step}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Storage Advice */}
            {(plan?.storage_advice && plan.storage_advice.length > 0) && (
              <Card className="bg-amber-50/50 border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Storage & Harvest Advice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(plan.storage_advice || []).map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-amber-800">{step}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Overall Summary */}
            {plan?.overall_summary && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.overall_summary}
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8 border-t">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Ready to implement this plan?
          </p>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export Plan
            </Button>
            <Button 
              onClick={() => router.push('/analyze')}
            >
              New Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}