import { useContext } from "react";
import { DomElementsContext } from "@/components/client/DomElementsProvider";

export const useDomElements = () => useContext(DomElementsContext)!;

export default useDomElements;
