"use client";

import MHIcon from "@moah/ui/components/MHIcon";
import cn from "@moah/ui/utils/cn";
import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useEffect, useRef, useState } from "react";
import JobPostingPreviewModal from "./modal/JobPostingPreviewModal";

const INPUT_METHODS = [
  { label: "URL 입력", value: "url" },
  { label: "공고 원문 붙여넣기", value: "content" },
];

const TEXTAREA_MAX_HEIGHT = 2000;

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = "auto";

  const nextHeight = Math.min(textarea.scrollHeight, TEXTAREA_MAX_HEIGHT);

  textarea.style.height = `${nextHeight}px`;
  textarea.style.overflowY =
    textarea.scrollHeight > TEXTAREA_MAX_HEIGHT ? "auto" : "hidden";
};

const JobPostingExtractor = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputMethod, setInputMethod] = useState("url");
  const [inputValues, setInputValues] = useState({
    content: "",
    url: "",
  });

  const inputValue =
    inputMethod === "url" ? inputValues.url : inputValues.content;
  const isSubmitDisabled = !inputValue.trim();

  const handleChangeURL: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInputValues((previousValues) => ({
      ...previousValues,
      url: event.target.value,
    }));
  };

  const handleChangeContent: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    resizeTextarea(event.currentTarget);
    setInputValues((previousValues) => ({
      ...previousValues,
      content: event.target.value,
    }));
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (inputMethod !== "content" || !inputValues.content.trim()) {
      return;
    }

    setIsModalOpen(true);
  };

  useEffect(() => {
    if (inputMethod !== "content") {
      return;
    }

    const textarea = textareaRef.current;

    if (textarea) {
      resizeTextarea(textarea);
    }
  }, [inputMethod]);

  return (
    <section className="flex min-w-0 flex-1 flex-col items-center justify-center p-6">
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex max-w-200 flex-col items-center gap-3 text-center">
          <h1 className="bold display40">길어진 취준, 복잡한 관리는 끝</h1>
          <p className="display16 medium text-muted-foreground">
            공고만 붙여넣으면, 지원 관리는 모아가 정리합니다.
          </p>
        </div>

        <form
          className="flex w-full max-w-160 flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <fieldset>
            <legend className="sr-only">공고 입력 방식</legend>
            <div className="grid grid-cols-2 rounded-small bg-field p-1">
              {INPUT_METHODS.map((method) => {
                const isSelected = inputMethod === method.value;

                return (
                  <label
                    className={cn(
                      "display14 medium flex h-10 cursor-pointer items-center justify-center rounded-tiny px-3 text-center transition-colors",
                      isSelected
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    key={method.value}
                  >
                    <input
                      checked={isSelected}
                      className="sr-only"
                      name="inputMethod"
                      onChange={() => setInputMethod(method.value)}
                      type="radio"
                      value={method.value}
                    />
                    {method.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <div className="flex min-h-14 w-full items-end gap-2 rounded-full border border-border bg-background p-2 within:ring-focus transition-colors focus-within:border-focus focus-within:ring-1 focus-within:ring-focus">
              {inputMethod === "url" ? (
                <input
                  className="display16 h-10 min-w-0 flex-1 bg-transparent px-4 text-foreground outline-none placeholder:text-neutral40"
                  onChange={handleChangeURL}
                  placeholder="채용 공고 URL을 입력해 주세요"
                  type="url"
                  value={inputValues.url}
                />
              ) : (
                <textarea
                  className="display16 max-h-60 min-h-10 min-w-0 flex-1 resize-none overflow-y-hidden bg-transparent px-4 py-2 text-foreground outline-none placeholder:text-neutral40"
                  onChange={handleChangeContent}
                  placeholder="채용 공고 원문을 붙여 넣어 주세요"
                  ref={textareaRef}
                  rows={1}
                  value={inputValues.content}
                />
              )}
              <button
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors disabled:cursor-not-allowed disabled:bg-disabled-border disabled:text-muted"
                disabled={isSubmitDisabled}
                type="submit"
              >
                <MHIcon icon="arrowUp" size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <JobPostingPreviewModal onClose={() => setIsModalOpen(false)} />
      )}
    </section>
  );
};

export default JobPostingExtractor;
