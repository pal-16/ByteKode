import { Button, Flex, FormControl, FormLabel, Input, Stack, Text, VStack } from '@chakra-ui/react'
import { useFormik } from 'formik'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Navbar from 'src/components/common/Navbar'
import { dbClient } from 'src/config/supabase'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { user, error } = await dbClient.auth.api.getUserByCookie(req)
    console.log(user)
    if(user && user.email_confirmed_at !== ''){
        return{
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        }
    }
    return { props: {} }
}

const Signup: NextPage = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        onSubmit: (values) => createAccountWithEmailAndPassword(values.email, values.confirmPassword)
    })

    const createAccountWithEmailAndPassword = async (email: string, password: string) => {
        setIsLoading(true)
        const { user, error } = await dbClient.auth.signUp({ email, password })
        if(user){
            router.push('/confirm_email')
        }
        setIsLoading(false)    
    }

    return(
        <Flex flexDirection={'column'} bgColor={'#1a1b23'} h='100vh' fontFamily={'Outfit'}>
            <Navbar />
            <VStack px={{ base: '8'}} py={{ base: '8' }}>
                <Stack w='sm' spacing={8} maxW={'sm'} fontFamily={'Outfit'}>
                    <Text color={'gray.100'} fontSize={'3xl'} fontWeight={'semibold'} letterSpacing={1}>
                        Signup to bytekode 
                    </Text>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={4}>
                        <FormControl>
                            <FormLabel color={'gray.200'}>Email</FormLabel>
                            <Input
                                name='email'
                                type={'email'} 
                                variant={'filled'} 
                                bgColor={'gray.800'} 
                                color={'gray.300'}
                                placeholder={'gavin@hooli.com'}
                                _hover={{ bgColor: 'gray.700' }}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel color={'gray.300'}>Password</FormLabel>
                            <Input
                                name='password'
                                type={'password'} 
                                variant={'filled'} 
                                bgColor={'gray.800'} 
                                color={'gray.300'}
                                placeholder={'**********'}
                                _hover={{ bgColor: 'gray.700' }}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel color={'gray.300'}>Confirm Password</FormLabel>
                            <Input
                                name='confirmPassword'
                                type={'password'} 
                                variant={'filled'} 
                                bgColor={'gray.800'} 
                                color={'gray.300'}
                                placeholder={'**********'}
                                _hover={{ bgColor: 'gray.700' }}
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <Button 
                                isLoading={isLoading} 
                                type='submit' 
                                bgColor={'gray.700'} w={'full'} 
                                mt={4} color={'gray.100'} 
                                fontWeight={'normal'} _hover={{ bgColor: 'gray.600'}}
                            >
                                Create Account
                            </Button>
                        </FormControl>
                        <Text textAlign={'center'} color={'gray.300'} as='a' cursor={'pointer'} href='/'>
                            {`Have an account? Login Here`}
                        </Text>
                    </Stack>
                    </form>
                </Stack>
            </VStack>
        </Flex>
    )
}

export default Signup