import { mockWait } from "../../tools/mock/mockWait"
import useDebounce from "../useDebounce"
import { fireEvent, render, screen } from "@testing-library/react"

describe("useDebounce", () => {
	test("debounce", async () => {
		const mockFn = {
			debounce: jest.fn(),
		}

		const Component = () => {
			const clickFn = useDebounce(() => {
				mockFn.debounce()
			}, 1000)
			mockFn.debounce = jest.fn()

			return <div data-testid="test-component" onClick={() => clickFn()}></div>
		}

		render(<Component />)

		fireEvent.click(screen.getByTestId("test-component"))
		expect(mockFn.debounce).toHaveBeenCalledTimes(0)
		await mockWait(1000)
		expect(mockFn.debounce).toHaveBeenCalledTimes(1)
		await mockWait(900)
		fireEvent.click(screen.getByTestId("test-component"))
		await mockWait(900)
		expect(mockFn.debounce).toHaveBeenCalledTimes(1)
		fireEvent.click(screen.getByTestId("test-component"))
		await mockWait(1000)
		expect(mockFn.debounce).toHaveBeenCalledTimes(2)
	})
})
