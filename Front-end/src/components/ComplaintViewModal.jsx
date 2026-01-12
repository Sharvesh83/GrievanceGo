import React, { useEffect } from 'react'
import {
    Box,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Divider,
} from '@chakra-ui/react'
import { getinfo } from './Redux/actions'
import { useDispatch, useSelector } from 'react-redux'

const ComplaintViewModal = ({ onClose, complaint }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getinfo())
    }, [])

    console.log('complaint in complaint modal', complaint.name) //Needs to be removed before deploying

    return (
        <Modal isOpen={true} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                bgColor="rgba(196, 189, 235, 1)"
                maxW="555px"
                maxH="493px"
                w="100%"
                h="100%"
            >
                <>
                    <ModalHeader fontFamily="Roboto-Bold">
                        {complaint.subject}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody fontFamily="Roboto">
                        {complaint.details}
                        <Divider my={6} />
                        <Box display="flex" flexDirection="column">
                            <Box display="flex" my={2.2}>
                                <Text fontFamily="Roboto-Bold" width={120}>
                                    Name:
                                </Text>
                                {complaint.name}
                            </Box>
                            <Box display="flex" my={2.2}>
                                <Text fontFamily="Roboto-Bold" width={120}>
                                    Phone No:
                                </Text>
                                {complaint.phoneno}
                            </Box>
                            <Box display="flex" my={2.2}>
                                <Text fontFamily="Roboto-Bold" width={120}>
                                    AreaLimit:
                                </Text>
                                {complaint.arealimit}
                            </Box>
                            <Box display="flex" my={2.2}>
                                <Text fontFamily="Roboto-Bold" width={120}>
                                    Ward No:
                                </Text>
                                {complaint.wardno}
                            </Box>
                            <Box display="flex" my={2.2}>
                                <Text fontFamily="Roboto-Bold" width={120}>
                                    Department:
                                </Text>
                                {complaint.department}
                            </Box>
                            <Box fontFamily="Roboto" display="flex" my={2.2}>
                                <Text fontFamily="Roboto-Bold" width={120}>
                                    Address:
                                </Text>
                                {complaint.address}
                            </Box>
                            <Box fontFamily="Roboto" display="flex" my={2.2}>
                                <Text fontFamily="Roboto-Bold" width={120}>
                                    Description :
                                </Text>
                                {complaint.description}
                            </Box>
                        </Box>
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
        // <div>hello</div>
    )
}

export default ComplaintViewModal
