import React from "react";
import { z } from "zod";
import { ImageSchema } from "./image";

const txt = (node: React.ReactElement): string => node.props.children;

export const PropertySchema = z
  .object({
    id: z
      .number()
      .describe(txt(<>A automatically generated unique identifier</>)),
    uid: z
      .string()
      .describe(
        txt(
          <>
            A unique identifier, entered by the real estate agent. Used so that
            the estate agent can correlate the property with their internal
            record
          </>
        )
      ),
    title: z
      .string()
      .describe(
        txt(
          <>
            An SEO friendly description of the property. It should be evocative,
            attractive to potential buyers. It should be succint
          </>
        )
      ),
    description: z
      .string()
      .describe(
        txt(
          <>
            A long(ish) form description of the property. It should be easy to
            read and well structured. It should contain key details about the
            property and be between 3 and 7 paragraphs long.
          </>
        )
      ),
    purchasePrice: z
      .number()
      .nullable()
      .describe(
        txt(
          <>
            The price, set by the owner that someone may purchase the property
            for, if for sale. Every property must have either a purchasePrice,
            rentalPrice or both. The price is specified in Thai Baht
          </>
        )
      ),
    availableToPurchase: z.boolean(),
    availableToRent: z.boolean(),
    rentalPrice: z
      .number()
      .nullable()
      .describe(
        txt(
          <>
            The price, set by the owner that someone may rent the property for,
            if available for rent. Every property must have either a
            purchasePrice, rentalPrice or both. The price is specified in Thai
            Baht
          </>
        )
      ),
    bedrooms: z
      .number()
      .describe(txt(<>The number of bathrooms in the property</>)),
    bathrooms: z
      .number()
      .describe(txt(<>The number of bathrooms in the property</>)),
    livingArea: z
      .number()
      .describe(txt(<>The living area of the property, specified in m²</>)),
    location: z.object({
      lng: z
        .number()
        .describe(txt(<>The longitude of the properties location</>)),
      lat: z
        .number()
        .describe(txt(<>The latitude of the properties location</>))
    }),
    address: z.string(),
    url: z.string(),
    formattedPurchasePrice: z.string().nullable(),
    formattedRentalPrice: z.string().nullable(),
    images: z.array(ImageSchema).nullable().default(null),
    createdAt: z.date(),
    updatedAt: z.date(),
    publishedAt: z.date()
  })
  .describe(
    txt(
      <>
        A schema that encapsulates all of the information of a single property`
      </>
    )
  );
