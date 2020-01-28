import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Slider from 'rc-slider';
import getDistance from 'geolib/es/getDistance';
import getCenterOfBounds from 'geolib/es/getCenterOfBounds';
import getBounds from 'geolib/es/getBounds';
import MyMap from '~components/map/map';
import '~style/slider.css';

// getDistance(start, end, accuracy = 1)
// By default the accuracy is 1 meter. If you need a more accurate result,
// you can set it to a lower value, e.g. to 0.01 for centimeter accuracy.
// You can set it higher to have the result rounded to the next value that
// is divisible by your chosen accuracy

// getCenter(coords)
// Calculates the geographical center of all points in a collection of geo
// coordinates. Takes an array of coordinates and calculates the center of it.

// getCenterOfBounds(coords)
// On polygons like political borders (eg. states), this may gives a
// closer result to human expectation, than getCenter, because that
// function can be disturbed by uneven distribution of point in different
// sides.

// getBounds(points)
// Calculates the bounds of geo coordinates.

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
        console.log('in withMinMaxData');
        const current = item;
        const now = new Date();

        const currStart = current.address.map((addr) => Number(addr.startdate));
        console.log('currStart', currStart, 'min', Math.min(...currStart));
        current.min = Math.min(...currStart);

        const currEnd = current.address.map((addr) => Number(addr.enddate));
        console.log('currEnd', currEnd, 'max', Math.max(...currEnd));

        current.max = (currEnd.includes(0))
        ? now.getFullYear() : Math.max(...currEnd);
        const address = item.address.map((item2) => {
            const currAddr = item2;
            currAddr.name = item.name;
            currAddr.city = item.city;
            currAddr.type = item.type;
            currAddr.slug = item.fields.slug;
            currAddr.startdate = Number(item2.startdate);
            currAddr.enddate = (!item2.enddate || item2.enddate === 0)
            ? now.getFullYear()
            : Number(item2.enddate);
            return currAddr;
        });
        current.address = address;
        return current;
    }), [data]);
    console.log('withMinMaxData', withMinMaxData);

    const [currentCity, setCurrentCity] = useState('');
    const [currentType, setCurrentType] = useState('');

    const [lowerMax, setLowerMax] = useState(0);
    const [upperMax, setUpperMax] = useState(0);
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);

    const filteredByCityType = useMemo(() => {
        console.log('in filteredByCityType');

        const result = withMinMaxData.filter((item) => (
        (currentCity) ? item.city === currentCity : item))
        .filter((item) => ((currentType) ? item.type === currentType : item));

        return result;
    }, [currentCity, currentType]);
    console.log('filteredByCityType', filteredByCityType);

    const filteredByRange = useMemo(() => {
        console.log('in filteredByRange');

        const result = filteredByCityType.filter((item) => (
            (value1 !== lowerMax || value2 !== upperMax)
            ? (item.max >= value1 && item.min <= value2)
            : item
        ))
        .map((item) => {
            const current = item;
            const newAddr = current.address.filter((item2) => (
                (value1 !== lowerMax || value2 !== upperMax)
                ? (item2.startdate <= value2 && item2.enddate >= value1)
                : item2
            ));
            current.address = newAddr;

            return current;
        });

        return result;
    }, [value1, value2]);
    console.log('filteredByRange', filteredByRange);

    const calcMidPoint = useMemo(() => {
        console.log('in calcMidPoint');
        const addresses = filteredByRange.map((item) => item.address).flat();
        console.log('addresses', addresses);
        const coordinates = addresses.map((item) => ({
                latitude: item.latitude,
                longitude: item.longitude,

        }));
        console.log('coordinates', coordinates);
        console.log('getCenterOfBounds', getCenterOfBounds(coordinates));
        console.log('getBounds', getBounds(coordinates));

        return null;
    }, [filteredByRange]);
    console.log('calcMidPoint', calcMidPoint);

    const findLowest = useMemo(() => {
        console.log('in findLowest');
        if (filteredByCityType.length === 0) {
            return 1900;
        }
        const minValues = filteredByCityType.map((item) => item.min);
        return Math.min(...minValues);
    }, [currentCity, currentType]);

    const findHighest = useMemo(() => {
        console.log('in findHighest');
        const now = new Date();
        if (filteredByCityType.length === 0) {
            return now.getFullYear();
        }

        const maxValues = filteredByCityType.map((item) => item.max);

        const result = Math.max(...maxValues);
        return result;
    }, [currentCity, currentType]);

    console.log('lowest', findLowest);
    console.log('highest', findHighest);


    useEffect(() => {
        if (lowerMax === 0) {
            setLowerMax(findLowest);
        }
        if (upperMax === 0) {
            setUpperMax(findHighest);
        }
        if (value1 === 0) {
            setValue1(findLowest);
        }
        if (value2 === 0) {
            setValue2(findHighest);
        }
    }, [currentCity, currentType]);

    const { createSliderWithTooltip } = Slider;
    const Range = createSliderWithTooltip(Slider.Range);

    return (
        <section className="section">
            <div className="columns is-centered">
                <div className="column is-6 is-centered">
                    <Range
                        min={lowerMax}
                        max={upperMax}
                        defaultValue={[value1, value2]}
                        tipFormatter={(value) => `${value}`}
                        // onChange={((e) => {

                        // })}
                        onAfterChange={((e) => {
                            console.log(e);
                            setValue1(e[0]);
                            setValue2(e[1]);
                        })}
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
                <div>
                    {/* <MyMap
                        address={}
                        undertext={}
                        pins={}
                    /> */}
                </div>
            </div>
        </section>
    );
};

export default KartSida;
