import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50 py-8">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-1">
                <CardHeader className="bg-white pb-4">
                  <div className="text-center space-y-4">
                    {/* Animated Check Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent">
                        Welcome to AgriSense!
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600 mt-2">
                        Your account has been created successfully
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>
              
              <CardContent className="p-6 space-y-6">
                {/* Main Content */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 text-emerald-600 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <Mail className="w-5 h-5" />
                    <p className="text-sm font-medium">
                      Check your email to confirm your account
                    </p>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {`We've sent a confirmation link to your email address. 
                    Please click the link in the email to verify your account 
                    and start using AgriSense.`}
                  </p>
                </div>

                {/* Helpful Tips */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-blue-900">{`What's Next?`}</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          Check your inbox (and spam folder)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          Click the verification link in the email
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          Return here to sign in to your account
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    asChild
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/auth/login" className="flex items-center gap-3">
                      <span>Sign In to AgriSense</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 rounded-xl transition-all duration-200"
                  >
                    <Link href="/" className="flex items-center gap-3">
                      Back to Homepage
                    </Link>
                  </Button>
                </div>

            
              </CardContent>
            </Card>

          
          </div>
        </div>
      </div>
    </div>
  );
}