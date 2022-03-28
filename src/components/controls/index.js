import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { MdArrowForward } from 'react-icons/md';
import View from '../view';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Box } from '@mui/system';
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tooltip,
  Typography,
  TextField,
} from '@mui/material';
import NavigateNext from '@mui/icons-material/NavigateNext';
import { ContentCopy } from '@mui/icons-material';

const styles = theme => ({
  wrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: '1px solid #7a40ee',
    // backgroundColor: p => (p.loading ? '#4A4A4A' : 'none'),
    // borderBottomRightRadius: '8px',
    // borderBottomLeftRadius: '8px',
    cursor: 'initial',
  },
  error: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
  },
  controls: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
  text: {
    color: '#fff',
    fontWeight: '300',
    fontSize: p => (p.mobile ? '20px' : '25px'),
  },
  errorCommand: {
    paddingRight: '10px',
    color: '#fff',
    fontSize: p => (p.mobile ? '20px' : '25px'),
  },
  nextIcon: {
    paddingRight: '10px',
    height: '30px',
    width: '30px',
    color: '#fff',
  },
});

// TODO: refactor to use render props due to complexity
const Controls = ({
  classes,
  text,
  onPress,
  error,
  errorText,
  errorAction,
  errorRender,
  loading,
  loadingText,
  loadingStyle,
  loadingRender,
  swapResponse,
}) => {
  // const loadingStyleSelect = loadingStyle ? loadingStyle : classes.text;
  // const loadingTextSelect = loadingText ? loadingText : text;
  console.log('loading: ', loadingText, loading, loadingRender);
  console.log('text: ', text, errorText);
  console.log('error, errorRender: ', error, errorRender, errorAction);
  let swapId = '';
  if (swapResponse && swapResponse.id) swapId = swapResponse.id;
  console.log('controls swapId, ', swapId);
  let copied = false;
  let showProgress = false;
  if (
    loadingText &&
    (loadingText.includes('Waiting for invoice to be paid...') ||
      loadingText.includes('Waiting for confirmation...'))
  ) {
    showProgress = true;
  }
  console.log('showProgress, ', showProgress);
  return (
    <View
      className={error ? classes.error : classes.wrapper}
      // onClick={loading || error ? undefined : () => onPress()}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {swapId ? (
          <TextField
            // label="With normal TextField"
            id="outlined-start-adornment"
            disabled
            // , width: '25ch'  m: 2,
            sx={{ width: '110px', p: 1 }}
            value={swapId}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">ID</InputAdornment>
              ),
            }}
          />
        ) : // width: '25ch'
        // <FormControl sx={{ m: 1 }} variant="outlined">
        //   <InputLabel htmlFor="outlined-adornment-password">
        //     Swap ID
        //   </InputLabel>
        //   <OutlinedInput
        //     id="outlined-adornment-password"
        //     type={'text'}
        //     value={swapId}
        //     disabled
        //     // onChange={handleChange('password')}
        //     endAdornment={
        //       <InputAdornment position="end">
        //         ID
        //         <Tooltip
        //           open={copied}
        //           disableFocusListener={true}
        //           disableHoverListener={true}
        //           title="Copied"
        //         >
        //           <CopyToClipboard
        //             text={swapId}
        //             onCopy={() => {
        //               copied = true;
        //             }}
        //           >
        //             <span className={classes.copyButtonSpan}>
        //               <ContentCopy />
        //             </span>
        //           </CopyToClipboard>
        //         </Tooltip>
        //       </InputAdornment>
        //     }
        //     label="Swap ID"
        //   />
        // </FormControl>
        null}
        {/* <Button
          variant="outlined"
          // className={classes.contractButton}
          text={'Connect Wallet'}
          sx={{ margin: 2, }}
          onClick={async () => {
            let w3 = await connectWallet();
            console.log('onpress account ', w3);
            // this.onChange(w3.account, false);
            document.getElementById('addressTextfield').value = w3.account;
          }}
        >{'Connect Wallet'}
        </Button> */}
        {error && errorRender && (
          <Alert severity="error" sx={{ flex: 1, mx: 1 }}>
            {errorRender(classes.errorCommand, errorAction)}
          </Alert>
        )}
        {showProgress && <CircularProgress sx={{ m: 2 }} />}
        {!showProgress && (
          <Button
            variant="contained"
            size="large"
            endIcon={<NavigateNext />}
            sx={{ margin: 2, marginLeft: 'auto' }}
            // className={classes.greenman}
            disabled={error || errorRender || loading}
            onClick={() => onPress()}
          >
            {/* {loading ? loadingTextSelect : text} */}
            Next
          </Button>
        )}
      </Box>

      {/* <MdContentCopy className={classes.nextIcon} size={30} /> */}

      {/* <IconButton
                  aria-label="copy swap id"
                  onClick={handleClickShowPassword}
                  // onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {<ContentCopy />}
                </IconButton> */}

      {/* <View className={classes.controls}>
        {error ? (
          <h1 className={classes.text}> {errorText} </h1>
        ) : (
          <h1 className={loading ? loadingStyleSelect : classes.text}>
            {loading ? loadingTextSelect : text}
          </h1>
        )}
      </View>
      {error ? (
        errorRender ? (
          errorRender(classes.errorCommand, errorAction)
        ) : errorAction ? (
          <span className={classes.errorCommand} onClick={() => errorAction()}>
            Retry
          </span>
        ) : null
      ) : loading && loadingRender ? (
        loadingRender()
      ) : (
        <MdArrowForward className={classes.nextIcon} />
      )} */}
    </View>
  );
};

Controls.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string,
  error: PropTypes.bool,
  errorAction: PropTypes.func,
  errorText: PropTypes.string,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  loadingStyle: PropTypes.string,
  loadingRender: PropTypes.func,
  errorRender: PropTypes.node,
  mobile: PropTypes.bool,
  swapResponse: PropTypes.object,
};

export default injectSheet(styles)(Controls);
