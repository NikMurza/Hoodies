export type ConversionStatus =
  | "CONVERSION_STATUS_UNSPECIFIED"
  | "CONVERSION_STATUS_APPROVED"
  | "CONVERSION_STATUS_FRAUD"
  | "CONVERSION_STATUS_NOT_ALLOWED"
  | "CONVERSION_STATUS_ON_HOLD"
  | "CONVERSION_STATUS_PENDING"
  | "CONVERSION_STATUS_REFUNDED"
  | "CONVERSION_STATUS_REJECTED"
  | "CONVERSION_STATUS_TEST"

export interface Conversion {
  // Click Id from trackdesk
  cid: string
  conversionTypeCode: "sale"
  status: ConversionStatus
  amount?: {
    value: string
  }
  currency?: {
    code: "USD"
  }
  // email of a user
  customerId?: string
}
