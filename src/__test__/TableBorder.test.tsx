import { render } from "@testing-library/react"
import TableBorder, { BorderWrapper } from "../core/components/TableBorder"

describe("Table border component", () => {
	it("border wrap component", () => {
		const { asFragment } = render(<BorderWrapper width={100} height={100} $offsetLeft={10} $offsetTop={10} />)
		expect(asFragment()).toMatchSnapshot()
	})

	it("table border render", () => {
		expect(TableBorder({ isRender: false })).toBeNull()

		expect(TableBorder({ isRender: true, borderHeight: 100, borderWidth: 100, offsetLeft: 0, offsetTop: 0 })).toMatchSnapshot()
	})
})
