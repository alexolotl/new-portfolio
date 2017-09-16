const portfolioInitialState = {
  portfolio: null,
  activeProject: null
}

export default(state = portfolioInitialState, action) => {
  console.log(action)
    switch (action.type) {
        case 'LOAD_PORTFOLIO':
            return {...state,
                    portfolio: action.payload};
        case 'MAKE_ACTIVE':
            return {
              ...state,
              activeProject: action.payload
            }
        case 'SELECT':
            return {...state,
                    activeProject: action.payload};
        case 'DESELECT':
            return portfolioInitialState;
        default:
            return state;
    }
};
