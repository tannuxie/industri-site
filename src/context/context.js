/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';

const defaultContextValue = {
  store: {
    // set your initial data shape here
    size: false,
  },
  set: () => {},
  toggleSize: () => {},
};

const { Provider, Consumer } = React.createContext(defaultContextValue);

class ContextProviderComponent extends React.Component {
  constructor() {
    super();

    this.toggleSize = _.debounce(this.toggleSize.bind(this), 500, {
        leading: true,
        trailing: false,
      });
    this.setData = this.setData.bind(this);
    this.state = {
      ...defaultContextValue,
      set: this.setData,
      toggleSize: this.toggleSize,
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

    toggleSize() {
        console.log('in toggleSize');
        this.setState((state) => ({
            store: {
                size: !this.state.store.size,
            },
        }));
    }

    render() {
        const { children } = this.props;
        return <Provider value={this.state}>{children}</Provider>;
    }
}

export { Consumer as default, ContextProviderComponent };
