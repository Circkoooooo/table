import { fireEvent, render, screen } from "@testing-library/react"
import App from "../App"

describe("Background Component", () => {
	it("calls prevent default when contextmenu triggered", async () => {
		render(<App />)

		const isDefault = fireEvent.contextMenu(screen.getByTestId("body"))
		expect(isDefault).toBe(false)
	})
})
