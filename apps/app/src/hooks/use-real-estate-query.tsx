"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { URLSearchParams } from "url";

type UseRealEstateQueryReturn = {
  isChecked: (key: string) => boolean;
  onCheckedChange: (key: string, on: boolean) => void;
};

const useRealEstateQuery = (): UseRealEstateQueryReturn => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const commit = (params: URLSearchParams) => {
    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    isChecked(k) {
      return params.has(k);
    },

    onCheckedChange(key, on) {
      const nextParams = new window.URLSearchParams(params.toString());
      on ? nextParams.set(key, "true") : nextParams.delete(key);
      commit(nextParams);
    }
  };
};

export default useRealEstateQuery;
