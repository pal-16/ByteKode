import { HStack, Icon, Stack, Text } from '@chakra-ui/react'
import { Dispatch, FC } from 'react'
import { FaBook, FaFileContract, FaHistory, FaReceipt, FaStaylinked, FaUsersCog, FaWallet } from 'react-icons/fa'
import { SetStateAction } from 'react'
import { BiCodeBlock } from 'react-icons/bi'
import { TbMathFunction } from 'react-icons/tb'
import { AiOutlineCode } from 'react-icons/ai'
import { RiSecurePaymentFill } from 'react-icons/ri'
// import { address as ipAddress } from 'ip'

interface Sidenav {
    setCurrentOption: Dispatch<SetStateAction<number>>,
    currentOption: number
}

const Sidenav: FC<Sidenav> = ({ setCurrentOption, currentOption }) => {

    const options = [
        {
            name: 'Contracts',
            icon: FaFileContract
        },
        {
            name: 'Decode',
            icon: AiOutlineCode
        },
        {
            name: 'History',
            icon: FaHistory
        },
        {
            name: 'Billing',
            icon: RiSecurePaymentFill
        },
        {
            name: 'Transactions',
            icon: FaStaylinked
        },
        {
            name: 'Wallet',
            icon: FaWallet
        },
        {
            name: 'Docs',
            icon: FaBook
        },
        {
            name: 'Users',
            icon: FaUsersCog
        },
    ]

    return(
        <Stack pt={4} px={4}>
            {
                options.map((option, index) => {
                    return(
                        <HStack 
                            px={4} py={2} bgColor={currentOption == (index+1) ? 'gray.700' : ''}
                            color={index < 6 ? "gray.200" : 'gray.700'} key={index} 
                            as='button' _hover={{ bgColor: index < 6 ? 'gray.700' : ''}}
                            disabled={index > 5 && true} 
                            cursor={index > 5 ? 'not-allowed' : 'pointer'} onClick={() => setCurrentOption(index+1)}
                            rounded={'md'}
                        >
                            <Icon as={option.icon}/>
                            <Text fontSize={'xl'}>{option.name}</Text>
                        </HStack>
                    )
                })
            }
            {/* <Text>{ipAddress()}</Text> */}
        </Stack>
    )
}

export default Sidenav