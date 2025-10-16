"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, UserPlus, CheckCircle } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 2) {
      setError("Please choose a stronger password");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { id: 1, text: "At least 8 characters", met: password.length >= 8 },
    { id: 2, text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { id: 3, text: "One number", met: /[0-9]/.test(password) },
    { id: 4, text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md mx-auto border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-emerald-700 bg-clip-text text-transparent">
              Join AgriSense
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">
              Create your account to start smart farming
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="h-12 pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            "h-2 flex-1 rounded-full transition-all duration-300",
                            level <= passwordStrength
                              ? level === 1
                                ? "bg-red-400"
                                : level === 2
                                ? "bg-orange-400"
                                : level === 3
                                ? "bg-yellow-400"
                                : "bg-emerald-500"
                              : "bg-gray-200"
                          )}
                        />
                      ))}
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {passwordRequirements.map((req) => (
                        <div
                          key={req.id}
                          className={cn(
                            "flex items-center gap-2 transition-colors",
                            req.met ? "text-emerald-600" : "text-gray-500"
                          )}
                        >
                          <CheckCircle className="w-3 h-3" />
                          {req.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Repeat Password Field */}
              <div className="space-y-3">
                <Label htmlFor="repeat-password" className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="repeat-password"
                    type={showRepeatPassword ? "text" : "password"}
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="h-12 pr-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showRepeatPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {repeatPassword && password !== repeatPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Your Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors group"
                >
                  Sign in to your account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      
    </div>
  );
}