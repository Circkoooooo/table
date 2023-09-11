import { render } from "@testing-library/react"
import { CellStyled } from "../core/styled/Table-styled"
import { BorderProperty } from "../core/calcBorderProperty"
import { SizeProperty } from "../core/types/table.type"

describe("Table Styled components", () => {
	const properties: BorderProperty = {
		top: false,
		right: false,
		bottom: false,
		left: false,
	}

	const columnSizeProperty = {
		isSingleItem: false,
		startColumnIndex: 2,
		endColumnIndex: 3,
		width: 300,
	} as SizeProperty.ColumnSizeProperty

	test("CellStyled", () => {
		render(<CellStyled $isEditable={false} $isIndexTableBody={false} $borderProperty={properties} $columnSizeProperty={columnSizeProperty} />)
	})
})
