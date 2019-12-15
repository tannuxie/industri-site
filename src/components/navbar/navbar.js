import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import '~style/style.scss';
import { css } from '@emotion/core';
import { Link, StaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import Emoji from '~components/emoji';
import ContextConsumer from '../../context/context';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.menuRef = React.createRef(this.menuRef);
        this.getParentHeight = this.getParentHeight.bind(this);
        this.listenToScroll = this.listenToScroll.bind(this);
        this.getParentElem = this.props.getParentElem.bind(this);

        this.state = {
            showMenu: false,
            fixMenu: false,
            headerHeight: 0,
        };
    }

    // provar med att försöka binda getparentelem vid mount...? kanske kan placera i render?
    componentDidMount() {
        console.log('Navbar creating...');
        // console.log(this.context);
        // const elem = this.getParentElem;
        // här måste man setta headerHeight-staten...
        this.setState({ headerHeight: this.getParentElem().current.clientHeight });
        // this.getParentElem = this.props.getParentElem.bind(this);
        window.addEventListener('scroll', this.listenToScroll);
        console.log('Navbar created');
    }

    componentWillUnmount() {
        console.log('Navbar cleaning up...');
        window.removeEventListener('scroll', this.listenToScroll);
        console.log('Navbar cleaned up');
    }

    getParentHeight() {
        // const { getParentElem } = this.props;
        const elem = this.getParentElem;
        console.log('Elem is: ');
        console.log(elem);
        console.log(elem.current);
        return elem().current.clientHeight;
    }

    listenToScroll() {
        // plocka in state för fixMenu och headerHeight här...
        const { fixMenu } = this.state;
        const { headerHeight } = this.state;

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        console.log(`scrolled: ${winScroll}`);
        console.log(`menuRef: ${this.menuRef.current.clientHeight}`);
        console.log(this.getParentElem().current.clientHeight);
        if (fixMenu === false
            && winScroll > (headerHeight - this.menuRef.current.clientHeight + 1)
        ) {
            this.setState({ fixMenu: true });
            // console.log('setting fixMenu: true');
        } else if (fixMenu === true
            && winScroll < headerHeight
        ) {
            this.setState({ fixMenu: false });
            // console.log('setting fixMenu: false');
        }
    }

    render() {
        const { data } = this.props;
        const { fixMenu, showMenu } = this.state;

        return (
            <ContextConsumer>
                {({ store, set }) => (
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
                                            this.setState({ showMenu: !showMenu });
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
                                            console.log(store.size);
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.keycode === 13) {
                                                console.log(store.size);
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
                )}
            </ContextConsumer>
        );
    }
}

// Navbar.contextType = ContextConsumer;

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
