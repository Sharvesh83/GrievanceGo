import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Grid,
    GridItem,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Text,
} from '@chakra-ui/react'
import { Registration } from './Redux/actions'
import { useDispatch } from 'react-redux'

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

    return (
        <Modal isOpen={true} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                bgColor="rgba(169,159, 222, 1)"
                maxW="706px"
                maxH="878px"
                w="100%"
            >
                <ModalHeader
                    fontFamily="Roboto-Medium"
                    paddingTop="38px"
                    fontSize="20px"
                >
                    Please fill out the required fields with your information
                    and describe your complaint in the space provided below.
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid gap={4} alignItems="center" paddingLeft="20px">
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!validation.name}>
                                <FormLabel>
                                    Name{' '}
                                    {validation.name ? null : (
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            * Required
                                        </span>
                                    )}
                                </FormLabel>
                                <Input
                                    height="32px"
                                    width="288px"
                                    type="text"
                                    bg="white"
                                    placeholder="Name"
                                    onChange={e => handleInputChange(e, 'name')}
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!validation.wardno}>
                                <FormLabel>
                                    Ward No{' '}
                                    {validation.wardno ? null : (
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            * Required
                                        </span>
                                    )}
                                </FormLabel>
                                <Input
                                    height="32px"
                                    width="288px"
                                    type="number"
                                    bg="white"
                                    placeholder="Ward No"
                                    onChange={e =>
                                        handleInputChange(e, 'wardno')
                                    }
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!validation.phoneno}>
                                <FormLabel>
                                    Phone No{' '}
                                    {validation.phoneno ? null : (
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            * Required
                                        </span>
                                    )}
                                </FormLabel>
                                <Input
                                    height="32px"
                                    width="288px"
                                    type="number"
                                    bg="white"
                                    placeholder="Phone No"
                                    onChange={e =>
                                        handleInputChange(e, 'phoneno')
                                    }
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!validation.arealimit}>
                                <FormLabel>
                                    AreaLimit{'  '}
                                    {validation.arealimit ? null : (
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            * Required
                                        </span>
                                    )}
                                </FormLabel>
                                <Input
                                    height="32px"
                                    width="288px"
                                    type="text"
                                    bg="white"
                                    placeholder="AreaLimit"
                                    onChange={e =>
                                        handleInputChange(e, 'arealimit')
                                    }
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!validation.subject}>
                                <FormLabel>
                                    Subject{' '}
                                    {validation.subject ? null : (
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            * Required
                                        </span>
                                    )}
                                </FormLabel>
                                <Input
                                    height="32px"
                                    width="288px"
                                    type="text"
                                    bg="white"
                                    placeholder="Subject"
                                    onChange={e =>
                                        handleInputChange(e, 'subject')
                                    }
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={!validation.department}>
                                <FormLabel>
                                    Department{' '}
                                    {validation.department ? null : (
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            * Required
                                        </span>
                                    )}
                                </FormLabel>
                                <Input
                                    height="32px"
                                    width="288px"
                                    type="text"
                                    bg="white"
                                    placeholder="Department"
                                    onChange={e =>
                                        handleInputChange(e, 'department')
                                    }
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <FormControl isInvalid={!validation.address}>
                                <FormLabel>
                                    Address{' '}
                                    {validation.address ? null : (
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            * Required
                                        </span>
                                    )}
                                </FormLabel>
                                <Input
                                    height="32px"
                                    width="621px"
                                    type="text"
                                    bg="white"
                                    placeholder="Address"
                                    onChange={e =>
                                        handleInputChange(e, 'address')
                                    }
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <FormControl isInvalid={!validation.description}>
                                <FormLabel>
                                    Describe your Complaint{' '}
                                    {validation.description ? null : (
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'normal',
                                            }}
                                        >
                                            * Required
                                        </span>
                                    )}
                                </FormLabel>
                                <Textarea
                                    height="120px"
                                    width="621px"
                                    type="text"
                                    bg="white"
                                    placeholder="Describe your Complaint"
                                    onChange={e =>
                                        handleInputChange(e, 'description')
                                    }
                                />
                            </FormControl>
                        </GridItem>
                    </Grid>
                </ModalBody>

                <ModalFooter>
                    <Button
                        bgColor="rgba(30, 30, 30, 1)"
                        color="white"
                        mr={3}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    <Button variant="ghost" color="black" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default NewComplaintModal
