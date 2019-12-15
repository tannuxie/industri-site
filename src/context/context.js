/* eslint-disable react/prop-types */
import React from 'react';

const defaultContextValue = {
  store: {
    // set your initial data shape here
    size: 'normal',
    headerHeight: 0,
  },
  set: () => {},
};

const { Provider, Consumer } = React.createContext(defaultContextValue);

class ContextProviderComponent extends React.Component {
  constructor() {
    super();

    this.setData = this.setData.bind(this);
    this.state = {
      ...defaultContextValue,
      set: this.setData,
    };
  }

  setData(newData) {
    this.setState((state) => ({
      store: {
        ...state.store,
        ...newData,
      },
    }));
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}

export { Consumer as default, ContextProviderComponent };
