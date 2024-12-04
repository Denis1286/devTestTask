import { AbstractInputWithActions } from './abstract-input-with-action'
import { formatCharsInput, maskIsValid } from './mask-format'
import { Input, InputNumber, Select } from 'antd'

import * as styles from './styles/styles.css'
import MaskedInput from 'react-input-mask'
import cn from 'classnames'

export class TextInputWithActions extends AbstractInputWithActions {
    render() {
        const { style, type, multiline, wrapperClassName } = this.props
        let { mask } = this.props

        mask = mask && maskIsValid(mask) ? mask : undefined

        const textInputContainer = (type !== 'number')
            ? styles.textInputContainer
            : ''

        const containerCN = cn(wrapperClassName, textInputContainer, {
            [styles.inputMask]: !multiline && !!mask,
        })

        const inputStyle = { ...style }

        return (
            <div className={containerCN}>
                {this.renderControl(inputStyle, mask)}
                {this.renderActions(inputStyle)}
            </div>
        )
    }

    renderControl(inputStyle, mask) {
        const value = this.state.value ||
            this.state.value === 0
            ? this.state.value
            : ''

        const inputCN = cn(this.props.className, {
            [styles[this.props.theme]]: !!this.props.theme,
            [styles.inputReadOnly]: this.props.readOnly,
            [styles.readOnly]: this.props.readOnly,
        })

        const params = { mask, value, inputCN, inputStyle }
        const { script, options, type, multiline } = this.props

        if (type === 'number')
            return this.renderInputNumber(params)
        if (mask)
            return this.renderMaskedInput(params)
        if (script)
            return this.renderCodeEditer(params)
        if (options)
            return this.renderSelect(params)
        if (multiline)
            return this.renderTextArea(params)
        if (this.props.children)
            return this.renderAntInput(params)

        return this.renderInput(params)
    }


    renderActions(inputStyle) {
        const { actionsWidth } = this.state
        const { actionsClassName, actions } = this.props

        const actionsCN = styles.inputWithActions
        const actionsStyle = {}

        if (!actions || actions.length === 0)
            actionsStyle.visibility = 'hidden'
        else if (actionsWidth)
            inputStyle.paddingRight = actionsWidth

        if (!(actions && actions.length))
            return null

        const ulcn = cn(actionsClassName, actionsCN)
        const ulref = node => this.actionsNode = node

        return (
            <ul
                ref={ulref}
                className={ulcn}
                style={actionsStyle}
            >
                {actions.map((node, i) => <li key={i}>{node}</li>)}
            </ul>
        )
    }

    renderInputNumber({ value, inputCN }) {
        if (this.props.readOnly)
            return (
                <span className={inputCN}>
                    {this.props.formatter && this.props.formatter(value)}
                </span>
            )
        return (
            <InputNumber
                ref={this.input}
                onKeyDown={this.onKeyDown}
                className={inputCN}
                value={value}
                onChange={this.onChangeNumber}
                onBlur={this.onBlurNumber}
                style={this.props.style}
            />
        )
    }

    renderInput({ value, inputCN, inputStyle }) {
        return (
            <Input
                ref={this.input}
                {...this.props}
                config={this.props.config}
                value={value}
                style={inputStyle}
                className={inputCN}
                onChange={this.onChange}
                onBlur={this.onBlur}
                onKeyDown={this.onKeyDown}
            />
        )
    }

    renderMaskedInput({ inputCN, inputStyle, mask }) {
        return (
            <MaskedInput
                formatChars={formatCharsInput}
                onKeyDown={this.onKeyDown}
                mask={mask}
                {...this.props}
                placeholder={this.getPlaceHolderMask(mask)}
                value={this.state.value}
                style={inputStyle}
                className={inputCN}
                onChange={this.onChangeMasked}
                onBlur={this.onBlur}
                disabled={this.props.readOnly}
            >
                {inputProps => <Input {...inputProps} ref={this.input} />}
            </MaskedInput>
        )
    }

    renderTextArea({ value, inputCN }) {
        return (
            <Input.TextArea
                ref={this.input}
                {...this.props}
                value={value}
                spellCheck='false'
                rows={4}
                autoSize={{
                    maxRows: 20,
                    minRows: this.props.readOnly ? 1 : 1,
                }}
                className={cn(inputCN, styles.textArea)}
                onChange={this.onChange}
                onBlur={this.onBlur}
                onKeyDown={this.onKeyDown}
            />
        )
    }

    renderCodeEditer({ value, inputCN, inputStyle }) {
        return (
            <CodeEditor
                ref={this.input}
                {...this.props}
                value={value}
                style={inputStyle}
                className={inputCN}
                onChange={this.setValue}
                onBlur={this.setBlur}
                subType={this.props.subType}
                rows={this.props.config.get('rows')}
            />
        )
    }

    renderSelect({ value, inputCN, inputStyle }) {
        inputStyle.width = '100%'
        const { options } = this.props

        const valueInOptions = options.some(o => {
            if (o.value === value)
                return true
            if (o.options && o.options.some(o => o.value === value))
                return true
        })

        if (!valueInOptions && value)
            inputCN = cn(inputCN, styles.invalidValue)

        const filterOption = (input, option) =>
            (option.label || '').toLowerCase().includes(input.toLowerCase())

        return (
            <Select
                ref={this.input}
                {...this.props}
                className={inputCN}
                style={inputStyle}
                value={value}
                onChange={this.setValue}
                onBlur={this.onBlurSelect}
                onInputKeyDown={this.onKeyDown}
                showSearch={true}
                bordered={false}
                showArrow={false}
                dropdownMatchSelectWidth={300}
                filterOption={filterOption}
            >
                {this.renderOptGroup()}
            </Select>
        )
    }

    renderSelectOption({ value, label, subLabel }) {
        return (
            <Select.Option value={value} label={label}>
                {label}
                {subLabel && (
                    <span className={styles.optionSubLabel}>
                        {subLabel}
                    </span>
                )}
            </Select.Option>
        )
    }

    renderOptGroup() {
        return this.props.options.map(o => {
            const { options, value, label } = o
            if (options instanceof Array)
                return (
                    <Select.OptGroup key={value} label={label}>
                        {options.map(o => this.renderSelectOption(o))}
                    </Select.OptGroup>
                )
            return this.renderSelectOption(o)
        })
    }

    renderAntInput({ inputCN, inputStyle }) {
        return (
            <div style={inputStyle} className={cn('ant-input', inputCN)}>
                {this.props.children}
            </div>
        )
    }

}
