import { useQuery } from 'react-apollo'
import QUERY_USER_ROLES from '../../../graphql/getUserRoles.gql'

function useAuth() {
  const { loading, data } = useQuery(QUERY_USER_ROLES, {
    fetchPolicy: 'no-cache'
  })
  let isLogged = false;
  if (data) {
    data.userRoles.roles.find((role: { name: string; }) => role.name === "AppAccess") ? isLogged = true : "";
  }
  return { loading, isLogged }
}

export default useAuth
