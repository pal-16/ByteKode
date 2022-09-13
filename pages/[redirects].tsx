import type { GetServerSideProps, NextPage } from 'next'
import Loading from 'src/components/common/Loading'
import { dbClient } from 'src/config/supabase'

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
		redirect: {
            destination: '/',
            permanent: false
        } 
	}
}

const Redirects: NextPage = () => {
    return(
        <Loading/>
    )
}

export default Redirects