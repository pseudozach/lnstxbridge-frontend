import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import { FaCheckCircle } from 'react-icons/fa';
import View from '../../../components/view';
import InputArea from '../../../components/inputarea';
import DropZone from '../../../components/dropzone';
import FileUpload from '../../../components/fileupload';
import { lockupTransactionHash, sampleStacksTxId } from '../../../constants';
import { CheckCircle, Upload } from '@mui/icons-material';
import { Button, IconButton, Input } from '@mui/material';

const UploadRefundFileStyles = theme => ({
  notfullwidth: {
    width: '90%',
  },
  regular: {
    display: 'block !important',
    margin: 'auto',
    textAlign: 'center',
  },
  wrapper: {
    flex: '1 0 100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '1vh',
    // backgroundColor: theme.colors.aeroBlue,
    // backgroundColor: '#fff',
  },
  icon: {
    color: '#50E3C2',
  },
  dropZone: {
    height: '300px',
    zIndex: 2000,
    // width: '700px',
    flexDirection: 'column',
    // border: `3px dotted ${'#D3D3D3'}`,
    alignItems: 'center',
    justifyContent: 'space-around',
    '@media (max-width: 425px)': {
      width: '100%',
      border: 'none',
    },
  },
  info: {
    fontSize: '30px',
    // color: '#4A4A4A',
    '@media (max-width: 425px)': {
      fontSize: '18px',
    },
  },
  mobileInfo: {
    '@media (max-width: 320px)': {
      fontSize: '16px',
    },
  },
});

class StyledUploadRefundFile extends React.Component {
  constructor() {
    super();
    this.state = {
      refundSet: false,
    };
  }

  setRefundFromLocal = async setRefundLocal => {
    try {
      // check if refunding from localstorage
      if (!window.location.href.includes('?')) return;
      const swapId = window.location.href.split('?swapId=')[1];
      if (!localStorage['lnswaps_' + swapId]) return;
      const swapData = localStorage['lnswaps_' + swapId];
      console.log('setRefundFromLocal ', setRefundLocal, swapData);
      setRefundLocal(swapData);
      this.setState({ refundSet: true });
    } catch (error) {
      console.log('error getting swapId: ', error.message);
    }
  };

  render() {
    const {
      classes,
      setRefundFile,
      setTransactionHash,
      isUploaded,
      refundFile,
      setRefundFromTx,
      setRefundLocal,
      // refundStx,
    } = this.props;

    if (!this.state.refundSet) {
      this.setRefundFromLocal(setRefundLocal);
    }

    return (
      <View className={classes.wrapper}>
        {isUploaded ? (
          <CheckCircle
            size={240}
            style={{ fontSize: 240 }}
            className={classes.icon}
            color="success"
          />
        ) : (
          <>
            <DropZone className={classes.dropZone} onFileRead={setRefundFile}>
              <p className={classes.info}>Drag the refund.png here</p>
              {/* <span className={classes.info}>or click to select file</span> */}
              {/* <FileUpload
            text={'Select file'}
            onFileRead={setRefundFile}
            acceptMimeType={'image/png'}
          /> */}
              <label htmlFor="icon-button-file">
                <Input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  // onChange={setRefundFile}
                  onChange={event => {
                    setRefundFile(event.target.files[0]);
                  }}
                  hidden
                  sx={{ display: 'none' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  endIcon={<Upload />}
                >
                  Upload
                </Button>
                {/* <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              size="large"
              variant="outlined"
            >
              <Upload />
            </IconButton> */}
              </label>
            </DropZone>
            <View className={classes.regular}>
              <p className={`${classes.mobileInfo}`}>
                (Optional) If you don't have the refund file, paste Stacks
                lockStx transaction Id
              </p>
              <InputArea
                height={100}
                width={400}
                onChange={setRefundFromTx}
                placeholder={`EG: ${sampleStacksTxId}`}
              />
            </View>
          </>
        )}
        {refundFile.currency === 'BTC' ? (
          <View className={classes.regular}>
            <p className={`${classes.info} ${classes.mobileInfo}`}>
              Paste the tx id of the BTC lockup transaction
            </p>
            <InputArea
              height={100}
              width={400}
              className={classes.notfullwidth}
              onChange={setTransactionHash}
              placeholder={`EG: ${lockupTransactionHash}`}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

StyledUploadRefundFile.propTypes = {
  classes: PropTypes.object.isRequired,
  setRefundFile: PropTypes.func.isRequired,
  isUploaded: PropTypes.bool.isRequired,
  setTransactionHash: PropTypes.func.isRequired,
  setRefundFromTx: PropTypes.func.isRequired,
  // refundStx: PropTypes.func.isRequired,
};

const UploadRefundFile = injectSheet(UploadRefundFileStyles)(
  StyledUploadRefundFile
);

export default UploadRefundFile;
