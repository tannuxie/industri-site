import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import { Helmet } from 'react-helmet';
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';
import '@reach/dialog/styles.css';
import Emoji from '~components/emoji';

// import { zeroRightClassName,fullWidthClassName, noScrollbarsClassName }
// from 'react-remove-scroll-bar';

class ImgBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoIndex: 0,
            isOpen: false,
            isMounted: false,
            images: [{}],
            undertext: '',
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggleRightScroll = this.toggleRightScroll.bind(this);
        this.getAspectRatioSum = this.getAspectRatioSum.bind(this);
    }

    componentDidMount() {
        console.log('Mounting...');
        console.log('mount state: ', this.state.images);
        const { images, undertext } = this.props;
        this.setState({ images, undertext });

        console.log('mount state: ', this.state.images);
        this.setState({ isMounted: true });
    }

    componentWillUnmount() {
        console.log('Unmounting...');

        this.setState({ isMounted: false });
    }

    getAspectRatioSum = () => {
        console.log('in getAspectRatio');

        const { images } = this.state;
        console.log('aspect images: ', images);
        console.log(typeof images);

        const aspectSum = images.map((currentImg) => (
        currentImg.bildfil.childImageSharp.fluid.aspectRatio))
        .reduce((accumulator, currentValue) => accumulator + currentValue);

        return aspectSum;
    }

    open = () => {
        this.setState({
            isOpen: true,
        });
        this.toggleRightScroll();
    };

    close = () => {
        this.setState({
            isOpen: false,
        });
        this.toggleRightScroll();
    };

    toggleRightScroll = () => {
        const element = document.getElementsByTagName('body')[0];
        element.classList.toggle('right-scroll-bar-position');
    };

    render() {
        console.log('in Render');
        const {
            isOpen, photoIndex, isMounted, images, undertext,
        } = this.state;
        // const { data, images, caption } = this.props;
        // const { selectImages } = this.getImages();
        // console.log('render selectImages', selectImages);
        // const { imageCaptions } = this.getImageCaptions();
        // const { aspectRatioSum } = this.getAspectRatioSum();
        // const subtitle = this.getSubtitle();

        return (
            <>
			{isMounted && images.length > 0 && (
                <>
                <div
                    css={css`
                        display: flex;
                        justify-content: center;
                        flex-direction: row;
                        flex-wrap: wrap;
                    `}
                >
                    {images.map((item, index) => {
                        const {
                            beskrivning, bildfil,
                        } = item;
                        return (
                            <div
                                role="button"
                                key={`${beskrivning}`}
                                tabIndex={0}
                                onClick={() => {
                                    this.open();
                                    this.setState({
                                    photoIndex: index,
                                });
                                }}
                                css={css`
                                    width: ${(bildfil.childImageSharp.fluid.aspectRatio / this.getAspectRatioSum()) * 100}%;
                                    :focus {
                                        outline: none;
                                    }
                                `}
                                onKeyDown={(event) => {
                                    if (event.keycode === 13) {
                                        this.open();
                                        this.setState({
                                            photoIndex: index,
                                        });
                                    }
                                }}
                            >
                                <Img
                                    fluid={bildfil.childImageSharp.fluid}
                                    alt={beskrivning}
                                    imgStyle={{ objectFit: 'contain' }}
                                />


                            </div>
                        );
                    })}
                    {undertext.length > 0 && (
                        <p
                            css={css`
                                font-style: italic;
                                text-align: center;
                                width: 100%;
                                margin-bottom: 0;
                            `}
                        >
                            {undertext}
                        </p>
                    )}

                    {isOpen && (
                        <DialogOverlay
                            css={css`
                                z-index: 9999;
                                display: flex;
                                align-items: center;
                            `}
                            isOpen={isOpen}
                            onDismiss={this.close}
                            onClick={() => this.open}
                        >
                            <DialogContent
                                css={css`
                                    position: relative;
                                    margin: 2vh auto 0;
                                    padding: 15px;
                                    width: 70vw;
                                    @media (max-width: 1680px) {
                                        width: 90vw;
                                    }
                                    @media (max-width: 769px) {
                                        width: 100%;
                                        margin: 0;
                                        padding: 0;
                                    }
                                `}
                                aria-label={images[photoIndex].beskrivning}
                            >
                                <Img
                                    fluid={images[photoIndex]
                                        .bildfil.childImageSharp.fluid}
                                    alt={images[photoIndex].beskrivning}
                                    style={{ maxHeight: '80vh' }}
                                />
                                <div
                                    css={css`
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: stretch;
                                    `}
                                >
                                    <h2
                                        css={css`
                                            margin-top: 1.25rem;
                                            @media (max-width: 769px) {
                                                padding-left: 5px;
                                            }
                                        `}
                                    >
                                        {images[photoIndex].beskrivning}
                                    </h2>
                                    <button
                                        id="imgbox-close"
                                        css={css`
                                            margin-top: 0.5rem;
                                            padding: 0 5px;
                                            max-height: calc(35px + 1.25rem);
                                            color: transparent;
                                            text-shadow: 0 0 0 #4e4e4e;
                                            border-width: 0;
                                            background-color: transparent;
                                            @media (max-width: 769px) {
                                                top: auto;
                                                right: 5px;
                                                bottom: 0;
                                            }
                                        `}
                                        tabIndex={0}
                                        onClick={() => this.close()}
                                        onKeyDown={(event) => {
                                            if (event.keycode === 13) {
                                                this.close();
                                            }
                                        }}
                                    >
                                        <span
                                            css={css`
                                                height: 50px;
                                                width: 100%;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;

                                                :before {
                                                    content: 'x';
                                                    font-weight: 300;
                                                    font-family: Arial, sans-serif;
                                                    font-size: 3rem;
                                                    cursor: pointer;
                                                }
                                            `}
                                        />
                                    </button>
                                </div>
                            </DialogContent>
                        </DialogOverlay>
                    )}
                </div>
                </>
			)}
            </>
        );
    }
}

ImgBox.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        beskrivning: PropTypes.string,
        bildfil: PropTypes.objectOf(PropTypes.object),
    })).isRequired,
    undertext: PropTypes.string,
};

ImgBox.defaultProps = {
    undertext: '',
};

export default ImgBox;
