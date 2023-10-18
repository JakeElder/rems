import { z } from "zod";

const RealEstateIndexPageSchema = z.coerce.number().default(1).catch(1);

export default RealEstateIndexPageSchema;
