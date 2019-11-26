import React from 'react';

export default props => {
	const styles = {
		fontSize: props.size + 'rem'
	};

	return (
		<span 
			id={'emoji-' + props.label}
			style={styles} 
			className="emoji"
			role="img"
			aria-label={props.label ? props.label : ""}
			aria-hidden={props.label ? "false" : "true"}
		>
			{props.emoji}
		</span>
	);
};
