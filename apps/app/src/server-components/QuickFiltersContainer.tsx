import QuickFiltersViewContainer from "../client-components/QuickFiltersViewContainer";
import api from "../api";

const QuickFiltersContainer = async () => {
  const filters = await api.get.quickFilters();
  return <QuickFiltersViewContainer filters={filters} />;
};

export default QuickFiltersContainer;
