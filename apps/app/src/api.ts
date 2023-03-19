import { fetch } from "./utils";
import { Property } from "@rems/types";

const get = {
  async properties(): Promise<Property[]> {
    const res = await fetch(`${process.env.API_URL}/properties`);
    const properties = await res.text();
    console.log(properties);
    return [];
  }
};

export default { get };
