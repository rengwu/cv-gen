export const downloadAsJSON = (object: unknown, filename = "resume") => {
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
