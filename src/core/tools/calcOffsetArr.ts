import { TableRowColumnCellConfig } from "../redux/canvas/canvasSlice.types"
import { CellDataInfoNumConfig } from "../redux/table-data/tableDataSlice"
import { CalcOffsetArr } from "./types"

/**
 * 获取行和列索引，每个索引的单元格相对于canvas起始渲染需要的偏移。每个索引的偏移 为 自己的当前偏移和前面叠加的偏移之和。
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
