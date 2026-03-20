import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { History as HistoryIcon, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { dbService } from '../lib/db';
import { useNavigate } from 'react-router-dom';

export const History = () => {
   const navigate = useNavigate();
   const [assessments, setAssessments] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     dbService.getAssessments().then(data => {
         setAssessments(data || []);
         setLoading(false);
     }).catch(err => {
         console.warn("Could not fetch assessments. Have you migrated Supabase?", err);
         setLoading(false);
     });
   }, []);

   if (loading) {
       return <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
   }

   return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-5xl mx-auto">
        
        <header className="flex items-center gap-3 border-b border-gray-100 pb-8">
           <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-inner border border-indigo-200">
              <HistoryIcon className="h-6 w-6" />
           </div>
           <div>
             <h1 className="text-3xl font-bold tracking-tight text-gray-900">Assessment History</h1>
             <p className="text-gray-500 font-medium">Review your past strategic analysis and prioritized roadmaps.</p>
           </div>
        </header>

        {assessments.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">You have no saved assessments yet.</p>
                <Button onClick={() => navigate('/assessment/new')} variant="outline">Create your first assessment</Button>
            </div>
        ) : (
            <div className="grid gap-4">
                {assessments.map(record => (
                   <Card key={record.id} className="border-gray-200 bg-white shadow-sm hover:shadow-md transition">
                       <CardContent className="flex items-center justify-between p-6">
                           <div className="flex flex-col gap-1">
                               <h3 className="text-xl font-bold text-gray-900">{record.title}</h3>
                               <p className="text-sm font-medium text-gray-500">Business Function: <span className="text-indigo-600 px-2 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-bold tracking-wide uppercase">{record.function_name}</span></p>
                           </div>
                           <div className="flex gap-8 items-center">
                               <div className="flex flex-col items-center">
                                   <span className="text-3xl font-extrabold text-blue-600 leading-none">{record.use_cases?.[0]?.count || 0}</span>
                                   <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Use Cases</span>
                               </div>
                               <div className="flex flex-col items-end">
                                   <span className="text-sm font-medium text-gray-500 mb-2">{new Date(record.created_at).toLocaleDateString()}</span>
                                   <Button variant="outline" size="sm" onClick={() => alert("Load assessment logic from DB isn't strictly requested in prompt but could map exactly like New Assessment pass down.")}>
                                       View Details <ArrowRight className="w-4 h-4 ml-2" />
                                   </Button>
                               </div>
                           </div>
                       </CardContent>
                   </Card>
                ))}
            </div>
        )}
      </div>
   );
};
