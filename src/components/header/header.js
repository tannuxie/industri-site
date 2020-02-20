import React, { Component } from 'react';
// import '~style/style.scss';
import Navbar from '../navbar/navbar';
import { css } from '@emotion/core';
import { StaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import styled from '@emotion/styled';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
        };
        this.headerRef = React.createRef();
        this.getElem = this.getElem.bind(this);
    }

    componentDidMount() {
        this.setState({
            isMounted: true,
        });
    }

    getElem() {
        return this.headerRef;
    }

    render() {
        // console.log('props', this.props);

        const { isMounted } = this.state;
        const imageData = this.props.data.file.childImageSharp.fluid;

        return (
            <BackgroundImage
                id="header-container"
                Tag="section"
                preserveStackingContext
                className="hero"
                css={css`
                    width: 100%;
                    height: 100%;
                    background-position: bottom center;
                    background-repeat: repeat-y;
                    background-size: cover;
                `}
                fluid={imageData}
                backgroundColor="#040e18"
            >
                <div
                    ref={this.headerRef}
                    className="hero-body"
                >
                    <div className="container center">
                        <article className="media">
                            <div className="media-content">
                                <div
                                    css={css`
                                        display: flex;
                                        justify-content: center;
                                        flex-direction: column;
                                        align-items: center;
                                    `}
                                >
                                    <h3
                                        id="header1"
                                        className="is-size-2"
                                        css={css`
                                            font-size: 2rem;
                                            background-color: #ffffffde;
                                            padding: 5px;
                                            box-shadow: 0px 0px 2px 0px #0000004d;
                                        `}
                                    >
                                        Sävsjö kommuns
                                    </h3>
                                    <h1
                                        id="header2"
                                        className="is-size-1"
                                        css={css`
                                            font-size: 3rem;
                                            background-color: #ffffffde;
                                            padding: 5px;
                                            box-shadow: 0px 0px 2px 0px #0000004d;
                                        `}
                                    >
                                        Industrihistoria
                                    </h1>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
                {isMounted && (
                    <Navbar
                        getParentElem={this.getElem}
                    />
                )}
            </BackgroundImage>
        );
    }
}

export default (props) => (
    <StaticQuery
		query={graphql`
            query HeaderQuery {
                file(name: {eq: "omslagsbild"}) {
                    id
                    name
                    childImageSharp {
                        fluid(quality: 90, maxWidth: 1920) {
                            aspectRatio
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
		`}
		render={(data) => (
            <Header data={data} {...props} />
        )}
    />
);
