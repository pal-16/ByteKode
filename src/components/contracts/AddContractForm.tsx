import { Button, FormControl, FormLabel, Input, Select, Stack, Text, Textarea } from '@chakra-ui/react'
import { User } from '@supabase/supabase-js'
import { ethers } from 'ethers'
import { useFormik } from 'formik'
import { FC, useState } from 'react'
import { dbClient } from 'src/config/supabase'
import * as Yup from 'yup'

interface IForm {
    user: User
}

const supportedChains = [
    {
        name: 'Ethereum',
        chainId: 1
    },
    {
        name: 'Binance Smart Chain',
        chainId: 56
    },
    {
        name: 'Avalanche C-Chain',
        chainId: 43114
    },
    {
        name: 'Polygon Mainnet',
        chainId: 137
    },
    {
        name: 'Arbitrum One',
        chainId: 42161
    },
    {
        name: 'Optimism',
        chainId: 10
    },
    {
        name: 'Cronos Mainnet',
        chainId: 25
    },
    {
        name: 'Fantom Opera',
        chainId: 250
    },
    {
        name: 'Celo Mainnet',
        chainId: 42220
    },
    {
        name: 'Polygon Mumbai Testnet',
        chainId: 80001
    },
    {
        name: 'Local/Undeployed',
        chainId: 0
    }
]

const AddContractForm: FC<IForm> = ({ user }) => {

    const [isLoading, setIsLoading] = useState(false)

    const addContractToTable = async (
        deployed_address: string,
        abi: string,
        chain_id: string
    ) => {
        setIsLoading(true)
        const { data: contract, error } = await dbClient.from('contracts').insert({
            deployed_address,
            abi,
            chain_id,
            user_id: user.id
        })
        if(error) alert(error.message)
        setIsLoading(false)
        window.location.reload()    
    }

    const validationSchema = Yup.object().shape({
        deployed_address: Yup.string().test('valid-address', 'Is a valid eth address', (value) => ethers.utils.isAddress(value as string) === true).required('Deployed Address required'),
        abi: Yup.string().required('Please enter a valid abi'),
        chain_id: Yup.string().required()
    })

    const formik = useFormik({
        initialValues: {
            deployed_address: '',
            abi: '',
            chain_id: '1'
        },
        onSubmit: ({ deployed_address, abi, chain_id }) => addContractToTable(deployed_address, abi, chain_id),
        validationSchema
    })


    return(
        <Stack>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={8}>
                    <FormControl>
                        <FormLabel>Deployed Address</FormLabel>
                        <Input 
                            variant={'filled'} bgColor={'gray.700'} 
                            _hover={{bgColor: 'none'}}
                            value={formik.values.deployed_address}
                            onChange={formik.handleChange}
                            name='deployed_address'
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Contract ABI</FormLabel>
                        <Textarea 
                            variant={'filled'} bgColor={'gray.700'} 
                            _hover={{bgColor: 'none'}}
                            value={formik.values.abi}
                            onChange={formik.handleChange}
                            name='abi'
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Deployment chain</FormLabel>
                        <Select name='chain_id' defaultValue={'1'} variant={'filled'} bgColor={'gray.700'} _hover={{bgColor: 'none'}} value={formik.values.chain_id} onChange={formik.handleChange}>
                            {
                                supportedChains.map((chain, index) => {
                                    return(
                                        <option value={chain.chainId.toString()} key={index}>
                                            <Text color={'gray.900'}>{chain.name}</Text>
                                        </option>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <Button isLoading={isLoading} type='submit' bgColor={'gray.700'} color={'gray.300'} fontWeight={'normal'} _hover={{ bgColor: 'gray.600'}}>
                        Add Contract
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

export default AddContractForm