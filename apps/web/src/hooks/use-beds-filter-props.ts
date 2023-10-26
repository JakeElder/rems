import {
  useStagedRealEstateQuery,
  setSpace,
  commitRealEstateQuery
} from "@/state";
import { BedsFilter } from "@rems/ui";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

type Props = React.ComponentProps<typeof BedsFilter>;

const useBedsFilterProps = (): Props => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  const onMinChange: Props["onMinChange"] = useCallback((value) => {
    dispatch(
      setSpace({
        role: "USER",
        data: { minBedrooms: value }
      })
    );
    dispatch(commitRealEstateQuery());
  }, []);

  const onMaxChange: Props["onMaxChange"] = useCallback((value) => {
    dispatch(
      setSpace({
        role: "USER",
        data: { maxBedrooms: value }
      })
    );
    dispatch(commitRealEstateQuery());
  }, []);

  return {
    minBedrooms: stagedQuery.space.minBedrooms,
    maxBedrooms: stagedQuery.space.maxBedrooms,
    onMinChange,
    onMaxChange
  };
};

export default useBedsFilterProps;
