import React, { useState, useEffect } from 'react'
import { submitComment } from '../services';

const CommentsForm = ({ slug }) => {
	const [error, setError] = useState(false)
	const [localStorage, setLocalStorage] = useState(null);
	const [showSuccessMassage, setShowSuccesMassage] = useState(false)
	const [formData, setFormData] = useState({
		name: null,
		email: null,
		comment: null,
		storeData: false
	})

	useEffect(() => {
		setLocalStorage(window.localStorage)	
		const initialFormData = {
			name: window.localStorage.getItem('name') || '',
			email: window.localStorage.getItem('email') || '',
			storeData: window.localStorage.getItem('name') || window.localStorage.getItem('email')
		}
		setFormData(initialFormData)
	}, [])

	const onInputChange = (e) => {
		const { target } = e
		if (target.type === 'checkbox') {
			setFormData((prevState) => ({
				...prevState,
				[target.name]: target.checked
			}))
		} else {
			setFormData((prevState) => ({
				...prevState,
				[target.name]: target.value
			}))
		}

	}

	const handlePostSubmission = () => {
		setError(false)
		const {name, email, comment, storeData } = formData
		if (!name || !email || !comment) {
			setError(true)
			return
		}

		const commentObj = { name, email, comment, slug }

		if (storeData) {
			localStorage.setItem('name', name)
			localStorage.setItem('email', email)
		} else {
			localStorage.removeItem('name')
			localStorage.removeItem('email')
		}
		// console.log(commentObj);
		submitComment(commentObj)
		.then((res) => {
			setShowSuccesMassage(true)
			setTimeout(() => {
				setShowSuccesMassage(false)
			}, 3000)
		})
	}

	return (
		<div className='bg-white shadow-lg rounded-lg p-8 pb-12 mb-8'>
			<h3 className="text-xl mb-8 font-semibold border-b pb-4">Leave a Reply</h3>
			<div className="grid grid-cols-1 gap-4 mb-4">
				<textarea
					value={formData.comment || ''}
					onChange={onInputChange}
					className='p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700'
					name='comment'
					placeholder='Comment'
				>
				</textarea>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
				<input
					value={formData.name || ''}
					onChange={onInputChange}
					type="text"
					className='py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700'
					placeholder='Name'
					name='name' />
				<input
					value={formData.email || ''}
					onChange={onInputChange}
					type="email"
					className='py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700'
					placeholder='Email'
					name='email' />
			</div>
			<div className="grid grid-cols-1 gap-4 mb-4">
				<div>
					<input
						checked={formData.storeData}
						onChange={onInputChange}
						type="checkbox"
						name="storeData"
						id="storeData"
						value="true" />
					<label
						className='text-gray-500 cursor-pointer ml-2'
						htmlFor="storeData">
						Save my name and email
					</label>
				</div>
			</div>
			{error && <p className='text-xs text-red-500'>All fields are mandatory</p>}
			<div className="mt-8">
				<button
					onClick={handlePostSubmission}
					type='button'
					className='transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer'>
					Submit comment
				</button>
				{showSuccessMassage && <span className="text-xl float-right font-semibold mt-3 text-green-500">Succes comment</span>}
			</div>
		</div>
	)
}

export default CommentsForm