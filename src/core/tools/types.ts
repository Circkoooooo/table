import { TableRowColumnCellConfig, TableRowColumnCellConfigExtraSizeConfig } from "../redux/canvas/canvasSlice.types"
import { CellDataInfoNumConfig } from "../redux/table-data/tableDataSlice"
import { IndexType } from "../types/table.types"

/**对数组中的值从后往前进行自增进位 */
export type ResolvePrefixArray = (prefixArray: number[], minPrefixCode: number, maxPrefixCode: number) => number[]
/** 根据传入值为数字或者字母，来进行不同规则的转化成ascii*/
export type PickValidTypeAsciiCode = (asciiCode: number | string) => number
/** 来获取每一列的索引列表，取值范围根据提供的asciiMin和asciiMax来决定。A..Z AA....ZZ AAA...ZZZ*/
export type GetColumnLabel = (columnCount: number, asciiMin?: number | string, asciiMax?: number | string) => string[]
/** 来获取每一行的索引列表，offset来表示从几开始。1...26 27...*/
export type GetRowLabel = (count: number, offset: number) => string[]

/** 获取当前索引下，根据行列的缩放配置文件值来获取每行和列的额外渲染尺寸。*/
export type CalcIndexExtraRenderSize = (
	rowHeightArrs: TableRowColumnCellConfigExtraSizeConfig,
	columnWidthArrs: TableRowColumnCellConfigExtraSizeConfig,
	startRowIndex: number,
	startColumnIndex: number
) => {
	extraOffsetLeft: number
	extraOffsetTop: number
}

/** 获取行和列索引，每个索引的单元格相对于canvas起始渲染需要的偏移。 */
export type CalcOffsetArr = (
	numConfig: CellDataInfoNumConfig,
	cellConfig: TableRowColumnCellConfig,
	dpr: number
) => {
	leftOffsetArr: number[]
	topOffsetArr: number[]
}

/** 根据行列伸缩尺寸数组，来分别输出canvas的row和column的总体所需额外渲染尺寸 */
export type CalcSumExtraSize = (
	extraSizeConfig: TableRowColumnCellConfig,
	dpr: number
) => {
	sumLeftExtra: number
	sumTopExtra: number
}

export type CellDataElement = string | null

export type CellData = CellDataElement[][]

/** 根据行，列数目，来创建一个r * c 的二维数组，值为null */
export type CreateEmptyCellData = (params: FullTableEmptyDataParams) => CellData

/** 在 r * c的null二维数组的基础上，为行和列的首部增加首labels */
export type CreateRulerCellData = (emptyRulerCellData: CellData) => WithRulerCellData

/** 行数，列数 */
export interface FullTableEmptyDataParams {
	rowNum: number
	columnNum: number
}

/** 包含有首部labels的二维数组的结构和信息 */
export interface WithRulerCellData {
	data: CellData
	info: {
		rowLength: number
		columnLength: number
	}
}

/** 受支持的cursor属性的值的类型 */
export type Cursor = "auto" | "pointer" | "crosshair" | "row-resize"
/** 改变body的css属性，鼠标类型 */
export type ChangeBodyCursor = (cursor: Cursor) => void
/** reset则清空为默认的指针类型，calc则判断是否为头部索引来设置pointer或者默认 */
export type ChangeBodyPointerByIndex = <T extends "reset" | "calc">(type: T, index?: T extends "calc" ? IndexType : never) => void
/** 获取当前鼠标所在元素的索引。*/
export type GetIndexByOffsetStart = (offsetStartNum: number, lineWidth: number, logicSize: number, rowColumnCellExtraSizeConfig: TableRowColumnCellConfigExtraSizeConfig) => number
/** 根据点击的索引和鼠标移动到的索引，来计算形成的矩形行列开始结束索引。 */
export type CalcIndexFromMouseIndex = (
	mousedownIndex: IndexType,
	mousemoveIndex: IndexType
) => {
	rowStartIndex: number
	rowEndIndex: number
	columnStartIndex: number
	columnEndIndex: number
}
/** 是否两个索引相同 */
export type IsIndexEqual = (index: IndexType | null, targetIndex: IndexType | null) => boolean
/** 是否索引在首部索引。简单的判断索引是否全为0。 */
export type IsIndexHeader = (rowIndex: number, columnIndex: number) => boolean
/** 是否索引在元素体内部。 相对于判断是header更准确，会传入表格最大的行和列。*/
export type IsIndexTableBody = (rowIndex: number, columnIndex: number, maxRowLength: number, maxColumnlength: number) => boolean

/** 以元素点击和移动所在索引和表格的行列数，来获取包围矩形的首部索引和索引的数量。*/
export type ParseInteractionIndex = (
	mousedownIndex: IndexType | null,
	mousemoveIndex: IndexType | null,
	rowNumber: number,
	columnNumber: number
) => {
	startRowIndex: number
	startColumnIndex: number
	rowCellCount: number
	columnCellCount: number
} | null
