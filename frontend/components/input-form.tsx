'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FarmData } from '@/lib/types/index';
import { SOIL_TYPES, SEASONS } from '@/constants';
import { MapPin, Leaf, Calendar, Clock, ArrowRight } from 'lucide-react';

export default function InputForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FarmData>({
    location: '',
    soilType: 'loamy',
    season: 'summer',
    duration: 6,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to analyze');
      sessionStorage.setItem('analysisResult', JSON.stringify(json.data));
      router.push('/analyze/result');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Farm Planning Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Provide your farm details to receive personalized crop recommendations and cultivation guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Information Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  {"What You'll Receive"}
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: '🌤️', title: 'Climate Analysis', desc: 'Weather patterns and seasonal insights' },
                    { icon: '🌱', title: 'Crop Suitability', desc: 'Best crops for your soil and location' },
                    { icon: '📅', title: 'Growing Calendar', desc: 'Optimal planting and harvest times' },
                    { icon: '💧', title: 'Irrigation Guide', desc: 'Water requirements and scheduling' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                        <div className="text-gray-600 text-xs">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Quick Tips</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>Be specific with your location for accurate weather data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>Consider your local microclimate and elevation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>Recent soil tests provide the most accurate results</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Farm Details
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Complete the form below to begin your assessment
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Location Field */}
                  <div className="space-y-4">
                    <Label htmlFor="location" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      Farm Location
                    </Label>
                    <Input
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter city, region, or coordinates..."
                      className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                    />
                    <p className="text-sm text-gray-500">This helps us provide accurate climate and soil data</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Soil Type */}
                    <div className="space-y-4">
                      <Label htmlFor="soilType" className="text-base font-semibold text-gray-900">
                        Soil Composition
                      </Label>
                      <div className="relative">
                        <select
                          id="soilType"
                          value={formData.soilType}
                          onChange={(e) => setFormData(prev => ({ ...prev, soilType: e.target.value as typeof prev.soilType }))}
                          className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 bg-white appearance-none transition-colors"
                        >
                          {SOIL_TYPES.map((soil) => (
                            <option key={soil.value} value={soil.value}>{soil.label}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <Leaf className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Season */}
                    <div className="space-y-4">
                      <Label htmlFor="season" className="text-base font-semibold text-gray-900">
                        Growing Season
                      </Label>
                      <div className="relative">
                        <select
                          id="season"
                          value={formData.season}
                          onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value as typeof prev.season }))}
                          className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 bg-white appearance-none transition-colors"
                        >
                          {SEASONS.map((season) => (
                            <option key={season.value} value={season.value}>{season.label}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-4">
                    <Label htmlFor="duration" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      Planning Horizon
                    </Label>
                    <div className="relative">
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="12"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 pl-4 pr-16 transition-colors"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        months
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Typically 3-6 months for most annual crops</p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={submitting} 
                      className="w-full h-14 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      {submitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Your Plan...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span>Generate Farming Plan</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { number: '95%', label: 'Accuracy' },
                { number: '24h', label: 'Fresh Data' },
                { number: '50+', label: 'Crop Types' },
              ].map((item, index) => (
                <div key={index} className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="font-bold text-2xl text-emerald-600">{item.number}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}