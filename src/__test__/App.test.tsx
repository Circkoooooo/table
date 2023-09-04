import { fireEvent, render, screen } from "@testing-library/react"
import App from "../App"

describe("App", () => {
	test("App component", () => {
		render(<App />)

		const isDefault = fireEvent.contextMenu(screen.getByTestId("body"))
		expect(isDefault).toBeFalsy()
	})
})
