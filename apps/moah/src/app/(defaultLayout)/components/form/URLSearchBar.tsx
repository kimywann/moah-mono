import MHIcon from "@moah/ui/components/MHIcon";

const URLSearchBar = () => {
  return (
    <form className="flex h-14 w-full max-w-140 items-center gap-2 rounded-full border border-border bg-background px-2">
      <label className="sr-only" htmlFor="job-posting">
        채용공고 URL 또는 내용
      </label>

      <input
        className="display16 min-w-0 flex-1 bg-transparent px-4 text-foreground outline-none placeholder:text-muted-foreground"
        id="job-posting"
        name="jobPosting"
        placeholder="채용공고 URL을 입력해 주세요"
        type="text"
      />

      <button
        aria-label="채용공고 분석하기"
        className="flex size-10 shrink-0 items-center justify-center text-primary"
        type="submit"
      >
        <MHIcon icon="search" size={20} />
      </button>
    </form>
  );
};

export default URLSearchBar;
