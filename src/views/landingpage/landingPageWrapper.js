import React from 'react';
import PropTypes from 'prop-types';
import { requestProvider } from 'webln';
import { notificationData } from '../../utils';
import { getLastSwap } from '../../actions/landingPageActions';

class LandingPageWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      lastSwap: {amount: '', link: ''},
    };

    this.notificationDom = React.createRef();
  }

  componentDidMount = async () => {
    this.props.getPairs();
    requestProvider()
      .then(provider => {
        this.webln = provider;
        this.forceUpdate();
      })
      .catch(error => {
        console.log(`Could not enable WebLN: ${error}`);
      });
    
    let lastSwap = await getLastSwap();
    // console.log(`landingpagewrapper.30 lastswap `, lastSwap)
    this.setState({lastSwap: lastSwap})
    // this.state.lastSwap = await getLastSwap()
  };

  componentDidUpdate = () => {
    if (this.props.errorMessage) {
      this.addNotification(this.props.errorMessage, 0);
    }
    // announcement
    this.notificationDom.current.addNotification(
      notificationData({
        title: 'Status Update', 
        message:'Bridge is temporarily offline until stuck transactions clear from mempool due to recent congestion.\nSorry for the inconvenience.'}, 
        1, 0));
  };

  addNotification = (info, type) => {
    this.notificationDom.current.addNotification(notificationData(info, type));
  };

  toggleModal = () => {
    this.setState(prev => ({ isOpen: !prev.isOpen }));
  };

  render() {
    return this.props.children({
      ...this.props,
      isOpen: this.state.isOpen,
      toggleModal: this.toggleModal,
      notificationDom: this.notificationDom,
      webln: this.webln,
      lastSwap: this.state.lastSwap,
    });
  }
}

LandingPageWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  errorMessage: PropTypes.object,
  getPairs: PropTypes.func.isRequired,
  classes: PropTypes.object,
  initSwap: PropTypes.func.isRequired,
  initReverseSwap: PropTypes.func.isRequired,
  fees: PropTypes.object.isRequired,
  rates: PropTypes.object.isRequired,
  limits: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  warnings: PropTypes.array.isRequired,
};

export default LandingPageWrapper;
