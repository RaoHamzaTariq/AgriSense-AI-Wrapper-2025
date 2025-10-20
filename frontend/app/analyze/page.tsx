import InputForm from '@/components/input-form'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
  
export default async function AnalyzePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="">
     <div className="shadow rounded-lg p-6">
        <InputForm />
      </div>
    </div>
  );
}


