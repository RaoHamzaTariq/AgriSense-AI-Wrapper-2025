import { UpdatePasswordForm } from "@/components/update-password-form";
import { Leaf, Shield, Lock, KeyRound } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50">
      <div className="container relative flex min-h-svh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        
        {/* Left Column - Form */}
        <div className="w-full p-6 md:p-10 lg:flex lg:items-center lg:justify-center">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="lg:p-8">
    
              
              <UpdatePasswordForm />
            </div>
          </div>
        </div>

        {/* Right Column - Security Showcase */}
        <div className="hidden lg:flex relative h-full flex-col bg-gradient-to-br from-emerald-600 to-green-700 text-white p-10">
          <div className="absolute inset-0 bg-black/10" />
          
        

          <div className="relative z-20 flex flex-1 flex-col justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AgriSense</h1>
                <p className="text-white/80 text-sm">Secure Account Management</p>
              </div>
            </div>

            {/* Security Showcase */}
            <div className="space-y-8 max-w-md">
              <div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  Account Security
                  <span className="block text-emerald-200">Updated in Real-time</span>
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Your new password will be immediately active across all your AgriSense sessions and devices.
                </p>
              </div>

              {/* Security Features */}
              <div className="space-y-6">
                {[
                  {
                    icon: Lock,
                    title: "Instant Sync",
                    description: "Password updates apply immediately across all devices"
                  },
                  {
                    icon: Shield,
                    title: "End-to-End Security",
                    description: "Your password is encrypted and securely stored"
                  },
                  {
                    icon: KeyRound,
                    title: "Session Protection",
                    description: "Active sessions remain secure during password changes"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 backdrop-blur-sm flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-white/90 italic mb-3">
                  {`"AgriSense's security features give me confidence that my farm data and account are always protected, even when updating passwords."`}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">RK</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Sohail Khan</div>
                    <div className="text-white/70 text-xs">Agricultural Consultant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}