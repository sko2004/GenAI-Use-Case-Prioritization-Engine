import { UseCase } from '../types';

export const scoreUseCase = (useCase: Partial<UseCase>): UseCase => {
  const impact = Math.floor(Math.random() * 3) + 3; // 3 to 5
  const effort = Math.floor(Math.random() * 3) + 2; // 2 to 4
  const dataReadiness = Math.floor(Math.random() * 3) + 2;
  const risk = Math.floor(Math.random() * 2) + 2;
  const processStd = Math.floor(Math.random() * 3) + 3;
  const scalability = Math.floor(Math.random() * 3) + 3;
  const adoption = Math.floor(Math.random() * 3) + 2;

  let totalScore = 
    (0.25 * impact) + 
    (0.15 * dataReadiness) + 
    (0.15 * scalability) + 
    (0.10 * processStd) + 
    (0.10 * adoption) - 
    (0.15 * effort) - 
    (0.10 * risk);
  
  // Normalize slightly to a 10 pt base roughly
  totalScore = Math.max(0, Math.min(10, totalScore * 2));

  let priority_bucket: UseCase['priority_bucket'] = 'Optional/Low Priority';
  let roadmap_stage: UseCase['roadmap_stage'] = 'Phase 3: Long-Term Integration';

  if (impact >= 4 && effort <= 3) {
    priority_bucket = 'Quick Win';
    roadmap_stage = 'Phase 1: Quick Wins';
  } else if (impact >= 4 && effort > 3) {
    priority_bucket = 'Strategic Bet';
    roadmap_stage = 'Phase 2: Medium-Term Pilots';
  } else if (impact < 3 && effort > 3) {
    priority_bucket = 'Avoid/Defer';
  }

  return {
    ...useCase,
    impact_score: impact,
    effort_score: effort,
    data_readiness_score: dataReadiness,
    risk_score: risk,
    process_standardization_score: processStd,
    scalability_score: scalability,
    adoption_feasibility_score: adoption,
    total_score: Number(totalScore.toFixed(1)),
    priority_bucket,
    roadmap_stage
  } as UseCase;
}
