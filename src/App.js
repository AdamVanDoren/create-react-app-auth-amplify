import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

const initialFormState = { name: '', description: ''}

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [people, updatePeople] = useState([])
  const [coins, updateCoins] = useState([])

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  // Helm API
  async function callHelm() {
      try {
          const order = await API.get('helmapi', '/order')
          console.log(order)
      } catch (err) {
          console.log({ err })
      }
  }

  // People JS API (form tutorial)
  async function callApi() {
    try {
        const peopleData = await API.get('mainappapi', '/people');
        console.log('peopleData: ', peopleData)
        updatePeople(peopleData.people)
        const coinsData = await API.get('mainappapi', '/coins');
        console.log('coinsData: ', coinsData)
        updateCoins(coinsData.coins)
    } catch (err) {
        console.log({ err })
    }
  }
  useEffect(() => {
    callApi()
  }, [])

  return (
    <div className="App">
      <h1>My Notes App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <button onClick={() => deleteNote(note)}>Delete note</button>
            </div>
          ))
        }
      </div>
      <h1>Star Wars People</h1>
        <div style={{marginBottom: 30}}>
            {
                people.map((p, i) => <h2>{p.name}</h2>)
            }
        </div>
      <h1>Coins</h1>
        <div style={{marginBottom: 30}}>
            {
                coins.map((c, i) => <h2>{c.name}</h2>)
            }
        </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);