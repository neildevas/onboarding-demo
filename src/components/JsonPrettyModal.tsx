import React from 'react';
import { Button, Modal, ModalOverlay, useDisclosure, ModalContent, ModalCloseButton, ModalFooter, ModalBody } from '@chakra-ui/react';
import JSONPretty from "react-json-pretty";

function JsonPrettyModal(props: { data: any; buttonTitle: string; }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data, buttonTitle } = props;
  return (
    <>
      <Button onClick={onOpen}>{buttonTitle}</Button>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <JSONPretty data={data} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default JsonPrettyModal;
