/**
 * Supabase Database Type Definitions for DARKSPOT AI
 * Enables plug-and-play synchronization with Supabase PostgreSQL backend.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type InvestigationAnalysisStatus =
  | "draft"
  | "extracting"
  | "analyzing"
  | "completed"
  | "error";

export type SourceExtractionStatus =
  | "pending"
  | "extracting"
  | "success"
  | "failed"
  | "blocked";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "verified"
  | "unable_to_verify";

export interface Database {
  public: {
    Tables: {
      investigator_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          role: string;
          organization: string;
          avatar_url: string | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name?: string;
          role?: string;
          organization?: string;
          avatar_url?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          role?: string;
          organization?: string;
          avatar_url?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      investigations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string | null;
          title: string;
          topic: string;
          research_question: string | null;
          primary_question: string | null;
          research_objective: string | null;
          objective: string | null;
          context: string | null;
          status: InvestigationAnalysisStatus;
          dark_spot_index: number;
          is_starred: boolean;
          is_demo: boolean;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          title: string;
          topic: string;
          research_question?: string | null;
          primary_question?: string | null;
          research_objective?: string | null;
          objective?: string | null;
          context?: string | null;
          status?: InvestigationAnalysisStatus;
          dark_spot_index?: number;
          is_starred?: boolean;
          is_demo?: boolean;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          title?: string;
          topic?: string;
          research_question?: string | null;
          primary_question?: string | null;
          research_objective?: string | null;
          objective?: string | null;
          context?: string | null;
          status?: InvestigationAnalysisStatus;
          dark_spot_index?: number;
          is_starred?: boolean;
          is_demo?: boolean;
          metadata?: Json;
        };
      };
      sources: {
        Row: {
          id: string;
          investigation_id: string;
          created_at: string;
          updated_at: string;
          retrieved_at: string;
          source_label: string;
          title: string;
          url: string | null;
          content: string;
          published_at: string | null;
          source_type: "url" | "manual_text";
          extraction_status: SourceExtractionStatus;
          temporal_status: "current" | "outdated" | "undated";
          word_count: number;
          reliability_score: number;
          metadata: Json;
        };
        Insert: {
          id?: string;
          investigation_id: string;
          created_at?: string;
          updated_at?: string;
          retrieved_at?: string;
          source_label: string;
          title: string;
          url?: string | null;
          content: string;
          published_at?: string | null;
          source_type?: "url" | "manual_text";
          extraction_status?: SourceExtractionStatus;
          temporal_status?: "current" | "outdated" | "undated";
          word_count?: number;
          reliability_score?: number;
          metadata?: Json;
        };
        Update: {
          id?: string;
          investigation_id?: string;
          created_at?: string;
          updated_at?: string;
          retrieved_at?: string;
          source_label?: string;
          title?: string;
          url?: string | null;
          content?: string;
          published_at?: string | null;
          source_type?: "url" | "manual_text";
          extraction_status?: SourceExtractionStatus;
          temporal_status?: "current" | "outdated" | "undated";
          word_count?: number;
          reliability_score?: number;
          metadata?: Json;
        };
      };
      extracted_claims: {
        Row: {
          id: string;
          investigation_id: string;
          source_id: string;
          created_at: string;
          updated_at: string;
          claim_text: string;
          research_dimension: string;
          claim_category: string;
          supporting_excerpt: string;
          extraction_confidence: number;
          analysis_status: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          investigation_id: string;
          source_id: string;
          created_at?: string;
          updated_at?: string;
          claim_text: string;
          research_dimension?: string;
          claim_category: string;
          supporting_excerpt: string;
          extraction_confidence?: number;
          analysis_status?: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          investigation_id?: string;
          source_id?: string;
          created_at?: string;
          updated_at?: string;
          claim_text?: string;
          research_dimension?: string;
          claim_category?: string;
          supporting_excerpt?: string;
          extraction_confidence?: number;
          analysis_status?: string;
          metadata?: Json;
        };
      };
      information_gaps: {
        Row: {
          id: string;
          investigation_id: string;
          created_at: string;
          updated_at: string;
          dimension: string;
          missing_category: string;
          title: string;
          explanation: string;
          why_it_matters: string;
          evidence_reviewed: string[];
          suggested_next_step: string;
          severity: "HIGH" | "MEDIUM" | "LOW" | string;
          status: string;
          evidence_coverage: string;
          confidence_level: number;
          signal_label: string;
        };
        Insert: {
          id?: string;
          investigation_id: string;
          created_at?: string;
          updated_at?: string;
          dimension: string;
          missing_category: string;
          title: string;
          explanation: string;
          why_it_matters: string;
          evidence_reviewed?: string[];
          suggested_next_step: string;
          severity?: "HIGH" | "MEDIUM" | "LOW" | string;
          status?: string;
          evidence_coverage?: string;
          confidence_level?: number;
          signal_label?: string;
        };
        Update: {
          id?: string;
          investigation_id?: string;
          created_at?: string;
          updated_at?: string;
          dimension?: string;
          missing_category?: string;
          title?: string;
          explanation?: string;
          why_it_matters?: string;
          evidence_reviewed?: string[];
          suggested_next_step?: string;
          severity?: "HIGH" | "MEDIUM" | "LOW" | string;
          status?: string;
          evidence_coverage?: string;
          confidence_level?: number;
          signal_label?: string;
        };
      };
      contradictions: {
        Row: {
          id: string;
          investigation_id: string;
          created_at: string;
          updated_at: string;
          claim_a_id: string | null;
          claim_b_id: string | null;
          claim_a: string;
          claim_b: string;
          source_a: string;
          source_b: string;
          supporting_excerpt_a: string;
          supporting_excerpt_b: string;
          conflict_category: string;
          comparison_dimension: string;
          explanation: string;
          confidence: number;
          status: string;
          verification_recommendation: string;
          is_contextual_divergence: boolean;
        };
        Insert: {
          id?: string;
          investigation_id: string;
          created_at?: string;
          updated_at?: string;
          claim_a_id?: string | null;
          claim_b_id?: string | null;
          claim_a: string;
          claim_b: string;
          source_a: string;
          source_b: string;
          supporting_excerpt_a: string;
          supporting_excerpt_b: string;
          conflict_category?: string;
          comparison_dimension: string;
          explanation: string;
          confidence?: number;
          status?: string;
          verification_recommendation: string;
          is_contextual_divergence?: boolean;
        };
        Update: {
          id?: string;
          investigation_id?: string;
          created_at?: string;
          updated_at?: string;
          claim_a_id?: string | null;
          claim_b_id?: string | null;
          claim_a?: string;
          claim_b?: string;
          source_a?: string;
          source_b?: string;
          supporting_excerpt_a?: string;
          supporting_excerpt_b?: string;
          conflict_category?: string;
          comparison_dimension?: string;
          explanation?: string;
          confidence?: number;
          status?: string;
          verification_recommendation?: string;
          is_contextual_divergence?: boolean;
        };
      };
      verification_tasks: {
        Row: {
          id: string;
          investigation_id: string;
          created_at: string;
          updated_at: string;
          priority: number;
          priority_level: string;
          title: string;
          action: string;
          description: string | null;
          reason: string | null;
          related_gap_id: string | null;
          related_gap_or_conflict: string | null;
          recommended_source: string | null;
          status: TaskStatus;
          completed: boolean;
          assigned_sources: string[];
          supporting_evidence_references: string[];
          estimated_effort: string;
        };
        Insert: {
          id?: string;
          investigation_id: string;
          created_at?: string;
          updated_at?: string;
          priority?: number;
          priority_level?: string;
          title: string;
          action: string;
          description?: string | null;
          reason?: string | null;
          related_gap_id?: string | null;
          related_gap_or_conflict?: string | null;
          recommended_source?: string | null;
          status?: TaskStatus;
          completed?: boolean;
          assigned_sources?: string[];
          supporting_evidence_references?: string[];
          estimated_effort?: string;
        };
        Update: {
          id?: string;
          investigation_id?: string;
          created_at?: string;
          updated_at?: string;
          priority?: number;
          priority_level?: string;
          title?: string;
          action?: string;
          description?: string | null;
          reason?: string | null;
          related_gap_id?: string | null;
          related_gap_or_conflict?: string | null;
          recommended_source?: string | null;
          status?: TaskStatus;
          completed?: boolean;
          assigned_sources?: string[];
          supporting_evidence_references?: string[];
          estimated_effort?: string;
        };
      };
      analysis_runs: {
        Row: {
          id: string;
          investigation_id: string;
          created_at: string;
          started_at: string;
          completed_at: string | null;
          analysis_method: string;
          analysis_status: string;
          summary: string | null;
          metrics: Json;
        };
        Insert: {
          id?: string;
          investigation_id: string;
          created_at?: string;
          started_at?: string;
          completed_at?: string | null;
          analysis_method?: string;
          analysis_status?: string;
          summary?: string | null;
          metrics?: Json;
        };
        Update: {
          id?: string;
          investigation_id?: string;
          created_at?: string;
          started_at?: string;
          completed_at?: string | null;
          analysis_method?: string;
          analysis_status?: string;
          summary?: string | null;
          metrics?: Json;
        };
      };
      // Legacy aliases for backwards compatibility
      claims: Database["public"]["Tables"]["extracted_claims"];
      gaps: Database["public"]["Tables"]["information_gaps"];
      conflicts: Database["public"]["Tables"]["contradictions"];
      checklist_items: Database["public"]["Tables"]["verification_tasks"];
      gap_reports: Database["public"]["Tables"]["information_gaps"];
    };
  };
}
