import { fetch } from "./utils";
import { Property } from "@rems/types";

const get = {
  async properties(): Promise<Property[]> {
    const res = await fetch(`${process.env.API_URL}/properties`);

    console.log(res.ok, res.statusText, res.status);

    return res.json();
  }
};

export default { get };
