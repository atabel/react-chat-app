// @flow
import * as React from 'react';

const deferRender = <P: {}>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P> => {
    return class Wrapper extends React.PureComponent<P, {props?: P}> {
        state = {};

        componentDidMount() {
            this.schedulePropsChange();
        }

        componentDidUpdate(prevProps) {
            if (prevProps !== this.props) {
                this.schedulePropsChange();
            }
        }

        schedulePropsChange() {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => this.setState({props: this.props}));
            });
        }

        render() {
            const {props} = this.state;
            return props ? <WrappedComponent {...props} /> : null;
        }
    };
};

export default deferRender;
