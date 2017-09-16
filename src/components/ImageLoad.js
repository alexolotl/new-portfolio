import React, { Component } from 'react';

export default (src) => (
  <div className="Img">
    <img src={require(src)} />
  </div>
)
