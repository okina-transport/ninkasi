import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';

class AdminZoneSearchWrapper extends React.Component {
  getZoneType(type) {
    let typeMap = {
      COUNTRY: 'Country',
      COUNTY: 'County',
      LOCALITY: 'Muncipality',
      CUSTOM: 'Custom'
    };
    return typeMap[type] || 'Uknown';
  }

  handleNewRequest({ value, text }, index) {
    if (value && text) {
      this.props.handleNewRequest({
        value,
        text
      });
    }

    this.refs.adminSearch.setState({
      searchText: ''
    });
  }

  render() {
    const { administrativeZones, chip, handleDeleteChip } = this.props;

    const formattedZones = administrativeZones.map(zone => ({
      text: `${zone.name}  (${this.getZoneType(zone.type)})`,
      value: zone.id
    }));

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <AutoComplete
          style={{ marginTop: -5, flex: 2 }}
          hintText="Restrict to administrative zone"
          ref="adminSearch"
          onNewRequest={this.handleNewRequest.bind(this)}
          maxSearchResults={7}
          menuProps={{
            desktop: true,
            disableAutoFocus: true
          }}
          animated={true}
          fullWidth={true}
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={formattedZones}
        />
        <div style={{ flex: 1, width: '100%', textAlign: 'center' }}>
          {chip
            ? <Chip
                style={{ marginTop: -12, marginLeft: 20 }}
                onRequestDelete={handleDeleteChip}
              >
                {chip.name}
              </Chip>
            : <div style={{ fontSize: 12, fontStyle: 'italic' }}>
                No restrictions ...
              </div>}
        </div>
      </div>
    );
  }
}

export default AdminZoneSearchWrapper;
