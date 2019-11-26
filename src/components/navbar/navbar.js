import React, { Component } from 'react'
//import '~style/style.scss';
import { css } from "@emotion/core"
import { Link } from 'gatsby'
import { StaticQuery, graphql } from 'gatsby'
import { Helmet } from 'react-helmet';
import Emoji from '~components/emoji'

class Navbar extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
			showMenu: false,
			fixMenu: false,
			sizeUpMode: false,
		}
		this.buttonRef = React.createRef()
		this.menuRef = React.createRef()
		this.toggleMenu = this.toggleMenu.bind(this)
		this.toggleSize = this.toggleSize.bind(this)
		this.getParentRef = this.getParentRef.bind(this)
	}

	getParentRef = () => {
		const elem = this.props.getParentElem()
		return elem.current.clientHeight
	}

	componentDidMount() {
		window.addEventListener('scroll', this.listenToScroll)
	}
	  
	componentWillUnmount() {
		window.removeEventListener('scroll', this.listenToScroll)
	}
	  
	listenToScroll = () => {
		const winScroll =
		  document.body.scrollTop || document.documentElement.scrollTop
		
		if (this.state.fixMenu == false && 
			winScroll > (this.getParentRef() - this.menuRef.current.clientHeight)
		) {
			this.setState({
				fixMenu: true,
			  })
		} 

		if (
			this.state.fixMenu == true && 
			winScroll < (this.getParentRef())
		) {
			this.setState({
				fixMenu: false,
			  })
		}
	}

	toggleMenu() {
		this.setState(state => ({
			showMenu: !state.showMenu
		}))
	}

	toggleSize() {
		this.setState(state => ({
			sizeUpMode: !state.sizeUpMode
		}))
	}

	render() {		
		return (
			<>
			<Helmet>
				 <body className={this.state.fixMenu && this.state.sizeUpMode ? "has-navbar-fixed-top sizeUp" : this.state.fixMenu ? "has-navbar-fixed-top" : this.state.sizeUpMode ? "sizeUp" : ''} />
			</Helmet>
			<div className="hero-foot is-hidden-mobile">
				<nav className={this.state.fixMenu ? "navbar navbarFixed" : "navbar"} role="navigation" aria-label="main navigation"
				css={css`
					justify-content: center;
				`}
				>
					<div className="navbar-brand">
						<a id="navButton" ref={this.buttonRef} onClick={this.toggleMenu} role="button" className="navbar-burger burger" data-target="navMenu" aria-label="menu" aria-expanded="false">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>

					<div id="navMenu" ref={this.menuRef} className={this.state.showMenu ? "navbar-menu is-active" : "navbar-menu"}
						css={css`
							flex-grow: 0;
						`}
					>
						<div className="navbar-start">
							{this.props.data.site.siteMetadata.menuLinks.map((item, index) => {
								return (
									<Link key={index} className="navbar-item"
									to={item.link}
									>
									{item.name}
									</Link>
								)
							})}
							<a 
								id={"sizeButton"}
								className="navbar-item"
								role="button"
								onClick={this.toggleSize}
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
									<Emoji size={1} label={'small-a'} emoji={`🇦`} />
								</span>
								<span 
									css={css` display: flex;
    									height: 2rem;
										align-items: center;
									`}
								>
									<Emoji size={2} label={'big-a'} emoji={`🇦`} />
								</span>
							</a>
						</div>

						<div className="navbar-end">		
						</div>
					</div>
				</nav>
			</div>
			</>
		)
	}
}

export default props => (
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
		render={data => (
			<Navbar data={data} {...props} />
	  	)}
	/>
)