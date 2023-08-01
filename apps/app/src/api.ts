import { legacy } from "@rems/ts-api";

legacy.init(
  process.env.CMS_API_URL!,
  process.env.ASSET_URL!,
  process.env.CMS_API_TOKEN!
);

const api = { get: legacy.get };
export default api;
