import { useStagedRealEstateQuery, setSpace } from "@/state";
import { BedsFilterPopover } from "@rems/ui";
import { useDispatch } from "react-redux";

type Props = React.ComponentProps<typeof BedsFilterPopover>;

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
    },
    onMaxChange: (value) => {
      dispatch(
        setSpace({
          role: "USER",
          data: { maxBedrooms: value }
        })
      );
    },
    on: true
  };
};

export default useBedsFilterProps;
