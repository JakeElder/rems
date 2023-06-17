import { CarouselImage, Property } from "@rems/types";

export function propertyToCarouselImages(property: Property): CarouselImage[] {
  return property.images.map((i) => ({ ...i, alt: property.title }));
}
