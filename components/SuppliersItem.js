import React, { PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import { connect } from 'react-redux'
import classNames from 'classnames'

require('../sass/components/lists.scss')

class ProviderItem extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired
  }

  selectSupplier(data) {
    this.props.store.dispatch(SuppliersActions.selectActiveSupplier(data.id))
    this.props.store.dispatch(SuppliersActions.fetchFilenames(data.id))
  }

  render() {

    const { name, id, activeId } = this.props

    const liClass = classNames({
      'active' : (id === activeId)
    })

    return (
      <li className={liClass} onClick={() => this.selectSupplier({id})}>
        {id} {name}
      </li>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  return {
    activeId: state.suppliersReducer.activeId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(ProviderItem)
