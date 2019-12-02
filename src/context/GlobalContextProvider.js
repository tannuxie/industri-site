import React from 'react';

export const GlobalStateContext = React.createContext();
export const GlobalDispatchContext = React.createContext();

const initialState = {
    size: 'normal',
};

function reducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_SIZE': {
            return {
                ...state,
                theme: state.size === 'normal' ? 'big' : 'normal',
            };
        }

        default:
            throw new Error('Bad action type');
    }
}

const GlobalContextProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <GlobalStateContext.Provider value={state}>
            <GlobalDispatchContext.Provider value={dispatch}>
                {children}
            </GlobalDispatchContext.Provider>
        </GlobalStateContext.Provider>
    );
};

export default GlobalContextProvider;
