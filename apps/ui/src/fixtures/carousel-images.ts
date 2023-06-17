import { CarouselImage, Property } from "@rems/types";
import properties from "./properties.json";

export default (properties as unknown as Property[]).map<CarouselImage[]>((p) =>
  p.images.map((i) => ({ ...i, alt: p.title }))
);
