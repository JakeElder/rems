import Filters from "../client-components/Filters";
import api from "../api";

const FiltersContainer = async () => {
  const filters = await api.get.quickFilters();
  return <Filters filters={filters} />;
};

export default FiltersContainer;
