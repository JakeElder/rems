import * as fetch from "@rems/utils/fetch";
fetch.init(process.env.NEXT_PUBLIC_REMS_API_URL!);
export default fetch.default;
