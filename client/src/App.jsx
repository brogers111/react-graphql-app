import {useQuery, useMutation, gql} from '@apollo/client';
import './App.css'

const GET_USERS = gql`
query GetUsers {
  getUsers {
    id
    age
    name
    isMarried
  }
}
`;

const GET_USER_BY_ID = gql`
query GetUserById($id: ID!) {
  GetUserById(id: $id) {
    id
    age
    name
    isMarried
  }
}
`;

function App() {
  const {data: getUsersData, error: getUsersError, loading: getUsersLoading} = useQuery(GET_USERS);
  const {data: getUserByIdData, error: getUsersByIdError, loading: getUsersByIdLoading} = useQuery(GET_USER_BY_ID);

  if(getUsersLoading) return <p>Data loading...</p>

  if(getUsersError) return <p>Error: {error.message}</p>

  return (
    <>
      <h1>Users</h1>
      <div>{getUsersData.getUsers.map((user) => (
        <div>
          <p>Name: {user.name}</p>  
          <p>Age: {user.age}</p>  
          <p>Is this user married: {user.isMarried ? "Yes" : "No"}</p>  
        </div>
      ))}
      </div>
    </>
  )
}

export default App
