import { render } from "@testing-library/react"
import TableBorder, { BorderWrapper } from "../core/components/TableBorder"

describe("Table border component", () => {
	it("border wrap component", () => {
		const { asFragment } = render(<BorderWrapper width={100} height={100} $offsetLeft={10} $offsetTop={10} />)
		expect(asFragment()).toMatchSnapshot()
	})
})
