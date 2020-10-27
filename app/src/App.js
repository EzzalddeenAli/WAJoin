import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';

import { JoinTaskList, JoinTaskCreate } from './JoinTask';

function App() {
  return (
    <Admin
      dataProvider={restProvider('http://localhost:3000/api')}
      title="WAJoin"
    >
      <Resource options={{ label: 'Running Joins' }} name="join_job" list={JoinTaskList} create={JoinTaskCreate} />
    </Admin>
  );
}

export default App;
