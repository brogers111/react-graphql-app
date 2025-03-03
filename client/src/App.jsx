import { useState } from 'react';
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
  getUserById(id: $id) {
    id
    age
    name
    isMarried
  }
}
`;

const CREATE_USER = gql`
mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
  createUser(name: $name, age: $age, isMarried: $isMarried) {
    name
  }
}
`;

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newUser, setNewUser] = useState({});

  const {data: getUsersData, error: getUsersError, loading: getUsersLoading} = useQuery(GET_USERS);
  const {data: getUserByIdData, loading: getUserByIdLoading} = useQuery(GET_USER_BY_ID, {
    variables: {id: selectedUserId},
    skip: !selectedUserId
  });

  const [createUser] = useMutation(CREATE_USER);

  const handleCreateUser = async () => {
    await createUser({ 
      variables: {name: newUser.name, age: Number(newUser.age), isMarried: false}, 
      update: (cache, { data: {createUser}}) => {
      cache.modify({
        fields: {
          getUsers(existingUsers = []){
            return [...existingUsers, createUser];
          }
        }
      });
    }
    });
    setNewUser({name: "", age: ""})
  }

  if(getUsersLoading) return <p>Data loading...</p>

  if(getUsersError) return <p>Error: {getUsersError.message}</p>

  return (
    <>
    <div>
      <input type="text" placeholder='Name...' value={newUser.name} onChange={(e) => setNewUser((prev) => ({...prev, name: e.target.value}))}/>
      <input type="number" placeholder='Age...' value={newUser.age} onChange={(e) => setNewUser((prev) => ({...prev, age: e.target.value}))}/>
      <button onClick={handleCreateUser}>Create User</button>
    </div>
      <h1>Users</h1>
      <div>
        {selectedUserId ? (
          getUserByIdLoading ? <p>Loading...</p> : (
            <>
              <h2>Chosen User:</h2>
              <p>Name: {getUserByIdData.getUserById.name}</p>
              <p>Age: {getUserByIdData.getUserById.age}</p>
              <p>Is Married: {getUserByIdData.getUserById.isMarried ? "Yes": "No"}</p>
            </>
          )
        ): (
          <p>Click on a user to select</p>
        )}
      </div>
      <div>
        <h2>All Users:</h2>
      </div>
      <div>{getUsersData.getUsers.map((user) => (
        <div key={user.id} onClick={() => setSelectedUserId(user.id)} style={{cursor: 'pointer'}}>
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
