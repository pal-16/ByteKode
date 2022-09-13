import { Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, FormControl, FormLabel, HStack, Input, Select, Stack, Tab, Table, TableContainer, TabList, TabPanel, TabPanels, Text, Textarea, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import { User } from '@supabase/supabase-js'
import { ethers } from 'ethers'
import { FC, useEffect, useState } from 'react'
import { dbClient } from 'src/config/supabase'
import AddContractForm from './AddContractForm'

interface IContracts {
    user: User
}

const ContractsContainer: FC<IContracts> = ({ user }) => {
    
    const { onClose, isOpen, onOpen } = useDisclosure()
    const [contracts, setContracts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchContractData = async () => {
        setIsLoading(true)
        const { data: contracts, error } = await dbClient.from('contracts').select('*').eq('user_id', user.id)
        if(contracts){
            setContracts(contracts)
            localStorage.setItem('contracts', JSON.stringify(contracts))
            console.log(contracts)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchContractData()
        dbClient.from('contracts').on('*', payload => {
            console.log('Contracts changed', payload)
        }).subscribe()
    
        return () => { dbClient.removeAllSubscriptions() }
    },[])

    return(
        <Stack pt={4} px={8} w={'full'}> 
            <HStack align={'center'} justify={'space-between'}>
                <Text color={'gray.200'} fontWeight={'semibold'} fontSize={'3xl'}>My Contracts</Text>
                <Button onClick={onOpen} bgColor={'gray.800'} color={'gray.300'} fontWeight={'normal'} _hover={{ bgColor: 'gray.600'}}>
                    Add Contracts
                </Button>
            </HStack>
            <Stack py={8} color={"gray.200"}>
                <HStack w={'full'} fontSize={'xl'} color={'gray.400'}>
                    <Text w={'25%'}>Address</Text>
                    <Text w={'25%'}>Chain Id</Text>
                    <Text w={'25%'}>nFunctions</Text>
                    <Text w={'25%'}>nEvents</Text>
                </HStack>
                {
                    contracts && contracts[0] && 
                    contracts.map(({ deployed_address, chain_id, abi, contract_id }, index) => {
                        
                        const iface = new ethers.utils.Interface(abi)
                        const format = iface.format() as string[]
                        const functions = format.filter((name) => name.includes('function'))
                        const events = format.filter((name) => name.includes('event'))
                        
                        return(
                            <HStack 
                                w={'full'} bgColor={(index % 2 == 0) ? 'gray.800' : ''} 
                                px={2} py={4} key={index}
                            >
                                <Text w={'25%'}>{deployed_address.slice(0,6)}...{deployed_address.slice(-6)}</Text>
                                <Text w={'25%'}>{chain_id}</Text>
                                <Text w={'25%'}>{functions.length}</Text>
                                <Text w={'25%'}>{events.length}</Text>
                            </HStack>
                        )
                    })
                }
            </Stack>
            <Drawer placement='right' onClose={onClose} isOpen={isOpen} size={'sm'}>
                <DrawerOverlay/>
                <DrawerContent bgColor={'gray.800'} color={'gray.300'} fontFamily={'Outfit'} py={4}>
                    <DrawerHeader fontWeight={'normal'} fontSize={'3xl'}>
                        Add Contract Details
                    </DrawerHeader>
                    <DrawerBody>
                        <AddContractForm user={user}/>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Stack>
    )
}

export default ContractsContainer