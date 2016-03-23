import Relay from 'react-relay';

export default class extends Relay.Route {
  static routeName = 'Home';
  static queries = {
    store: (Component) => Relay.QL`
      query MainQuery {
        store { ${Component.getFragment('store')} }
      }
    `
  };
}
