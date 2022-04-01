import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import Link from '../../../components/link';
import View from '../../../components/view';
import { getExplorer } from '../../../utils';
import { FaCheckCircle } from 'react-icons/fa';
import { CheckCircle, OpenInNew } from '@mui/icons-material';
import { Button, Paper, Typography } from '@mui/material';

const CompleteRefundStyles = theme => ({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    // backgroundColor: theme.colors.aeroBlue,
    // backgroundColor: '#fff',
  },
  icon: {
    color: '#50E3C2',
  },
  title: {
    margin: '15px',
    fontSize: '42px',
    fontWeight: 300,
  },
  transaction: {
    wordBreak: 'break-all',
    paddingLeft: '1vw',
    paddingRight: '1vw',
    fontSize: '24px',
    fontWeight: 300,
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
});

const StyledCompleteRefund = ({ classes, currency, refundTransactionHash }) => (
  <View className={classes.wrapper}>
    <Paper
      variant="outlined"
      sx={{
        // backgroundColor: '#f8f4fc',
        m: 1,
        py: 1,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <CheckCircle
        color="success"
        fontSize="large"
        sx={{ m: 1, fontSize: 36 }}
      />
      <Typography
        variant="body1"
        gutterBottom
        component="div"
        sx={{
          mx: 'auto',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          marginBottom: 0,
        }}
        // color={this.state.statusColor}
      >
        Refund Successful!
      </Typography>
    </Paper>

    {/* <CheckCircle
      size={200}
      style={{ fontSize: 240 }}
      className={classes.icon}
      color="success"
    />
    <span className={classes.title}> Success! </span> */}
    {/* <p className={classes.transaction}>
      <Link
        to={`${getExplorer(currency)}/tx/${refundTransactionHash}`}
        text={'Click here'}
      />{' '}
      to see the refund transaction
    </p> */}
    <Button
      href={`${getExplorer(currency)}/tx/${refundTransactionHash}`}
      // underline="none"
      sx={{ m: 1, color: 'white', display: 'flex !important', mt: 3 }}
      target="_blank"
      rel="noreferrer"
      variant="outlined"
      endIcon={<OpenInNew sx={{ verticalAlign: 'middle' }} />}
      fullWidth
    >
      View on Explorer
    </Button>
  </View>
);

StyledCompleteRefund.propTypes = {
  classes: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  refundTransactionHash: PropTypes.string.isRequired,
};

const CompleteRefund = injectSheet(CompleteRefundStyles)(StyledCompleteRefund);

export default CompleteRefund;
