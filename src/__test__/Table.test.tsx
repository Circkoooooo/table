import { render } from "@testing-library/react"
import Table from "../core/Table"

describe("Table", () => {
	it("snapshot", () => {
		const { asFragment } = render(<Table />)
		// expect(asFragment()).toMatchSnapshot()
	})
})
