"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRealEstateQuery } from "@/state";
import { generateQueryString } from "@rems/utils/query";

type Props = { children: React.ReactNode };

const QuerySync = ({ children }: Props) => {
  const query = useRealEstateQuery();
  const router = useRouter();

  useEffect(() => {
    const qs = generateQueryString(query);
    router.push(`/real-estate${qs}`);
  }, [query]);

  return children;
};

export default QuerySync;
