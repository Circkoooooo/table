import { fireEvent, render, screen } from "@testing-library/react"
import Background from "../layout/Background"

describe("Background Component", () => {
	it("calls prevent default when contextmenu triggered", async () => {
		const contextMenuMock = jest.fn()
		render(
			<Background
				{...{
					HeaderSlot: <div>header</div>,
					MainSlot: <div>main</div>,
					AsideSlot: <div>aside</div>,
					onContextMenu: () => contextMenuMock(),
				}}
			/>
		)

		fireEvent.contextMenu(screen.getByTestId("body"))
		expect(contextMenuMock).toHaveBeenCalled()
	})
})
