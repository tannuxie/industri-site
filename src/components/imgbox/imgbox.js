import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import { Helmet } from 'react-helmet';
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

    function getAspectRatioSum(imagesToSum) {
        console.log('in getAspectRatio');
        console.log('aspect images: ', imagesToSum);

        const aspectSum = imagesToSum.map((currentImg) => (
        currentImg.bildfil.childImageSharp.fluid.aspectRatio))
        .reduce((accumulator, currentValue) => accumulator + currentValue);

        return aspectSum;
    }

    function getContainerWidth() {
        const element = document.getElementById('image-container');
        console.log('getContainerWidth: ', element);

        if (element) {
            return element.getBoundingClientRect().width;
        }
        return 0;
    }

    function toggleRightScroll() {
        const element = document.getElementsByTagName('body')[0];
        element.classList.toggle('right-scroll-bar-position');
    }

    function openOverlay() {
        console.log('in openOverlay');
        setIsOpen(true);
        toggleRightScroll();
    }

    function closeOverlay() {
        console.log('in closeOverlay');
        setIsOpen(false);
        toggleRightScroll();
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
            newImagesArray.push([aspectSortedImages]);
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

        return newImagesArray;
    }, [images]);

    useEffect(() => {
        console.log('in UseEffect');
        console.log('chunkedImages', chunkedImages);

        setIsMounted(true);
        setImgBoxWidth(getContainerWidth());

        return () => {
            console.log('in UseEffect, unmounting');
            setIsMounted(false);
        };
    }, [chunkedImages]);

    return (isMounted && chunkedImages.length > 0) && (
        <div
            id="image-container"
            css={css`
                display: flex;
                justify-content: center;
                flex-direction: row;
                flex-wrap: wrap;
            `}
        >
            {chunkedImages.map((chunk, index) => {
                const chunkIndex = index;
                return chunk.map((item, index) => {
                    const {
                        beskrivning, bildfil,
                    } = item;
                    return (
                        <div
                            role="button"
                            key={`${beskrivning}`}
                            tabIndex={0}
                            onClick={() => {
                                console.log('chunk', (chunkIndex * 2) + index);
                                console.log('chunk data', chunk);
                                console.log('all chunks', chunkedImages);
                                // console.log('test1', chunkedImages[1][0]);
                                // console.log('test2', chunkedImages[1]['0']);
                                // console.log('test1', chunkedImages[0][0].beskrivning);
                                // console.log('test2', chunkedImages[0][1].beskrivning);
                                // console.log('test3', chunkedImages[1][0].beskrivning);
                                // console.log('test4', chunkedImages[1][1].beskrivning);
                                console.log('test5', chunkedImages[Math.floor(((chunkIndex * 2) + index) / 2)][((chunkIndex * 2) + index) % 2].beskrivning);

                                openOverlay();
                                setPhotoIndex((chunkIndex * 2) + index);
                            }}
                            css={css`
                                width: ${(bildfil.childImageSharp.fluid.aspectRatio / getAspectRatioSum(chunk)) * 100}%;
                            `}
                            onKeyDown={(event) => {
                                if (event.keycode === 13) {
                                    openOverlay();
                                    setPhotoIndex((chunkIndex * 2) + index);
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
                    `}
                    isOpen={isOpen}
                    onDismiss={() => closeOverlay()}
                    onClick={() => openOverlay()}
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
                        aria-label={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
                    >
                        <Img
                            fluid={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2]
                                .bildfil.childImageSharp.fluid}
                            alt={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
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
                                        top: auto;
                                        right: 5px;
                                        bottom: 0;
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
