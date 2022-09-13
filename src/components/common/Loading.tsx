import { Center } from '@chakra-ui/react'
import { FC } from 'react'
import animation from 'src/helpers/loading.json'
import Lottie from 'react-lottie'

const Loading: FC = () => {
    return(
        <Center h={'full'} w='full'>
            <Lottie 
                options={{
                    animationData: animation,
                }}
                height={250}
                width={250}
            />            
        </Center>
    )
}

export default Loading