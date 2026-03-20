import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { BrainCircuit, Activity, CheckCircle, TrendingUp, Presentation, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
   const navigate = useNavigate();
   const { user } = useAuth();

   return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        <header className="mb-10 flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Strategist'}</h1>
             <p className="text-gray-500 mt-2">Here's an overview of your GenAI discovery pipeline.</p>
           </div>
           <Button onClick={() => navigate('/assessment/new')} size="lg" className="shadow-lg shadow-indigo-200">
              New Assessment <ArrowRight className="ml-2 w-4 h-4" />
           </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
           {[ 
             { title: 'Total Assessments', val: '4', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
             { title: 'Use Cases Generated', val: '28', icon: BrainCircuit, color: 'text-indigo-600', bg: 'bg-indigo-100' },
             { title: 'Quick Wins Identified', val: '6', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
             { title: 'Strategic Bets', val: '3', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' }
           ].map((stat, i) => (
             <Card key={i} className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-lg hover:shadow-lg transition-all hover:-translate-y-1">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                 <div className={`p-2 rounded-lg ${stat.bg}`}>
                   <stat.icon className={`h-4 w-4 ${stat.color}`} />
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold">{stat.val}</div>
               </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
           <Card className="col-span-4 border-none shadow-md">
              <CardHeader>
                <CardTitle>Recent Priority Pipeline</CardTitle>
                <CardDescription>A summary of your latest evaluations across functions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {[
                   { fw: 'Finance', pr: 'Invoice Processing Agent', rank: 'Quick Win' },
                   { fw: 'HR', pr: 'Onboarding Copilot', rank: 'Strategic Bet' },
                   { fw: 'Customer Support', pr: 'Triage AI Agent', rank: 'Quick Win' },
                 ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <div className="flex flex-col">
                           <span className="font-semibold text-gray-900">{item.pr}</span>
                           <span className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-1">{item.fw}</span>
                       </div>
                       <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${item.rank === 'Quick Win' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {item.rank}
                       </span>
                    </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="col-span-3 border-none shadow-md bg-gradient-to-br from-indigo-900 to-blue-900 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Presentation className="h-48 w-48 text-white" />
               </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-white text-xl">Generate Board Reports</CardTitle>
                <CardDescription className="text-indigo-200 mt-2">Export your prioritized roadmaps directly into presentation-ready PDFs.</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 mt-6">
                 <Button className="w-full bg-white text-indigo-900 hover:bg-gray-100">
                    View Reports
                 </Button>
              </CardContent>
           </Card>
        </div>

      </div>
   );
};
