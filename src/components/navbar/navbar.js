import React, { useContext, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import '~style/style.scss';
import { css } from '@emotion/core';
import { Link, StaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import Emoji from '~components/emoji';
import { GlobalDispatchContext, GlobalStateContext } from '../../context/GlobalContextProvider';

const Navbar = ({ data, getParentElem }) => {
	const dispatch = useContext(GlobalDispatchContext);
	const state = useContext(GlobalStateContext);
	console.log(dispatch);
	console.log(state);

	// Menuref, to be able to get height of menu
	const menuRef = useRef();

	// State
	const [showMenu, setShowMenu] = useState(false);
	const [fixMenu, setFixMenu] = useState(false);

	// 	sizeUpMode: false,

	// this.buttonRef = React.createRef();
	// this.menuRef = React.createRef();
	// this.toggleMenu = this.toggleMenu.bind(this);
	// this.toggleSize = this.toggleSize.bind(this);
	// this.getParentRef = this.getParentRef.bind(this);

	const addListen = () => {
		window.addEventListener('scroll', this.listenToScroll);
	};

	const removeListen = () => {
		window.removeEventListener('scroll', this.listenToScroll);
	};


	const getParentRefHeight = () => {
		const elem = getParentElem();
		return elem.current.clientHeight;
	};

	// const getMenuHeight = () => {
	// 	useEffect(() => { return menuRef.current.clientHeight;
	// 	}
	// 	)
	// }

	const listenToScroll = () => {
		const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
		if (fixMenu === false
			&& winScroll > (getParentRefHeight() - menuRef.current.clientHeight)) {
			setFixMenu(true);
		}

		if (
			fixMenu === true
			&& winScroll < (this.getParentRef())
		) {
			setFixMenu(false);
		}
	};

	const toggleMenu = () => {
		setShowMenu(!showMenu);
	};

	// const toggleSize = () => {
	// 	sizeUpMode.setState(!sizeUpMode);
	// };

	// const { fixMenu, sizeUpMode, showMenu } = this.state;
	// const { data } = this.props;

	const bodyClass = () => {
		if (fixMenu && state.size) {
			return 'has-navbar-fixed-top sizeUp';
		}
		if (fixMenu) {
			return 'has-navbar-fixed-top'; // else if
		}
		if (state.size) {
			return 'sizeUp'; // else if
		}
		return '';
	};

	return (
		<>
			<Helmet>
				<body className={bodyClass()} />
			</Helmet>
			<div className="hero-foot is-hidden-mobile">
				<nav
					className={fixMenu ? 'navbar navbarFixed' : 'navbar'}
					role="navigation"
					aria-label="main navigation"
					css={css`
					justify-content: center;
					`}
				>
					<div className="navbar-brand">
					<button
						id="navButton"
						// ref={this.buttonRef}
						onClick={toggleMenu()}
						onKeyDown={(event) => { if (event.keycode === 13) toggleMenu(); }}
						className="navbar-burger burger"
						data-target="navMenu"
						aria-label="menu"
						aria-expanded="false"
						tabIndex={0}
					>
						<span aria-hidden="true" />
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</button>
					</div>

					<div
					id="navMenu"
					ref={menuRef}
					className={showMenu ? 'navbar-menu is-active' : 'navbar-menu'}
					css={css`
						flex-grow: 0;
					`}
					>
						<div className="navbar-start">
							{data.site.siteMetadata.menuLinks.map((item, index) => (
								<Link
								key={item.name}
								className="navbar-item"
								to={item.link}
								>
								{item.name}
								</Link>
							))}
							<button
							id="sizeButton"
							className="navbar-item"
							onClick={() => {
								dispatch({ type: 'TOGGLE_SIZE' });
							}}
							css={css`
							color: transparent;
							text-shadow: 0 0 0 #4e4e4e;
							display: flex;
							align-items: flex-start;
							`}
							>
							<span
								css={css`display: flex;
									height: 2rem;
									align-items: center;
								`}
							>
								<Emoji size={1} label="small-a" emoji="🇦" />
							</span>
							<span
								css={css` display: flex;
								height: 2rem;
								align-items: center;
								`}
							>
								<Emoji size={2} label="big-a" emoji="🇦" />
							</span>
							</button>
						</div>

						<div className="navbar-end" />
					</div>
				</nav>
			</div>
		</>
	);
};

Navbar.propTypes = {
	data: PropTypes.object.isRequired,
	getParentElem: PropTypes.func.isRequired,
};

export default () => (
	<StaticQuery
		query={graphql`
			query SiteMetaQuery {
				site {
					siteMetadata {
						title
						menuLinks {
							name
							link
						}
					}
				}
			}
		`}
		render={(data, props) => (
			<Navbar data={data} {...props} />
		)}
	/>
);
