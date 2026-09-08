import type { IListSearchParams, TSortOrder } from "@moah/shared/type/url";
import { createQueryString } from "@moah/shared/utils/url";
import { useSearchParams } from "react-router";
import ApplicationsView from "@/features/applications/ApplicationsView";
import type { TApplicationStage } from "@/features/applications/model/application.type";

const ApplicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const listParams: IListSearchParams<TApplicationStage> = {
    keyword: searchParams.get("keyword") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    sort: (searchParams.get("sort") ?? undefined) as TSortOrder | undefined,
    status: (searchParams.get("status") ?? undefined) as
      | TApplicationStage
      | undefined,
  };

  const handleListParamsChange = (
    params: Partial<IListSearchParams<TApplicationStage>>,
  ) => {
    const nextParams = { ...listParams, ...params };

    setSearchParams(
      createQueryString({
        keyword: nextParams.keyword,
        page: nextParams.page === "1" ? undefined : nextParams.page,
        sort: nextParams.sort,
        status: nextParams.status,
      }),
    );
  };

  return (
    <>
      <meta content="noindex" name="robots" />
      <ApplicationsView
        listParams={listParams}
        onListParamsChange={handleListParamsChange}
      />
    </>
  );
};

export default ApplicationsPage;
