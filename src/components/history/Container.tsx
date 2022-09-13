import { HStack, Stack, Text, Tooltip } from '@chakra-ui/react'
import { User } from '@supabase/supabase-js'
import { FC, useEffect, useState } from 'react'
import { dbClient } from 'src/config/supabase'
import Loading from '../common/Loading'

interface IHistory {
    user: User
}

const History: FC<IHistory> = ({ user }) => {

    const [isLoading, setIsLoading] = useState(true)
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        fetchUserHistory()
    }, [])

    const fetchUserHistory = async () => {
        setIsLoading(true)
        const { data: history, error } = await dbClient.from('history').select('*').eq('user_id', user.id)
        if(history){
            setHistory(history)
            // localStorage.setItem('contracts', JSON.stringify(contracts))
            console.log(history)
        }
        setIsLoading(false)
    }
    return(
        <Stack pt={4} px={8} w={'full'}>
            <HStack align={'center'} justify={'space-between'}>
                <Text color={'gray.200'} fontWeight={'semibold'} fontSize={'3xl'}>
                    My History
                </Text>
            </HStack>
            <Stack py={8} color={"gray.200"}>
                <HStack w={'full'} fontSize={'xl'} color={'gray.400'}>
                    <Text w={'30%'}>Address</Text>
                    <Text w={'30%'}>Function</Text>
                    <Text w={'30%'}>Message</Text>
                </HStack>
                {
                    history && history[0] && history.map(({contract_address, function_info, decoded_message}, index) => {
                        return(
                            <HStack 
                                w={'full'} bgColor={(index % 2 == 0) ? 'gray.800' : ''} 
                                px={2} py={4} key={index}
                            >
                                <Text w={'30%'}>{contract_address.slice(0,15)}...{contract_address.slice(-6)}</Text>
                                <Tooltip label={function_info}>
                                    <Text w={'30%'}>{function_info.split('(')[0]}</Text>
                                </Tooltip>
                                <Tooltip label={decoded_message}>
                                    <Text w={'30%'}>{decoded_message.slice(0,20)}...{decoded_message.slice(-15)}</Text>
                                </Tooltip>
                            </HStack>
                        )
                    })
                }
            </Stack>
        </Stack>
    )
}

export default History