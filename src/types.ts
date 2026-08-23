import type { Component } from "svelte";
import type { themes } from "./themes";

export type Theme = {
  name: string;
  icons: { [key: string]: string };
  Page: Component<{
    resumeData: ResumeData;
    icons: { [key: string]: string };
  }>;
};

export type InputData = {
  defaultLanguage: string;
  theme: keyof typeof themes;
  languages: { [langCode: string]: ResumeData };
  background: Background;
};

export type ResumeData = {
  profile: Profile;
  sections: ValidSection[];
};

export type Profile = {
  name: string;
  caption?: string;
  location?: string;
  description?: string;
  links: Link[];
};

export type Link = {
  label: string;
  href: string;
  icon?: string;
};

export type Section<
  dataType,
  sectionDataTypeName extends ValidSectionDataTypeNames
> = {
  title: string;
  data: dataType;
  type: sectionDataTypeName;
};

export type ValidSection = ExperienceSection | SkillSection | SummarySection;
export type ValidSectionDataTypeNames =
  | "experienceList"
  | "skillList"
  | "summary";

export type ExperienceSection = Section<Experience[], "experienceList">;
export type SkillSection = Section<Skill[], "skillList"> & {
  labels: { low: string; high: string };
};
export type SummarySection = Section<Summary, "summary">;

export type Experience = {
  title: string;
  subtitle: string;
  location: string;
  date: string;
  items: string[];
};

export type Skill = {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
};

export type Summary = {
  description: string;
};

// background types
export type Background = SolidBackground | YoutubeBackground | VideoBackground;

type SolidBackground = {
  type: "solid";
  color: string;
};

type VideoBackground = {
  type: "video";
  src: string;
};

type YoutubeBackground = {
  type: "youtube";
  src: string;
};
