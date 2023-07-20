import api from "../api";
import TypeFilterPopoverViewContainer from "../client-components/TypeFilterPopoverViewContainer";

const TypeFilterPopoverContainer = async () => {
  const types = await api.get.propertyTypes();
  return <TypeFilterPopoverViewContainer types={types} />;
};

export default TypeFilterPopoverContainer;
