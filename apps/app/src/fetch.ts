import { fetch } from "@rems/ts-api";
fetch.init(process.env.NEXT_PUBLIC_REMS_API_URL!);
export default fetch.default;
