import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, StackDivider, Text, Textarea, Tooltip, useDisclosure, Wrap, WrapItem } from '@chakra-ui/react'
import { User } from '@supabase/supabase-js'
import { ethers } from 'ethers'
import { FC, useEffect, useState } from 'react'
import { openai } from 'src/config/openai'
import { dbClient } from 'src/config/supabase'
import Loading from '../common/Loading'

interface Props {
    user: User
}

const FunctionsContainer: FC<Props> = ({ user }) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const [contracts, setContracts] = useState<any[]>([])
    const [selectedContract, setSelectedContract] = useState(contracts[0])
    const [decodedResult, setDecodedResult] = useState('')

    const getDecodedTransaction = async (func: string) => {
        onOpen()
        setIsLoading(true)
        const { data } = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: `Explain this smart contract function for non developers: ${func}`,
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
        const decodedResult = data.choices![0].text as string
        console.log(decodedResult)
        setDecodedResult(decodedResult)
        // add to history table
        const { data: history, error } = await dbClient
            .from('history').insert({
                user_id: user.id,
                contract_address: selectedContract.deployed_address,
                decoded_message: decodedResult,
                function_info: func
            })
        setIsLoading(false)
    }

    useEffect(() => {
        fetchContractInfo()
    }, [])

    const fetchContractInfo = async () => {
        setIsLoading(true)
        const contracts = JSON.parse(localStorage.getItem('contracts') as string) as any[]
        setContracts(contracts)
        setSelectedContract(contracts[0])
        setIsLoading(false)
    }

    return(
        <Stack py={4} px={8} w={'full'}>
            <HStack align={'center'} justify={'space-between'}>
                <Text color={'gray.200'} fontWeight={'semibold'} fontSize={'3xl'}>
                    Decode Functions
                </Text>
            </HStack>
            <Stack spacing={4}>
                <Text color={'gray.300'}>Select Contract</Text>
                <HStack align={'center'} spacing={8}>
                    {
                        contracts.map(({ deployed_address }, index)  => {
                            return(
                                <Button 
                                    onClick={() => setSelectedContract(contracts[index])} 
                                    key={index} color={'gray.200'} bgColor={'gray.700'} 
                                    _hover={{ bgColor: 'gray.600'}}
                                >
                                    {deployed_address.slice(0,8)}...{deployed_address.slice(-8)}
                                </Button>
                            )
                        })
                    }
                </HStack>
                <StackDivider borderColor={'gray.600'}/>
                {
                    selectedContract && (() => {
                        const iface = new ethers.utils.Interface(selectedContract.abi)
                        const functions = iface.fragments.filter((frag) => frag.type === 'function')

                        return (
                            <Wrap>
                                {
                                    functions.map((fn, index) => {
                                        let params = ``
                                        for(let i = 0; i < fn.inputs.length; i++){
                                            params = params + fn.inputs[i].type + ' ' + fn.inputs[i].name
                                            if(i < fn.inputs.length - 1){
                                                params += ','
                                            }
                                        }
                                        return(
                                            <WrapItem key={index}>
                                                <Tooltip label={`Decode ${fn.format()}`}>
                                                    <Button 
                                                        onClick={() => getDecodedTransaction(`${fn.name} (${params})`)} 
                                                        _hover={{ bgColor: 'gray.700'}} bgColor={'gray.900'} color={'gray.400'}
                                                    >
                                                        {`${index+1}) ${fn.name} (${params})`}
                                                    </Button>
                                                </Tooltip>
                                            </WrapItem>
                                        )
                                    })
                                }
                            </Wrap>
                        )
                    })()
                }
            </Stack>
            {/* Show decoded message */}
            <Modal 
                isOpen={isOpen} onClose={onClose} 
                closeOnEsc={false} closeOnOverlayClick={false} size={'xl'}
                blockScrollOnMount={false}
            >
                <ModalOverlay/>
                <ModalContent bgColor={'gray.900'} color={'gray.100'} fontFamily={'Outfit'}>
                    <ModalHeader textAlign={'center'}>Simplified Message</ModalHeader>
                    <ModalCloseButton />
                    {
                        isLoading && <Loading/>
                    }
                    <ModalBody>
                        <Text textAlign={'center'} lineHeight={'7'} letterSpacing={'wider'}>
                            {decodedResult}
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Stack>
    )
}

export default FunctionsContainer