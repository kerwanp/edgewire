import { Component, view } from 'edgewire'

const users = [
  {
    name: 'Nicholas North',
    avatar:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMGhlYWRzaG90fGVufDB8fDB8fA%3D%3D&auto=format&w=80&h=80&q=60&fit=facearea&facepad=3',
  },
  {
    name: 'Cameron Watson',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGZlbWFsZSUyMGhlYWRzaG90fGVufDB8fDB8fA%3D%3D&auto=format&fit=facearea&w=80&h=80&q=60&facepad=3',
  },
  {
    name: 'Jane Lambert',
    avatar:
      'https://images.unsplash.com/photo-1607569708758-0270aa4651bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZmVtYWxlJTIwaGVhZHNob3R8ZW58MHx8MHx8&auto=format&fit=facearea&w=80&h=80&q=60&facepad=3',
  },
  {
    name: 'Gabrielle Mills',
    avatar:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGZlbWFsZSUyMGhlYWRzaG90fGVufDB8fDB8fA%3D%3D&auto=format&fit=facearea&w=80&h=80&q=60&facepad=3',
  },
  {
    name: 'Luke Arnold',
    avatar:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMGhlYWRzaG90fGVufDB8fDB8fA%3D%3D&auto=format&fit=facearea&w=80&h=80&q=60&facepad=4',
  },
]

export default class SearchUsersComponent extends Component {
  query = ''

  async render() {
    return view('edgewire/search-users', {
      users: this.query?.length
        ? users.filter((u) => u.name.toLowerCase().includes(this.query.toLowerCase()))
        : users,
    })
  }
}
