import { cleanup, render } from "@testing-library/react"
import Table from "../../Table"
import useEvent from "@testing-library/user-event"

describe("Table", () => {
	it("adds and removes contextmenu listener on mount/unmount", async () => {
		const addEventListenerSpy = jest.spyOn(window, "addEventListener")
		const removeEventListenerSpy = jest.spyOn(window, "removeEventListener")

		render(<Table />)
		expect(addEventListenerSpy).toHaveBeenCalledWith("contextmenu", expect.any(Function))

		cleanup() // 卸载组件
		expect(removeEventListenerSpy).toHaveBeenCalledWith("contextmenu", expect.any(Function))
	})

	it("calls preventDefault when contextmenu event triggered", async () => {
		render(<Table />)
		const preventDefaultMock = jest.fn()

		document.body.addEventListener("contextmenu", preventDefaultMock)

		const user = useEvent.setup()
		await user.pointer("[MouseRight][/MouseRight]")
		await user.click(document.body)

		expect(preventDefaultMock).toHaveBeenCalled()
	})

	it("snapshot", () => {
		const { asFragment } = render(<Table />)
		expect(asFragment()).toMatchSnapshot()
	})
})
