import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { FC } from 'react'
// fonts
import '@fontsource/outfit'
import '@fontsource/hammersmith-one'
import '@fontsource/spartan'
import { AuthContextProvider } from 'src/helpers/context/AuthContext'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<ChakraProvider>
			<AuthContextProvider>
				<Component {...pageProps} />
			</AuthContextProvider>
		</ChakraProvider>
	)
}

export default MyApp
