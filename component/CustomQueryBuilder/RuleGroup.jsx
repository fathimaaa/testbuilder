import React from 'react';
import Rule from './Rule';

export default class RuleGroup extends React.Component {
    static get defaultProps() {
        return {
            id: null,
            parentId: null,
            rules: [],
            combinator: 'and',
            schema: {},
            groupName: '',
            isRuleGroupMinified: false
        };
    }

    render() {
        const { isRuleGroupMinified, groupName, combinator, rules, translations, schema: { combinators, controls, onRuleRemove, isRuleGroup, getLevel, classNames } } = this.props;
        const level = getLevel(this.props.id);

        return (
            <div className={`ruleGroup ${classNames.ruleGroup}` + (isRuleGroupMinified ? " hideBgBorder" : "")}>

                {isRuleGroupMinified ?
                    <div className={("rule-group-minified") + ((combinator === 'and') ? " bg-darkGreen" : " bg-orange")} onClick={this.toggleRuleGroupView.bind(this, false)}>
                        <p className="rule-group-minified-field">{groupName || combinator}</p>
                        {
                            this.hasParentGroup() ?
                                React.createElement(controls.removeGroupAction,
                                    {
                                        label: translations.removeGroup.label,
                                        title: translations.removeGroup.title,
                                        className: `ruleGroup-remove ${classNames.removeGroup}`,
                                        handleOnClick: this.removeGroup,
                                        rules: rules,
                                        level: level
                                    }
                                ) : null
                        }
                    </div>
                    :
                    <div>
                        {
                            this.hasParentGroup() ?
                                <input type="text"
                                    placeholder="Group Name"
                                    className="group-name-input"
                                    value={groupName}
                                    onChange={this.onChangeGroupName.bind(this)} /> : null
                        }
                        {
                            React.createElement(controls.combinatorSelector,
                                {
                                    options: combinators,
                                    value: combinator,
                                    title: translations.combinators.title,
                                    className: `ruleGroup-combinators ${classNames.combinators}`,
                                    handleOnChange: this.onCombinatorChange,
                                    rules: rules,
                                    level: level
                                }
                            )
                        }
                        {
                            React.createElement(controls.addRuleAction,
                                {
                                    label: translations.addRule.label,
                                    title: translations.addRule.title,
                                    className: `ruleGroup-addRule ${classNames.addRule}`,
                                    handleOnClick: this.addRule,
                                    rules: rules,
                                    level: level
                                }
                            )
                        }
                        {
                            React.createElement(controls.addGroupAction,
                                {
                                    label: translations.addGroup.label,
                                    title: translations.addGroup.title,
                                    className: `ruleGroup-addGroup ${classNames.addGroup}`,
                                    handleOnClick: this.addGroup,
                                    rules: rules,
                                    level: level
                                }
                            )
                        }
                        {
                            this.hasParentGroup() ?
                                React.createElement(controls.removeGroupAction,
                                    {
                                        label: translations.removeGroup.label,
                                        title: translations.removeGroup.title,
                                        className: `ruleGroup-remove ${classNames.removeGroup}`,
                                        handleOnClick: this.removeGroup,
                                        rules: rules,
                                        level: level
                                    }
                                ) : null
                        }
                        {
                            this.hasParentGroup() ?
                                <button className="rule-group-confirm" onClick={this.toggleRuleGroupView.bind(this, true)}>
                                    <img src={require('../../assets/images/common/tick.svg')} alt="Confirm Rule" />
                                </button> : null
                        }
                        <div className="rule-group-children">
                            {
                                rules.map(r => {
                                    return (
                                        isRuleGroup(r) ?
                                            <RuleGroup key={r.id}
                                                id={r.id}
                                                schema={this.props.schema}
                                                parentId={this.props.id}
                                                combinator={r.combinator}
                                                translations={this.props.translations}
                                                rules={r.rules}
                                                groupName={r.groupName}
                                                isRuleGroupMinified={r.isRuleGroupMinified} />
                                            :
                                            <Rule key={r.id}
                                                id={r.id}
                                                field={r.field}
                                                value={r.value}
                                                operator={r.operator}
                                                schema={this.props.schema}
                                                parentId={this.props.id}
                                                translations={this.props.translations}
                                                onRuleRemove={onRuleRemove}
                                                isRuleMinified={r.isRuleMinified} />
                                    );
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }

    hasParentGroup() {
        return this.props.parentId;
    }

    onCombinatorChange = (value) => {
        const { onPropChange } = this.props.schema;

        onPropChange('combinator', value, this.props.id);
    }

    addRule = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { createRule, onRuleAdd } = this.props.schema;

        const newRule = createRule();
        onRuleAdd(newRule, this.props.id)
    }

    addGroup = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { createRuleGroup, onGroupAdd } = this.props.schema;
        const newGroup = createRuleGroup();
        onGroupAdd(newGroup, this.props.id)
    }

    removeGroup = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.props.schema.onGroupRemove(this.props.id, this.props.parentId);
    }

    toggleRuleGroupView(value) {
        const { onPropChange } = this.props.schema;

        onPropChange('isRuleGroupMinified', value, this.props.id);
    }

    onChangeGroupName(event) {
        const { onPropChange } = this.props.schema;

        onPropChange('groupName', event.target.value, this.props.id);
    }
}