import { fetch } from "./utils";
import { Property } from "@rems/types";

const get = {
  async properties(): Promise<Property[]> {
    const res = await fetch(`${process.env.API_URL}/properties`);

    console.log(res.ok, res.body);

    return res.json();
  }
};

export default { get };
