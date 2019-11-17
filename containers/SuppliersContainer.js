import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import SuppliersActions from '../actions/SuppliersActions';
import cfgreader from '../config/readConfig';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import MdNew from 'material-ui/svg-icons/content/add';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import { getQueryVariable } from './utils';
import Checkbox from 'material-ui/Checkbox';
import Popover from 'material-ui/Popover';
import MdDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import Divider from 'material-ui/Divider';
import moment from 'moment';
import roleParser from '../roles/rolesParser';
import MdEdit from 'material-ui/svg-icons/image/edit';
import GraphStatus from '../components/GraphStatus';
import FlatButton from 'material-ui/FlatButton';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import ConfirmDialog from '../modals/ConfirmDialog';
import { getProvidersEnv, getTheme, getIconColor } from '../config/themes';

class SuppliersContainer extends React.Component {
  constructor(props) {
    super(props);

    let tasks = {};

    this.state = {
      anchorEl: null,
      confirmDialogOpen: false,
      confirmAction: null,
      confirmTitle: '',
      confirmInfo: '',
      cleanPopoverOpen: false,
      googlePopoverOpen: false,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    cfgreader.readConfig(
      function(config) {
        window.config = config;
        dispatch(SuppliersActions.getAllProviders());

        if (!!getQueryVariable('id')) {
          dispatch(
            SuppliersActions.selectActiveSupplier(getQueryVariable('id'))
          );
        }
      }.bind(this)
    );
  }

  selectSupplier(value) {
    const { dispatch } = this.props;
    if (value > 0) {
      dispatch(SuppliersActions.selectActiveSupplier(value));
    } else {
      dispatch(SuppliersActions.selectAllSuppliers());
    }
  }

  handleNewProvider() {
    this.props.dispatch(SuppliersActions.openNewProviderDialog());
  }

  handleCancelAllJobs() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Annuler tous les IEV',
      confirmInfo:
        'Etes-vous sûr de vouloir annuler les IEV pour toutes les filiales ?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.cancelAllChouetteJobsforAllProviders());
      }
    });
  }

  exportAllStopPlaces() {
    const { dispatch } = this.props;
    dispatch(SuppliersActions.exportStopPlacesAllProviders());
  }


  handleCleanAllDataSpaces(filter) {
    let filterText = '';

    switch (filter) {
      case 'level1':
        filterText = ' dans l\'espace de niveau 1';
        break;
      case 'level2':
        filterText = ' dans l\'espace de niveau 2';
        break;
      default:
        break;
    }

    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Nettoyer les espaces de données',
      confirmInfo: `Etes-vous sûr de vouloir nettoyer les espaces de données de toutes les filiales${filterText}?`,
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.cleanAllDataspaces(filter));
      },
      cleanPopoverOpen: false
    });
  }

  handleCleanFileFilter() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Nettoyer la liste des fichiers d\'imports',
      confirmInfo: 'Etes-vous sûr de vouloir nettoyer la liste des fichiers d\'import ?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.cleanFileFilter());
      },
      cleanPopoverOpen: false
    });
  }


  handleClearEventHistory() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Nettoyer la liste des imports',
      confirmInfo: 'Etes vous sûr de vouloir nettoyer l\'historique des imports ?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.deleteAllJobs());
      },
      cleanPopoverOpen: false
    });
  }

  handleEditProvider() {
    this.props.dispatch(SuppliersActions.openEditProviderDialog());
  }

  handleCleanOpen(event) {
    event.preventDefault();

    this.setState({
      cleanPopoverOpen: true,
      anchorEl: event.currentTarget
    });
  }

  getColorByStatus(status) {
    switch (status) {
      case 'STARTED':
        return '#08920e';
      case 'OK':
        return '#08920e';
      case 'FAILED':
        return '#990000';
      default:
        return 'grey';
    }
  }


  render() {

    const { suppliers, activeProviderId, otherStatus, kc } = this.props;
    const isAdmin = roleParser.isAdmin(kc.tokenParsed);
    const providersEnv = getProvidersEnv(window.config.providersBaseUrl);
    const iconColor = getIconColor(providersEnv);

    const supplierItems = [
      {
        id: -1,
        name: 'Toutes les filiales'
      }
    ].concat(suppliers);

    let innerContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      borderTop: '1px solid rgba(158, 158, 158, 0.15)',
      ...getTheme(providersEnv)
    };

    const toolTips = {
      history: 'Voir l\'historique de vos activités dans l\'administration',
      cleanFileFilter: 'Nettoyer la liste des fichiers d\'import',
      canceAllJobs: 'Annuler tous les IEV en cours',
      cleanAll: 'Nettoyage par niveau',
      createNewProvider: 'Créer une nouvelle filiale',
      editProvider: 'Modifier une filiale',
      cleanEventHistory: 'Nettoyer la liste des imports'
    };



    return (
      <div className="suppliers-container">
        <div style={innerContainerStyle}>
          <div>
            <FlatButton
              disabled={!isAdmin}
              onClick={this.handleCleanOpen.bind(this)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MdWarning
                  color={iconColor}
                  style={{ height: '1.1em', width: '1.1em', paddingLeft: 10 }}
                />
                <div
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 2,
                    textTransform: 'uppercase'
                  }}
                >
                  Nettoyage
                </div>
                <MdDropDown color="#fff"/>
              </div>
            </FlatButton>
            <FlatButton
              disabled={!isAdmin}
              title={toolTips.canceAllJobs}
              style={{transform: 'translateY(-3px)'}}
              labelStyle={{ fontSize: 12, color: '#fff' }}
              label={'Annuler tous les IEV en cours'}
              icon={
                <MdWarning
                  color={iconColor}
                  style={{ height: '1.1em', width: '1.1em' }}
                />
              }
              onClick={() => this.handleCancelAllJobs()}
            />
            <FlatButton
                disabled={!isAdmin}
                style={{transform: 'translateY(-3px)'}}
                labelStyle={{ fontSize: 12, color: '#fff' }}
                label={'Export des points d\'arrets'}
                onClick={() => this.exportAllStopPlaces()}
            />
          </div>
          <Popover
            open={this.state.cleanPopoverOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={() => this.setState({ cleanPopoverOpen: false })}
          >
            <MenuItem
              primaryText={'Nettoyer la liste des fichiers d\'import'}
              style={{ fontSize: '1.1em' }}
              onClick={() => this.handleCleanFileFilter()}
              disabled={!isAdmin}
              title={toolTips.cleanFileFilter}
            />
            <MenuItem
              primaryText={'Nettoyer la liste des imports'}
              style={{ fontSize: '1em' }}
              onClick={() => this.handleClearEventHistory()}
              disabled={!isAdmin}
              title={toolTips.cleanEventHistory}
            />
            <MenuItem
              disabled={!isAdmin}
              id="dropdown-clean-all"
              primaryText={'Clean all'}
              style={{ fontSize: '1em' }}
              rightIcon={<ArrowDropRight />}
              menuItems={[
                <MenuItem
                  primaryText={'Tous'}
                  onClick={() => this.handleCleanAllDataSpaces('all')}
                  style={{ fontSize: '1em' }}
                />,
                <MenuItem
                  primaryText={'Niveau 1'}
                  onClick={() => this.handleCleanAllDataSpaces('level1')}
                  style={{ fontSize: '1em' }}
                />,
                <MenuItem
                  primaryText={'Niveau 2'}
                  onClick={() => this.handleCleanAllDataSpaces('level2')}
                  style={{ fontSize: '1em' }}
                />
              ]}
            />
          </Popover>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: 'auto',
            width: '98%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SelectField
              id="select-supplier"
              floatingLabelFixed={true}
              style={{ minWidth: 350 }}
              floatingLabelText={'Filiale'}
              onChange={(e, k, v) => this.selectSupplier(v)}
              autoWidth={true}
              value={Number(activeProviderId) || -1}
              iconStyle={{ fill: 'rgba(22, 82, 149, 0.69)' }}
            >
              {supplierItems.map(supplier => {
                const isLevel1Provider =
                  (supplier.chouetteInfo &&
                    supplier.chouetteInfo.migrateDataToProvider) ||
                  supplier.id == -1;
                return (
                  <MenuItem
                    key={supplier.id}
                    value={supplier.id}
                    label={supplier.name}
                    primaryText={
                      <span
                        style={{
                          color: isLevel1Provider ? 'intial' : '#d9a51b'
                        }}
                      >
                        {supplier.name}
                      </span>
                    }
                  />
                );
              })}
            </SelectField>
            <div
              style={{ display: 'inline-block', marginTop: 25, marginLeft: 15 }}
            >
              <div
                title={toolTips.editProvider}
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  marginRight: 10
                }}
                onClick={() => this.handleEditProvider()}
              >
                {!this.props.displayAllSuppliers &&
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MdEdit style={{ width: '1.1em', height: '1.1em' }} />
                    <span style={{ marginLeft: 2 }}>Edit</span>
                  </div>}
              </div>
              <div
                title={toolTips.createNewProvider}
                style={{ display: 'inline-block', cursor: 'pointer' }}
                onClick={() => this.handleNewProvider()}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdNew style={{ width: '1.2em', height: '1.2em' }} />
                  <span style={{ marginLeft: 2 }}>New</span>
                </div>
              </div>
            </div>
          </div>
          <GraphStatus />
          <ConfirmDialog
            open={this.state.confirmDialogOpen}
            handleSubmit={this.state.confirmAction}
            title={this.state.confirmTitle}
            info={this.state.confirmInfo}
            handleClose={() => {
              this.setState({
                confirmDialogOpen: false,
                confirmAction: null
              });
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  suppliers: state.SuppliersReducer.data,
  activeProviderId: state.SuppliersReducer.activeId,
  otherStatus: state.SuppliersReducer.otherStatus || [],
  kc: state.UserReducer.kc,
  displayAllSuppliers: state.SuppliersReducer.all_suppliers_selected
});

export default connect(mapStateToProps)(SuppliersContainer);
