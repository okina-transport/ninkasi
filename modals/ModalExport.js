import {connect} from 'react-redux';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from "material-ui/MenuItem";
import SelectField from 'material-ui/SelectField';

class ModalExport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [], // Catégories de lignes
            linesIdSelected: [], // ID des lignes sélectionnées
            currentCategory: -1 // ID de la catégorie sélectionnée
        };

        this.props.handleGetLines();

        this.getLinesFromCategory = this.getLinesFromCategory.bind(this);
    }

    componentWillUpdate() {

        const {lines} = this.props;

        // On alimente les catégories si les lignes ont été récupérées
        if (lines && this.state.categories.length === 0) {
            const linesArray = Object.keys(lines);
            if (linesArray.length > 0) {

                let categories = [];

                linesArray.forEach(function (i) {

                    let found = false;
                    for (let j = 0; j < categories.length; j++) {
                        if (categories[j].id === lines[i].right.id) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        categories.push({
                            id: lines[i].right.id,
                            name: lines[i].right.name
                        });
                    }
                });
                this.setState({categories: categories});
            }
        }
    }

    selectLine(lines, value) {

        let linesIdSelected = [];
        this.getLinesFromCategory(lines, value).forEach(function (line) {
            linesIdSelected.push(line.id);
        });

        this.setState({currentCategory: value, linesIdSelected: linesIdSelected});
    }

    getLinesFromCategory(lines, currentCategory) {
        const linesId = Object.keys(lines);
        let array = [];

        linesId.forEach(function (i) {
            if (lines[i].right.id === currentCategory) {
                array.push({
                    id: i, // ID de la ligne
                    name: lines[i].left // Nom de la ligne
                });
            }
        });
        return array;
    }

    render() {
        const {handleClose, handlePostLines,  open, lines} = this.props;

        const actions = [
            <FlatButton
                label={"Close"}
                onClick={() => {
                    handleClose()
                }}
            />,
            <FlatButton
                label={"Export"}
                onClick={() => {
                    handlePostLines(this.state.linesIdSelected)
                }}
            />
        ];

        return (
            <Dialog
                actions={actions}
                open={open}
                onRequestClose={() => handleClose()}
                title={'Export'}>
                <div>
                    <SelectField
                        id="select-category"
                        floatingLabelFixed={true}
                        style={{minWidth: '100%'}}
                        floatingLabelText={'Catégorie de ligne'}
                        autoWidth={true}
                        value={this.state.currentCategory}
                        onChange={(e, k, v) => this.selectLine(lines, v)}>
                        {this.state.categories.map(c => {
                            return (
                                <MenuItem
                                    key={c.id}
                                    value={c.id}
                                    label={c.name}
                                    primaryText={c.name}
                                />
                            );
                        })}
                    </SelectField>
                </div>
                {this.getLinesFromCategory(lines, this.state.currentCategory).map(i => {
                    return <li key={i.id}>{i.name}</li>
                })}
            </Dialog>
        );
    }
}

const mapStateToProps = ({UtilsReducer}) => ({
    isModalOpen: UtilsReducer.isModalOpen,
    filteredLoggedEvents: UtilsReducer.filteredLoggedEvents,
    lines: UtilsReducer.lines
});

export default connect(mapStateToProps)(ModalExport);
