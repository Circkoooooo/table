import { TableRowColumnCellConfigExtraSizeConfig } from "../redux/canvas/canvasSlice.types"
import { GetIndexByOffsetStart } from "./types"

/**
 * 获取当前鼠标所在元素的索引。
 * 第一个单元格包含边框，所以逻辑宽度以内都为该单元格的索引
 * 从第一个单元格开始，所有单元格之间由于重叠了边框，所以需要以逻辑宽度减去边框宽度
 * @param offsetStartNum
 * @param lineWidth
 * @param logicSize
 * @param rowColumnCellExtraSizeConfig
 * @returns
 */
export const getIndexByOffsetStart: GetIndexByOffsetStart = (offsetStartNum: number, lineWidth: number, logicSize: number, rowColumnCellExtraSizeConfig: TableRowColumnCellConfigExtraSizeConfig) => {
	let ofsStartTemp = offsetStartNum
	let index = 0

	while (ofsStartTemp >= logicSize) {
		const currentIndex = index
		ofsStartTemp -= logicSize - lineWidth + (rowColumnCellExtraSizeConfig.find((item) => item.index === currentIndex)?.value || 0)
		index++
	}

	return index
}
