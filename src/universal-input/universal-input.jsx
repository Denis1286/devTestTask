import { TextInputWithActions } from './text-input-with-actions'
import { useState, useId } from 'react'

import * as styles from './styles/styles.css'
import cn from 'classnames'

export function UniversalInput({
    updateProcess,
    onEndEditing,
    eventable,
    onChange,
    actions,
    ...props
}) {
    const [shouldProcess, setShouldProcess] = useState(false)
    const id = useId()

    const _onChange = value => {  
        onChange && onChange(value)
        eventable && setShouldProcess(true)
    }

    const _onEndEditing = value => {
        onEndEditing && onEndEditing(value)
        setShouldProcess(false)
    }

    const inProcess = updateProcess && updateProcess.get('inProcess')
    const newActions = [...(actions || [])]

    if (shouldProcess || inProcess)
        newActions.push(createAction(inProcess ? '' : 'ready to send'))

    return (
        <TextInputWithActions
            onEndEditing={_onEndEditing}
            onChange={_onChange}
            actions={newActions}
            id={id}
            {...props}
        />
    )
}

function createAction(title) {
    return <span
        className={getActionClassName()}
        title={title} />
}

function getActionClassName() {
    return cn(styles.actionIcon, {
        [styles.actionIconGray]: inProcess
    })
}