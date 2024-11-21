import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "app/store"

const localStorageChargedAmountKey = "chargedAmountKey"

interface AuthState {
  chargeAmount: string
}

const slice = createSlice({
  name: "affiliates",
  initialState: {
    chargeAmount: localStorage.getItem(localStorageChargedAmountKey) || "",
  } as AuthState,
  reducers: {
    setChargedAmount: (state, payload: PayloadAction<string>) => {
      if (payload.payload) {
        localStorage.setItem(localStorageChargedAmountKey, payload.payload)
        state.chargeAmount = payload.payload
      }
    },
    clearChargedAmount: (state) => {
      localStorage.removeItem(localStorageChargedAmountKey)
      state.chargeAmount = ""
    },
  },
})

export const { setChargedAmount, clearChargedAmount } = slice.actions

export default slice.reducer

export const selectChargeAmount = (state: RootState) =>
  state.affiliates.chargeAmount
