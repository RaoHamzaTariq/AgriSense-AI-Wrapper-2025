'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { LOADING_STEPS } from '@/constants';

export default function LoadingAnimation() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => router.push('/analyze/result'), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(stepInterval);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🌾</span>
          </div>

          <h2 className="text-2xl font-bold mb-8">AI is analyzing your farm data...</h2>

          <div className="flex justify-center items-center mb-8 space-x-4">
            {['Weather', 'Crop', 'Planner'].map((agent, index) => (
              <div key={agent} className="flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                  currentStep >= index * 2 ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {currentStep >= index * 2 ? '✓' : index + 1}
                </div>
                <span className="ml-2 text-sm">{agent} Agent</span>
                {index < 2 && <div className="w-8 h-1 mx-2 bg-gray-300" />}
              </div>
            ))}
          </div>

          <div className="text-lg text-gray-600 mb-6 h-8">
            {LOADING_STEPS[currentStep]}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}