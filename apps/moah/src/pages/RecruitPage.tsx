import { useEffect, useState } from "react";
import { getJobPostingList } from "@/api/job-posting";
import JobPostingCard from "@/components/job-posting/JobPostingCard";
import HeroBanner from "@/components/layout/HeroBanner";
import hero from "@/shared/assets/job-posings-hero.png";
import type { IJobPostingList } from "@/shared/type/job-posting";

const RecruitPage = () => {
  const [jobPostings, setJobPostings] = useState<IJobPostingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await getJobPostingList();

        if (!response.success || !response.data) {
          throw new Error("채용 공고 목록을 불러오지 못했습니다.");
        }

        setJobPostings(response.data);
      } catch {
        setErrorMessage("채용 공고 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchJobPostings();
  }, []);

  if (isLoading) {
    return (
      <p className="p-6 text-muted-foreground">
        채용 공고 목록을 불러오는 중...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="p-6 text-danger" role="alert">
        {errorMessage}
      </p>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <HeroBanner
          backgroundImage={hero}
          description="관심 있는 채용 공고를 확인하고 지원해 보세요."
          title="채용 공고"
        />
      </div>

      <div className="mb-3 flex justify-end">
        <p className="medium display14 text-muted-foreground">
          총 {jobPostings.length}건
        </p>
      </div>

      {jobPostings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobPostings.map((data) => (
            <JobPostingCard jobPosting={data} key={data.id} />
          ))}
        </div>
      ) : (
        <div className="rounded-medium border border-border-subtle bg-muted p-10 text-center text-muted-foreground">
          등록된 채용 공고가 없습니다.
        </div>
      )}
    </section>
  );
};

export default RecruitPage;
