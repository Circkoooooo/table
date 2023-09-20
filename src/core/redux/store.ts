import { configureStore } from "@reduxjs/toolkit"
import interactionReducer from "./interaction/interactionSlice"
import tableDataSlice from "./table-data/tableDataSlice"

const store = configureStore({
	reducer: {
		interaction: interactionReducer,
		tableData: tableDataSlice,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
