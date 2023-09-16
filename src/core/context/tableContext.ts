import { createContext } from "react"
import { WithRulerCellData } from "../cellDataHandler"

export const WithRulerCelLDataContext = createContext<WithRulerCellData | null>(null)
