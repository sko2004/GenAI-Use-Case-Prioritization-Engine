-- Drop tables if they exist to allow clean migrations
drop table if exists use_cases;
drop table if exists pain_points;
drop table if exists assessments;

-- Create core tables
create table assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  function_name text not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table pain_points (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references assessments on delete cascade not null,
  description text not null
);

create table use_cases (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references assessments on delete cascade not null,
  title text not null,
  category text not null,
  description text not null,
  llm_generated_reason text,
  prerequisites text,
  expected_benefit text,
  risks text,
  impact_score integer,
  effort_score integer,
  data_readiness_score integer,
  risk_score integer,
  process_standardization_score integer,
  scalability_score integer,
  adoption_feasibility_score integer,
  total_score numeric,
  priority_bucket text,
  roadmap_stage text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS)
alter table assessments enable row level security;
alter table pain_points enable row level security;
alter table use_cases enable row level security;

-- Create Policies to ensure users can only access their own data
create policy "Users can view own assessments" on assessments for select using (auth.uid() = user_id);
create policy "Users can create custom assessments" on assessments for insert with check (auth.uid() = user_id);

create policy "Users can view child pain points" on pain_points for select using (
  exists (select 1 from assessments where assessments.id = pain_points.assessment_id and assessments.user_id = auth.uid())
);
create policy "Users can insert pain points" on pain_points for insert with check (
  exists (select 1 from assessments where assessments.id = pain_points.assessment_id and assessments.user_id = auth.uid())
);

create policy "Users can view child use cases" on use_cases for select using (
  exists (select 1 from assessments where assessments.id = use_cases.assessment_id and assessments.user_id = auth.uid())
);
create policy "Users can insert use cases" on use_cases for insert with check (
  exists (select 1 from assessments where assessments.id = use_cases.assessment_id and assessments.user_id = auth.uid())
);
