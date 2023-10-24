import { IndexType } from "../../../types/table.types"

export type DispatchLineFlexibleCurrentIndex = {
	index: IndexType | null
}

export type DispatchLineFlexibleCurrentOffset = {
	mouseScreenPosition: {
		screenX: number
		screenY: number
	}
	offset: {
		offsetLeft: number
		offsetTop: number
	}
}

export type DispatchLineFlexibleActiveOffect = {
	offset: {
		offsetLeft?: number
		offsetTop?: number
	}
}
