import React from 'react';

const KartSida = () => {
    const [lowerValue, setLowerValue] = React.useState(0);
    const [upperValue, setUpperValue] = React.useState(0);
    const range1 = React.useRef();
    const range2 = React.useRef();

    return (
        <section className="section">
            <div className="columns is-centered">
                <div className="column is-10 is-centered">
                    <input
                        id="range1"
                        name="range1"
                        ref={range1}
                        type="range"
                        min="1900"
                        max="2020"
                        step="10"
                        value="1950"
                        onChange={((e) => {
                            setLowerValue(e.target.value);
                            // range1.current.value = e.target.value;
                            }
                        )}
                    />
                    <input
                        id="range2"
                        name="range2"
                        ref={range2}
                        type="range"
                        min="1900"
                        max="2020"
                        step="10"
                        value="1990"
                        onChange={((e) => {
                            setUpperValue(e.target.value);
                            // range2.current.value = e.target.value;
                        }
                        )}
                    />
                    <p>
                        {lowerValue}
                        {' '}
                        {upperValue}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default KartSida;
