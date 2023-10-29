import { TableRowColumnCellConfig } from "../redux/canvas/canvasSlice.types"
import { CellDataInfoNumConfig } from "../redux/table-data/tableDataSlice"
import { CalcOffsetArr } from "./types"

/**
 * 获取当前渲染body部分所需要进行的偏移
 * @param numConfig
 * @param cellConfig
 * @param dpr
 */
export const calcOffsetArr: CalcOffsetArr = (numConfig: CellDataInfoNumConfig, cellConfig: TableRowColumnCellConfig, dpr: number) => {
	const { rowNum, columnNum } = numConfig
	const { columnWidth, rowHeight } = cellConfig

	let _currentSumRenderLeft = 0
	let _currentSumRenderTop = 0

	const leftOffsetArr: number[] = new Array(columnNum + 1).fill(0).map((_, index) => {
		_currentSumRenderLeft += Math.round((columnWidth.find((item) => item.index === index - 1)?.value || 0) * dpr)
		return _currentSumRenderLeft
	})

	const topOffsetArr: number[] = new Array(rowNum + 1).fill(0).map((_, index) => {
		_currentSumRenderTop += Math.round((rowHeight.find((item) => item.index === index - 1)?.value || 0) * dpr)
		return _currentSumRenderTop
	})

	return {
		leftOffsetArr,
		topOffsetArr,
	}
}
