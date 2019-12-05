import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import '~style/style.scss';
import { css } from '@emotion/core';
import { Link, StaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import Emoji from '~components/emoji';
import GlobalContextProvider, { GlobalDispatchContext, GlobalStateContext } from '../../context/GlobalContextProvider';

// const addScrollWatcher = () => {
//     return null;
// };

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
            fixMenu: false,
        };

        // this.menuRef = this.menuRef.bind(this);
        this.menuRef = React.createRef(this.menuRef);
        // this.headerRef = this.headerRef.bind(this);
        this.getParentRefHeight = this.getParentRefHeight.bind(this);
        this.listenToScroll = this.listenToScroll.bind(this);
    }

    // provar med att försöka binda getparentelem vid mount...? kanske kan placera i render?
    componentDidMount() {
        console.log('Navbar creating...');
        this.getParentElem = this.props.getParentElem.bind(this);
        // const addListen = () => {
        // test = true;
        // console.log(headerHeight);
        window.addEventListener('scroll', this.listenToScroll, false);
        console.log('Navbar created');
    }

    componentWillUnmount() {
        console.log('Navbar cleaning up...');
        // test = false;
        window.removeEventListener('scroll', this.listenToScroll, false);
        console.log('Navbar cleaned up');
    }

    getParentRefHeight() {
        const { getParentElem } = this.props;
        const elem = this.getParentElem;
        return elem().current.clientHeight;
    }

    listenToScroll = () => {
        const { fixMenu } = this.state;
        // console.log('in ListenToScroll');
        // console.log('Listen is logging getParentRefHeight...');
        // console.log(this.getParentRefHeight());
        // console.log('Listen is logging this.menuRef.current.clientHeight...');
        // console.log(this.menuRef.current.clientHeight);
        // console.log('Listen is moving on...');
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        // console.log('winScroll is...');
        // console.log(winScroll);
        if (fixMenu === false
            && winScroll > (this.getParentRefHeight() - this.menuRef.current.clientHeight)
        ) {
            this.setState({ fixMenu: true });
        }

        if (fixMenu === true
            && winScroll < (this.getParentRefHeight())
        ) {
            this.setState({ fixMenu: false });
        }
    }

    render() {
        const { showMenu, fixMenu } = this.state;
        const { data } = this.props;

        // function bodyClass() {
        //     // if (fixMenu && size) {
        //     //     return 'has-navbar-fixed-top sizeUp';
        //     // }
        //     if (fixMenu) {
        //         return 'has-navbar-fixed-top'; // else if
        //     }
        //     // if (size) {
        //     //     return 'sizeUp'; // else if
        //     // }
        //     return '';
        // }

        return (
            <>
                <Helmet>
                    <body className={fixMenu ? 'has-navbar-fixed-top' : ''} />
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
                                onClick={() => this.setState({ showMenu: !showMenu })}
                                onKeyDown={(event) => {
                                    if (event.keycode === 13) {
                                        this.setState({
                                            showMenu: !showMenu,
                                        });
                                    }
                                }}
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
                            ref={this.menuRef}
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
                                <a
                                    id="sizeButton"
                                    className="navbar-item"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        // dispatch({ type: 'TOGGLE_SIZE' });
                                        console.log('sizebutton clicked');
                                        console.log(this.context);
                                        this.context({
                                            type: 'TOGGLE_SIZE',
                                        });
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.keycode === 13) {
                                            console.log('sizebutton key down');
                                        }
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
                                </a>
                            </div>

                            <div className="navbar-end" />
                        </div>
                    </nav>
                </div>
            </>
        );
    }
}

Navbar.contextType = GlobalDispatchContext;

// Navbar.propTypes = {
//     data: PropTypes.object.isRequired,
//     getParentElem: PropTypes.func.isRequired,
// };

export default (props) => (
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
		render={(data) => (
			<Navbar data={data} {...props} />
		)}
	/>
);
