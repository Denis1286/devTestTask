import { useState } from 'react'
import { Input } from 'antd'

export function CodeEditor({ onChange, onBlur, inputRef, ...props }) {
    const [textAreaValue, setTextAreaValue] = useState('')

    const _onChange = ({ target }) => {
        const { value } = target
        setTextAreaValue(value)
        onChange && onChange(value)
    }

    const _onBlur = () => {
        onBlur && onBlur(textAreaValue)
    }

    return (
        <Input.TextArea
            rows={4}
            ref={inputRef}
            onBlur={_onBlur}
            style={props.style}
            onChange={_onChange}
            value={textAreaValue}
            className={props.className}
        />
    )
}