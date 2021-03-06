import Typography from 'typography';
import twintheme from 'typography-theme-twin-peaks';

twintheme.overrideThemeStyles = ({ rhythm }, options, styles) => ({
    body: {
        overflowX: 'hidden',
    },
    select: {
        color: 'inherit',
        backgroundColor: 'inherit',
    },
    a: {
		color: 'inherit',
		textShadow: 'none',
        backgroundImage: 'none',
        textDecoration: 'underline',
    },
    'a:hover, a:focus': {
        color: '#25347f',
    },
    ':focus': {
        outline: 'none',
    },
});

const typography = new Typography(twintheme);

// Hot reload typography in development
if (process.env.NODE_ENV !== 'production') {
	typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm();
export const scale = typography.scale();
