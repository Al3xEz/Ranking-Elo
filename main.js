let players = []

const params = {
  // PARAMS FOR SEARCH
  from: '202504',
  to: '202505',
  rating: 'national'
}

const ratingTitles = {
  national: 'Elo Nacional',
  'standard-fide': 'Elo FIDE Clásico',
  'blitz-fide': 'Elo FIDE Blitz',
  'rapid-fide': 'Elo FIDE Rápido'
}

function updateTitle() {
  const titleEl = document.getElementById('ranking-title')
  const ratingName = ratingTitles[params.rating] || 'Elo'

  const year = params.from.slice(0, 4)
  const month = params.from.slice(4)
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]
  const mesNombre = meses[parseInt(month, 10) - 1] || ''

  titleEl.innerHTML = `Ranking Incrementos <br> ${ratingName} ${mesNombre} ${year}`
}

async function fetchData() {
  const baseURL =
    'https://ajedrezcostaricafuncs.azurewebsites.net/api/HighestDeltas?code=pXPrABs-r8-2nB-9hsRGVwkhSmVQAJTF-BamxYCegQlHAzFuIlkfOg%3D%3D'

  const queryString = new URLSearchParams(params).toString()
  const fullURL = `${baseURL}&${queryString}`

  try {
    const response = await fetch(fullURL)
    if (!response.ok)
      throw new Error(`Error en la solicitud: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error al realizar la consulta:', error)
    return []
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  updateTitle()
  players = await fetchData()
  console.log(players)
  createRanking(players.slice(0, 5))
})

const takeScreenShot = () => {
  const element = document.getElementById('ranking-elo')
  html2canvas(element)
    .then((canvas) => {
      const image = canvas.toDataURL('image/jpg')
      const a = document.createElement('a')
      a.href = image
      a.download = 'Ranking-Elo.jpg'
      a.click()
    })
    .catch(console.error)
}

const rankingList = document.querySelector('.ranking-list')

function createRanking(topPlayers) {
  rankingList.innerHTML = ''

  topPlayers.forEach((player, idx) => {
    const rankingItem = document.createElement('div')
    rankingItem.classList.add('ranking-item')

    const rankDiv = document.createElement('div')
    const rankP = document.createElement('p')
    rankP.textContent = idx + 1

    const colorClass = ['gold', 'blue', 'red'][idx] || 'gray'
    rankDiv.classList.add('rank', `bg-${colorClass}`)
    rankDiv.appendChild(rankP)

    const detailsDiv = document.createElement('div')
    detailsDiv.classList.add('details', colorClass)

    const nameAndClub = document.createElement('div')
    nameAndClub.classList.add('name-and-club')

    const nameP = document.createElement('p')
    nameP.classList.add('name')
    nameP.textContent = player.name

    const clubAndCategory = document.createElement('div')
    clubAndCategory.classList.add('club-and-category')

    const clubP = document.createElement('p')
    clubP.classList.add('club')
    clubP.textContent = player.club || 'Sin club'

    const categoryP = document.createElement('p')
    categoryP.classList.add('category')
    categoryP.textContent = player.category

    const separatorDot = document.createElement('div')
    separatorDot.classList.add('separator-dot')

    if (player.category) {
      clubAndCategory.append(clubP, separatorDot, categoryP)
    } else {
      clubAndCategory.appendChild(clubP)
    }

    nameAndClub.append(nameP, clubAndCategory)

    const scoreDiv = document.createElement('div')
    scoreDiv.classList.add('score')

    const eloP = document.createElement('p')
    eloP.classList.add('elo-player')
    eloP.textContent = player.toRating

    const changeDiv = document.createElement('div')
    changeDiv.classList.add('change')

    const changeSvg = document.createElement('div')
    changeSvg.classList.add('arrow')
    changeSvg.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="40" d="M112 244l144-144 144 144M256 120v292"></path>
      </svg>
    `

    const changeSpan = document.createElement('span')
    changeSpan.classList.add('elo-player')
    changeSpan.textContent = player.delta

    changeDiv.append(changeSvg, changeSpan)
    scoreDiv.append(eloP, changeDiv)

    detailsDiv.append(nameAndClub, scoreDiv)
    rankingItem.append(rankDiv, detailsDiv)
    rankingList.appendChild(rankingItem)
  })
}
