import changeBodyCursor from "./changeBodyCursor"
import { IndexType } from "../types/table.types"
import { ChangeBodyPointerByIndex } from "./types"

/**
 * type参数为reset则改变cursor为pointer；如果是calc，则提取第二个参数index，判断是否是pointer
 * @param type reset | calc
 */
const changeBodyPointerByIndex: ChangeBodyPointerByIndex = <T extends "reset" | "calc">(type: T, index?: T extends "calc" ? IndexType : never) => {
	if (type === "reset") {
		changeBodyCursor("auto")
	} else if (type === "calc" && index !== undefined) {
		const { rowIndex, columnIndex } = index
		if (rowIndex === 0 || columnIndex === 0) {
			changeBodyCursor("pointer")
		} else {
			changeBodyCursor("auto")
		}
	}
}

export default changeBodyPointerByIndex
