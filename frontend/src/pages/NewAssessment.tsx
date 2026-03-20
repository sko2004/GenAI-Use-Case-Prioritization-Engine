import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Wand2, Factory, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateUseCases } from '../lib/groq';
import { scoreUseCase } from '../lib/scoring';
import { UseCase } from '../types';

export const NewAssessment = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, control, handleSubmit } = useForm({
        defaultValues: {
            title: '',
            functionName: 'HR',
            painPoints: [{ description: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "painPoints"
    });

    const functions = ['HR', 'Finance', 'Risk & Compliance', 'Procurement', 'Healthcare', 'Operations', 'Customer Support', 'Knowledge Management'];

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            // Convert simple painpoints to array of strings
            const painPointList = data.painPoints.map((p: any) => p.description).filter((desc: string) => desc.trim() !== '');
            const rawCases = await generateUseCases(data.functionName, painPointList);
            const scoredCases = rawCases.map(scoreUseCase);
            
            // Pass the resulting cases to the Results page state
            navigate('/assessment/results', {
                state: {
                    title: data.title,
                    functionName: data.functionName,
                    painPoints: painPointList,
                    useCases: scoredCases
                }
            });
        } catch (error) {
            console.error(error);
            alert("Error generating use cases");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-inner border border-indigo-200">
                  <Factory className="h-6 w-6" />
               </div>
               <div>
                 <h1 className="text-3xl font-bold tracking-tight text-gray-900">New Assessment</h1>
                 <p className="text-gray-500 font-medium">Capture business pain points to discover GenAI opportunities.</p>
               </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle>Assessment Context</CardTitle>
                        <CardDescription>Define the scope of this exploration.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                           <Label htmlFor="title">Assessment Title</Label>
                           <Input id="title" placeholder="e.g. Q4 Core Operations GenAI Discovery" {...register("title", { required: true })} className="bg-gray-50/50" />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="functionName">Business Function</Label>
                           <select 
                             id="functionName" 
                             {...register("functionName")}
                             className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition"
                           >
                             {functions.map(f => (
                                 <option key={f} value={f}>{f}</option>
                             ))}
                           </select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle>Pain Points Capture</CardTitle>
                        <CardDescription>Describe the operational friction points that need solving.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-3 items-start group">
                                <span className="mt-2 text-gray-400 font-mono text-sm">{index+1}.</span>
                                <Input 
                                   placeholder="e.g. High manual effort spent reconciling invoices..."
                                   {...register(`painPoints.${index}.description` as const, { required: true })}
                                   className="bg-gray-50/50"
                                />
                                <Button
                                   type="button"
                                   variant="ghost"
                                   size="icon"
                                   onClick={() => remove(index)}
                                   className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                >
                                   <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => append({ description: '' })}
                           className="border-dashed border-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50 w-full mt-4"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Pain Point
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={isLoading} className="shadow-xl shadow-indigo-200/50">
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Requirements...</>
                        ) : (
                            <><Wand2 className="mr-2 h-5 w-5" /> Generate Use Cases</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
