import { Button, HStack, Stack, Text } from '@chakra-ui/react'
import { User } from '@supabase/supabase-js'
import { FC } from 'react'

interface Props {
    user: User
}

const Billing: FC<Props> = ({ user }) => {
    return(
        <Stack pt={4} px={8} w={'full'} spacing={8}>
            <HStack align={'center'} justify={'space-between'}>
                <Text color={'gray.200'} fontWeight={'semibold'} fontSize={'3xl'}>My Subscriptions</Text>
            </HStack>
            <Stack>
                <Text color={'gray.200'} fontSize={'xl'}>Bytekode Starter</Text>
                <Text color={'gray.400'}>{'$19.99/month'}</Text>
                <form action="/api/checkout_sessions" method='POST'>
                    <Button maxW={'max-content'} p={2} type='submit'>Buy Subscription</Button>
                </form>
            </Stack>
        </Stack>
    )
}

export default Billing