import React from 'react';

export default class Rule extends React.Component {
    static get defaultProps() {
        return {
            id: null,
            parentId: null,
            field: null,
            operator: null,
            value: null,
            schema: null
        };
    }

    render() {
        const { isRuleMinified, field, operator, value, translations, schema: { fields, controls, getOperators, getLevel, classNames } } = this.props;
        var level = getLevel(this.props.id);
        return (
            <div className={`rule ${classNames.rule}`}>

                {isRuleMinified ?
                    <div className="rule-minified" onClick={this.onToggleRuleView.bind(this, false)}>
                        <span className="rule-minified-field">{field}</span>
                        <span className="rule-minified-operator">{operator}</span>
                        <span className="rule-minified-value">{value ? '"' + value + '"' : ''}</span>
                        {
                            React.createElement(controls.removeRuleAction,
                                {
                                    label: translations.removeRule.label,
                                    title: translations.removeRule.title,
                                    className: `rule-remove ${classNames.removeRule}`,
                                    handleOnClick: this.removeRule,
                                    level: level
                                })
                        }
                    </div>
                    :
                    <div className="rule-box">
                        {
                            React.createElement(controls.fieldSelector,
                                {
                                    options: fields,
                                    title: translations.fields.title,
                                    value: field,
                                    className: `rule-fields ${classNames.fields}`,
                                    handleOnChange: this.onFieldChanged,
                                    level: level
                                }
                            )
                        }
                        {
                            React.createElement(controls.operatorSelector,
                                {
                                    field: field,
                                    title: translations.operators.title,
                                    options: getOperators(field),
                                    value: operator,
                                    className: `rule-operators ${classNames.operators}`,
                                    handleOnChange: this.onOperatorChanged,
                                    level: level
                                }
                            )
                        }
                        {
                            React.createElement(controls.valueEditor,
                                {
                                    field: field,
                                    title: translations.value.title,
                                    operator: operator,
                                    value: value,
                                    className: `rule-value ${classNames.value}`,
                                    handleOnChange: this.onValueChanged,
                                    level: level
                                }
                            )
                        }
                        {
                            React.createElement(controls.removeRuleAction,
                                {
                                    label: translations.removeRule.label,
                                    title: translations.removeRule.title,
                                    className: `rule-remove ${classNames.removeRule}`,
                                    handleOnClick: this.removeRule,
                                    level: level
                                })
                        }
                        <button className="rule-confirm" onClick={this.onToggleRuleView.bind(this, true)}>
                            <img src={require('../../assets/images/common/tick.svg')} alt="Confirm Rule" />
                        </button>
                    </div>
                }

            </div>
        );
    }

    onFieldChanged = (value) => {
        this.onElementChanged('field', value);
    }

    onOperatorChanged = (value) => {
        this.onElementChanged('operator', value);
    }

    onValueChanged = (value) => {
        this.onElementChanged('value', value);
    }

    onToggleRuleView(value) {
        this.onElementChanged('isRuleMinified', value)
    }

    onElementChanged = (property, value) => {
        const { id, schema: { onPropChange } } = this.props;

        onPropChange(property, value, id);
    }

    removeRule = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.props.schema.onRuleRemove(this.props.id, this.props.parentId);
    }
}