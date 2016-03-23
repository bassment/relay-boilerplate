import '../css/globals.css';
import shared from '../css/shared.css';
import styles from '../css/Home.css';

import React from 'react';
import Helmet from 'react-helmet';
import Relay from 'react-relay';

class Home extends React.Component {
  static propTypes = {
    store: React.PropTypes.object
  };

  render() {
    const content = this.props.store.companies.map((company, i) => {
      return (
        <li key={i}>
        {company.name} - {company.earnings}$
      </li>
    );
    });

    return (
      <div>
        <Helmet title="React"/>
        <section className={shared.section}>
          <h1>Companies</h1>
          <ul className={styles.list}>
            {content}
          </ul>
        </section>
      </div>
    );
  }
}

// Declare the requirements for this component with Relay
Home = Relay.createContainer(Home, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        companies {
          name
          earnings
        }
      }
    `
  }
});

export default Home;
