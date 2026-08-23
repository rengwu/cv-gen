import type { Theme } from "../../types";
import icons from "./assets/icons";
import Page from "./components/Page.svelte";

export const theme: Theme = {
  name: "default",
  icons: icons,
  Page: Page,
};

export default theme;
