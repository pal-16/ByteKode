import { Button, Flex, FormControl, FormLabel, Input, Stack, Text, VStack } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import Loading from 'src/components/common/Loading'
import Navbar from 'src/components/common/Navbar'
import { dbClient } from 'src/config/supabase'
import { AuthContext, IAuthContext } from 'src/helpers/context/AuthContext'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const { user, error } = await dbClient.auth.api.getUserByCookie(req)
	console.log(user?.aud)
	if(user){
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false
			}
		}
	}
	return {
		props: { } 
	}
}

const Home: NextPage = () => {

	const router = useRouter()
	const { currentUser, isLoadingAuth } = useContext(AuthContext) as IAuthContext

	// when dom loads, check if user, then redirect to dashbboard
	useEffect(() => {
			if(!isLoadingAuth){
				currentUser && 
				router.push('/dashboard')
			} 
	}, [])

	const formik = useFormik({
		initialValues: {
			email: '',
			password: ''
		},
		onSubmit: (values) => loginWithEmailAndPassword(values.email, values.password)
	})

	const [isLoading, setIsLoading] = useState(false)
	
	const loginWithEmailAndPassword = async (email: string, password: string) => {
		setIsLoading(true)
		const { user, error } = await dbClient.auth.signIn({ email, password })
		if(user) router.push('/dashboard') 
		setIsLoading(false)
	}

    return(
        <Flex flexDirection={'column'} bgColor={'#1a1b23'} h='100vh' fontFamily={'Outfit'}>
            <Head>
				<title>Welcome to bytekode</title>
			</Head>
			<Navbar/>
			{
				isLoadingAuth ? <Loading /> :
				<VStack px={{ base: '8'}} py={{ base: '8' }}>
					{/* <Form /> */}
					<Stack w='sm' spacing={8} maxW={'sm'} fontFamily={'Outfit'}>
						<Text color={'gray.100'} fontSize={'3xl'} fontWeight={'semibold'} letterSpacing={1}>
							Login to bytekode 
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
									<FormLabel color={'gray.200'}>Password</FormLabel>
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
									<Button 
										isLoading={isLoading} 
										type='submit' 
										bgColor={'gray.700'} w={'full'} 
										mt={4} color={'gray.100'} 
										fontWeight={'normal'} _hover={{ bgColor: 'gray.600'}}
									>
										Login
									</Button>
							</FormControl>
							<Text textAlign={'center'} color={'gray.300'} as='a' cursor={'pointer'} href='/signup'>
                            	{`Don't have an account? Signup Here`}
                        	</Text>
							</Stack>
						</form>
					</Stack>
				</VStack>
			}
        </Flex>
    )
}

export default Home