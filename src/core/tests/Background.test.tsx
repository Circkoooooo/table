import { fireEvent, render, screen } from "@testing-library/react"
import Background from "../../layout/Background"

describe("App", () => {
	it("calls prevent default when contextmenu triggered", async () => {
		const onContextMenu = jest.fn()

		render(<Background onContextMenu={onContextMenu} HeaderSlot={<header>Header</header>} MainSlot={<main>Main</main>} />)

		fireEvent.contextMenu(screen.getByRole("body"))

		expect(onContextMenu).toHaveBeenCalled()
	})
})
