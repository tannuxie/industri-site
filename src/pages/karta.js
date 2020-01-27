import React, { useEffect, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import '~style/slider.css';

const KartSida = () => {
    const data = useStaticQuery(graphql`
        query AddressQuery {
            allStrapiCompany {
                edges {
                    node {
                        id
                        strapiId
                        name
                        city
                        type
                        fields {
                            slug
                        }
                        address {
                            addresstext1
                            addresstext2
                            enddate(formatString: "YYYY")
                            id
                            latitude
                            longitude
                            startdate(formatString: "YYYY")
                        }
                    }
                }
            }
        }
    `);
    const addressData = data.allStrapiCompany.edges.map((item) => item.node);
    console.log('addressData', addressData);

    const withMinMaxData = React.useMemo(() => addressData.map((item) => {
        const current = item;
        const currStart = current.address.map((addr) => Number(addr.startdate));
        console.log('currStart', currStart, 'min', Math.min(...currStart));
        current.min = Math.min(...currStart);

        const currEnd = current.address.map((addr) => Number(addr.enddate));
        console.log('currEnd', currEnd, 'max', Math.max(...currEnd));

        current.max = (currEnd.includes(0))
        ? null : Math.max(...currEnd);
        const address = item.address.map((item2) => {
            const currAddr = item2;
            currAddr.name = item.name;
            currAddr.city = item.city;
            currAddr.type = item.type;
            currAddr.slug = item.fields.slug;
            currAddr.startdate = Number(item2.startdate);
            currAddr.enddate = Number(item2.enddate);
            return currAddr;
        });
        current.address = address;
        return current;
    }), []);
    console.log('withMinMaxData', withMinMaxData);

    const currentCity = null;
    const currentType = null;

    const filteredCompanies = React.useMemo(() => (
    withMinMaxData.filter((item) => ((currentCity) ? item.city === currentCity : item))
        .filter((item) => ((currentType) ? item.type === currentType : item))
    ), [withMinMaxData, currentCity, currentType]);
    console.log('filteredCompanies', filteredCompanies);

    function findLowest() {
        const minValues = filteredCompanies.map((item) => item.min);
        return Math.min(...minValues);
    }

    function findHighest() {
        const maxValues = filteredCompanies.map((item) => item.max);

        if (maxValues.includes(null)) {
            const now = new Date();
            return now.getFullYear();
        }
        const result = Math.max(...maxValues);
        return result;
    }

    // const minVals = filteredCompanies.map((item) => item.min);
    console.log('lowest', findLowest());
    console.log('highest', findHighest());

    const [lowerMax, setLowerMax] = useState(0);
    const [upperMax, setUpperMax] = useState(0);


    useEffect(() => {
        if (lowerMax === 0) {
            setLowerMax(findLowest());
        }
        if (upperMax === 0) {
            setUpperMax(findHighest());
        }
    }, [lowerMax, upperMax]);

    const { createSliderWithTooltip } = Slider;
    const Range = createSliderWithTooltip(Slider.Range);
    const ToolTipp = (
        <Tooltip placement="left" trigger={['click']} overlay={<span>tooltip</span>}>
        <a href="#">hover</a>
        </Tooltip>
    );

    return (
        <section className="section">
            <div className="columns is-centered">
                <div className="column is-6 is-centered">
                    <Range
                        min={lowerMax}
                        max={upperMax}
                        defaultValue={[lowerMax, upperMax]}
                        tipFormatter={(value) => `${value}`}
                        onChange={((e) => {

                        })}
                        // onAfterChange={((e) => {
                        //     console.log(e);
                        //     setSlider1(e[0]);
                        //     setSlider2(e[1]);
                        // })}
                    />

                    <div
                        id="kartaInfo"
                        css={css`
                            display: flex;
                            justify-content: space-between;
                        `}
                    >
                        <span id="lowerMax">{lowerMax}</span>
                        <span id="upperMax">{upperMax}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KartSida;
