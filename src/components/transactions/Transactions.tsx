import { HStack, Stack, Text } from '@chakra-ui/react'
import { User } from '@supabase/supabase-js'
import { FC } from 'react'

interface Props {
    user: User
}

const Transactions: FC<Props> = ({ user }) => {
    return(
        <Stack py={4} px={8} w={'full'}>
            <HStack align={'center'} justify={'space-between'}>
                <Text color={'gray.200'} fontWeight={'semibold'} fontSize={'3xl'}>
                    Decode Transactions
                </Text>
            </HStack>
        </Stack>
    )
}

export default Transactions