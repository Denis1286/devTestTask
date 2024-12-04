import { useState } from 'react'
import './App.css'

import { UniversalInput } from './universal-input/universal-input'
import { UniversalForm } from './universal-form/universal-form'

const App = () => {
	const [firstValue, setFirstValue] = useState('')
	const [secondValue, setSecondValue] = useState('')
	const [thirdValue, setThirdValue] = useState('')
	const [fourValue, setFourValue] = useState('')
	const [fiveValue, setFiveValue] = useState('')

	return (
		<div className='main'>
			<UniversalForm header='THIS IS NOT A TEST TASK' width='540px'>
				<UniversalInput
					type='number'
					disabled={false}
					value={firstValue}
					onChange={(e) => setFirstValue(e)}
					placeholder='Number type'
					style={{ width: '100%' }}
				/>
				<UniversalInput
					disabled={false}
					value={secondValue}
					onChange={(e) => setSecondValue(e)}
					placeholder='Text type'
					style={{ width: '100%' }}
				/>
				<UniversalInput
					multiline={true}
					disabled={false}
					value={thirdValue}
					onChange={(e) => setThirdValue(e)}
					placeholder='Text multiline type'
					style={{ width: '100%' }}
				/>
				<UniversalInput
					disabled={false}
					value={fourValue}
					onChange={(e) => setFourValue(e)}
					mask={'111-111'}
					placeholder='With mask'
					style={{
						width: '100%',
						backgroundColor: 'white',
						color: 'black',
						borderRadius: '15px',
					}}
				/>
				<UniversalInput
					disabled={false}
					value={fiveValue}
					onChange={(e) => setFiveValue(e)}
					options={[
						{ value: 'first element', label: 'first element' },
						{ value: 'second element', label: 'second element' },
						{ value: 'third element', label: 'third element' },
					]}
					placeholder='Another type'
					style={{
						width: '100%',
						backgroundColor: 'white',
						color: 'black',
						borderRadius: '15px',
					}}
				/>
			</UniversalForm>
		</div>
	)
}

export default App