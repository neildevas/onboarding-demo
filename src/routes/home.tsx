import {Box, Button, Flex} from "@chakra-ui/react";
import React from "react";
import {Link} from "react-router-dom";

function Home() {
  return (
    <Flex height={'100vh'} alignItems={'center'} justifyContent={'center'}>
      <Box textAlign={'center'}>
        <Link to={'/onboarding'}>
          <Button>Onboarding Demo</Button>
        </Link>
      </Box>
    </Flex>
  );
}

export default Home;
