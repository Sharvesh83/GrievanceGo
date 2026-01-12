import React, { useEffect, useState } from 'react'
import {
    Box,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { addingchat } from './Redux/actions'

const ReplyModal = ({ onClose, complaint }) => {
    const { subject, description, _id } = complaint
    const [showInput, setShowInput] = useState(false)
    const [chat, setChat] = useState('')

    const handleReplyClick = () => {
        setShowInput(true)
    }

    const data_chats = useSelector(state => state.info)
    const redData = data_chats.filter(elem => {
        return elem._id == complaint._id
    })
    // console.log('data_chats', redData) //Needs to be removed before deploying

    const dispatch = useDispatch()
    let addChat = () => {
        dispatch(addingchat({ _id, chat }))
    }

    return (
        <Modal isOpen={true} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                bgColor="rgba(169, 160, 222, 1)"
                maxHeight="523px"
                maxWidth="596px"
                height="100%"
                width="100%"
            >
                <ModalCloseButton />
                <ModalBody>
                    <Box
                        color="white"
                        bgColor="rgba(101, 83, 193, 1)"
                        marginTop="37px"
                        marginLeft="3px"
                        paddingTop="10px"
                        paddingLeft="16px"
                        h="142px"
                        w="542px"
                        fontFamily="Roboto-Bold"
                    >
                        <Box>
                            <Text display="inline">{subject}</Text>

                            <Text paddingTop="4px" fontFamily="Roboto-Regular">
                                {description}
                            </Text>
                        </Box>
                    </Box>
                    <Box
                        marginTop="15px"
                        overflowY="auto"
                        overflowX="hidden"
                        maxH="231px"
                    >
                        {redData[0].chats?.map((comp, index) => {
                            return (
                                <Box
                                    bgColor="white"
                                    marginTop="8px"
                                    marginLeft="3px"
                                    paddingTop="10px"
                                    paddingLeft="13px"
                                    paddingRight="15px"
                                    paddingBottom="10px"
                                    w="542px"
                                    fontFamily="Roboto-Bold"
                                >
                                    <Box key={index}>
                                        {/* <Text fontSize="14px" color="black">
                                            {comp.sender}
                                        </Text> */}
                                        <Text
                                            fontFamily="Roboto-Medium"
                                            w="80%"
                                            fontSize="15px"
                                        >
                                            {comp}
                                        </Text>
                                        {/* <Text
                                            color="rgba(130, 130, 130, 1)"
                                            fontFamily="Roboto-Italic"
                                            textAlign="right"
                                            fontSize="12px"
                                        >
                                        </Text> */}
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    {showInput ? (
                        <>
                            <Input
                                w="472px"
                                h="39px"
                                placeholder="Enter your message"
                                bgColor="white"
                                marginRight="10px"
                                onChange={event => {
                                    setChat(event.target.value)
                                }}
                            />
                            <Button
                                colorScheme="black"
                                bgColor="black"
                                color="white"
                                onClick={addChat}
                            >
                                Send
                            </Button>
                        </>
                    ) : (
                        <Button
                            colorScheme="black"
                            bgColor="black"
                            color="white"
                            onClick={handleReplyClick}
                        >
                            Reply
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
        // <div>hellooo</div>
    )
}

export default ReplyModal
