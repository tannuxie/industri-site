import React from 'react';

export default (props) => {
	const { size, label, emoji } = props;
	const styles = {
		fontSize: `${size}rem`,
	};

	return (
		<span
			id={`emoji-${label}`}
			style={styles}
			className="emoji"
			role="img"
			aria-label={label || ''}
			aria-hidden={label ? 'false' : 'true'}
		>
			{emoji}
		</span>
	);
};
