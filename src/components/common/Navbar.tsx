import { Avatar, Badge, Button, HStack, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { dbClient } from 'src/config/supabase'

const Navbar: FC<{ userId?: string, email?: string}> = ({ userId, email }) => {

    const router = useRouter()

    const logout = async () => {
        await dbClient.auth.signOut()
        router.push('/')
    }

    const logoText = `ßytekode`
    const versionText = `alpha`

    return(
        <HStack fontFamily={'Outfit'} px={8} py={4} alignItems={'center'} justify={'space-between'} bgColor={'#1a1b22'} color={'whiteAlpha.900'}>
            <HStack>
                <Text fontSize={'2xl'} fontFamily={'Hammersmith One'} as='a' href='/' color={'#fff'}>
                    {logoText}
                </Text>
                <Badge variant={'solid'} colorScheme={'red'} fontSize={'8'}>
                    {versionText}
                </Badge>
            </HStack>
            {
                userId && email &&
                <Menu>
                    <MenuButton>
                        <HStack alignItems={'center'}>
                            <Avatar src={`https://avatars.dicebear.com/api/bottts/${email}.svg`}/>
                            <Stack spacing={0} as='button'>
                                <Text fontWeight={'semibold'} color={'whiteAlpha.800'}>@{email.split('@')[0]}</Text>
                                <Text color={'whiteAlpha.700'}>{`${userId.slice(0,4)}...${userId.slice(-4)}`}</Text>
                            </Stack>
                        </HStack>
                    </MenuButton>
                    <MenuList color={'gray.700'}>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            }
        </HStack>
    )
}

export default Navbar