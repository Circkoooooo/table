import { fireEvent, render, screen } from "@testing-library/react"
import { TableMain } from "../core/components/TableMain"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import Table from "../core/Table"
import { Provider } from "react-redux"
import store from "../core/redux/store"

describe("TableMain component", () => {
	test("edit content on cellbody", async () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellBody = screen.getAllByTestId("cell-body")[0]

		fireEvent.mouseDown(firstCellBody)
		const cellHighlightBorder = screen.getByTestId("cell-highlight")

		expect(cellHighlightBorder.getAttribute("width")).toBe("100")
		expect(cellHighlightBorder.getAttribute("height")).toBe("30")

		fireEvent.mouseDown(firstCellBody)

		const user = userEvent.setup()
		await act(() => user.type(firstCellBody, "test-value"))
		expect(firstCellBody.textContent).toBe("test-value")
	})

	test("blur", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)

		const firstCellBody = screen.getAllByTestId("cell-body")[0]
		const secondCellBody = screen.getAllByTestId("cell-body")[1]

		fireEvent.mouseDown(firstCellBody)
		fireEvent.mouseDown(firstCellBody)

		fireEvent.mouseDown(secondCellBody)

		// const user = userEvent.setup()
		expect(firstCellBody.textContent).toBe("")
	})

	test("not add contenteditable in head", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellRowHead = screen.getAllByTestId("cell-row-head")[0]
		const firstCellColumnHead = screen.getAllByTestId("cell-column-head")[0]
		const firstCellRowColumnHead = screen.getByTestId("cell-row-column-head")

		fireEvent.mouseDown(firstCellRowHead)
		expect(firstCellRowHead.getAttribute("contenteditable")).toBeNull()
		fireEvent.mouseDown(firstCellColumnHead)
		expect(firstCellColumnHead.getAttribute("contenteditable")).toBeNull()
		fireEvent.mouseDown(firstCellRowColumnHead)
		expect(firstCellRowColumnHead.getAttribute("contenteditable")).toBeNull()
	})

	test("clickdown on row cellheader", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellRowHead = screen.getAllByTestId("cell-row-head")[0]

		fireEvent.mouseDown(firstCellRowHead)
	})

	test("clickdown on column cellheader", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellColumnHead = screen.getAllByTestId("cell-column-head")[0]

		fireEvent.mouseDown(firstCellColumnHead)
		const highlightBorder = screen.getByTestId("cell-highlight")
		expect(highlightBorder.getAttribute("width")).toBe("2600")
		expect(highlightBorder.getAttribute("height")).toBe("30")
	})

	test("clickdown on column and row cellheader", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellRowColumnHead = screen.getAllByTestId("cell-row-column-head")[0]

		fireEvent.mouseDown(firstCellRowColumnHead)
		const highlightBorder = screen.getByTestId("cell-highlight")
		expect(highlightBorder.getAttribute("width")).toBe("2600")
		expect(highlightBorder.getAttribute("height")).toBe("780")
	})

	test("mousemove indexes equals mousedown indexes", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellBody = screen.getAllByTestId("cell-body")[0]

		fireEvent.mouseDown(firstCellBody)
		fireEvent.mouseMove(firstCellBody)
		const highlightBorder = screen.getByTestId("cell-highlight")
		expect(highlightBorder.getAttribute("width")).toBe("100")
		expect(highlightBorder.getAttribute("height")).toBe("30")
	})

	test("mousedown in body and mousemove in row-column-head", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellRowHead = screen.getAllByTestId("cell-row-head")[0]
		const firstCellColumnHead = screen.getAllByTestId("cell-column-head")[0]
		const rowColumnHead = screen.getAllByTestId("cell-row-column-head")[0]

		fireEvent.mouseDown(firstCellRowHead)
		fireEvent.mouseMove(rowColumnHead)
		const highlightBorder = screen.getByTestId("cell-highlight")
		expect(highlightBorder.getAttribute("width")).toBe("100")
		expect(highlightBorder.getAttribute("height")).toBe("780")

		fireEvent.mouseDown(firstCellColumnHead)
		fireEvent.mouseMove(rowColumnHead)
		expect(highlightBorder.getAttribute("width")).toBe("2600")
		expect(highlightBorder.getAttribute("height")).toBe("30")
	})

	test("mousemoveIndex > mousedownIndex", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellBody = screen.getAllByTestId("cell-body")[0]
		const CellBodySecond = screen.getAllByTestId("cell-body")[28] // rowIndexes equals 0

		fireEvent.mouseDown(firstCellBody)
		fireEvent.mouseMove(CellBodySecond)
		const highlightBorder = screen.getByTestId("cell-highlight")
		expect(highlightBorder.getAttribute("width")).toBe("300")
		expect(highlightBorder.getAttribute("height")).toBe("60")
	})

	test("mousemoveIndex < mousedownIndex", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const cellBodyFirst = screen.getAllByTestId("cell-body")[28]
		const secondCellBody = screen.getAllByTestId("cell-body")[1] // rowIndexes equals 0

		fireEvent.mouseDown(cellBodyFirst)
		fireEvent.mouseMove(secondCellBody)
		const highlightBorder = screen.getByTestId("cell-highlight")
		expect(highlightBorder.getAttribute("width")).toBe("200")
		expect(highlightBorder.getAttribute("height")).toBe("60")
	})

	test("mousemove table body without any status", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellBody = screen.getAllByTestId("cell-body")[0]

		fireEvent.mouseMove(firstCellBody)
	})

	test("mouseup", () => {
		render(
			<Provider store={store}>
				<TableMain />
			</Provider>
		)
		const firstCellBody = screen.getAllByTestId("cell-body")[0]

		fireEvent.mouseUp(firstCellBody)
	})

	test("input in a cell which not body", async () => {
		render(
			<Provider store={store}>
				<Table />
			</Provider>
		)
		const firstCellRowHead = screen.getAllByTestId("cell-row-head")[0]
		const firstCellColumnHead = screen.getAllByTestId("cell-column-head")[0]
		const firstCellRowColumnHead = screen.getByTestId("cell-row-column-head")

		const user = userEvent.setup()
		fireEvent.mouseDown(firstCellRowHead)
		await act(() => user.type(firstCellRowHead, "test-value"))

		fireEvent.mouseDown(firstCellColumnHead)
		await act(() => user.type(firstCellColumnHead, "test-value"))

		fireEvent.mouseDown(firstCellRowColumnHead)
		await act(() => user.type(firstCellRowColumnHead, "test-value"))
	})
})
