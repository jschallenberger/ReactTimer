import "styled-components";
import { defaultTheme } from "../styles/themes/default";

// ALL THE CODE BELOW IS NEEDED TO TYPESCRIPT ESLINT
// IT WILL ENABLE AUTOCOMPLETE WHEN USING PROPS.THEME.
type ThemeType = typeof defaultTheme;
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
