import { UseCase } from '../types';
import { supabase } from './supabase';

export const dbService = {
  saveAssessment: async (
    userId: string,
    title: string,
    functionName: string,
    painPoints: string[],
    useCases: UseCase[]
  ) => {
    // 1. Insert Assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        user_id: userId,
        title,
        function_name: functionName
      })
      .select()
      .single();

    if (assessmentError) throw assessmentError;

    const assessmentId = assessment.id;

    // 2. Insert Pain Points
    const painPointsPayload = painPoints.map(pp => ({
      assessment_id: assessmentId,
      description: pp
    }));
    const { error: ppError } = await supabase
      .from('pain_points')
      .insert(painPointsPayload);

    if (ppError) throw ppError;

    // 3. Insert Use Cases
    const useCasesPayload = useCases.map((uc) => ({
      assessment_id: assessmentId,
      title: uc.title,
      category: uc.category,
      description: uc.description,
      llm_generated_reason: uc.llm_generated_reason,
      prerequisites: uc.prerequisites,
      expected_benefit: uc.expected_benefit,
      risks: uc.risks,
      impact_score: uc.impact_score,
      effort_score: uc.effort_score,
      data_readiness_score: uc.data_readiness_score,
      risk_score: uc.risk_score,
      process_standardization_score: uc.process_standardization_score,
      scalability_score: uc.scalability_score,
      adoption_feasibility_score: uc.adoption_feasibility_score,
      total_score: uc.total_score,
      priority_bucket: uc.priority_bucket,
      roadmap_stage: uc.roadmap_stage
    }));

    const { error: ucError } = await supabase
      .from('use_cases')
      .insert(useCasesPayload);

    if (ucError) throw ucError;
    return assessmentId;
  },

  getAssessments: async () => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*, use_cases(count)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
