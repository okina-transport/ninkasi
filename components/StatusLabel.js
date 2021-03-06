import React, {Component} from 'react';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import MdError from 'material-ui/svg-icons/alert/error';
import MdOK from 'material-ui/svg-icons/action/check-circle';
import { ExportStatus } from '../actions/formatUtils';


class StatusLabel extends Component {

  getIcon(type) {

    const errorColor = 'red';
    const warningColor = 'orange';
    const successColor = 'green';

    if (type === ExportStatus.ERROR) {
      return <MdError style={{height: 20, width: 20}} color={errorColor}/>
    } else if (type === ExportStatus.WARNING) {
      return <MdWarning style={{height: 20, width: 20}} color={warningColor}/>
    } else if (type === ExportStatus.OK) {
      return <MdOK style={{height: 20, width: 20}} color={successColor}/>
    } else {
      return null;
    }
  }

  render() {

    const { type, label } = this.props;
    const icon = this.getIcon(type);

    if (!type) return null;

    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        {icon}
        <span style={{marginLeft: 5}}>
          {label}
        </span>
      </div>
    );
  }
}


export default StatusLabel;
