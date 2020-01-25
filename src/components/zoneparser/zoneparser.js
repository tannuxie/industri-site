import React from 'react';
import { css } from '@emotion/core';
import MdxRender from '~components/mdxrender/mdxrender';
import ImgBox from '~components/imgbox/imgbox';
import MyMap from '~components/map/map';
import CompanyHighlight from '~components/companyhighlight/companyhighlight';

const ZoneParser = ({
    content,
    childMdx,
    mainimage,
    layout = 'fullbredd',
}) => {
    console.log('ZoneParser content: ', content);
    console.log('ZoneParser childMdx: ', childMdx);
    console.log('ZoneParser source: ', layout);

    // layouts:

    let currentMdx = 0;

    const contentWithMdx = content.map((item) => {
        const current = item;
        console.log('before contentWithMdx', current);

        // textfield = vanlig textkolumn
        // if (current.textfield) {
        //     current.textfield = childMdx[currentMdx].body;
        //     currentMdx += 1;
        // }
        // text = 2col texttext/textimg
        if (current.text) {
            current.text.textfield = childMdx[currentMdx].body;
            currentMdx += 1;
        }
        if (current.text_vanster) {
            current.text_vanster.textfield = childMdx[currentMdx].body;
            currentMdx += 1;
        }
        if (current.text_hoger) {
            current.text_hoger.textfield = childMdx[currentMdx].body;
            currentMdx += 1;
        }
        return current;
    });
    // console.log('contentWithMdx', contentWithMdx);

    return contentWithMdx.map((item, index) => {
        console.log('after contentwithMdx', index, item);
        let key = '';
        const result = (() => {
            if (item.text && !item.imgbox && !item.karta) {
                key = item.text.textfield;
                 return (
                     <div
                        className='columns'
                        css={css`
                            ${item.layout === 'center' && 'justify-content: center;'}
                            ${item.layout === 'vanster' && 'justify-content: flex-start;'}
                            ${item.layout === 'hoger' && 'justify-content: flex-end;'}
                        `}
                     >
                        <div
                            className={`zone-text column ${item.size
                                === 'fullbredd' ? 'is-12'
                                : item.size === 'tva_tredjedelar' ? 'is-8'
                                : item.size === 'halv' ? 'is-6'
                                : item.size === 'en_tredjedel' ? 'is-4'
                                : item.size === 'en_fjardedel' ? 'is-3'
                                : 'is-6'
                            }`}
                        >
                            <MdxRender mdxBody={item.text.textfield} />
                        </div>
                     </div>
                 );
            }
            if (item.bild) {
                key = `${item.bild[0].beskrivning} + ${item.bild[0].bildfil.childImageSharp.fluid.aspectRatio}`;
                const bildboxSizeClass = (() => {
                    const sizeTypes = {
                        fullbredd: 'is-12',
                        tva_tredjedelar: 'is-8',
                        halv: 'is-6',
                        en_tredjedel: 'is-4',
                        en_fjardedel: 'is-3',
                        undefined: 'is-12',
                    };
                    return sizeTypes[item.width];
                })();
                return (
                    <div className='columns is-centered'>
                        <div className={`column ${bildboxSizeClass}`}>
                            <ImgBox
                                images={item.bild}
                                undertext={item.undertext}
                            />
                        </div>
                    </div>
                );
            }
            if (item.text && item.imgbox) {
                key = item.text.textfield;
                const imgboxSizeClass = (() => {
                    const sizeTypes = {
                        tva_tredjedelar: 'is-8',
                        halv: 'is-6',
                        en_tredjedel: 'is-4',
                        en_fjardedel: 'is-3',
                        undefined: 'is-6',
                    };
                    return sizeTypes[item.bredd_bildbox];
                })();
                return (
                    <div className="columns is-centered is-vcentered">
                        <div className={item.layout !== 'bild_hoger' ? (`column ${ imgboxSizeClass}`) : 'column'}>
                            {item.layout === 'bild_hoger' ? (
                                <div className='zone-text' css={css`@media (max-width: 1023px) {padding: 0 0.5rem;}`}>
                                    <MdxRender mdxBody={item.text.textfield} />
                                </div>
                            )
                            : (
                            <ImgBox
                                images={item.imgbox}
                                undertext={item.undertext_bildbox && item.undertext_bildbox}
                            />
                            )}
                        </div>
                        <div className={item.layout === 'bild_hoger' ? (`column ${ imgboxSizeClass}`) : 'column'}>
                            {item.layout === 'bild_hoger' ? (
                            <ImgBox
                                images={item.imgbox}
                                undertext={item.undertext_bildbox && item.undertext_bildbox}
                            />
                            ) : (
                                <div className='zone-text' css={css`@media (max-width: 1023px) {padding: 0 0.5rem;}`}>
                                    <MdxRender mdxBody={item.text.textfield} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
            if (item.text && item.karta) {
                key = item.text.textfield;
                const kartaSizeClass = (() => {
                    const sizeTypes = {
                        tva_tredjedelar: 'is-8',
                        halv: 'is-6',
                        en_tredjedel: 'is-4',
                        en_fjardedel: 'is-3',
                        undefined: 'is-6',
                    };
                    return sizeTypes[item.bredd_karta];
                })();
                const pins = item.karta.map_pins.map((pin) => ({
                    name: pin.beskrivning,
                    position: [pin.latitude, pin.longitude],
                }));
                return (
                    <div className="columns is-centered is-vcentered">
                        <div className={item.layout !== 'karta_hoger' ? (`column ${ kartaSizeClass}`) : 'column'}>
                            {item.layout === 'karta_hoger' ? (
                                <div
                                    className='zone-text'
                                    css={css`@media (max-width: 1023px) {padding: 0 0.5rem;}`}
                                >
                                    <MdxRender mdxBody={item.text.textfield} />
                                </div>
                            )
                            : (
                                <MyMap
                                    address={[item.karta.latitude, item.karta.longitude]}
                                    undertext={item.karta.undertext}
                                    pins={pins}
                                />
                            )}
                        </div>
                        <div className={item.layout === 'karta_hoger' ? (`column ${ kartaSizeClass}`) : 'column'}>
                            {item.layout === 'karta_hoger' ? (
                                <MyMap
                                    address={[item.karta.latitude, item.karta.longitude]}
                                    undertext={item.karta.undertext}
                                    pins={pins}
                                />
                            ) : (
                                <div
                                    className='zone-text'
                                    css={css`@media (max-width: 1023px) {padding: 0 0.5rem;}`}
                                >
                                    <MdxRender mdxBody={item.text.textfield} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
            if (item.text_vanster && item.text_hoger) {
                key = item.text_vanster.textfield;
                return (
                    <div className="columns is-6 is-variable is-vcentered">
                        <div className="zone-text column">
                            <MdxRender mdxBody={item.text_vanster.textfield} />
                        </div>
                        <div className="zone-text column">
                            <MdxRender mdxBody={item.text_hoger.textfield} />
                        </div>
                    </div>
                );
            }
            if (item.longitude) {
                key = item.undertext;
                const pins = item.map_pins.map((pin) => ({
                        name: pin.beskrivning,
                        position: [pin.latitude, pin.longitude],
                    }));

                return (
                    <div className='columns is-centered'>
                        <div className="column">
                            <MyMap
                                address={[item.latitude, item.longitude]}
                                undertext={item.undertext}
                                pins={pins}
                            />
                        </div>
                    </div>
                );
            }
            if (item.filter) {
                key = `${item.id } ${ item.filter}`;
                return (
                    <>
                        <div className='columns'>
                            <div
                                className='column is-12'
                            >
                                <h2
                                    css={css`
                                        font-style: italic;
                                        padding: 0 0.5rem;
                                    `}
                                >
                                    Här kommer ett urval ur våra berättelser...
                                </h2>
                            </div>
                        </div>

                        <div className='columns'>
                            <CompanyHighlight filtering={item.filter} />
                        </div>
                    </>
                );
            }
        })();

        return (result) && (
            <section className='section' key={`${key}`}>
                {result}
            </section>
        );
    });
};

export default ZoneParser;
