/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Circles from './Circles';

/**
 * Material Design feature discovery prompt
 * @see [Feature discovery](https://material.io/archive/guidelines/growth-communications/feature-discovery.html)
 */
export default class FeatureDiscoveryPrompt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: {
        top: 1,
        right: 1,
        bottom: 1,
        left: 1,
        width: 1,
      },
    };
  }

  componentDidMount() {
    this.portal = document.createElement('div');
    document.body.appendChild(this.portal);
    this.portal.style.position = 'fixed';
    this.portal.style.zIndex = 1;
    this.portal.style.top = 0;
    this.portal.style.left = 0;
    this.renderCircle();
  }

  componentDidUpdate() {
    this.renderCircle();
  }

  componentWillUnmount() {
    unmountComponentAtNode(this.portal);
    this.portal = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.circles) {
      if (nextProps.open && !this.props.open) {
        this.circles.open();
      } else if (!nextProps.open && this.props.open) {
        this.circles.close();
      }
    }
  }

  renderCircle() {
    if (!this.circles) {
      const { backgroundColor, description, onClose, title } = this.props;

      render(
        <Circles
          backgroundColor={backgroundColor}
          description={description}
          element={this}
          onClose={onClose}
          ref={ref => {
            this.circles = ref;
          }}
          title={title}
        />,
        this.portal,
      );
    }
  }

  render() {
    const child = React.Children.only(this.props.children);
    return React.cloneElement(child, {
      style: {
        ...child.props.style,
        position:
          child.props.style &&
          child.props.style.position &&
          child.props.style.position !== 'static'
            ? child.props.style.position
            : 'relative',
        zIndex: 2,
      },
    });
  }
}

FeatureDiscoveryPrompt.propTypes = {
  /** Defines if the prompt is visible. */
  open: PropTypes.bool.isRequired,
  /** Fired when the the prompt is visible and clicked. */
  onClose: PropTypes.func.isRequired,
  /** The node which will be featured. */
  children: PropTypes.node.isRequired,
  /** Override the inline-styles of the circles element. */
  style: PropTypes.object,
  /** Defines the title text **/
  title: PropTypes.string.isRequired,
  /** Defines the description text **/
  description: PropTypes.string.isRequired,
};
