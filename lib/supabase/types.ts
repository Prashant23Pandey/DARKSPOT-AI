/**
 * Supabase Database Type Definitions for DARKSPOT AI
 * Enables plug-and-play migration to Supabase PostgreSQL backend.
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

export interface Database {
  public: {
    Tables: {
      investigations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string | null;
          title: string;
          topic: string;
          primary_question: string | null;
          objective: string | null;
          context: string | null;
          status: InvestigationAnalysisStatus;
          dark_spot_index: number;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          title: string;
          topic: string;
          primary_question?: string | null;
          objective?: string | null;
          context?: string | null;
          status?: InvestigationAnalysisStatus;
          dark_spot_index?: number;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          title?: string;
          topic?: string;
          primary_question?: string | null;
          objective?: string | null;
          context?: string | null;
          status?: InvestigationAnalysisStatus;
          dark_spot_index?: number;
          metadata?: Json;
        };
      };
      sources: {
        Row: {
          id: string;
          investigation_id: string;
          created_at: string;
          source_label: string;
          title: string;
          url: string | null;
          source_type: "url" | "manual_text";
          extraction_status: SourceExtractionStatus;
          extraction_error: string | null;
          temporal_status: "current" | "outdated" | "undated";
          word_count: number;
          reliability_score: number;
          content: string;
          published_at: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          investigation_id: string;
          created_at?: string;
          source_label: string;
          title: string;
          url?: string | null;
          source_type?: "url" | "manual_text";
          extraction_status?: SourceExtractionStatus;
          extraction_error?: string | null;
          temporal_status?: "current" | "outdated" | "undated";
          word_count?: number;
          reliability_score?: number;
          content: string;
          published_at?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          investigation_id?: string;
          created_at?: string;
          source_label?: string;
          title?: string;
          url?: string | null;
          source_type?: "url" | "manual_text";
          extraction_status?: SourceExtractionStatus;
          extraction_error?: string | null;
          temporal_status?: "current" | "outdated" | "undated";
          word_count?: number;
          reliability_score?: number;
          content?: string;
          published_at?: string | null;
          metadata?: Json;
        };
      };
      gap_reports: {
        Row: {
          id: string;
          investigation_id: string;
          created_at: string;
          gap_title: string;
          description: string;
          severity: "HIGH" | "MEDIUM" | "LOW";
          signal_label: string;
          resolution_status: "unresolved" | "in_progress" | "resolved";
        };
        Insert: {
          id?: string;
          investigation_id: string;
          created_at?: string;
          gap_title: string;
          description: string;
          severity: "HIGH" | "MEDIUM" | "LOW";
          signal_label?: string;
          resolution_status?: "unresolved" | "in_progress" | "resolved";
        };
        Update: {
          id?: string;
          investigation_id?: string;
          created_at?: string;
          gap_title?: string;
          description?: string;
          severity?: "HIGH" | "MEDIUM" | "LOW";
          signal_label?: string;
          resolution_status?: "unresolved" | "in_progress" | "resolved";
        };
      };
    };
  };
}
