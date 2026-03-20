import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UseCase } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BrainCircuit, Activity, Download, ArrowLeft, ArrowUpRight, BarChart3, AlertTriangle, Cpu, Save, Loader2, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, CartesianGrid, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../lib/db';

export const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [useCases, setUseCases] = useState<UseCase[]>(location.state?.useCases || []);
    const { title, functionName, painPoints } = location.state || { title: 'No Title', functionName: 'Unknown', painPoints: [] };
    
    // Safety check mostly for hot reloads
    if (!useCases || useCases.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-500">
                <BrainCircuit className="h-16 w-16 text-indigo-200 mb-6 mx-auto animate-pulse" />
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">No Generated Data Found</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">Please run an assessment to generate AI Use Cases.</p>
                <Button onClick={() => navigate('/assessment/new')} size="lg" className="shadow-lg shadow-indigo-100">
                   Back to Assessment form
                </Button>
            </div>
        );
    }

    const priorityColors = {
        'Quick Win': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Strategic Bet': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'Optional/Low Priority': 'bg-gray-50 text-gray-700 border-gray-200',
        'Avoid/Defer': 'bg-red-50 text-red-700 border-red-200',
    };

    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const scatterData = useCases.map((uc) => ({
        id: uc.id,
        name: uc.title,
        effort: uc.effort_score,
        impact: uc.impact_score,
        size: uc.total_score * 10,
        fill: uc.priority_bucket === 'Quick Win' ? '#10B981' : uc.priority_bucket === 'Strategic Bet' ? '#6366F1' : uc.priority_bucket === 'Avoid/Defer' ? '#EF4444' : '#9CA3AF'
    }));

    const handleSave = async () => {
        if (!user) {
            alert("No authenticated session context found.");
            return;
        }
        setIsSaving(true);
        try {
            await dbService.saveAssessment(user.id, title, functionName, painPoints, useCases);
            setSaved(true);
        } catch (error) {
            console.error("DB Save Error", error);
            alert("Failed to save report.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <header className="flex items-center justify-between border-b border-gray-100 pb-8">
               <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full mr-2">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Prioritization Results</h1>
                 </div>
                 <p className="text-gray-500 font-medium ml-14">Assessment: <span className="text-indigo-600 font-semibold">{title}</span> • Function: <span className="text-gray-900 font-semibold">{functionName}</span></p>
               </div>
               <div className="flex gap-4">
                  <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition" onClick={handleSave} disabled={isSaving || saved}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} 
                      {saved ? 'Saved Successfully' : 'Save to History'}
                  </Button>
                  <Button size="lg" className="shadow-lg shadow-indigo-200" onClick={() => window.print()}>
                      <Download className="w-4 h-4 mr-2 print:hidden" /> Export PDF
                  </Button>
               </div>
            </header>

            {/* Matrix Visualization */}
            <section className="grid md:grid-cols-2 gap-8">
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-600"/> Prioritization Matrix</CardTitle>
                        <CardDescription>Visualizing Business Impact vs Implementation Effort</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis type="number" dataKey="effort" name="Effort" domain={[0, 6]} label={{ value: "Implementation Effort →", position: "insideBottom", offset: -10, fill: "#6B7280", fontSize: 12, fontWeight: 500 }} stroke="#9CA3AF" tick={false} />
                                <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 6]} label={{ value: "Business Impact ↑", angle: -90, position: "insideLeft", fill: "#6B7280", fontSize: 12, fontWeight: 500 }} stroke="#9CA3AF" tick={false} />
                                <ZAxis type="number" dataKey="size" range={[60, 400]} />
                                <RechartsTooltip 
                                    cursor={{ strokeDasharray: '3 3' }} 
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white/95 backdrop-blur shadow-xl border border-gray-100 p-4 rounded-xl text-sm w-48 z-50">
                                                    <p className="font-semibold text-gray-900 leading-tight mb-2">{data.name}</p>
                                                    <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Impact:</span><span className="font-medium">{data.impact}/5</span></div>
                                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Effort:</span><span className="font-medium">{data.effort}/5</span></div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Scatter name="Use Cases" data={scatterData} fill="#8884d8">
                                    {scatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                        {/* Matrix Quadrant Labels */}
                        <div className="absolute top-10 left-16 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Quick Wins</div>
                        <div className="absolute top-10 right-10 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Strategic Bets</div>
                        <div className="absolute bottom-10 left-16 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">Low Priority</div>
                        <div className="absolute bottom-10 right-10 text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">High Risk</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Cpu className="w-5 h-5 text-indigo-600"/> Roadmap Progression</CardTitle>
                        <CardDescription>Suggested adoption path based on scores and dependencies.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="relative border-l-2 border-indigo-100 pl-6 pb-6 space-y-2">
                           <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
                           <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Phase 1: Quick Wins (0-3 Months)</h4>
                           <p className="text-sm text-gray-500">Target applications with high readiness and clear ROI.</p>
                           <div className="flex flex-wrap gap-2 mt-2">
                               {useCases.filter(uc => uc.roadmap_stage.includes('Phase 1')).map(uc => (
                                   <div key={uc.id} className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-md font-medium">{uc.title}</div>
                               ))}
                           </div>
                        </div>
                        <div className="relative border-l-2 border-indigo-100 pl-6 pb-6 space-y-2">
                           <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
                           <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Phase 2: Medium-Term Pilots (3-9 Months)</h4>
                           <p className="text-sm text-gray-500">Transformative applications requiring data grooming and process alignment.</p>
                           <div className="flex flex-wrap gap-2 mt-2">
                               {useCases.filter(uc => uc.roadmap_stage.includes('Phase 2')).map(uc => (
                                   <div key={uc.id} className="text-xs bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-md font-medium">{uc.title}</div>
                               ))}
                           </div>
                        </div>
                        <div className="relative pl-6 space-y-2">
                           <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-gray-300 border border-white"></div>
                           <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Phase 3: Long-Term Integration (9-18 Months)</h4>
                           <p className="text-sm text-gray-500">High-effort programs that remodel extensive workflows.</p>
                           <div className="flex flex-wrap gap-2 mt-2">
                               {useCases.filter(uc => uc.roadmap_stage.includes('Phase 3')).map(uc => (
                                   <div key={uc.id} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-md font-medium">{uc.title}</div>
                               ))}
                           </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Detailed Justifications */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                   <h2 className="text-2xl font-bold tracking-tight text-gray-900">Recommended GenAI Applications</h2>
                   <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{useCases.length} Options</span>
                </div>
                <div className="grid gap-6">
                    {useCases.sort((a,b) => b.total_score - a.total_score).map((uc, i) => (
                        <Card key={uc.id} className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition">
                            <div className="flex flex-col md:flex-row">
                                {/* Score Panel */}
                                <div className="md:w-64 bg-gray-50 p-6 flex flex-col justify-center border-r border-gray-100">
                                   <div className="text-center group relative cursor-pointer">
                                       <span className="block text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-blue-600 mb-1 leading-none">{uc.total_score}</span>
                                       <span className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Prioritization Score</span>
                                       <div className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${priorityColors[uc.priority_bucket]}`}>
                                          {uc.priority_bucket}
                                       </div>
                                       
                                       {/* Hover Explainer */}
                                       <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-100 transition duration-300 rounded peer flex flex-col justify-center p-2 text-left z-10 shadow-xl border border-gray-100 overflow-hidden translate-x-4 md:-translate-y-4">
                                            <p className="text-[10px] text-gray-500 font-mono mb-1 border-b pb-1">Scoring Breakdown</p>
                                            <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Business Impact</span><span className="font-semibold">{uc.impact_score}/5</span></div>
                                            <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Implementation Effort</span><span className="font-semibold text-red-500">{uc.effort_score}/5</span></div>
                                            <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Data Readiness</span><span className="font-semibold">{uc.data_readiness_score}/5</span></div>
                                            <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Process Feasibility</span><span className="font-semibold">{uc.process_standardization_score}/5</span></div>
                                            <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Scale & Adoption</span><span className="font-semibold">{Math.round((uc.scalability_score + uc.adoption_feasibility_score)/2)}/5</span></div>
                                            <div className="flex justify-between text-xs"><span className="text-gray-500">Compliance Risk</span><span className="font-semibold text-amber-500">{uc.risk_score}/5</span></div>
                                       </div>
                                   </div>
                                </div>
                                {/* Detail Panel */}
                                <div className="flex-1 p-8">
                                    <div className="flex items-start justify-between mb-4">
                                       <div>
                                           <h3 className="text-xl font-bold text-gray-900 mb-1">{uc.title}</h3>
                                           <p className="text-sm font-medium text-gray-600 leading-relaxed">{uc.description}</p>
                                       </div>
                                       <span className="flex-shrink-0 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hidden md:block">
                                           {uc.roadmap_stage.split(':')[0]}
                                       </span>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                                        <div className="space-y-4">
                                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5"><ArrowUpRight className="w-3.5 h-3.5"/> Expected Value</h4>
                                                <p className="text-sm text-emerald-800 leading-relaxed">{uc.expected_benefit}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Why it fits the pain points</h4>
                                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-400 italic">"{uc.llm_generated_reason}"</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> Risks & Mitigation</h4>
                                                <p className="text-sm text-amber-800 leading-relaxed">{uc.risks}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Prerequisites</h4>
                                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{uc.prerequisites}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};
