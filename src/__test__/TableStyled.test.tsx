import { render } from "@testing-library/react"
import { CellStyled } from "../core/styled/Table-styled"
import { BorderProperty } from "../core/calcBorderProperty"

describe("Table Styled components", () => {
	const properties: BorderProperty = {
		top: false,
		right: false,
		bottom: false,
		left: false,
	}

	test("CellStyled", () => {
		render(<CellStyled $borderProperty={properties} />)
	})
})
