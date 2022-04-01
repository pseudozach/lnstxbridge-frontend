import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import { MdContentCopy } from 'react-icons/md';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from '@mui/material';

const styles = theme => ({
  wrapper: {
    textAlign: 'center',
    fontSize: 18,
    border: 'none',
    borderRadius: '2px',
    margin: '5px',
    backgroundColor: '#D3D3D3',
    width: '90%',
    height: '50px',
    outline: p => (p.error ? '1px solid red' : 'none'),
  },
  copyButtonSpan: {
    verticalAlign: 'middle',
  },
});

// const copyToClipBoard = (id) => {
//   console.log('copying to clipboard from id ', id);
//   const range = document.createRange();
//   range.selectNodeContents(document.getElementById(id));

//   window.getSelection().removeAllRanges();
//   window.getSelection().addRange(range);

//   document.execCommand(id);
// };

class Input extends React.PureComponent {
  // onChange = e => {
  //   this.props.onChange(e.target.value);
  // };

  render() {
    const {
      classes,
      className,
      disable,
      min,
      max,
      value,
      step,
      id,
    } = this.props;
    // console.log('textinput render id ', id);
    const classname = className
      ? `${classes.wrapper} ${className}`
      : classes.wrapper;

    return (
      <div>
        <input
          disabled={disable}
          // step={step}
          // min={min}
          // max={max}
          className={classname}
          // onChange={this.onChange}
          value={value}
          type={'text'}
          id={id}
        />
        {/* <span className={classes.action} onClick={() => copyToClipBoard(id)}>
          <MdContentCopy className={classes.nextIcon} size={30}/>
        </span> */}
        {/* <Tooltip
          // open={this.state.copied}
          disableFocusListener={true}
          disableHoverListener={true}
          title="Copied"
        >
          <CopyToClipboard
            text={value}
            onCopy={() => this.setState({ copied: true })}
          >
            <span className={classes.copyButtonSpan}>
              <MdContentCopy className={classes.nextIcon} size={30} />
            </span>
          </CopyToClipboard>
        </Tooltip> */}
      </div>
    );
  }
}

Input.defaultProps = {
  min: 0,
  step: 1,
};

Input.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  disable: PropTypes.bool,
  error: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.string,
  id: PropTypes.string,
};

export default injectSheet(styles)(Input);
