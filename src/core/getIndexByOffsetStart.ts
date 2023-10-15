import { TableRowColumnCellConfigExtraSizeConfig } from "./redux/canvas/canvasSlice.types"

/**
 * 第一个单元格包含边框，所以全逻辑宽度以内都为该单元格的索引
 * 后面所有单元格之间由于重叠了边框，所以需要以逻辑宽度减去边框宽度
 * @param offsetStartNum
 * @param lineWidth
 * @param logicSize
 * @param rowColumnCellExtraSizeConfig
 * @returns
 */
export const getIndexByOffsetStart = (offsetStartNum: number, lineWidth: number, logicSize: number, rowColumnCellExtraSizeConfig: TableRowColumnCellConfigExtraSizeConfig) => {
	let ofsStartTemp = offsetStartNum
	let index = 0

	while (ofsStartTemp >= logicSize) {
		const currentIndex = index
		ofsStartTemp -= logicSize - lineWidth + (rowColumnCellExtraSizeConfig.find((item) => item.index === currentIndex)?.value || 0)
		index++
	}

	return index
}
