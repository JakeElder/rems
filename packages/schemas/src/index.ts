import { z } from "zod";

export {
  PartialRealEstateQuerySchema,
  RealEstateQuerySchema,
  AiRealEstateQuerySchema,
  PartialAiRealEstateQuerySchema,
  ServerRealEstateQuerySchema
} from "./real-estate-query";

export { ContactFormSchema } from "./contact-form";
export { FileSchema } from "./file";
export { ImageSchema } from "./image";
export { PropertySchema } from "./property";

const filterSchemaFactory = () =>
  z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
  });

export const FilterSchema = filterSchemaFactory();
export const IndoorFeature = filterSchemaFactory();
export const LotFeature = filterSchemaFactory();
export const OutdoorFeature = filterSchemaFactory();
export const ViewType = filterSchemaFactory();
export const PropertyType = filterSchemaFactory();

// propertyType: filterSchemaFactory().describe(
//   txt(<>The type of property it is</>)
// ),
// indoorFeatures: z
//   .array(filterSchemaFactory())
//   .nullable()
//   .default(null)
//   .describe(
//     txt(
//       <>
//         A list of indoor features that may be attractive to the end user,
//         people seeking rental or purchase properties
//       </>
//     )
//   ),
// lotFeatures: z
//   .array(filterSchemaFactory())
//   .nullable()
//   .default(null)
//   .describe(
//     txt(
//       <>
//         A list of lot features, IE features of the condo building or project
//         that contains the property
//       </>
//     )
//   ),
// outdoorFeatures: z
//   .array(filterSchemaFactory())
//   .nullable()
//   .default(null)
//   .describe(
//     txt(
//       <>
//         A list of outdoor features, IE features of the condo building or
//         project that contains the property
//       </>
//     )
//   ),
// viewTypes: z
//   .array(filterSchemaFactory())
//   .nullable()
//   .default(null)
//   .describe(txt(<> A list of view types that the property has`</>)),
