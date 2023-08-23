import { NextPage } from "next";
import { useRouter } from "next/router";
import update from "immutability-helper";
import qs from "query-string";
import { Observable } from "rxjs";

const useQuery = () => {
  const router = useRouter();

  const patch = (data: any) => {
    const currentQuery = router.query;
    const nextQuery = update(currentQuery, { $merge: data });
    const string = qs.stringify(nextQuery);
    router.push(`${router.pathname}?${string}`, "", { shallow: true });
  };

  return { query: router.query, patch };
};

const fetcher = (data: any) => {
  return new Observable((s) => {
    /* (Do something async with data) */
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      s.next({ one: "set" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      s.next({ two: "set" });
    })();
  });
};

const Page: NextPage<{}> = () => {
  const { patch, query } = useQuery();

  const execute = () => {
    fetcher({ relevant: "data" }).subscribe({
      next(d) {
        patch(d);
      }
    });
  };

  return (
    <div>
      <button onClick={() => execute()}>Go</button>
      <span>{JSON.stringify(query)}</span>
    </div>
  );
};

export default Page;
