import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-emerald-100" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">🌾</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
          Agri<span className="text-green-600">Sense</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          AI-Powered Crop Planning for <span className="text-green-600 font-semibold">Smarter Farming</span>
        </p>

        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Make data-driven decisions about which crops to grow using weather, soil, 
          and climate data through our intelligent AI multi-agent system.
        </p>

        <Link href="/analyze">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-2xl">
            Start Planning Today →
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            { icon: '🌤️', title: 'Weather Analysis', desc: 'Real-time climate insights' },
            { icon: '🌱', title: 'Smart Recommendations', desc: 'AI-powered crop suggestions' },
            { icon: '📊', title: 'Farming Plan', desc: 'Step-by-step guidance' },
          ].map((feature, index) => (
            <div key={index} className="bg-white/70 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}