import {
  useStagedRealEstateQuery,
  setSpace,
  commitRealEstateQuery
} from "@/state";
import { BathroomsFilter } from "@rems/ui";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

type Props = React.ComponentProps<typeof BathroomsFilter>;

const useBathsFilterProps = (): Props => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  const onChange: Props["onChange"] = useCallback((value) => {
    dispatch(
      setSpace({
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
