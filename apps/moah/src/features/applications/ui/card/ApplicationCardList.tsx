import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import { getDeadlineLabel } from "@/features/applications/lib/format";
import type {
  IApplicationList,
  TApplicationStage,
} from "@/features/applications/model/application.type";
import ApplicationStageDropdown from "@/features/applications/ui/ApplicationStageDropdown";

interface IApplicationCardListProps {
  applications: IApplicationList[];
  isDeleting: boolean;
  isStageUpdate: boolean;
  onAttachmentClick: (id: string) => void;
  onDelete: (id: string) => void;
  onDetailClick: (id: string) => void;
  onStageChange: (id: string, stage: TApplicationStage) => void;
}

const ApplicationCardList = (props: IApplicationCardListProps) => {
  if (props.applications.length === 0) {
    return (
      <p className="rounded-small border border-neutral10 px-4 py-12 text-center text-muted-foreground">
        데이터가 존재하지 않습니다.
      </p>
    );
  }

  return (
    <div>
      <ul className="grid grid-cols-1 tab:grid-cols-2 gap-3">
        {props.applications.map((application) => {
          const attachmentCount = application.attachments.length;

          return (
            <li
              className="flex min-w-0 flex-col rounded-medium border border-neutral10 bg-background p-4"
              key={application.id}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="display16 semibold truncate">
                    {application.companyName ?? "회사명 미정"}
                  </p>
                  <p className="display14 mt-1 truncate text-muted-foreground">
                    {application.position ?? "포지션 미정"}
                  </p>
                </div>
                <ApplicationStageDropdown
                  isUpdate={props.isStageUpdate}
                  onChange={(stage) =>
                    props.onStageChange(application.id, stage)
                  }
                  stage={application.stage}
                />
              </div>

              <p className="display14 mt-4 line-clamp-2 min-h-10">
                {application.title ?? "공고명 미정"}
              </p>

              <div className="display12 mt-3 flex items-center justify-between gap-3 text-muted-foreground">
                <span>마감일</span>
                <span className="truncate font-medium text-foreground">
                  {getDeadlineLabel(application)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-border-subtle border-t pt-3">
                <MHButton
                  className="px-3"
                  onClick={() => props.onAttachmentClick(application.id)}
                  size="small"
                  variant="ghost"
                >
                  <MHIcon icon="upload" size={16} />
                  첨부 {attachmentCount > 0 ? attachmentCount : ""}
                </MHButton>
                <div className="flex items-center gap-1">
                  <MHButton
                    className="text-danger"
                    disabled={props.isDeleting}
                    onClick={() => props.onDelete(application.id)}
                    size="small"
                    variant="ghost"
                  >
                    삭제
                  </MHButton>
                  <MHButton
                    onClick={() => props.onDetailClick(application.id)}
                    size="small"
                    variant="secondary"
                  >
                    자세히
                  </MHButton>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ApplicationCardList;
