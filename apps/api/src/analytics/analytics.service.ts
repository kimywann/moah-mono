import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Mixpanel from "mixpanel";
import type { TCoreActivityEvent } from "./analytics.constants";

type TAnalyticsProperty = string | number | boolean;

interface ITrackCoreActivityParams {
  userId: string;
  eventName: TCoreActivityEvent;
  properties?: Record<string, TAnalyticsProperty>;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly mixpanel: ReturnType<typeof Mixpanel.init> | null;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    const token = configService.get<string>("MIXPANEL_TOKEN");
    const isEnabled = configService.get<string>("MIXPANEL_ENABLED") === "true";

    this.mixpanel =
      token && isEnabled ? Mixpanel.init(token, { keepAlive: true }) : null;
  }

  trackCoreActivity({
    userId,
    eventName,
    properties = {},
  }: ITrackCoreActivityParams) {
    if (!this.mixpanel) {
      return;
    }

    this.mixpanel.track(
      eventName,
      {
        distinct_id: userId,
        source: "backend",
        environment: process.env.NODE_ENV ?? "development",
        ...properties,
      },
      (error) => {
        if (error) {
          this.logger.warn(
            `Mixpanel 이벤트 전송에 실패했습니다: ${error.message}`,
          );
        }
      },
    );
  }
}
