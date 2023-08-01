import QuickFiltersViewContainer from "@/components/client/QuickFiltersViewContainer";
import fetch from "@/fetch";

const QuickFiltersContainer = async () => {
  const filters = await fetch("quick-filters");
  return <QuickFiltersViewContainer filters={filters} />;
};

export default QuickFiltersContainer;
