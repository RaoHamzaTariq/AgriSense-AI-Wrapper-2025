import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50 py-8">
      <div className="container flex min-h-svh flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-1">
              <CardHeader className="bg-white pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 bg-orange-100 rounded-2xl">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    Oops! Something went wrong
                    <p className="text-lg text-gray-600 font-normal mt-1">
                      We encountered an issue
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
            </div>
            
            <CardContent className="p-6 space-y-6">
              {/* Error Message */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                
                {params?.error ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                     {" We're sorry, but something unexpected happened while processing your request."}
                    </p>
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <p className="text-sm font-medium text-orange-900 mb-1">Error Code:</p>
                      <code className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-md font-mono">
                        {params.error}
                      </code>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    An unspecified error occurred. This might be a temporary issue. Please try again in a moment.
                  </p>
                )}
              </div>

              {/* Help Text */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">Quick Solutions</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Refresh the page and try again</li>
                      <li>• Check your internet connection</li>
                      <li>• Clear your browser cache</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  asChild
                  variant="outline"
                  className="flex-1 gap-2 border-2 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700"
                >
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </Button>
                
                <Button 
                  onClick={() => window.location.reload()}
                  className="flex-1 gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>

              {/* Support Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Need help?{" "}
                  <Link 
                    href="/contact" 
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🔄", title: "Refresh", desc: "Reload the page" },
              { icon: "🏠", title: "Home", desc: "Return to homepage" },
              { icon: "📞", title: "Support", desc: "Get help" },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-100">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                <div className="text-gray-600 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}