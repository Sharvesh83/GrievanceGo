import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getinfo, resolveComplaint } from './Redux/actions'
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
} from '@chakra-ui/react'
import WarningModal from './WarningModal'
import sortIcon from '../assets/sort.svg' // Import icon for sorting

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
        department: null, // Initially set to null to indicate no sorting
        status: null, // Initially set to null to indicate no sorting
        resolvedOn: null, // Initially set to null to indicate no sorting
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
        <Box paddingLeft="85px" paddingTop="35px" width="95%">
            <Box maxH="60vh" overflowY="auto">
                <TableContainer overflowX="unset" overflowY="unset">
                    <Table>
                        <Thead
                            alignItems="center"
                            position="sticky"
                            top={0}
                            zIndex="docked"
                        >
                            <Tr>
                                <Th borderLeftRadius="7px" fontSize="14px">
                                    Complaint
                                </Th>
                                <Th fontSize="14px">
                                    Department{' '}
                                    <Popover trigger="hover">
                                        <PopoverTrigger>
                                            <Box
                                                as="button"
                                                style={{
                                                    backgroundColor: 'white',
                                                    padding: '3px',
                                                    borderRadius: '2px',
                                                }}
                                                onClick={() =>
                                                    toggleSortingOrder(
                                                        'department'
                                                    )
                                                }
                                            >
                                                <img
                                                    src={sortIcon}
                                                    alt="Sort"
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        transform:
                                                            sortingOrder.department ===
                                                            'asc'
                                                                ? 'rotate(0deg)'
                                                                : 'rotate(180deg)',
                                                    }}
                                                />
                                            </Box>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            color="black"
                                            fontFamily="body"
                                            fontSize="12px"
                                            width="max-content"
                                            placement="top"
                                        >
                                            <PopoverBody>
                                                A-Z || Z-A
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Th>
                                <Th fontSize="14px">Created On</Th>
                                <Th fontSize="14px">
                                    Resolved On{' '}
                                    <Popover trigger="hover">
                                        <PopoverTrigger>
                                            <Box
                                                as="button"
                                                style={{
                                                    backgroundColor: 'white',
                                                    padding: '3px',
                                                    borderRadius: '2px',
                                                }}
                                                onClick={() =>
                                                    toggleSortingOrder(
                                                        'resolvedOn'
                                                    )
                                                }
                                            >
                                                <img
                                                    src={sortIcon}
                                                    alt="Sort"
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        transform:
                                                            sortingOrder.resolvedOn ===
                                                            'asc'
                                                                ? 'rotate(0deg)'
                                                                : 'rotate(180deg)',
                                                    }}
                                                />
                                            </Box>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            color="black"
                                            fontFamily="body"
                                            fontSize="12px"
                                            width="max-content"
                                            placement="top"
                                        >
                                            <PopoverBody>
                                                Ascending || Descending
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Th>
                                <Th fontSize="14px">
                                    Status{' '}
                                    <Popover trigger="hover">
                                        <PopoverTrigger>
                                            <Box
                                                as="button"
                                                style={{
                                                    backgroundColor: 'white',
                                                    padding: '3px',
                                                    borderRadius: '2px',
                                                }}
                                                onClick={() =>
                                                    toggleSortingOrder('status')
                                                }
                                            >
                                                <img
                                                    src={sortIcon}
                                                    alt="Sort"
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        transform:
                                                            sortingOrder.status ===
                                                            'asc'
                                                                ? 'rotate(0deg)'
                                                                : 'rotate(180deg)',
                                                    }}
                                                />
                                            </Box>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            color="black"
                                            fontFamily="body"
                                            fontSize="12px"
                                            width="max-content"
                                            placement="top"
                                        >
                                            <PopoverBody>
                                                A-Z || Z-A
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Th>
                                <Th fontSize="14px">Replies</Th>
                                <Th fontSize="14px" borderRightRadius="7px">
                                    Action
                                </Th>
                            </Tr>
                            <Tr h="26px"></Tr>
                        </Thead>
                        <Tbody alignItems="center">
                            {sortedComplaintsData.map((complaint, index) => {
                                let dte = new Date(complaint.createdOn)
                                const isResolved =
                                    complaint.status === 'Resolved'

                                return (
                                    <React.Fragment key={index}>
                                        <Tr
                                            height="48px"
                                            bg="white"
                                            borderRadius="7px"
                                            rowGap="20px"
                                        >
                                            <Td
                                                borderLeftRadius="7px"
                                                fontFamily="Roboto-Regular"
                                                textDecoration="underline"
                                            >
                                                <button
                                                    onClick={() =>
                                                        onComplaintClick(
                                                            complaint
                                                        )
                                                    }
                                                >
                                                    {complaint.subject}
                                                </button>
                                            </Td>
                                            <Td fontFamily="Roboto-Regular">
                                                {complaint.department}
                                            </Td>
                                            <Td fontFamily="Roboto-Regular">
                                                {formatDate(
                                                    complaint.createdOn
                                                )}
                                            </Td>
                                            <Td fontFamily="Roboto-Regular">
                                                {formatDate(
                                                    complaint.resolvedOn || '-'
                                                )}
                                            </Td>
                                            <Td fontFamily="Roboto-Regular">
                                                {complaint.status}
                                            </Td>
                                            <Td
                                                fontFamily="Roboto-Regular"
                                                textDecoration="underline"
                                            >
                                                <button
                                                    onClick={() =>
                                                        onReplyClick(complaint)
                                                    }
                                                >
                                                    view
                                                </button>
                                            </Td>
                                            <Td
                                                borderRightRadius="7px"
                                                fontFamily="Roboto-Medium"
                                            >
                                                {isResolved ? (
                                                    'Resolved'
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleResolveClick(
                                                                complaint
                                                            )
                                                        }
                                                    >
                                                        Resolve
                                                    </button>
                                                )}
                                            </Td>
                                        </Tr>
                                        <br />
                                    </React.Fragment>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            {showWarningModal && (
                <WarningModal
                    onClose={() => setShowWarningModal(false)}
                    onConfirm={() => {
                        dispatch(resolveComplaint(selectedComplaint._id))
                        setShowWarningModal(false)
                    }}
                />
            )}
        </Box>
    )
}

export default ComplaintTable
