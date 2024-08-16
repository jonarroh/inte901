const url = `https://e92f-2806-2f0-6021-bce0-88b5-f219-b8ab-78ce.ngrok-free.app/Account/login`
const email = "urieher99@gmail.com"
const password = "Ganondorf09#"


const data = {
  email,
  password
}

const headers = {
  'Content-Type': 'application/json'
}

async function login() {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })
  
  const json = await response.json()
  console.log(json)
}

login()