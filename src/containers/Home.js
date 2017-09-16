import React, { Component } from 'react';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {withRouter, Link} from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div className="Home">
          <h1>Home</h1>
          <a onClick={this.props.changePage} >go to about via push</a>
          <hr />
          <Link to={'/about'}>or via link</Link>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/about')
}, dispatch)

export default withRouter( connect(null, mapDispatchToProps)(Home) )
