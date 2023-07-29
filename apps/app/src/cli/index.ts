import { Command } from "commander";
import { createImages, createMockProperty, getModels } from "../lib/Remi";
import fetch from "../utils/fetch";
import b64ToBlob from "b64-to-blob";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const insertImages = async (b64s: string[], name: string) => {
  const form = new FormData();
  for (let i = 0; i < b64s.length; i++) {
    const blob = b64ToBlob(b64s[i], "image/png");
    form.append("files", blob, `${name} ${i + 1}.png`);
  }
  const url = `${process.env.CMS_API_URL}/upload`;
  const res = await fetch(url, { method: "POST", body: form });
  return res.json();
};

const amendKeys = (p: any) => {
  const {
    propertyType,
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    ...rest
  } = p;

  return {
    ...rest,
    property_type: propertyType,
    indoor_features: indoorFeatures,
    lot_features: lotFeatures,
    outdoor_features: outdoorFeatures,
    view_types: viewTypes
  };
};

const insertProperty = async (property: any) => {
  const url = `${process.env.CMS_API_URL}/properties`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ data: amendKeys(property) }),
    headers: { "Content-Type": "application/json" }
  });

  return res.json();
};

const insertMockProperty = async () => {
  const { id, ...property } = await createMockProperty();
  const b64s = await createImages(property.title, randomInt(2, 6));
  const images = await insertImages(b64s, property.title);
  property.images = images;
  return insertProperty(property);
};

const insertMockProperties = async () => {
  try {
    const property = await insertMockProperty();
    console.log(`✅ ${property.data.attributes.title}`);
  } catch (e) {
    console.log(`❌`);
  }
  insertMockProperties();
};

const program = new Command();

program.name("rems-cli").description("Rems CLI tools");

program
  .command("mock")
  .description("Inserts mock properties on a loop")
  .action(() => insertMockProperties());

program
  .command("get")
  .description("Gets a property")
  .action(async () => {
    const url = `${process.env.CMS_API_URL}/properties/5?populate=images`;
    const res = await fetch(url);
    console.dir(await res.json(), { depth: null, colors: true });
  });

program
  .command("gpt-models")
  .description("Lists gpt models")
  .action(async () => {
    const models = await getModels();
    console.dir(
      models.data.data.map((m: any) => m.id),
      { depth: null, colors: true }
    );
  });

program.parse();
