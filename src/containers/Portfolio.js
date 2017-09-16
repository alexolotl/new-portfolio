import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import Project from './Project'
import * as portfolioActions from '../actions/portfolio';
import portfolio from '../services/data' // AEZ is this the place to import data?
import {withRouter, Route} from 'react-router-dom'
import './Portfolio.css'

// AEZ do i have to move all this presentational stuff out of this container?
// AEZ move Link's state object into Redux, to pass project data while navigating to new page

class Portfolio extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.loadPortfolio();
  }

  renderPreview(project, index) {
      return (
      <div
        key={index}
        className="ProjectList__Project"
        onClick={() => {
          this.props.changeRoute(`${this.props.match.path}/${project.path}`)}
        }
      >
        {project.thumb && <img src={project.thumb} alt={project.description || 'image'} />}
        {project.src && <img src={project.src} alt={project.description || 'image'} />}
      </div>
    )
  }

  renderShaders(shaders) {
    return (
      shaders && shaders.map((project, index) => (
        this.renderPreview(project, index)
      ))
    )
  }

  render3D(images) {
    return (
      images && images.map((project, index) => (
        this.renderPreview(project, index)
      ))
    )
  }

  render() {

    return (
      this.props.portfolio.portfolio && <div className="Portfolio">
          <Route path="/portfolio/:project" component={Project} />
          <div className="ProjectList">
            {
              this.renderShaders(this.props.portfolio.portfolio.shaders.projects)
            }
            {
              this.render3D(this.props.portfolio.portfolio.visuals.projects)
            }
          </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
    return {
        portfolio: state.portfolio
    };
}

// const mapDispatchToProps = dispatch => bindActionCreators({
//   goToProject: (projectPath) => {push(projectPath)},
//   portfolioActions
// }, dispatch)

function mapDispatchToProps(dispatch) {
    return {
      changeRoute: (url) => dispatch(push(url)),
      loadPortfolio: () => {dispatch(portfolioActions.loadPortfolio(portfolio))},
      makeActiveProject: (project) => {dispatch(portfolioActions.makeActive(project))},
      dispatch,
    };
  }

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(Portfolio) )
