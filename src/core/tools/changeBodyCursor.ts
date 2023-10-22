type Cursor = "auto" | "pointer" | "crosshair"

const changeBodyCursor = (cursor: Cursor) => {
	const body = document.querySelector("body")
	body && (body.style.cursor = cursor)
}
export default changeBodyCursor
