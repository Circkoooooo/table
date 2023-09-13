import { CellData } from "./cellDataHandler"

export type BorderProperty = {
	top?: boolean
	right?: boolean
	bottom?: boolean
	left?: boolean
}

const calcBorderProperty = (cellData: CellData, rowNum: number, columnNum: number): BorderProperty[][] => {
	return cellData.map((row, rowIndex) => {
		return row.map((_, columnIndex) => {
			const property = {
				top: false,
				right: false,
				bottom: false,
				left: false,
			}

			if (rowIndex === 0) {
				if (columnIndex === 0) {
					property.top = true
					property.right = true
					property.bottom = true
					property.left = true
				} else {
					property.top = true
					property.bottom = true
					property.right = true
				}
			} else {
				// last column and not last row
				if (columnIndex === 0) {
					// property.top = true
					property.right = true
					property.bottom = true
					property.left = true
				} else {
					//neither last row nor last column
					Object.assign(property, {
						right: true,
						bottom: true,
					})
				}
			}

			return property
		})
	})
}

export default calcBorderProperty
