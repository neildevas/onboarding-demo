import React from 'react';
import {Table, Tbody, Tr, Td, Th, VStack, Text, Box, Flex} from "@chakra-ui/react";
import {FormOption} from "../types/onboarding";

type Props = {
  options: FormOption[];
}
const UiFormTable: React.FC<Props> = ({ options }) => {
  return (
    <Table variant="unstyled">
      <Tbody>
        <VerticalTable data={options} />
      </Tbody>
    </Table>
  )
}


type VerticalDataProps = {
  data: FormOption[];
}

const VerticalTable: React.FC<VerticalDataProps> = ({ data }) => {
  return (
    <VStack spacing={4} align="stretch">
      {data.map(({ value, title }) => (
        <Tr key={value}>
          <Td fontWeight="bold" p={0}>{title}</Td>
          <Td style={{ textAlign: 'left' }}><Flex align={'center'}><Text textAlign="left">{value}</Text></Flex></Td>
        </Tr>
      ))}
    </VStack>
  );
};
export default UiFormTable;
