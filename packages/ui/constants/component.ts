export type TComponentSize = "xSmall" | "small" | "medium" | "large" | "xLarge";

export const COMPONENT_CLASS: Record<TComponentSize, string> = {
  xSmall: "h-6 px-2 display10",
  small: "h-8 px-3 display12",
  medium: "h-11 px-4 display16",
  large: "h-12 px-5 display18",
  xLarge: "h-14 px-6 display20",
};
