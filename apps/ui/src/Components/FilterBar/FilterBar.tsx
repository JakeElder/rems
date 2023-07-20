import React from "react";
import css from "./FilterBar.module.css";
import Container from "../../Elements/Container/Container";

// type Props = {};

// const FilterBar = ({}: Props) => {
// const $sections = useRef<HTMLDivElement>(null);
// const { events } = useDraggable(
//   $sections as MutableRefObject<HTMLDivElement>
// );
// return (
//   <div className={css["root"]} ref={$sections} {...events}>
//     <Container full>
//       <div className={css["sections"]}>
//         <div className={css["filters"]}>
//           <FilterDialog />
//         </div>
//         <div className={css["separator"]} />
//         <div className={css["key-filters"]}>
//           <TypeFilterPopover on={has("property-type")} />
//           <AvailabilityFilterPopover />
//           <PriceFilterPopover on={has("min-price") || has("max-price")} />
//           <BedsFilterPopover
//             on={has("min-bedrooms") || has("max-bedrooms")}
//           />
//         </div>
//         <div className={css["separator"]} />
//         <div className={css["toggles"]}>
//           <QuickFilters />
//         </div>
//       </div>
//     </Container>
//   </div>
// );
// };

export const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["root"]}>
      <Container full>
        <div className={css["sections"]}>{children}</div>
      </Container>
    </div>
  );
};

export const QuickFilters = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["toggles"]}>{children}</div>;
};
