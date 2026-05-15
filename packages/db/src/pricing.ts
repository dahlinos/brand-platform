// ============================================================
// PRISBERÄKNING — alltid server-side, aldrig i frontend
// Källa till sanning för alla orderrads-priser
// ============================================================

import type { Database } from './types.ts'

type PrintPriceTier = Database['public']['Tables']['print_price_tiers']['Row']

export interface OrderLineParams {
  basePrice: number          // products.base_price (inköpspris från leverantör)
  quantity: number
  markupPct: number          // standard 40% enligt SPEC
  printTier?: PrintPriceTier // hämtad från print_price_tiers
  customerDiscountPct?: number // från customer_price_lists
}

export interface OrderLinePrice {
  unitPriceSek: number       // produktpris per styck inkl. påslag, exkl. moms
  printPriceSek: number      // totalt tryckpris för hela raden inkl. påslag
  setupFeeSek: number        // uppsättningsavgift (en gång per orderrad)
  subtotalSek: number        // (unitPrice + printPrice/qty) * qty + setupFee
  vatSek: number             // 25% moms på subtotal
  totalSek: number           // subtotal + moms
}

const VAT_RATE = 0.25 // Sverige, alltid 25%

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Hitta rätt prisnivå i prismatrisen baserat på antal och färger.
 * qty_to = null innebär ingen övre gräns.
 */
export function findPrintTier(
  tiers: PrintPriceTier[],
  quantity: number,
  colors: number
): PrintPriceTier | undefined {
  return tiers.find(
    (t) =>
      t.colors === colors &&
      t.qty_from <= quantity &&
      (t.qty_to === null || t.qty_to >= quantity)
  )
}

/**
 * Beräkna pris för en orderrad.
 * Anropas alltid server-side — aldrig exponera denna logik i frontend.
 */
export function calculateOrderLine(params: OrderLineParams): OrderLinePrice {
  const { basePrice, quantity, markupPct, printTier, customerDiscountPct = 0 } = params

  // 1. Produktpris per styck med påslag och kundrabatt
  const productUnitPrice = round2(
    basePrice * (1 + markupPct / 100) * (1 - customerDiscountPct / 100)
  )

  // 2. Tryckpris per styck med påslag (om tryckmetod vald)
  const printPricePerUnit = printTier
    ? round2(printTier.price_per_unit * (1 + printTier.our_markup_pct / 100))
    : 0

  // 3. Uppsättningsavgift — en gång per orderrad, ingen kundrabatt
  const setupFeeSek = round2(printTier?.setup_fee ?? 0)

  // 4. Subtotal exkl. moms
  const subtotalSek = round2(
    (productUnitPrice + printPricePerUnit) * quantity + setupFeeSek
  )

  // 5. Moms
  const vatSek = round2(subtotalSek * VAT_RATE)

  return {
    unitPriceSek: productUnitPrice,
    printPriceSek: round2(printPricePerUnit * quantity),
    setupFeeSek,
    subtotalSek,
    vatSek,
    totalSek: round2(subtotalSek + vatSek),
  }
}

/**
 * Beräkna totalt för en hel order (summa av alla rader + frakt).
 * TODO: [OPEN DECISION #6] fraktprissättning är ej beslutad
 */
export function calculateOrderTotal(
  lines: OrderLinePrice[],
  shippingSek: number = 0
): {
  subtotalSek: number
  shippingSek: number
  vatSek: number
  totalSek: number
} {
  const subtotalSek = round2(lines.reduce((sum, l) => sum + l.subtotalSek, 0))
  const shippingVat = round2(shippingSek * VAT_RATE)
  const vatSek = round2(
    lines.reduce((sum, l) => sum + l.vatSek, 0) + shippingVat
  )
  const totalSek = round2(subtotalSek + shippingSek + vatSek)

  return { subtotalSek, shippingSek, vatSek, totalSek }
}
