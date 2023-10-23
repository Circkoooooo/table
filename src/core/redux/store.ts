import { configureStore } from "@reduxjs/toolkit"
import interactionReducer from "./interaction/interactionSlice"
import tableDataSlice from "./table-data/tableDataSlice"
import canvasSlice from "./canvas/canvasSlice"
import lineFlexibleSlice from "./interaction/lineFlexible/lineFlexibleSlice"

const store = configureStore({
	reducer: {
		interaction: interactionReducer,
		tableData: tableDataSlice,
		canvas: canvasSlice,
		lineFlexible: lineFlexibleSlice,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
