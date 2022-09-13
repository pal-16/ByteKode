import { Center, Flex, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Navbar from 'src/components/common/Navbar'

const ConfirmPassword: NextPage = () => {
    return(
        <Flex 
            flexDirection={'column'} 
            bgColor={'#1a1b23'} h='100vh' 
            fontFamily={'Outfit'}
        >
            <Navbar />
            <Center h='65vh'>
                <Text color={'gray.100'} fontSize={'4xl'}>
                    {`We've mailed you a confirmation link.`}
                </Text>
            </Center>
        </Flex>
    )
}

export default ConfirmPassword