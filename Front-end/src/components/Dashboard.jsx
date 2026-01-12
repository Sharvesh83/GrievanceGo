import React, { useEffect } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import bg2 from '../assets/bg2.png'
import Navbar from './Navbar'
import ComplaintTable from './Tables'
import NewComplaintModal from './NewComplaintModal'
import ComplaintViewModal from './ComplaintViewModal'
import WarningModal from './WarningModal'
import ReplyModal from './ReplyModal'
import { useSelector, useDispatch } from 'react-redux'
import { getinfo } from './Redux/actions'

const Dashboard = () => {
    const {
        isOpen: isNewComplaintModalOpen,
        onOpen: openNewComplaintModal,
        onClose: closeNewComplaintModal,
    } = useDisclosure()

    const {
        isOpen: isComplaintViewModalOpen,
        onOpen: openComplaintViewModal,
        onClose: closeComplaintViewModal,
    } = useDisclosure()

    const {
        isOpen: isWarningModalOpen,
        onOpen: openWarningModal,
        onClose: closeWarningModal,
    } = useDisclosure()

    const {
        isOpen: isReplyModalOpen,
        onOpen: openReplyModal,
        onClose: closeReplyModal,
    } = useDisclosure()

    const [selectedComplaint, setSelectedComplaint] = useState(null)
    const handleComplaintClick = complaint => {
        console.log(complaint) //Needs to be removed before deploying
        setSelectedComplaint(complaint)
        openComplaintViewModal()
    }

    const complaintsData = useSelector(state => state.info)

    const dispatch = useDispatch()
    // const reduxData = useSelector(dta => dta)

    useEffect(() => {
        dispatch(getinfo())
    }, [])

    console.log('name : ', selectedComplaint) //Needs to be removed before deploying

    const handleReplyClick = complaint => {
        setSelectedComplaint(complaint)
        openReplyModal()
    }

    return (
        <Box
            bgImage={`url(${bg2})`}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            minHeight="100vh"
        >
            <Navbar onRegisterNewClick={openNewComplaintModal} />
            <ComplaintTable
                onComplaintClick={handleComplaintClick}
                onResolveClick={openWarningModal}
                onReplyClick={handleReplyClick}
                complaintsData={complaintsData}
            />
            {isNewComplaintModalOpen && (
                <NewComplaintModal onClose={closeNewComplaintModal} /> /// register new complaint
            )}
            {isComplaintViewModalOpen && (
                <ComplaintViewModal
                    onClose={closeComplaintViewModal}
                    complaint={selectedComplaint}
                />
            )}
            {isReplyModalOpen && (
                <ReplyModal
                    onClose={closeReplyModal}
                    complaint={selectedComplaint}
                />
            )}
            {isWarningModalOpen && <WarningModal onClose={closeWarningModal} />}
        </Box>
    )
}

export default Dashboard
