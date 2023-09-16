import { configureStore } from "@reduxjs/toolkit"
import interactionReducer from "../features/interaction/interactionSlice"
import tableDataSlice from "../features/table-data/tableDataSlice"

const store = configureStore({
	reducer: {
		interaction: interactionReducer,
		tableData: tableDataSlice,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
