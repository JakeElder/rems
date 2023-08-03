import fetch from "@/fetch";
import TypeFilterPopoverViewContainer from "@/components/client/TypeFilterPopoverViewContainer";

const TypeFilterPopoverContainer = async () => {
  const types = await fetch("property-types");
  return <TypeFilterPopoverViewContainer types={types} />;
};

export default TypeFilterPopoverContainer;
