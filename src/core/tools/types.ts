import { TableRowColumnCellConfig, TableRowColumnCellConfigExtraSizeConfig } from "../redux/canvas/canvasSlice.types"
import { CellDataInfoNumConfig } from "../redux/table-data/tableDataSlice"
import { IndexType } from "../types/table.types"

export type ResolvePrefixArray = (prefixArray: number[], minPrefixCode: number, maxPrefixCode: number) => number[]
export type PickValidTypeAsciiCode = (asciiCode: number | string) => number

export type GetColumnLabel = (columnCount: number, asciiMin?: number | string, asciiMax?: number | string) => string[]
export type GetRowLabel = (count: number, offset: number) => string[]

export type CalcIndexExtraRenderSize = (
	rowHeightArrs: TableRowColumnCellConfigExtraSizeConfig,
	columnWidthArrs: TableRowColumnCellConfigExtraSizeConfig,
	startRowIndex: number,
	startColumnIndex: number
) => {
	extraOffsetLeft: number
	extraOffsetTop: number
}

export type CalcOffsetArr = (
	numConfig: CellDataInfoNumConfig,
	cellConfig: TableRowColumnCellConfig,
	dpr: number
) => {
	leftOffsetArr: number[]
	topOffsetArr: number[]
}

export type CalcSumExtraSize = (
	extraSizeConfig: TableRowColumnCellConfig,
	dpr: number
) => {
	sumLeftExtra: number
	sumTopExtra: number
}

export interface FullTableEmptyDataParams {
	rowNum: number
	columnNum: number
}

export type CellDataElement = string | null

export type CellData = CellDataElement[][]

export interface WithRulerCellData {
	data: CellData
	info: {
		rowLength: number
		columnLength: number
	}
}

export type Cursor = "auto" | "pointer" | "crosshair" | "row-resize"
export type ChangeBodyCursor = (cursor: Cursor) => void

export type ChangeBodyPointerByIndex = <T extends "reset" | "calc">(type: T, index?: T extends "calc" ? IndexType : never) => void

export type GetIndexByOffsetStart = (offsetStartNum: number, lineWidth: number, logicSize: number, rowColumnCellExtraSizeConfig: TableRowColumnCellConfigExtraSizeConfig) => number

export type CalcIndexFromMouseIndex = (
	mousedownIndex: IndexType,
	mousemoveIndex: IndexType
) => {
	rowStartIndex: number
	rowEndIndex: number
	columnStartIndex: number
	columnEndIndex: number
}

export type IsIndexEqual = (index: IndexType | null, targetIndex: IndexType | null) => boolean

export type IsIndexHeader = (rowIndex: number, columnIndex: number) => boolean

export type IsIndexTableBody = (rowIndex: number, columnIndex: number, maxRowLength: number, maxColumnlength: number) => boolean

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
