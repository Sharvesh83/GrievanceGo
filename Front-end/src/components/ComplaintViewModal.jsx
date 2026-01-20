import React, { useEffect } from 'react'
import { getinfo } from './Redux/actions'
import { useDispatch } from 'react-redux'
import Modal from './Modal'

const ComplaintViewModal = ({ onClose, complaint }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getinfo())
    }, [])

    console.log('complaint in complaint modal', complaint.name) //Needs to be removed before deploying

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={complaint.subject}
            size="lg"
            contentClassName="bg-[#C4BDEB]" // rgba(196, 189, 235, 1)
        >
            <div className="font-['Roboto']">
                <p>{complaint.details}</p>
                <div className="my-6 border-t border-black/10"></div>
                <div className="flex flex-col gap-2.5">
                    {[
                        { label: 'Name:', value: complaint.name },
                        { label: 'Phone No:', value: complaint.phoneno },
                        { label: 'AreaLimit:', value: complaint.arealimit },
                        { label: 'Ward No:', value: complaint.wardno },
                        { label: 'Department:', value: complaint.department },
                        { label: 'Address:', value: complaint.address },
                        { label: 'Description :', value: complaint.description }
                    ].map((item, idx) => (
                        <div key={idx} className="flex">
                            <span className="font-bold w-[120px] shrink-0">{item.label}</span>
                            <span>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default ComplaintViewModal
