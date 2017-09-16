export const SELECT = 'SELECT'
export const DESELECT = 'DESELECT'
export const LOAD_PORTFOLIO = 'LOAD_PORTFOLIO'
export const MAKE_ACTIVE = 'MAKE_ACTIVE'

export const loadPortfolio = (portfolio) => {
  return {
      type: LOAD_PORTFOLIO,
      payload: portfolio
  };
}

export const makeActive = (project) => {
  return {
    type: MAKE_ACTIVE,
    payload: project
  }
}

export const selectProject = (project) => {
  return {
      type: SELECT,
      payload: project
  };
}

export const deselectProject = () => {
  return {
    type: DESELECT
  }
}
