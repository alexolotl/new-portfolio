import React, { Component } from 'react';
import Scene from './three/ShaderTemplate'

export default class Project extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scene: null
    }
  }
  componentDidMount() {
    this.setState({
      scene: this.props.project.three ? new Scene(this.threeRef, this.props.project.vertex, this.props.project.fragment) : null
    })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match !== this.props.match) {
      console.log('new page!')

      // remove and clean previous scene if there was one
      this.state.scene && this.state.scene.cleanupScene()

      // crate new scene if there should be one
      this.setState({
        scene: newProps.project.three ? new Scene(this.threeRef, newProps.project.vertex, newProps.project.fragment) : null
      })
    }
  }

  render() {
    const {project} = this.props

    return (
      <div className="Project">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <div ref={threeRef => this.threeRef = threeRef}></div>
      </div>
    )
  }

}
