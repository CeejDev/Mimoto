import { Theme } from './Theme';

const tintColorLight = Theme.colors.accent;
const tintColorDark = Theme.colors.accent;

export default {
  light: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    tint: tintColorLight,
    tabIconDefault: Theme.colors.tabInactive,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    tint: tintColorDark,
    tabIconDefault: Theme.colors.tabInactive,
    tabIconSelected: tintColorDark,
  },
};
