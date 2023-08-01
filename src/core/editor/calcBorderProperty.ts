import { CellData } from "./CellData"

const calcBorderProperty = (cellData: CellData, rowNum: number, columnNum: number) => {
	return cellData.map((row, rowIndex) => {
		return row.map((_, columnIndex) => {
			const property = {
				top: false,
				right: false,
				bottom: false,
				left: false,
			}

			// last row
			if (rowIndex === cellData.length - 1) {
				//both last row and column
				if (columnIndex === row.length - 1) {
					property.top = true
					property.right = true
					property.bottom = true
					property.left = true
				} else {
					property.top = true
					property.bottom = true
					property.left = true
				}
			} else {
				// last column and not last row
				if (columnIndex === row.length - 1) {
					property.top = true
					property.right = true
					property.bottom = false
					property.left = true
				} else {
					//neither last row nor last column
					Object.assign(property, {
						top: true,
						left: true,
					})
				}
			}

			return property
		})
	})
}

export default calcBorderProperty
