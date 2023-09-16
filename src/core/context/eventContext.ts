import { createContext } from "react"
import { TableMouseItemCallback } from "../types/types.type"

export interface EventContextProps {
	mousedownItemCallback?: (params: TableMouseItemCallback.TableMousedownItemCallbackParams) => void
	mousemoveItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	mouseupItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	inputItemCallback?: (params: TableMouseItemCallback.TableInputItemCallbackParams) => void
}

const EventContext = createContext<EventContextProps | null>(null)

export { EventContext }
