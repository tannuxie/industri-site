import React from 'react';
import MdxRender from '~components/mdxrender/mdxrender';
import ImgBox from '~components/imgbox/imgbox';
import MyMap from '~components/map/map';

const ZoneParser = (content) => {
    console.log('ZoneParser content: ', content);

    const theContent = content.content;
    const theChildMdx = content.childMdx;

    // console.log('theContent', theContent);
    // console.log('theChildMdx', theChildMdx);

    let currentMdx = 0;

    const contentWithMdx = theContent.map((item) => {
        const current = item;
        console.log('before contentWithMdx', current);

        // textfield = vanlig textkolumn
        if (current.textfield) {
            current.textfield = theChildMdx[currentMdx].body;
            currentMdx += 1;
        }
        // text = 2col texttext/textimg
        if (current.text) {
            current.text.textfield = theChildMdx[currentMdx].body;
            currentMdx += 1;
        }
        if (current.text_vanster) {
            current.text_vanster.textfield = theChildMdx[currentMdx].body;
            currentMdx += 1;
        }
        if (current.text_hoger) {
            current.text_hoger.textfield = theChildMdx[currentMdx].body;
            currentMdx += 1;
        }
        return current;
    });
    // console.log('contentWithMdx', contentWithMdx);

    return contentWithMdx.map((item, index) => {
        console.log('after contentwithMdx', index, item);
        let key = '';
        const result = (() => {
            if (item.textfield) {
                key = item.textfield;
                 return (
                     <div className='columns is-centered'>
                        <div className='column is-half'>
                            <MdxRender mdxBody={item.textfield} />
                        </div>
                     </div>
                 );
            }
            if (item.bild) {
                key = item.bild[0].beskrivning;
                const bildboxSizeClass = (() => {
                    const sizeTypes = {
                        '1': 'is-12',
                        '2/3': 'is-8',
                        '1/2': 'is-6',
                        '1/3': 'is-4',
                        '1/4': 'is-3',
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
                        '2/3': 'is-8',
                        '1/2': 'is-6',
                        '1/3': 'is-4',
                        '1/4': 'is-3',
                        undefined: 'is-6',
                    };
                    return sizeTypes[item.bredd_bildbox];
                })();
                return (
                    <div className="columns is-centered is-vcentered">
                        <div className={item.layout !== 'bild_hoger' ? (`column ${ imgboxSizeClass}`) : 'column'}>
                            {item.layout === 'bild_hoger' ? <MdxRender mdxBody={item.text.textfield} />
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
                            ) : (<MdxRender mdxBody={item.text.textfield} />)}
                        </div>
                    </div>
                );
            }
            if (item.text_vanster && item.text_hoger) {
                key = item.text_vanster.textfield;
                return (
                    <div className="columns is-8 is-variable is-vcentered">
                        <div className="column">
                            <MdxRender mdxBody={item.text_vanster.textfield} />
                        </div>
                        <div className="column">
                            <MdxRender mdxBody={item.text_hoger.textfield} />
                        </div>
                    </div>
                );
            }
            if (item.longitude) {
                key = item.undertext;
                const pins = item.map_pin.map((pin) => ({
                        name: pin.beskrivning,
                        position: [pin.latitude, pin.longitude],
                    }));

                return (
                    <div className='columns is-centered'>
                        <MyMap
                            address={[item.latitude, item.longitude]}
                            undertext={item.undertext}
                            pins={pins}
                        />
                    </div>
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
