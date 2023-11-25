import { useStagedRealEstateQuery } from "@/state";
import {
  commitRealEstateQuery,
  setSpaceRequirements
} from "@rems/state/app/actions";
import { BathroomsFilter } from "@rems/ui";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

type Props = React.ComponentProps<typeof BathroomsFilter>;

const useBathsFilterProps = (): Props => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  const onChange: Props["onChange"] = useCallback((value) => {
    dispatch(
      setSpaceRequirements({
        role: "USER",
        data: { minBathrooms: value }
      })
    );
    dispatch(commitRealEstateQuery());
  }, []);

  return {
    value: stagedQuery["space"]["minBathrooms"],
    onChange
  };
};

export default useBathsFilterProps;
