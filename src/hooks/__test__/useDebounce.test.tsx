import useDebounce from "../useDebounce"
import { fireEvent, render, screen } from "@testing-library/react"

describe("useDebounce", () => {
	jest.useFakeTimers()
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
		jest.advanceTimersByTime(1000)
		expect(mockFn.debounce).toHaveBeenCalledTimes(1)
		jest.advanceTimersByTime(900)

		fireEvent.click(screen.getByTestId("test-component"))
		jest.advanceTimersByTime(900)
		expect(mockFn.debounce).toHaveBeenCalledTimes(1)
		fireEvent.click(screen.getByTestId("test-component"))
		jest.advanceTimersByTime(1000)
		expect(mockFn.debounce).toHaveBeenCalledTimes(2)
	})
})
