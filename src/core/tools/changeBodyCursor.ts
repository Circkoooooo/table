import { Cursor } from "./types"

const changeBodyCursor = (cursor: Cursor) => {
	const body = document.querySelector("body")
	body && (body.style.cursor = cursor)
}
export default changeBodyCursor
