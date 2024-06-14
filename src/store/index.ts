// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import category from 'src/store/apps/category'
import client from 'src/store/apps/client'
import document from 'src/store/apps/document'
import existence_slice from 'src/store/apps/existence_slice'
import income_note_detail from 'src/store/apps/income_note_detail'
import income_note_slice from 'src/store/apps/income_note_slice'
import kardex_detail_slice from 'src/store/apps/kardex_detail_slice'
import kardex_slice from 'src/store/apps/kardex_slice'
import outcome_note_detail_slice from 'src/store/apps/outcome_note_detail_slice'
import outcome_note_slice from 'src/store/apps/outcome_note_slice'
import product from 'src/store/apps/product'
import receipt from 'src/store/apps/receipt'
import receipt_detail_slice from 'src/store/apps/receipt_detail_slice'
import storage from 'src/store/apps/storage'
import userAntonio from 'src/store/apps/userAntonio'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    category,
    client,
    document,
    existence_slice,
    income_note_detail,
    income_note_slice,
    kardex_detail_slice,
    kardex_slice,
    outcome_note_detail_slice,
    outcome_note_slice,
    product,
    receipt,
    receipt_detail_slice,
    storage,
    userAntonio,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
