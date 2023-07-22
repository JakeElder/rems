import { propertySchema } from "@rems/types";
import zodToJsonSchema from "zod-to-json-schema";

const generateSchema = async () => {
  const jsonSchema = zodToJsonSchema(propertySchema);
  return jsonSchema;
};

const run = async () => {
  const schema = await generateSchema();
  console.log(JSON.stringify(schema, null, 2));
};

run();
