type Cursor = "auto" | "pointer" | "crosshair" | "row-resize"

const changeBodyCursor = (cursor: Cursor) => {
	const body = document.querySelector("body")
	body && (body.style.cursor = cursor)
}
export default changeBodyCursor
