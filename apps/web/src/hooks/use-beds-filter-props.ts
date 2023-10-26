import {
  useStagedRealEstateQuery,
  setSpace,
  commitRealEstateQuery
} from "@/state";
import { BedsFilter } from "@rems/ui";
import { useDispatch } from "react-redux";

type Props = React.ComponentProps<typeof BedsFilter>;

const useBedsFilterProps = (): Props => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  return {
    minBedrooms: stagedQuery.space.minBedrooms,
    maxBedrooms: stagedQuery.space.maxBedrooms,
    onMinChange: (value) => {
      dispatch(
        setSpace({
          role: "USER",
          data: { minBedrooms: value }
        })
      );
      dispatch(commitRealEstateQuery());
    },
    onMaxChange: (value) => {
      dispatch(
        setSpace({
          role: "USER",
          data: { maxBedrooms: value }
        })
      );
      dispatch(commitRealEstateQuery());
    }
  };
};

export default useBedsFilterProps;
