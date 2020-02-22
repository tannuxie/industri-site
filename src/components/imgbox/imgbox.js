import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import { Helmet } from 'react-helmet';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';
import '@reach/dialog/styles.css';
import _ from 'lodash';
import CompareValues, { compareValues } from '../functions';

// import { zeroRightClassName,fullWidthClassName, noScrollbarsClassName }
// from 'react-remove-scroll-bar';

const ImgBox = ({ images, undertext }) => {
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [imgBoxWidth, setImgBoxWidth] = useState(0);
    const overlayImageOverlay = useRef(null);

    function getAspectRatioSum(imagesToSum) {
        // console.log('in getAspectRatio');
        // console.log('aspect images: ', imagesToSum);

        const aspectSum = imagesToSum.map((currentImg) => (
        currentImg.bildfil.childImageSharp.fluid.aspectRatio))
        .reduce((accumulator, currentValue) => accumulator + currentValue);
        // console.log('aspectSum', aspectSum);

        return aspectSum;
    }

    function fadeImageOverlay(boolean) {
        setTimeout(() => {
            if (overlayImageOverlay.current !== null) {
                if (boolean) {
                    overlayImageOverlay.current.style.opacity = '1';
                } else {
                    overlayImageOverlay.current.style.opacity = '0';
                }
            }
        }, 5);
    }

    function openOverlay() {
        console.log('in openOverlay');
        setIsOpen(true);
        fadeImageOverlay(true);
    }

    function closeOverlay() {
        console.log('in closeOverlay');
        fadeImageOverlay(false);
        setTimeout(() => {
            setIsOpen(false);
        }, 500);
    }

    const chunkedImages = useMemo(() => {
        const aspectRatioImages = images.map(((item) => {
            const current = item;
            current.aspectRatio = item.bildfil.childImageSharp.fluid.aspectRatio;
            return current;
        }));
        console.log('aspectRatioImages', aspectRatioImages);
        // const aspectSortedImages = aspectRatioImages.sort(compareValues('aspectRatio', 'asc'));
        const aspectSortedImages = aspectRatioImages;
        console.log('aspectSortedImages', aspectSortedImages);

        const newImagesArray = [];
        if (aspectSortedImages.length === 1) {
            newImagesArray.push(aspectSortedImages);
        } else {
            let lastElement = null;
            if (aspectSortedImages.length % 2 !== 0) {
                lastElement = aspectSortedImages.pop();
            }
            for (let index = 0; index < aspectSortedImages.length / 2; index++) {
                const earlyElement = aspectSortedImages[index];
                const endElement = aspectSortedImages[aspectSortedImages.length - 1 - index];
                newImagesArray.push([earlyElement, endElement]);
            }
            if (lastElement) {
                newImagesArray.push([lastElement]);
            }
        }
        console.log('newImagesArray', newImagesArray);

        return newImagesArray;
    }, [images]);

    useEffect(() => {
        console.log('in UseEffect');
        console.log('chunkedImages', chunkedImages);

        setIsMounted(true);

        return () => {
            console.log('in UseEffect, unmounting');
            setIsMounted(false);
        };
    }, [chunkedImages]);

    return (isMounted && chunkedImages.length > 0) && (
        <div
            className="image-container"
            css={css`
                display: flex;
                justify-content: center;
                flex-direction: row;
                flex-wrap: wrap;

                ${chunkedImages.length > 1 && (`
                    @media (min-width: 1024px) {
                        .gatsby-image-wrapper {
                            max-height: 40vh;
                        }
                    }
                `)}
            `}
        >
            {chunkedImages.map((chunk, chunkIndex) => {
                // console.log('chunk nr', chunkIndex);
                // console.log('all chunks', chunkedImages);
                // console.log('chunk data', chunk);

                return chunk.map((item, imageIndex) => {
                    const {
                        id, beskrivning, bildfil,
                    } = item;
                    return (
                        <div
                            role="button"
                            key={`${id} ${beskrivning}`}
                            tabIndex={0}
                            onClick={() => {
                                console.log('chunk', (chunkIndex * 2) + imageIndex);
                                console.log('chunk data', chunk);
                                console.log('all chunks', chunkedImages);
                                console.log('test5', chunkedImages[Math.floor(((chunkIndex * 2) + imageIndex) / 2)][((chunkIndex * 2) + imageIndex) % 2].beskrivning);

                                openOverlay();
                                setPhotoIndex((chunkIndex * 2) + imageIndex);
                            }}
                            css={css`
                                width: ${(bildfil.childImageSharp.fluid.aspectRatio / getAspectRatioSum(chunk)) * 100}%;
                            `}
                            onKeyDown={(event) => {
                                if (event.keycode === 13) {
                                    openOverlay();
                                    setPhotoIndex((chunkIndex * 2) + imageIndex);
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
                });
            })}
            {undertext && undertext.length > 0 && (
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
                        opacity: 0;
                        transition: opacity 0.4s ease-out;
                    `}
                    ref={overlayImageOverlay}
                    isOpen={isOpen}
                    onDismiss={() => closeOverlay()}
                    onClick={() => openOverlay()}
                >
                    <DialogContent
                        css={css`
                            margin: 2vh auto 0;
                            padding: 15px;
                            width: 70vw;
                            min-height: 70vh;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            @media (max-width: 1680px) {
                                width: 90vw;
                            }
                            @media (max-width: 769px) {
                                width: 100%;
                                margin: 0;
                                padding: 0;
                            }
                            .react-transform-component {
                                align-self: center;
                            }
                            .gatsby-image-wrapper img {
                                object-fit: contain !important;
                            }
                        `}
                        aria-label={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
                    >
                        <TransformWrapper
                            defaultScale={1}
                            scale={1}
                            defaultPositionX={0}
                            defaultPositionY={0}
                            positionX={0}
                            positionY={0}
                            options={{
                                    limitToWrapper: true,
                            }}
                            scalePadding={{
                                    size: 0.2,
                            }}
                            pan={{
                                    velocitySensitivity: 0.5,
                                    velocity: false,
                            }}
                        >
                            {({
                                zoomIn, zoomOut, resetTransform, ...rest
                            }) => (
                                <>
                                    <div
                                        className='tools'
                                        css={css`
                                            position: absolute;
                                            top: 1.2rem;
                                            right: 1.2rem;
                                            z-index: 100;
                                            background-color: white;
                                            overflow: hidden;
                                            @media (max-width: 769px) {
                                                right: 10px;
                                                display: none;
                                            }
                                            button:not(:last-of-type) {
                                                margin-right: 0.5rem;
                                            }
                                            button {
                                                padding: 0 10px;
                                                vertical-align: middle;
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
                                                span {
                                                    height: 50px;
                                                    width: 100%;
                                                    display: flex;
                                                    align-items: center;
                                                    justify-content: center;

                                                    :before {
                                                        font-weight: 300;
                                                        font-family: Arial, sans-serif;
                                                        font-size: 3rem;
                                                        cursor: pointer;
                                                    }
                                                }
                                            }

                                            #imgbox-zoomin {
                                                span {
                                                    :before {
                                                        content: '+';
                                                    }
                                                }
                                            }
                                            #imgbox-zoomout {
                                                padding: 0 5px 12px;
                                                span {
                                                    :before {
                                                        content: '-';
                                                    }
                                                }
                                            }
                                            #imgbox-zoomreset {
                                                span {
                                                    :before {
                                                        content: '0';
                                                    }
                                                }
                                            }
                                        `}
                                    >
                                        <button
                                            id="imgbox-zoomin"
                                            tabIndex={0}
                                            onClick={zoomIn}
                                            onKeyDown={(event) => {
                                                if (event.keycode === 13) {
                                                    zoomIn();
                                                }
                                            }}
                                        >
                                            <span />
                                        </button>
                                        <button
                                            id="imgbox-zoomout"
                                            tabIndex={0}
                                            onClick={zoomOut}
                                            onKeyDown={(event) => {
                                                if (event.keycode === 13) {
                                                    zoomOut();
                                                }
                                            }}
                                        >
                                            <span />
                                        </button>
                                        <button
                                            id="imgbox-zoomreset"
                                            tabIndex={0}
                                            onClick={resetTransform}
                                            onKeyDown={(event) => {
                                                if (event.keycode === 13) {
                                                    resetTransform();
                                                }
                                            }}
                                        >
                                            <span />
                                        </button>
                                    </div>
                                    <TransformComponent>
                                        <Img
                                            fluid={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2]
                                                .bildfil.childImageSharp.fluid}
                                            alt={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
                                            css={css`
                                                min-width: 88vw;
                                                @media (max-width: 769px) {
                                                    min-width: 100vw;
                                                }
                                            `}
                                        />

                                    </TransformComponent>
                                </>
                            )}
                        </TransformWrapper>
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
                                    flex-grow: 1;
                                    text-align: center;
                                    @media (max-width: 769px) {
                                        padding-left: 10px;
                                    }
                                `}
                            >
                                {chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
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
                                        margin-right: 10px;
                                    }
                                `}
                                tabIndex={0}
                                onClick={() => closeOverlay()}
                                onKeyDown={(event) => {
                                    if (event.keycode === 13) {
                                        closeOverlay();
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
    );
};

ImgBox.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        beskrivning: PropTypes.string,
        bildfil: PropTypes.shape({
            childImageSharp: PropTypes.object,
            id: PropTypes.string,
        }),
        id: PropTypes.number,
    })).isRequired,
    undertext: PropTypes.string,
};

ImgBox.defaultProps = {
    undertext: '',
};

export default ImgBox;
