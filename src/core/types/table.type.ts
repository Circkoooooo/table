export type IndexType = {
	rowIndex: number
	columnIndex: number
}

export type BorderProperty = {
	top?: boolean
	right?: boolean
	bottom?: boolean
	left?: boolean
}

export namespace SizeProperty {
	export type RenderingIndexRange = {
		startRowIndex: number
		endRowIndex: number
		startColumnIndex: number
		endColumnIndex: number
	}
	// Row
	export type RowSizeSingleItemProperty = {
		isSingleItem: true
		rowIndex: number
		height: number
	}

	export type RowSizeRangeItemProperty = {
		isSingleItem: false
		startRowIndex: number
		endRowIndex: number
		height: number
	}

	// type
	export type RowSizeProperty = RowSizeSingleItemProperty | RowSizeRangeItemProperty

	// Column
	export type ColumnSizeSingleItemProperty = {
		isSingleItem: true
		columnIndex: number
		width: number
	}

	export type ColumnSizeRangeItemProperty = {
		isSingleItem: false
		startColumnIndex: number
		endColumnIndex: number
		width: number
	}

	export type ColumnSizeProperty = ColumnSizeSingleItemProperty | ColumnSizeRangeItemProperty

	// size property
	export type RowColumnSizeProperty = {
		rowSizeProperty: RowSizeProperty[]
		columnSizeProperty: ColumnSizeProperty[]
	}
}
