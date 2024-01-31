import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  FormControl, FormLabel,
  Input, Text, Heading
} from '@chakra-ui/react';
import UiDropdownSelect from "./UiDropdownSelect";

function AddFormStepModal(props: { didSubmit: boolean; buttonTitle: string; onSubmit: (val: { state: string, title: string, message: string } ) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chosenState, setChosenState] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const { buttonTitle, didSubmit, onSubmit } = props;
  return (
    <>
      <Button onClick={onOpen}>{buttonTitle}</Button>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a form step</ModalHeader>
          <ModalCloseButton />
          {didSubmit ? (
            <ModalBody>
              <Heading>You already submitted a form step.</Heading>
              <Text>Please restart the demo to submit a step again.</Text>
            </ModalBody>
          ) : (
            <ModalBody>
              <FormControl>
                <FormLabel>
                  If State is
                </FormLabel>
                {/* @ts-ignore */}
                <UiDropdownSelect options={[{ title: 'South Carolina', value: 'SC'}, { title: 'Washington', value: 'WA' }, ]} onChange={val => setChosenState(val)} />
                <FormLabel>
                  Enter Title:
                </FormLabel>
                <Input onChange={(e) => setTitle(e.target.value)} value={title}/>
                <FormLabel>
                  Enter Message:
                </FormLabel>
                <Input onChange={(e) => setMessage(e.target.value)} value={message}/>
              </FormControl>
            </ModalBody>
          )}

          <ModalFooter>
            <Button variant='outline' onClick={onClose} mr={3} >Close</Button>
            {!didSubmit && (<Button colorScheme='blue' isDisabled={!chosenState || !title || !message} onClick={() => { onSubmit({ state: chosenState, title, message }); onClose() }}>
              Submit
            </Button>)}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default AddFormStepModal;
