// ============================================================
// ZOD-SCHEMAS — validering av all API-input
// Importeras av Next.js route handlers
// ============================================================

import { z } from 'zod'

// ── Kalkylering ──────────────────────────────────────────────

export const CalculateLineSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  printMethodId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(100_000),
  printColors: z.number().int().min(0).max(12).default(0),
  customerDiscountPct: z.number().min(0).max(100).default(0),
})

export type CalculateLineInput = z.infer<typeof CalculateLineSchema>

// ── Order ────────────────────────────────────────────────────

export const CreateOrderSchema = z.object({
  shippingAddressId: z.string().uuid(),
  paymentMethod: z.enum(['card', 'invoice']),
  lines: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid().optional(),
        printMethodId: z.string().uuid().optional(),
        quantity: z.number().int().min(1),
        printColors: z.number().int().min(0).max(12).default(0),
        printPositions: z.array(z.string()).default([]),
        artworkUrl: z.string().url().optional(),
        printNotes: z.string().max(500).optional(),
      })
    )
    .min(1)
    .max(50),
  notes: z.string().max(1000).optional(),
})

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>

export const CheckoutSchema = z.object({
  method: z.enum(['card', 'invoice']),
})

export type CheckoutInput = z.infer<typeof CheckoutSchema>

// ── Kund ─────────────────────────────────────────────────────

export const CreateCustomerSchema = z.object({
  companyName: z.string().min(1).max(200),
  orgNumber: z.string().max(20).optional(),
  vatNumber: z.string().max(30).optional(),
  contactName: z.string().min(1).max(100),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(20).optional(),
  invoiceEmail: z.string().email().optional(),
  industry: z.string().max(100).optional(),
})

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>

export const CreateAddressSchema = z.object({
  type: z.enum(['shipping', 'billing']).default('shipping'),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2).default('SE'),
  isDefault: z.boolean().default(false),
})

export type CreateAddressInput = z.infer<typeof CreateAddressSchema>

// ── Retur ────────────────────────────────────────────────────

export const CreateReturnSchema = z.object({
  orderId: z.string().uuid(),
  orderLineId: z.string().uuid().optional(),
  reason: z.enum([
    'defective',
    'wrong_product',
    'wrong_print',
    'qty_error',
    'other',
  ]),
  description: z.string().max(2000).optional(),
  evidenceUrls: z.array(z.string().url()).max(10).default([]),
})

export type CreateReturnInput = z.infer<typeof CreateReturnSchema>

// ── GDPR ─────────────────────────────────────────────────────

export const GdprConsentSchema = z.object({
  anonSessionId: z.string().uuid().optional(),
  consents: z.object({
    necessary: z.literal(true),   // alltid true
    functional: z.boolean(),
    analytics: z.boolean(),
    marketing: z.boolean(),
  }),
})

export type GdprConsentInput = z.infer<typeof GdprConsentSchema>

// ── Agent (intern — används av API-routes mot Felix) ─────────

export const AgentTaskUpdateSchema = z.object({
  taskId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  rejectionReason: z.string().max(500).optional(),
})

export type AgentTaskUpdateInput = z.infer<typeof AgentTaskUpdateSchema>

// ── Produktsökning ───────────────────────────────────────────

export const ProductSearchSchema = z.object({
  query: z.string().max(200).optional(),
  categorySlug: z.string().max(100).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(24),
})

export type ProductSearchInput = z.infer<typeof ProductSearchSchema>
