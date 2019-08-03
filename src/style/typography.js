import Typography from "typography";
import twintheme from 'typography-theme-twin-peaks';
twintheme.overrideThemeStyles = ({ rhythm }, options, styles) => ({
    'a': {
        color: '#4a4a4a',
        textShadow: 'none',
        backgroundImage: 'none'
    }
  })

const typography = new Typography(twintheme);

export default typography;
export const rhythm = typography.rhythm
export const scale = typography.scale