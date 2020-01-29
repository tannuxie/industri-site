import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Slider from 'rc-slider';
import getDistance from 'geolib/es/getDistance';
import getCenterOfBounds from 'geolib/es/getCenterOfBounds';
import orderByDistance from 'geolib/es/orderByDistance';
import getBoundsOfDistance from 'geolib/es/getBoundsOfDistance';
import getBounds from 'geolib/es/getBounds';
import computeDestinationPoint from 'geolib/es/computeDestinationPoint';
import Loadable from 'react-loadable';
import CircularProgress from '@material-ui/core/CircularProgress';
import L from 'leaflet';
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

// computeDestinationPoint(point, distance, bearing, radius = earthRadius)

const Loading = () => {
    return (
        <div css={css`
            width: 100%
            height: 500px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        `}
        >
            <h1
                css={css`text-align: center;`}
            >
                Laddar karta...
            </h1>
            <CircularProgress />
        </div>
    );
};

// pins ska vara en array med objekt som har
// name, position(array med lat, lng), subtitle(array av textrader)

const LoadableComponent = Loadable.Map({
    loader: {
      leaf: () => import('react-leaflet'),
    },
    loading: Loading,
    render(loaded, props) {
        const {
          Map, Marker, Popup, Tooltip, TileLayer,
        } = loaded.leaf;
        const {
            center, bounds, pins, zoom,
        } = props;
        const myIcon = ((year) => {
            const icon = L.divIcon({
                        className: 'year-icon',
                        html: `<span>${year}</span>`,
                        });
            return icon;
        });

        return (
            <div>
                {(typeof window !== 'undefined') && (
                <Map
                    center={center}
                    bounds={bounds && bounds}
                    zoom={zoom && zoom}
                    style={{
                        height: '600px',
                    }}
                    css={css`
                        .year-icon {
                            display: flex;
                            width: 45px!important;
                            height: 45px!important;
                            background-color: white;
                            justify-content: center;
                            opacity: 0.8;
                            border-radius: 50%;
                            align-items: center;
                            box-shadow: 0px 0px 3px 1px #000000b5;
                        }
                        .year-icon span {
                            font-size: 0.9rem;
                        }
                    `}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {pins && pins.map((element) => (
                        <Marker
                            key={`${element.name } ${ element.position[0]}`}
                            position={element.position}
                            icon={myIcon(element.startdate)}
                        >
                            <Popup>
                                <b>{element.name}</b>
                                {element.subtitle && (
                                <>
                                    <br />
                                    {element.subtitle.map((line) => (
                                        <span
                                            key={line}
                                            css={css`
                                                display: block;
                                            `}
                                        >
                                            {line}
                                        </span>
                                    ))}
                                </>
                                )}
                            </Popup>
                        </Marker>
                    ))}
                </Map>
                )}
            </div>
        );
    },
  });

const KartSida = () => {
    const [currentCity, setCurrentCity] = useState('');
    const [currentType, setCurrentType] = useState('');

    const [lowerMax, setLowerMax] = useState(0);
    const [upperMax, setUpperMax] = useState(0);

    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);

    const [numberOfCompanies, setNumberOfCompanies] = useState(0);

    const [mapCenter, setMapCenter] = useState([]);
    const [mapBounds, setMapBounds] = useState([]);
    const [mapPins, setMapPins] = useState([]);

    const data = useStaticQuery(graphql`
        query AddressQuery {
            company: allStrapiCompany {
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
    // const addressData = React.useMemo(() => {
    //     data.company.edges.map((item) => item.node);
    // }, [data.company.edges]);
    // // console.log('addressData', addressData);

    const withMinMaxData = React.useMemo(() => {
        console.log('in withMinMaxData');
        const thedata = data.company.edges.map((item) => item.node);
        const result = thedata.map((item) => {
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
        });
        console.log('withMinMaxData result', result);

        return result;
    }, [data]);
    // console.log('withMinMaxData', withMinMaxData);

    // const filteredByCityType = useMemo(() => {
    //     console.log('in filteredByCityType');

    //     const result = withMinMaxData.filter((item) => (
    //     (currentCity) ? item.city === currentCity : item))
    //     .filter((item) => ((currentType) ? item.type === currentType : item));
    //     console.log('filteredByCityType result', result);
    //     return result;
    // }, [withMinMaxData, currentCity, currentType]);
    // console.log('filteredByCityType', filteredByCityType);

    // const findLowest = useMemo(() => {
    //     console.log('in findLowest');
    //     if (filteredByCityType.length === 0) {
    //         return 1900;
    //     }
    //     const minValues = filteredByCityType.map((item) => item.min);
    //     const result = Math.min(...minValues);
    //     console.log('findLowest result', result);

    //     return result;
    // }, [filteredByCityType]);

    // const findHighest = useMemo(() => {
    //     console.log('in findHighest');
    //     const now = new Date();
    //     if (filteredByCityType.length === 0) {
    //         console.log('findHighest result', now.getFullYear());
    //         return now.getFullYear();
    //     }

    //     const maxValues = filteredByCityType.map((item) => item.max);

    //     const result = Math.max(...maxValues);
    //     console.log('findHighest result', result);

    //     return result;
    // }, [filteredByCityType]);

    // console.log('lowest', findLowest);
    // console.log('highest', findHighest);

    // const filteredByRange = useMemo(() => {
    //     console.log('in filteredByRange');

    //     const result = filteredByCityType.filter((item) => (
    //         (value1 !== lowerMax || value2 !== upperMax)
    //         ? (item.max >= value1 && item.min <= value2)
    //         : item
    //     ))
    //     .map((item) => {
    //         const current = item;
    //         const newAddr = current.address.filter((item2) => (
    //             (value1 !== lowerMax || value2 !== upperMax)
    //             ? (item2.startdate <= value2 && item2.enddate >= value1)
    //             : item2
    //         ));
    //         current.address = newAddr;

    //         return current;
    //     });

    //     console.log('filteredByRange result', result);
    //     return result;
    // }, [value1, value2]);
    // console.log('filteredByRange', filteredByRange);

    // *********************** //
    // geografiska beräkningar //
    // *********************** //

    // beräkna centerpunkten bland relevanta koordinater
    // const calcCenter = useMemo(() => {
    //     console.log('in calcCenter');
    //     const addresses = filteredByRange.map((item) => item.address).flat();
    //     // console.log('addresses', addresses);
    //     const coordinates = addresses.map((item) => ({
    //             latitude: item.latitude,
    //             longitude: item.longitude,

    //     }));
    //     // console.log('coordinates', coordinates);
    //     // console.log('getCenterOfBounds', getCenterOfBounds(coordinates));

    //     return getCenterOfBounds(coordinates);
    // }, [filteredByRange]);
    // console.log('calcCenter', calcCenter);

    // beräkna hur kartan ska vara positionerad över centerpunkten
    // const calcBounds = useMemo(() => {
    //     console.log('in calcBounds');
    //     const addresses = filteredByRange.map((item) => item.address).flat();
    //     // console.log('addresses', addresses);
    //     const coordinates = addresses.map((item) => ({
    //             latitude: item.latitude,
    //             longitude: item.longitude,

    //     }));
    //     // console.log('coordinates', coordinates);
    //     // console.log('getBounds', getBounds(coordinates));
    //     const bounds = getBounds(coordinates);
    //     const result = [
    //         [
    //             bounds.maxLat,
    //             bounds.maxLng,
    //         ],
    //         [
    //             bounds.minLat,
    //             bounds.minLng,
    //         ],
    //     ];
    //     console.log(result);

    //     return result;
    // }, [filteredByRange]);
    // console.log('calcBounds', calcBounds);


    // initial inställning av datum till slidern
    // useEffect(() => {
    //     console.log('in useEffect: setup');
    //     if (lowerMax === 0) {
    //         setLowerMax(findLowest);
    //     }
    //     if (upperMax === 0) {
    //         setUpperMax(findHighest);
    //     }
    //     if (value1 === 0) {
    //         setValue1(findLowest);
    //     }
    //     if (value2 === 0) {
    //         setValue2(findHighest);
    //     }
    // }, [filteredByCityType]);

    // uppdatera kartans state
    useEffect(() => {
        console.log('in useEffect: map update');
        console.log('withMinMaxData', withMinMaxData);

        const filteredByCityType = withMinMaxData.filter((item) => (
            (currentCity) ? item.city === currentCity : item))
            .filter((item) => ((currentType) ? item.type === currentType : item));

        const min = (() => {
            if (filteredByCityType.length === 0) {
                return 1900;
            }
            const minValues = filteredByCityType.map((item) => item.min);
            const minNmbr = Math.min(...minValues);
            return minNmbr;
        })();
        console.log('findLowest result', min);
        if (value1 === 0 || value1 < min) {
            setValue1(min);
        }
        setLowerMax(min);

        const max = (() => {
            const now = new Date();
            if (filteredByCityType.length === 0) {
                console.log('findHighest result', now.getFullYear());
                return now.getFullYear();
            }
            const maxValues = filteredByCityType.map((item) => item.max);
            const result = Math.max(...maxValues);
            return result;
        })();
        console.log('findHighest result', max);
        if (value2 === 0 || value2 > max) {
            setValue2(max);
        }
        setUpperMax(max);

        const filteredByRange = filteredByCityType.filter((item) => (
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

        const addresses = filteredByRange.map((item) => item.address).flat();
        console.log('addresses length', addresses.length, 'content', addresses);
        setNumberOfCompanies(addresses.length);
        const pins = addresses.map((item) => {
            const obj = {
                position: [item.latitude, item.longitude],
                subtitle: [item.addresstext1, item.addresstext2],
                ...item,
            };
            return obj;
        });
        setMapPins(pins);

        if (addresses.length > 0) {
            const coordinates = addresses.map((item) => ({
                latitude: item.latitude,
                longitude: item.longitude,
            }));
            console.log('coordinates', coordinates);
            console.log('center of coords', getCenterOfBounds(coordinates));

            const coordsByDistance = orderByDistance(getCenterOfBounds(coordinates), coordinates);
            console.log('coordsByDistance', coordsByDistance);

            const distance = getDistance(
                getCenterOfBounds(coordinates),
                coordsByDistance[coordsByDistance.length - 1],
            );
            console.log('distance', distance);

            const distantPoint = computeDestinationPoint(
                getCenterOfBounds(coordinates),
                distance * 1.2,
                180,
            );
            const otherPoint = computeDestinationPoint(
                getCenterOfBounds(coordinates),
                distance * 1.2,
                0,
            );
            console.log('distantPoint', distantPoint);

            coordinates.push(distantPoint, otherPoint);
            console.log('addedCoords', coordinates);

            const bounds = getBounds(coordinates);
            console.log('bounds', bounds);

            // const boundsArray = bounds.sort((a, b) => {
            //     const Alat = a.latitude;
            //     const Bblat = b.latitude;

            //     let comparison = 0;
            //     if (Alat < Bblat) {
            //       comparison = 1;
            //     } else if (Alat > Bblat) {
            //       comparison = -1;
            //     }
            //     return comparison;
            // }).reverse();
            // console.log('boundsArray', boundsArray);

            setMapBounds(bounds);
            setMapCenter(getCenterOfBounds(coordinates));
        }
    }, [currentCity, currentType, lowerMax, upperMax, value1, value2, withMinMaxData]);

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
                    <h3
                        css={css`
                            text-align: center;
                            margin: 0;
                        `}
                    >
                        {`${numberOfCompanies} företag hittades!`}
                    </h3>
                </div>
            </div>
            <div className="columns is-centered">
                <div className="column is-10 is-centered">
                    <div
                        css={css`
                            width: 100%;
                        `}
                    >
                            <LoadableComponent
                                center={mapCenter}
                                bounds={mapBounds}
                                pins={mapPins}
                                // zoom={zoom}
                            />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KartSida;
