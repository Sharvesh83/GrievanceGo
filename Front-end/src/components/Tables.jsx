import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getinfo, resolveComplaint } from './Redux/actions'
import WarningModal from './WarningModal'
import sortIcon from '../assets/sort.svg'

const formatDate = date => {
    if (isNaN(new Date(date).getTime())) {
        return 'Not Yet'
    }

    const formattedDate = new Date(date)
    const day = formattedDate.getDate().toString().padStart(2, '0')
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0')
    const year = formattedDate.getFullYear()
    return `${day}-${month}-${year}`
}

const SortPopover = ({ onToggle, currentOrder, label }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block ml-1">
            <button
                className="bg-white p-[3px] rounded-[2px] transition-transform hover:bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            >
                <img
                    src={sortIcon}
                    alt="Sort"
                    style={{
                        width: '10px',
                        height: '10px',
                        transform: currentOrder === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    }}
                />
            </button>
            {isOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max bg-white text-black text-xs p-2 rounded shadow-lg z-50 font-sans border border-gray-200">
                    <button onClick={() => { onToggle(); setIsOpen(false); }} className="w-full text-left hover:bg-gray-50 px-2 py-1 rounded">
                        {label}
                    </button>
                </div>
            )}
        </div>
    )
}


const ComplaintTable = ({
    onComplaintClick,
    onResolveClick,
    onReplyClick,
    complaintsData,
}) => {
    const dispatch = useDispatch()
    const [showWarningModal, setShowWarningModal] = useState(false)
    const [selectedComplaint, setSelectedComplaint] = useState(null)
    const [sortingOrder, setSortingOrder] = useState({
        department: null,
        status: null,
        resolvedOn: null,
    })

    useEffect(() => {
        dispatch(getinfo())
    }, [])

    const handleResolveClick = complaint => {
        setSelectedComplaint(complaint)
        setShowWarningModal(true)
    }

    const toggleSortingOrder = column => {
        setSortingOrder(prevOrder => ({
            ...prevOrder,
            [column]: prevOrder[column] === 'asc' ? 'desc' : 'asc',
        }))
    }

    const sortedComplaintsData = [...complaintsData]

    if (sortingOrder.department) {
        sortedComplaintsData.sort((a, b) => {
            if (sortingOrder.department === 'asc') {
                return a.department.localeCompare(b.department)
            } else {
                return b.department.localeCompare(a.department)
            }
        })
    }

    if (sortingOrder.status) {
        sortedComplaintsData.sort((a, b) => {
            if (sortingOrder.status === 'asc') {
                return a.status.localeCompare(b.status)
            } else {
                return b.status.localeCompare(a.status)
            }
        })
    }

    if (sortingOrder.resolvedOn) {
        sortedComplaintsData.sort((a, b) => {
            const dateA = new Date(a.resolvedOn || 0)
            const dateB = new Date(b.resolvedOn || 0)

            if (sortingOrder.resolvedOn === 'asc') {
                return dateA - dateB
            } else {
                return dateB - dateA
            }
        })
    }

    return (
        <div className="pl-[85px] pt-[35px] w-[95%]">
            <div className="max-h-[60vh] overflow-y-auto pr-2">
                <table className="w-full border-separate border-spacing-y-5 text-left">
                    <thead className="sticky top-0 z-10 bg-transparent">
                        <tr>
                            <th className="text-sm font-bold pb-2 pl-4">Complaint</th>
                            <th className="text-sm font-bold pb-2">
                                Department
                                <SortPopover
                                    onToggle={() => toggleSortingOrder('department')}
                                    currentOrder={sortingOrder.department}
                                    label="A-Z || Z-A"
                                />
                            </th>
                            <th className="text-sm font-bold pb-2">Created On</th>
                            <th className="text-sm font-bold pb-2">
                                Resolved On
                                <SortPopover
                                    onToggle={() => toggleSortingOrder('resolvedOn')}
                                    currentOrder={sortingOrder.resolvedOn}
                                    label="Ascending || Descending"
                                />
                            </th>
                            <th className="text-sm font-bold pb-2">
                                Status
                                <SortPopover
                                    onToggle={() => toggleSortingOrder('status')}
                                    currentOrder={sortingOrder.status}
                                    label="A-Z || Z-A"
                                />
                            </th>
                            <th className="text-sm font-bold pb-2">Replies</th>
                            <th className="text-sm font-bold pb-2 pr-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedComplaintsData.map((complaint, index) => {
                            const isResolved = complaint.status === 'Resolved'

                            return (
                                <tr key={index} className="bg-white h-[48px] rounded-[7px] shadow-sm hover:shadow-md transition-shadow">
                                    <td className="font-['Roboto'] underline pl-4 rounded-l-[7px]">
                                        <button onClick={() => onComplaintClick(complaint)}>
                                            {complaint.subject}
                                        </button>
                                    </td>
                                    <td className="font-['Roboto']">
                                        {complaint.department}
                                    </td>
                                    <td className="font-['Roboto']">
                                        {formatDate(complaint.createdOn)}
                                    </td>
                                    <td className="font-['Roboto']">
                                        {formatDate(complaint.resolvedOn || '-')}
                                    </td>
                                    <td className="font-['Roboto']">
                                        {complaint.status}
                                    </td>
                                    <td className="font-['Roboto'] underline">
                                        <button onClick={() => onReplyClick(complaint)}>
                                            view
                                        </button>
                                    </td>
                                    <td className="font-['Roboto'] font-medium rounded-r-[7px]">
                                        {isResolved ? (
                                            'Resolved'
                                        ) : (
                                            <button onClick={() => handleResolveClick(complaint)}>
                                                Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {showWarningModal && (
                <WarningModal
                    onClose={() => setShowWarningModal(false)}
                    onConfirm={() => {
                        dispatch(resolveComplaint(selectedComplaint._id))
                        setShowWarningModal(false)
                    }}
                />
            )}
        </div>
    )
}

export default ComplaintTable
