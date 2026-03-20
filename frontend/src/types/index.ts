export interface UseCase {
  id: string; // added to manage generated UI state
  title: string;
  category: string;
  description: string;
  llm_generated_reason: string;
  prerequisites: string;
  expected_benefit: string;
  risks: string;
  stakeholders?: string;
  impact_score: number;
  effort_score: number;
  data_readiness_score: number;
  risk_score: number;
  process_standardization_score: number;
  scalability_score: number;
  adoption_feasibility_score: number;
  total_score: number;
  priority_bucket: 'Quick Win' | 'Strategic Bet' | 'Optional/Low Priority' | 'Avoid/Defer';
  roadmap_stage: 'Phase 1: Quick Wins' | 'Phase 2: Medium-Term Pilots' | 'Phase 3: Long-Term Integration';
}

export interface Assessment {
  id: string;
  userId: string;
  functionId: string;
  title: string;
  createdAt: string;
  useCases?: UseCase[];
}

export interface PainPoint {
  id: string;
  description: string;
  severity: number;
  frequency: number;
}
