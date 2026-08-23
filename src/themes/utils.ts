import type { Theme } from "../types";

// maps section type key string to template string
export const sectionMap: { [key: string]: keyof Theme } = {
  experienceList: "experienceSectionTemplate",
  skillList: "skillsSectionTemplate",
  summary: "summarySectionTemplate",
};

export const setDOMInnerHTML = (ID: string, text: string | undefined) => {
  const el = document.getElementById(ID);
  if (el && text) {
    el.textContent = text;
  }
};

export const appendDOMInnerHTML = (
  ID: string,
  innerHTML: string,
  position: InsertPosition = "beforeend"
) => {
  const el = document.getElementById(ID);
  if (el && innerHTML) {
    el.insertAdjacentHTML(position, innerHTML);
  }
};

export const downloadAsJSON = (object: any, filename = "resume") => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(object));
  let elem = document.createElement("a");
  elem.setAttribute("href", dataStr);
  elem.setAttribute("download", `${filename}.json`);
  elem.click();
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
