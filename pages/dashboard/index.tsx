import { Flex } from '@chakra-ui/react'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useEffect, useState } from 'react'
import Navbar from 'src/components/common/Navbar'
import Sidenav from 'src/components/common/Sidebar'
import { dbClient } from 'src/config/supabase'
import Contracts from 'src/components/contracts/Container'
import Functions from 'src/components/functions/Container'
import History from 'src/components/history/Container'
import Loading from 'src/components/common/Loading'
import Billing from 'src/components/billing/Container'
import Transactions from 'src/components/transactions/Transactions'
import Wallet from 'src/components/wallet/Wallet'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { user, error } = await dbClient.auth.api.getUserByCookie(req)
    console.log(user)
    if(error){
        return{
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    return {
        props: { user }
    }
}

const Dashboard: NextPage<
    InferGetServerSidePropsType<
        typeof getServerSideProps
    >> = ({ user }) => 
{
    
    const [currentOption, setCurrentOption] = useState(1)
    const [domLoaded, setDomLoaded] = useState(false)

    useEffect(() => {
        setDomLoaded(true)
    }, [])
    
    if(domLoaded){
        return(
            <Flex flexDir={'column'} overflow={'auto'} bgColor={'#1a1b23'} h='100vh' fontFamily={'Outfit'}>
                <Navbar userId={user.id} email={user.email}/>
                <Flex w={'full'} pb={4}>
                    <Flex w={'25%'}>
                        <Sidenav 
                            setCurrentOption={setCurrentOption} 
                            currentOption={currentOption}
                        />
                    </Flex>
                    <Flex w={'75%'}>
                        {
                            (() => {
                                switch(currentOption){
                                    case 1:
                                        return (<Contracts user={user}/>)
                                    case 2:
                                        return (<Functions user={user}/>)
                                    case 3:
                                        return (<History user={user}/>)
                                    case 4:
                                        return (<Billing user={user}/>)
                                    case 5:
                                        return (<Transactions user={user}/>)
                                    case 6:
                                        return (<Wallet user={user}/>)
                                }
                            })()
                        }
                    </Flex>
                </Flex>
            </Flex>
        )
    }
    return (<Loading />)
}

export default Dashboard