import { render } from "@testing-library/react"
import Table from "../Table"

describe("Table", () => {
	it("snapshot", () => {
		const { asFragment } = render(<Table />)
		expect(asFragment()).toMatchSnapshot()
	})
})
