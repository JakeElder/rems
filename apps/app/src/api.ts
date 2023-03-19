import { fetch } from "./utils";
import { Property } from "@rems/types";

const get = {
  async properties(): Promise<Property[]> {
    const res = await fetch(`${process.env.API_URL}/properties`);
    const properties = await res.json();
    console.log(properties);
    return properties;
  }
};

export default { get };
