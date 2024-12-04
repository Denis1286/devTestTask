import { formatCharsInput } from './mask-format'
import { createRef, Component } from 'react'

export class AbstractInputWithActions extends Component {
	constructor(props) {
		super(props)

		this.state = {
			oldValue: '',
			actionsWidth: 0,
			value: this.props.value,
		}

		this.input = createRef()
	}

	recalcActionsWidth() {
		if (!this.actionsNode) return
		const actionsWidth = this.actionsNode.clientWidth
		if (actionsWidth !== this.state.actionsWidth)
			this.setState({ actionsWidth })
	}

	setFocus = () => {
		if (this.props.autoFocus)
			this.input.current.focus()
	}

	setValue = value => {
		this.setState({ value })
		this.onChangeDebounce(value)
	}

	
	synchronize = (e) => {
		if (e.storageArea != localStorage) return
		if (e.key === this.props.id)
				this.onChange({target: { value: e.newValue}})
	} 

	componentDidMount() {
		this.recalcActionsWidth()
		this.setFocus()
		localStorage.setItem(this.props.id, this.state.value)
		addEventListener('storage', this.synchronize)
	}
	
	componentWillUnmount() {
		removeEventListener('storage', this.synchronize)
	}

	componentDidUpdate() {		
		localStorage.setItem(this.props.id, this.state.value)
		this.recalcActionsWidth()
	}

	onChange = ({ target }) => {
		const { value } = target
		this.setState({ value })
		this.onChangeDebounce(value)
		this.setValue(value)
	}


	onBlur = ({ target }) => {
		if (!this.props.readOnly)
			this.setBlur(target.value)
	}

	onBlurSelect = e => {
		if (!this.props.readOnly)
			this.setBlur(this.state.value)
	}

	onChangeNumber = value => {
		const { prepareNumber } = this.props
		value = prepareNumber ? prepareNumber(value) : value
		this.setValue(value)
	}

	onChangeDebounce = value => {
		this.onChangeDebounceCancel()
		this.changeTimer = setTimeout(() =>
			this.props.onChange && this.props.onChange(value), 200)
	}

	onChangeDebounceCancel = () => {
		clearTimeout(this.changeTimer)
	}

	onChangeMasked = ({ target }) => {
		let value = target.value
		let mask = this.props.mask
		mask = mask.replace(/[^-]/g, '_')
		this.setValue(value === mask ? '' : value)
	}

	onBlurNumber = ({ target }) => {
		if (this.props.readOnly)
			return

		let { prepareNumber } = this.props
		let { value } = target

		value = prepareNumber &&
			prepareNumber(value)

		if (value || this.state.oldValue !== '')
			this.setBlur(value)
	}

	onKeyDown = e => {
		this.props.onKeyDown &&
			this.props.onKeyDown(e)

		if (!this.props.allowTabs)
			return

		if (e.key === 'Tab' && !e.shiftKey) {
			e.preventDefault()
			document.execCommand('insertText', false, '\t')
			return false
		}
	}

	setBlur = value => {
		this.setState({ value })
		this.onChangeDebounceCancel()

		const { onChange, onEndEditing } = this.props
		const { oldValue } = this.state

		onChange && onChange(value)
		this.state.oldValue = value

		if (value !== this.state.oldValue) {
			onEndEditing && onEndEditing(value)
		}
		else if (typeof value === 'number' && value !== oldValue) {
			onEndEditing && onEndEditing(value)
		}
	}


	getPlaceHolderMask = mask => {
		let placeholder = ''
		let charsEditableMask = Object.keys(formatCharsInput)
		for (const char of mask) {
			if (char === '\\')
				continue
			placeholder += charsEditableMask.includes(char)
				? '_'
				: char
		}
		return placeholder
	}
}
