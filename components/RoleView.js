import React from 'react';
import '../sass/views/roleView.scss';
import MdEdit from 'material-ui/svg-icons/image/edit';
import MdDelete from 'material-ui/svg-icons/action/delete';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ModalEditRole from '../modals/ModalEditRole';
import ModalCreateRole from '../modals/ModalCreateRole';
import { connect } from 'react-redux';
import OrganizationRegisterActions from '../actions/OrganizationRegisterActions';
import { sortByColumns } from '../modals/utils';

class RoleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateModalOpen: false,
      isEditModalOpen: false,
      activeRole: null,
      sortOrder: {
        column: null,
        asc: true
      }
    };
  }

  handleEditRole(role) {
    this.setState({
      activeRole: role,
      isEditModalOpen: true
    });
  }

  handleSortOrder(column) {
    const { sortOrder } = this.state;

    let asc = true;

    if (sortOrder.column == column) {
      if (sortOrder.asc) {
        asc = false;
      }
    }

    this.setState({
      sortOrder: {
        column,
        asc
      }
    });
  }

  componentDidMount() {
    this.props.dispatch(OrganizationRegisterActions.getRoles());
  }

  handleCreateRole(role) {
    this.props.dispatch(OrganizationRegisterActions.createRole(role));
  }

  handleUpdateRole(role) {
    this.props.dispatch(OrganizationRegisterActions.updateRole(role));
  }

  handleDeleteRole(role) {
    this.props.dispatch(OrganizationRegisterActions.deleteRole(role.id));
  }

  componentWillReceiveProps(nextProps) {
    const { isCreateModalOpen, isEditModalOpen } = this.state;
    if (
      nextProps.status &&
      nextProps.status.error == null &&
      (isCreateModalOpen || isEditModalOpen)
    ) {
      this.setState({
        isCreateModalOpen: false,
        isEditModalOpen: false
      });
    }
  }

  render() {
    const { roles } = this.props;
    const { sortOrder } = this.state;

    const sortedRoles = sortByColumns(roles, sortOrder);

    return (
      <div className="role-row">
        <div className="role-header">
          <div className="col-1-3">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('privateCode')}
            >
              private code
            </span>
          </div>
          <div className="col-1-3">
            <span
              className="sortable"
              onClick={() => this.handleSortOrder('name')}
            >
              name
            </span>
          </div>
        </div>
        {sortedRoles.map(role => {
          return (
            <div key={'role-' + role.id} className="role-row-item">
              <div className="col-1-3">{role.privateCode}</div>
              <div className="col-1-3">{role.name}</div>
              <div className="col-icon" style={{ cursor: 'pointer' }}>
                <MdDelete
                  color="#fa7b81"
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 10,
                    verticalAlign: 'middle',
                    cursor: 'pointer'
                  }}
                  onClick={() => this.handleDeleteRole(role)}
                />
                <MdEdit
                  color="rgba(25, 118, 210, 0.59)"
                  onClick={() => this.handleEditRole(role)}
                  style={{
                    height: 20,
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          );
        })}
        <FloatingActionButton
          mini={true}
          style={{ float: 'right', marginRight: 10 }}
        >
          <ContentAdd
            onClick={() => this.setState({ isCreateModalOpen: true })}
          />
        </FloatingActionButton>
        {this.state.isCreateModalOpen
          ? <ModalCreateRole
              isModalOpen={this.state.isCreateModalOpen}
              handleCloseModal={() =>
                this.setState({ isCreateModalOpen: false })}
              takenPrivateCodes={roles.map(role => role.privateCode)}
              handleSubmit={this.handleCreateRole.bind(this)}
            />
          : null}
        {this.state.isEditModalOpen
          ? <ModalEditRole
              isModalOpen={this.state.isEditModalOpen}
              role={this.state.activeRole}
              handleCloseModal={() => this.setState({ isEditModalOpen: false })}
              handleSubmit={this.handleUpdateRole.bind(this)}
            />
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  roles: state.OrganizationReducer.roles,
  status: state.OrganizationReducer.roleStatus
});

export default connect(mapStateToProps)(RoleView);
