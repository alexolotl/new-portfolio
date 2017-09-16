import React, { Component } from 'react'
import SceneShaderTemplate from '../components/three/ShaderTemplate'
import SceneRDTemplate from '../components/three/RDtemplate'
import * as portfolioActions from '../actions/portfolio'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import './Project.css'

class Project extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scene: null
    }
  }

  componentWillMount() {
    // const foundProject = this.searchForProjectByPath( this.props.portfolio, this.props.match.params.project)
    // foundProject ? this.props.makeActive(foundProject) : this.props.changeRoute('/') // redirect to home if not found
  }

  componentDidMount() {
      const foundProject = this.searchForProjectByPath( this.props.portfolio, this.props.match.params.project)
      foundProject ? this.props.makeActive(foundProject) : this.props.changeRoute('/') // redirect to home if not found
  }

  componentWillUpdate() {
    console.log('component is updating')
  }

  componentDidUpdate() {
    window.scrollTo(0,0);
  }

  componentWillReceiveProps(newProps) {

    if (newProps.match.params.project !== this.props.match.params.project) {
      console.log('new page!')

      const foundProject = this.searchForProjectByPath( newProps.portfolio, newProps.match.params.project)

      // remove and clean previous scene if there was one
      this.state.scene && this.state.scene.cleanupScene()

      if (foundProject) {

        let CreateScene;

        if (foundProject.three) {
          switch (foundProject.threeFile) {
            case 'ShaderTemplate':
              CreateScene = SceneShaderTemplate;
              break;
            case 'RDtemplate':
              CreateScene = SceneRDTemplate;
            default:
              break;
            }
          }

        // crate new scene if there should be one
        this.setState({
          scene: foundProject.three ? new CreateScene(this.threeRef, foundProject.vertex, foundProject.fragment) : null
        })
        this.props.makeActive(foundProject)
      }
      else {
        this.props.makeActive(null)
        this.props.changeRoute('/')
      }

    }
  }

  searchForProjectByPath = (portfolio, path) => { // AEZ TODO kind of messy - matching URL path param to nested portfolio project via search
    let foundResults = []
    Object.keys(portfolio).forEach(key => {
      let project = portfolio[key].projects && portfolio[key].projects.find( p => p.path === path )
      if (project) {foundResults.push(project)}
    })
    if (foundResults.length === 1) {
      return foundResults[0]
    }
    else if (foundResults.length > 1) {
      console.log('Warning: more than one match found, rendering first')
      return foundResults[0]
    }
    else {
      console.log('No matches found for' + path)
      return false
    }
  }

  render() {

    return (
      <div className="Project">
        <div className="Project__ThreeContainer" ref={threeRef => this.threeRef = threeRef}></div>
        {
          this.props.activeProject && <img src={this.props.activeProject.src} />
        }
      </div>
    )
  }
}

function mapStateToProps(state, props) {
    return {
        portfolio: state.portfolio.portfolio,
        activeProject: state.portfolio.activeProject
    };
}

function mapDispatchToProps(dispatch) {
    return {
      changeRoute: (url) => dispatch(push(url)),
      makeActive: (project) => {dispatch(portfolioActions.makeActive(project))},
      dispatch,
    };
  }

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(Project) )
