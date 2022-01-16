import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import View from '../../components/view';
import Link from '../../components/link';
import NavigationBar from '../../components/navigationbar';
import Question from '../../components/question';
import NodeInfo from '../../components/nodeinfo';
import BackGround from '../../components/background';
import {
  bitcoinLnd,
  litecoinLnd,
  bitcoinLndOnion,
  litecoinLndOnion,
} from '../../constants';

const styles = theme => ({
  wrapper: {
    flex: '1 0 100%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '42px',
    color: theme.colors.white,
  },
  questionTab: {
    backgroundColor: theme.colors.white,
    minWidth: '820px',
    maxWidth: '920px',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
    paddingTop: '10px',
    paddingBottom: '10px',
    '@media (max-width: 425px)': {
      justifyContent: 'center',
      minWidth: '100%',
      maxWidth: '100%',
    },
  },
});

const twitterLink = 'https://twitter.com/citlayik';
const discordLink = 'https://discord.gg/kyNWQAUwY5';

class Widget extends React.Component {
  render() {
    const { classes } = this.props;

    document.body.style.overflowX = 'hidden';

    return (
      <BackGround>
        <NavigationBar />
        <View className={classes.wrapper}>
          <View className={classes.titleWrapper}>
            <h1 className={classes.title}>Accept Bitcoin for STX</h1>
          </View>
          <View className={classes.questionTab}>
            <Question
              title={style => <h1 className={style}>Integrate LNSwap.org</h1>}
              content={style => (
                <p className={style}>
                  LNSwap offers an embeddable widget that Stacks App
                  developers can place on their websites to enable users to swap
                  Bitcoin on Lightning Network for STX.
                  <br /> <br />                  
                  If you need a demo or help integrating feel free to <Link to={'https://discord.gg/8jGPCKmnnA'} text={'Join our Discord'} />.
                </p>
              )}
            />
            <Question
              title={style => (
                <h1 className={style}>
                  How does it work?
                </h1>
              )}
              content={style => (
                <p className={style}>
                  LNSwap Widget simplifies the LNSwap.org submarine swap 
                  flow by allowing the host website pre-populate data and allowing
                  user to claim funds without ever leaving the Stacks app.
                  <br /><br />
                  LNSwap Widget also allows anyone to mint NFT with Lightning.
                  <br /><br />
                  {/* We believe this can be useful for NFT marketplaces or any Stacks app
                  that wants to onboard users.  */}
                  <div style={{display: 'flex', justifyContent: 'space-between',}}>
                    <img src="./widget.png" style={{display: 'block', margin:'4px', maxWidth: '40%'}}/>
                    <img src="./nftss.png" style={{display: 'block', margin:'4px', maxWidth: '40%'}}/>
                  </div>
                  <p>Visit <Link to={'https://docs.lnswap.org'} text={'https://docs.lnswap.org'} /> for documentation and code samples.</p>
                  <p>Visit <Link to={'https://widget.lnswap.org'} text={'https://widget.lnswap.org'} /> for live mainnet demo.</p>
                </p>
                
              )}
            />
            <Question
              title={style => (
                <h1 className={style}>How to integrate?</h1>
              )}
              content={style => (
                <p className={style}>
                  <p>NFT Marketplaces or any Stacks App can integrate the widget as below:</p>

                  <iframe
                    src="https://carbon.now.sh/embed?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=seti&wt=none&l=auto&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=false&pv=56px&ph=56px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%253Cdiv%2520id%253D%2522root%2522%253E%253C%252Fdiv%253E%250A%253Cscript%2520src%253D%2522https%253A%252F%252Fwidget.lnswap.org%252Fwidget.js%2522%2520%2520%250A%2509id%253D%2522LNSwap-Widget-Script%2522%2520%250A%2520%2520%2520%2520data-config%253D%2522%257B%27name%27%253A%2520%27lnswap%27%252C%2520%27config%27%253A%2520%257B%27targetElementId%27%253A%2520%27root%27%257D%257D%2522%253E%250A%253C%252Fscript%253E%250A%250A%252F%252F%2520Start%2520the%2520Swap%250Alnswap%28%27swap%27%252C%2520%250A%2520%2520%2520%2520%2520%2520%2520%27swapType%27%252C%2520%250A%2520%2520%2520%2520%2520%2520%2520%27user%2520stx%2520address%27%252C%2520%250A%2520%2520%2520%2520%2520%2520%2520%27amount%2520in%2520STX%27%252C%2520%250A%2520%2520%2520%2520%2520%2520%2520%27%28only%2520for%2520mintnft%29%2520NFT%2520Contract%2520Address%27%252C%250A%2520%2520%2520%2520%2520%2520%2520%27%28only%2520for%2520mintnft%29%2520NFT%2520Mint%2520Function%2520Name%27%29%253B%250A%250A%252F%252F%2520e.g.%2520Mint%2520NFT%2520with%2520Lightning%2520%250Alnswap%28%27swap%27%252C%2520%27mintnft%27%252C%2520%27ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF%27%252C%252025%252C%2520%27ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF.stacks-roots-v2%27%252C%2520%27claim-for%27%29%253B%250A%250A%252F%252F%2520e.g.%2520Trustless%2520Swap%2520Lightning%2520to%2520STX%250Alnswap%28%27swap%27%252C%2520%27reversesubmarine%27%252C%2520%27ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF%27%252C%25205%29%253B%250A"
                    style={{width: '857px', height: '577px', border:'0', transform: 'scale(1)', overflow:'hidden', maxWidth: '100%'}}
                    sandbox="allow-scripts allow-same-origin">
                  </iframe>

                </p>
              )}
            />
          </View>
        </View>
      </BackGround>
    );
  }
}

Widget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Widget);
