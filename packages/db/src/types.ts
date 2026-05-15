export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          permissions: string[] | null
          role: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          permissions?: string[] | null
          role?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          permissions?: string[] | null
          role?: string | null
        }
        Relationships: []
      }
      agent_run_log: {
        Row: {
          agent_name: string
          completion_tokens: number | null
          cost_sek: number | null
          created_at: string | null
          id: string
          latency_ms: number | null
          model_used: string | null
          prompt_tokens: number | null
          task_id: string | null
        }
        Insert: {
          agent_name: string
          completion_tokens?: number | null
          cost_sek?: number | null
          created_at?: string | null
          id?: string
          latency_ms?: number | null
          model_used?: string | null
          prompt_tokens?: number | null
          task_id?: string | null
        }
        Update: {
          agent_name?: string
          completion_tokens?: number | null
          cost_sek?: number | null
          created_at?: string | null
          id?: string
          latency_ms?: number | null
          model_used?: string | null
          prompt_tokens?: number | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_run_log_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "agent_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tasks: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assigned_agent: string | null
          completed_at: string | null
          created_at: string | null
          error: string | null
          id: string
          order_id: string | null
          payload: Json
          priority: number | null
          rejection_reason: string | null
          requires_approval: boolean | null
          result: Json | null
          retry_count: number | null
          started_at: string | null
          status: string | null
          task_type: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          assigned_agent?: string | null
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          order_id?: string | null
          payload?: Json
          priority?: number | null
          rejection_reason?: string | null
          requires_approval?: boolean | null
          result?: Json | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
          task_type: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          assigned_agent?: string | null
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          order_id?: string | null
          payload?: Json
          priority?: number | null
          rejection_reason?: string | null
          requires_approval?: boolean | null
          result?: Json | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
          task_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_tasks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_sessions: {
        Row: {
          anon_session_id: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          messages: Json | null
          outcome: string | null
          products_shown: string[] | null
          satisfaction_score: number | null
          updated_at: string | null
        }
        Insert: {
          anon_session_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          messages?: Json | null
          outcome?: string | null
          products_shown?: string[] | null
          satisfaction_score?: number | null
          updated_at?: string | null
        }
        Update: {
          anon_session_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          messages?: Json | null
          outcome?: string | null
          products_shown?: string[] | null
          satisfaction_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_sessions_anon_session_id_fkey"
            columns: ["anon_session_id"]
            isOneToOne: false
            referencedRelation: "anonymous_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chat_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      anonymous_sessions: {
        Row: {
          converted_to_customer: string | null
          created_at: string | null
          fingerprint: string
          gdpr_consent: boolean | null
          id: string
          inferred_company: string | null
          inferred_industry: string | null
          search_queries: string[] | null
          time_on_site_s: number | null
          updated_at: string | null
          utm_campaign: string | null
          utm_source: string | null
          viewed_categories: Json | null
          viewed_products: string[] | null
        }
        Insert: {
          converted_to_customer?: string | null
          created_at?: string | null
          fingerprint: string
          gdpr_consent?: boolean | null
          id?: string
          inferred_company?: string | null
          inferred_industry?: string | null
          search_queries?: string[] | null
          time_on_site_s?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
          viewed_categories?: Json | null
          viewed_products?: string[] | null
        }
        Update: {
          converted_to_customer?: string | null
          created_at?: string | null
          fingerprint?: string
          gdpr_consent?: boolean | null
          id?: string
          inferred_company?: string | null
          inferred_industry?: string | null
          search_queries?: string[] | null
          time_on_site_s?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
          viewed_categories?: Json | null
          viewed_products?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_sessions_converted_to_customer_fkey"
            columns: ["converted_to_customer"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: string | null
          after: Json | null
          before: Json | null
          created_at: string | null
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          ai_boost_score: number | null
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          ai_boost_score?: number | null
          created_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          ai_boost_score?: number | null
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          city: string
          country: string | null
          customer_id: string
          id: string
          is_default: boolean | null
          postal_code: string
          street: string
          type: string | null
        }
        Insert: {
          city: string
          country?: string | null
          customer_id: string
          id?: string
          is_default?: boolean | null
          postal_code: string
          street: string
          type?: string | null
        }
        Update: {
          city?: string
          country?: string | null
          customer_id?: string
          id?: string
          is_default?: boolean | null
          postal_code?: string
          street?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_price_lists: {
        Row: {
          customer_id: string
          discount_pct: number
          id: string
          is_active: boolean | null
          name: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          customer_id: string
          discount_pct: number
          id?: string
          is_active?: boolean | null
          name: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          customer_id?: string
          discount_pct?: number
          id?: string
          is_active?: boolean | null
          name?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_price_lists_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          ai_segment: string | null
          auth_user_id: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          credit_approved: boolean | null
          credit_limit_sek: number | null
          id: string
          industry: string | null
          invoice_email: string | null
          org_number: string | null
          payment_terms_days: number | null
          preferred_categories: string[] | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          ai_segment?: string | null
          auth_user_id?: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          credit_approved?: boolean | null
          credit_limit_sek?: number | null
          id?: string
          industry?: string | null
          invoice_email?: string | null
          org_number?: string | null
          payment_terms_days?: number | null
          preferred_categories?: string[] | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          ai_segment?: string | null
          auth_user_id?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          credit_approved?: boolean | null
          credit_limit_sek?: number | null
          id?: string
          industry?: string | null
          invoice_email?: string | null
          org_number?: string | null
          payment_terms_days?: number | null
          preferred_categories?: string[] | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      gdpr_consents: {
        Row: {
          anon_session_id: string | null
          consent_type: string
          created_at: string | null
          customer_id: string | null
          granted: boolean
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          anon_session_id?: string | null
          consent_type: string
          created_at?: string | null
          customer_id?: string | null
          granted: boolean
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          anon_session_id?: string | null
          consent_type?: string
          created_at?: string | null
          customer_id?: string | null
          granted?: boolean
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gdpr_consents_anon_session_id_fkey"
            columns: ["anon_session_id"]
            isOneToOne: false
            referencedRelation: "anonymous_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gdpr_consents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          actor: string | null
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          metadata: Json | null
          order_id: string
        }
        Insert: {
          actor?: string | null
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          order_id: string
        }
        Update: {
          actor?: string | null
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_lines: {
        Row: {
          artwork_url: string | null
          id: string
          line_total_sek: number
          order_id: string
          print_colors: number | null
          print_method_id: string | null
          print_notes: string | null
          print_positions: string[] | null
          print_price_sek: number | null
          product_id: string
          quantity: number
          setup_fee_sek: number | null
          unit_price_sek: number
          variant_id: string | null
        }
        Insert: {
          artwork_url?: string | null
          id?: string
          line_total_sek: number
          order_id: string
          print_colors?: number | null
          print_method_id?: string | null
          print_notes?: string | null
          print_positions?: string[] | null
          print_price_sek?: number | null
          product_id: string
          quantity: number
          setup_fee_sek?: number | null
          unit_price_sek: number
          variant_id?: string | null
        }
        Update: {
          artwork_url?: string | null
          id?: string
          line_total_sek?: number
          order_id?: string
          print_colors?: number | null
          print_method_id?: string | null
          print_notes?: string | null
          print_positions?: string[] | null
          print_price_sek?: number | null
          product_id?: string
          quantity?: number
          setup_fee_sek?: number | null
          unit_price_sek?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_lines_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_lines_print_method_id_fkey"
            columns: ["print_method_id"]
            isOneToOne: false
            referencedRelation: "print_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_lines_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          approved_at: string | null
          created_at: string | null
          customer_id: string
          id: string
          notes: string | null
          order_number: string
          payment_method: string
          payment_status: string | null
          placed_at: string | null
          shipping_address_id: string | null
          shipping_sek: number | null
          status: string
          stripe_invoice_id: string | null
          stripe_payment_id: string | null
          subtotal_sek: number
          total_sek: number
          updated_at: string | null
          vat_sek: number | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          notes?: string | null
          order_number: string
          payment_method: string
          payment_status?: string | null
          placed_at?: string | null
          shipping_address_id?: string | null
          shipping_sek?: number | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_id?: string | null
          subtotal_sek?: number
          total_sek?: number
          updated_at?: string | null
          vat_sek?: number | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          payment_status?: string | null
          placed_at?: string | null
          shipping_address_id?: string | null
          shipping_sek?: number | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_id?: string | null
          subtotal_sek?: number
          total_sek?: number
          updated_at?: string | null
          vat_sek?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      personalization_profiles: {
        Row: {
          anon_session_id: string | null
          avg_order_qty: number | null
          customer_id: string | null
          embedding: string | null
          id: string
          preferred_methods: string[] | null
          price_sensitivity: string | null
          segment: string | null
          top_categories: Json | null
          updated_at: string | null
        }
        Insert: {
          anon_session_id?: string | null
          avg_order_qty?: number | null
          customer_id?: string | null
          embedding?: string | null
          id?: string
          preferred_methods?: string[] | null
          price_sensitivity?: string | null
          segment?: string | null
          top_categories?: Json | null
          updated_at?: string | null
        }
        Update: {
          anon_session_id?: string | null
          avg_order_qty?: number | null
          customer_id?: string | null
          embedding?: string | null
          id?: string
          preferred_methods?: string[] | null
          price_sensitivity?: string | null
          segment?: string | null
          top_categories?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personalization_profiles_anon_session_id_fkey"
            columns: ["anon_session_id"]
            isOneToOne: false
            referencedRelation: "anonymous_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personalization_profiles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      print_methods: {
        Row: {
          id: string
          is_active: boolean | null
          max_area_mm: Json | null
          max_colors: number | null
          method_type: string
          position_name: string
          product_id: string
          setup_fee: number | null
          supplier_method_id: string | null
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          max_area_mm?: Json | null
          max_colors?: number | null
          method_type: string
          position_name: string
          product_id: string
          setup_fee?: number | null
          supplier_method_id?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          max_area_mm?: Json | null
          max_colors?: number | null
          method_type?: string
          position_name?: string
          product_id?: string
          setup_fee?: number | null
          supplier_method_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "print_methods_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      print_price_tiers: {
        Row: {
          colors: number
          id: string
          our_markup_pct: number | null
          price_per_unit: number
          print_method_id: string
          qty_from: number
          qty_to: number | null
        }
        Insert: {
          colors?: number
          id?: string
          our_markup_pct?: number | null
          price_per_unit: number
          print_method_id: string
          qty_from: number
          qty_to?: number | null
        }
        Update: {
          colors?: number
          id?: string
          our_markup_pct?: number | null
          price_per_unit?: number
          print_method_id?: string
          qty_from?: number
          qty_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "print_price_tiers_print_method_id_fkey"
            columns: ["print_method_id"]
            isOneToOne: false
            referencedRelation: "print_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          id: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
          type: string | null
          url: string
          variant_id: string | null
        }
        Insert: {
          id?: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
          type?: string | null
          url: string
          variant_id?: string | null
        }
        Update: {
          id?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
          type?: string | null
          url?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_media_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color_hex: string | null
          color_name: string | null
          color_pantone: string | null
          created_at: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          material: string | null
          product_id: string
          size: string | null
          stock_qty: number | null
          supplier_sku: string
        }
        Insert: {
          color_hex?: string | null
          color_name?: string | null
          color_pantone?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          material?: string | null
          product_id: string
          size?: string | null
          stock_qty?: number | null
          supplier_sku: string
        }
        Update: {
          color_hex?: string | null
          color_name?: string | null
          color_pantone?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          material?: string | null
          product_id?: string
          size?: string | null
          stock_qty?: number | null
          supplier_sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          ai_embedding: string | null
          ai_tags: string[] | null
          base_price: number
          category_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          is_active: boolean | null
          min_qty: number | null
          name: string
          slug: string
          supplier_product_id: string
          supplier_synced_at: string | null
          updated_at: string | null
        }
        Insert: {
          ai_embedding?: string | null
          ai_tags?: string[] | null
          base_price: number
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          min_qty?: number | null
          name: string
          slug: string
          supplier_product_id: string
          supplier_synced_at?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_embedding?: string | null
          ai_tags?: string[] | null
          base_price?: number
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          min_qty?: number | null
          name?: string
          slug?: string
          supplier_product_id?: string
          supplier_synced_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string | null
          description: string | null
          evidence_urls: string[] | null
          id: string
          order_id: string
          order_line_id: string | null
          reason: string
          refund_amount_sek: number | null
          resolution: string | null
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          evidence_urls?: string[] | null
          id?: string
          order_id: string
          order_line_id?: string | null
          reason: string
          refund_amount_sek?: number | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          evidence_urls?: string[] | null
          id?: string
          order_id?: string
          order_line_id?: string | null
          reason?: string
          refund_amount_sek?: number | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_order_line_id_fkey"
            columns: ["order_line_id"]
            isOneToOne: false
            referencedRelation: "order_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_tracking: {
        Row: {
          carrier: string | null
          delivered_at: string | null
          estimated_delivery: string | null
          id: string
          last_event: string | null
          order_id: string
          purchase_order_id: string | null
          status: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          carrier?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: string
          last_event?: string | null
          order_id: string
          purchase_order_id?: string | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          carrier?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: string
          last_event?: string | null
          order_id?: string
          purchase_order_id?: string | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_tracking_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "supplier_purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      site_analytics: {
        Row: {
          anon_session_id: string | null
          created_at: string | null
          customer_id: string | null
          duration_s: number | null
          event_type: string
          id: string
          metadata: Json | null
          page_url: string | null
          product_id: string | null
          referrer: string | null
          search_query: string | null
        }
        Insert: {
          anon_session_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          duration_s?: number | null
          event_type: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          product_id?: string | null
          referrer?: string | null
          search_query?: string | null
        }
        Update: {
          anon_session_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          duration_s?: number | null
          event_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          product_id?: string | null
          referrer?: string | null
          search_query?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_analytics_anon_session_id_fkey"
            columns: ["anon_session_id"]
            isOneToOne: false
            referencedRelation: "anonymous_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_analytics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_purchase_orders: {
        Row: {
          confirmed_at: string | null
          error_message: string | null
          estimated_delivery: string | null
          id: string
          order_id: string
          payload_sent: Json | null
          response_raw: Json | null
          status: string | null
          submitted_at: string | null
          submitted_by: string
          supplier_order_id: string | null
        }
        Insert: {
          confirmed_at?: string | null
          error_message?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id: string
          payload_sent?: Json | null
          response_raw?: Json | null
          status?: string | null
          submitted_at?: string | null
          submitted_by: string
          supplier_order_id?: string | null
        }
        Update: {
          confirmed_at?: string | null
          error_message?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string
          payload_sent?: Json | null
          response_raw?: Json | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string
          supplier_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_purchase_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_sync_log: {
        Row: {
          errors: Json | null
          finished_at: string | null
          id: string
          prices_updated: number | null
          products_updated: number | null
          started_at: string | null
          status: string
          stock_updated: number | null
          sync_type: string
        }
        Insert: {
          errors?: Json | null
          finished_at?: string | null
          id?: string
          prices_updated?: number | null
          products_updated?: number | null
          started_at?: string | null
          status: string
          stock_updated?: number | null
          sync_type: string
        }
        Update: {
          errors?: Json | null
          finished_at?: string | null
          id?: string
          prices_updated?: number | null
          products_updated?: number | null
          started_at?: string | null
          status?: string
          stock_updated?: number | null
          sync_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
