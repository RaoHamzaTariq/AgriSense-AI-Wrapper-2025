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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
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
  BarChart3,
  Leaf,
  TrendingUp,
  CloudSun
} from 'lucide-react'

export default function AnalyzeResultPage() {
  const router = useRouter()
  const [data, setData] = useState<any | null>(null)

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Leaf className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">Preparing your farming plan</p>
            <p className="text-sm text-gray-500">This will just take a moment...</p>
          </div>
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
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    { 
      icon: Droplets, 
      label: 'Humidity', 
      value: `${weather?.humidity ?? '—'}%`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      icon: CloudRain, 
      label: 'Rainfall', 
      value: `${weather?.rainfall_mm ?? '—'}mm`,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    },
    { 
      icon: CloudSun, 
      label: 'Climate', 
      value: weather?.climate_type ?? '—',
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }
  ]

  const cropMetrics = [
    {
      icon: Droplets,
      label: 'Water Need',
      value: crop?.water_requirement_level ?? '—',
      color: 'from-blue-500 to-cyan-500',
      level: crop?.water_requirement_level === 'Low' ? 30 : crop?.water_requirement_level === 'Medium' ? 60 : 90
    },
    {
      icon: BarChart3,
      label: 'Yield Potential',
      value: crop?.expected_yield_potential ?? '—',
      color: 'from-green-500 to-emerald-500',
      level: crop?.expected_yield_potential === 'Low' ? 40 : crop?.expected_yield_potential === 'Medium' ? 70 : 90
    },
    {
      icon: TrendingUp,
      label: 'Success Rate',
      value: 'High',
      color: 'from-purple-500 to-pink-500',
      level: 85
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20">
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/analyze')}
              className="gap-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Analysis
            </Button>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent">
                Farming Plan
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-emerald-600">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">{city}</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                  🌱 Ready to Plant
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="gap-2 border-2 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button 
              onClick={() => router.push('/analyze')}
              className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sprout className="w-4 h-4" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Weather Summary */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-1">
            <CardHeader className="bg-white pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <CloudRain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  Weather Intelligence
                  <CardDescription className="text-lg text-gray-600">
                    Real-time climate analysis for optimal planning
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Weather Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {weatherMetrics.map((metric, index) => (
                <div key={index} className={`p-6 rounded-2xl ${metric.bgColor} border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Forecast & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {weather?.forecast_summary && (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CloudSun className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Weather Outlook</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{weather.forecast_summary}</p>
                </div>
              )}

              {!!(weather?.risk_alerts?.length) && (
                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Important Alerts</h3>
                  </div>
                  <div className="space-y-3">
                    {(weather.risk_alerts || []).map((alert: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-orange-800 text-sm">{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Crop Recommendations */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-1">
            <CardHeader className="bg-white pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <Sprout className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  Crop Recommendations
                  <CardDescription className="text-lg text-gray-600">
                    Optimized selection for maximum yield
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
          </div>
          <CardContent className="p-6 space-y-8">
            {/* Crop Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recommended Crops */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">Recommended Crops</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(crop?.suggested_crops || []).map((cropName: string, index: number) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                      <div className="text-center space-y-3">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🌱</div>
                        <p className="font-semibold text-green-900">{cropName}</p>
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">Ideal Match</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unsuitable Crops */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">Not Recommended</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(crop?.unsuitable_crops || []).map((cropName: string, index: number) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200/50 opacity-80">
                      <div className="text-center space-y-3">
                        <div className="text-3xl">🚫</div>
                        <p className="font-semibold text-red-900">{cropName}</p>
                        <Badge variant="outline" className="border-red-300 text-red-700">Poor Fit</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Crop Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cropMetrics.map((metric, index) => (
                <div key={index} className="p-6 bg-white rounded-2xl border border-gray-200/50 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                      <metric.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">{metric.label}</p>
                      <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  </div>
                  <Progress value={metric.level} className={`h-2 bg-gray-200`} />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reasoning */}
            {crop?.reasoning && (
              <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Leaf className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Why These Crops?</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{crop.reasoning}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Farming Plan */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1">
            <CardHeader className="bg-white pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  Farming Plan & Timeline
                  <CardDescription className="text-lg text-gray-600">
                    Step-by-step cultivation guide
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
          </div>
          <CardContent className="p-6 space-y-8">
            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200/50 text-center">
                <div className="text-3xl mb-3">🌾</div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Primary Crop</p>
                <p className="text-xl font-bold text-purple-700">{plan?.primary_crop ?? plan?.primary ?? '—'}</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200/50 text-center">
                <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-600 mb-2">Sowing Schedule</p>
                <p className="text-xl font-bold text-orange-700">{plan?.sowing_schedule ?? '—'}</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 text-center">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-600 mb-2">Harvest Time</p>
                <p className="text-xl font-bold text-green-700">{plan?.harvest_time ?? '—'}</p>
              </div>
            </div>

            {/* Plan Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {plan?.soil_preparation_steps?.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <div className="text-lg">🛠️</div>
                      </div>
                      <h3 className="font-semibold text-gray-900">Soil Preparation</h3>
                    </div>
                    <div className="space-y-3">
                      {(plan.soil_preparation_steps || []).map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plan?.irrigation_guidelines?.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Droplets className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Irrigation Guide</h3>
                    </div>
                    <div className="space-y-3">
                      {(plan.irrigation_guidelines || []).map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {plan?.fertilizer_recommendations?.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <div className="text-lg">🧪</div>
                      </div>
                      <h3 className="font-semibold text-gray-900">Fertilizer Plan</h3>
                    </div>
                    <div className="space-y-3">
                      {(plan.fertilizer_recommendations || []).map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plan?.risk_precautions?.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Shield className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Risk Management</h3>
                    </div>
                    <div className="space-y-3">
                      {(plan.risk_precautions || []).map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-red-700 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Storage Advice */}
            {plan?.storage_advice?.length > 0 && (
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <div className="text-lg">📦</div>
                  </div>
                  <h3 className="font-semibold text-gray-900">Storage & Harvest Advice</h3>
                </div>
                <div className="space-y-3">
                  {(plan.storage_advice || []).map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-amber-800 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Summary */}
            {plan?.overall_summary && (
              <div className="p-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">Plan Summary</h3>
                </div>
                <p className="leading-relaxed opacity-95">{plan.overall_summary}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="text-center py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent mb-3">
              Ready to Grow?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Implement this plan and track your farming progress with AgriSense
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.print()}
                className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Download Full Plan
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => router.push('/analyze')}
                className="gap-2 border-2 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700"
              >
                Create New Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}