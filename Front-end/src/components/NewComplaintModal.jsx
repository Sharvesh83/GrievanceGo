import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Registration } from './Redux/actions'
import Modal from './Modal'

function NewComplaintModal({ onClose }) {
    const [name, setName] = useState('')
    const [wardno, setWardNo] = useState('')
    const [phoneno, setPhoneNo] = useState('')
    const [arealimit, setAreaLimit] = useState('')
    const [subject, setSubject] = useState('')
    const [department, setDepartment] = useState('')
    const [address, setAddress] = useState('')
    const [description, setDescription] = useState('')

    // Define validation state for each field
    const [validation, setValidation] = useState({
        name: true,
        wardno: true,
        phoneno: true,
        arealimit: true,
        subject: true,
        department: true,
        address: true,
        description: true,
    })

    const handleInputChange = (e, field) => {
        const value = e.target.value
        // Update the state of the respective field
        switch (field) {
            case 'name':
                setName(value)
                break
            case 'wardno':
                setWardNo(value)
                break
            case 'phoneno':
                setPhoneNo(value)
                break
            case 'arealimit':
                setAreaLimit(value)
                break
            case 'subject':
                setSubject(value)
                break
            case 'department':
                setDepartment(value)
                break
            case 'address':
                setAddress(value)
                break
            case 'description':
                setDescription(value)
                break
            default:
                break
        }
    }

    const dispatch = useDispatch()

    const handleSubmit = () => {
        // Validate the fields before submitting
        const isValid = validateFields()
        if (isValid) {
            dispatch(
                Registration({
                    name,
                    wardno,
                    phoneno,
                    arealimit,
                    subject,
                    department,
                    address,
                    description,
                })
            )
            onClose()
        }
    }

    const validateFields = () => {
        const fieldsToValidate = [
            { field: 'name', value: name },
            { field: 'wardno', value: wardno },
            { field: 'phoneno', value: phoneno },
            { field: 'arealimit', value: arealimit },
            { field: 'subject', value: subject },
            { field: 'department', value: department },
            { field: 'address', value: address },
            { field: 'description', value: description },
        ]

        // Check if any of the required fields are empty
        let isValid = true
        const updatedValidation = { ...validation }

        fieldsToValidate.forEach(field => {
            if (!field.value.trim()) {
                isValid = false
                updatedValidation[field.field] = false
            } else {
                updatedValidation[field.field] = true
            }
        })

        setValidation(updatedValidation)
        return isValid
    }

    const footer = (
        <>
            <button
                className="bg-[#1e1e1e] text-white px-4 py-2 rounded hover:bg-black transition-colors"
                onClick={handleSubmit}
            >
                Submit
            </button>
            <button
                className="text-black bg-transparent hover:bg-white/20 px-4 py-2 rounded transition-colors"
                onClick={onClose}
            >
                Cancel
            </button>
        </>
    )

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Please fill out the required fields with your information and describe your complaint in the space provided below."
            footer={footer}
            size="2xl"
            contentClassName="bg-[#A99FDE]" // Preserving original color
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5">
                {[
                    { label: 'Name', value: name, field: 'name', type: 'text' },
                    { label: 'Ward No', value: wardno, field: 'wardno', type: 'number' },
                    { label: 'Phone No', value: phoneno, field: 'phoneno', type: 'number' },
                    { label: 'AreaLimit', value: arealimit, field: 'arealimit', type: 'text' },
                    { label: 'Subject', value: subject, field: 'subject', type: 'text' },
                    { label: 'Department', value: department, field: 'department', type: 'text' },
                ].map((item) => (
                    <div key={item.field} className="col-span-1">
                        <label className="block text-sm font-medium mb-1">
                            {item.label}
                            {!validation[item.field] && <span className="text-red-600 ml-1">* Required</span>}
                        </label>
                        <input
                            type={item.type}
                            className={`w-full h-8 px-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${!validation[item.field] ? 'border-red-500' : 'border-transparent'}`}
                            placeholder={item.label}
                            value={item.value}
                            onChange={(e) => handleInputChange(e, item.field)}
                        />
                    </div>
                ))}

                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                        Address
                        {!validation.address && <span className="text-red-600 ml-1">* Required</span>}
                    </label>
                    <input
                        type="text"
                        className={`w-full h-8 px-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${!validation.address ? 'border-red-500' : 'border-transparent'}`}
                        placeholder="Address"
                        value={address}
                        onChange={(e) => handleInputChange(e, 'address')}
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                        Describe your Complaint
                        {!validation.description && <span className="text-red-600 ml-1">* Required</span>}
                    </label>
                    <textarea
                        className={`w-full h-[120px] p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none ${!validation.description ? 'border-red-500' : 'border-transparent'}`}
                        placeholder="Describe your Complaint"
                        value={description}
                        onChange={(e) => handleInputChange(e, 'description')}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default NewComplaintModal
