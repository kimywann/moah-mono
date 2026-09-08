import { useEffect } from "react";
import { useLocation } from "react-router";

const INDEXABLE_PATHS = new Set(["/", "/privacy", "/terms"]);
const INDEXABLE_ROBOTS_CONTENT = "index, follow";
const NON_INDEXABLE_ROBOTS_CONTENT = "noindex, nofollow";

const RobotsMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const robotsContent = INDEXABLE_PATHS.has(pathname)
      ? INDEXABLE_ROBOTS_CONTENT
      : NON_INDEXABLE_ROBOTS_CONTENT;
    let robotsMetaTag = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );

    if (!robotsMetaTag) {
      robotsMetaTag = document.createElement("meta");
      robotsMetaTag.name = "robots";
      document.head.append(robotsMetaTag);
    }

    robotsMetaTag.content = robotsContent;
  }, [pathname]);

  return null;
};

export default RobotsMeta;
