import { useStagedRealEstateQuery } from "@/state";
import {
  commitRealEstateQuery,
  setSpaceRequirements
} from "@rems/state/app/actions";
import { BedsFilter } from "@rems/ui";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

type Props = React.ComponentProps<typeof BedsFilter>;

const useBedsFilterProps = (): Props => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  const onMinChange: Props["onMinChange"] = useCallback((value) => {
    dispatch(
      setSpaceRequirements({
        role: "USER",
        data: { minBedrooms: value }
      })
    );
    dispatch(commitRealEstateQuery());
  }, []);

  const onMaxChange: Props["onMaxChange"] = useCallback((value) => {
    dispatch(
      setSpaceRequirements({
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
