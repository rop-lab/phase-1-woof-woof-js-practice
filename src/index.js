document.addEventListener('DOMContentLoaded', async () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    
    let filterOn = false;
    
    // Function to fetch all pups
    const fetchAllPups = async () => {
      try {
        const response = await fetch('http://localhost:3000/pups');
        if (!response.ok) {
          throw new Error(`Failed to fetch pups. Status: ${response.status}`);
        }
        const pups = await response.json();
        return pups;
      } catch (error) {
        console.error(error);
        alert('Failed to fetch pups. Please try again later.');
        return [];
      }
    };
    
    // Function to render pups in the dog bar
    const renderPups = (pups) => {
      dogBar.innerHTML = '';
      pups.forEach((pup) => {
        const pupSpan = document.createElement('span');
        pupSpan.textContent = pup.name;
        pupSpan.addEventListener('click', () => showPupInfo(pup));
        dogBar.appendChild(pupSpan);
      });
    };
    
    // Function to show pup info in the dog info div
    const showPupInfo = async (pup) => {
      try {
        const response = await fetch(`http://localhost:3000/pups/${pup.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch pup details. Status: ${response.status}`);
        }
        const pupDetails = await response.json();
        dogInfo.innerHTML = `
          <img src="${pupDetails.image}" />
          <h2>${pupDetails.name}</h2>
          <button data-id="${pupDetails.id}" data-good="${pupDetails.isGoodDog}">
            ${pupDetails.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}
          </button>
        `;
        const toggleButton = dogInfo.querySelector('button');
        toggleButton.addEventListener('click', () => toggleGoodDogStatus(pupDetails));
      } catch (error) {
        console.error(error);
        alert('Failed to fetch pup details. Please try again later.');
      }
    };
    
    // Function to toggle good dog status
    const toggleGoodDogStatus = async (pup) => {
      try {
        pup.isGoodDog = !pup.isGoodDog;
        const response = await fetch(`http://localhost:3000/pups/${pup.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ isGoodDog: pup.isGoodDog }),
        });
        if (!response.ok) {
          throw new Error(`Failed to update pup. Status: ${response.status}`);
        }
        showPupInfo(pup); // Refresh the displayed info after updating
      } catch (error) {
        console.error(error);
        alert('Failed to update pup. Please try again later.');
      }
    };
    
    // Function to filter good dogs
    const filterGoodDogs = async () => {
      filterOn = !filterOn;
      filterButton.textContent = `Filter good dogs: ${filterOn ? 'ON' : 'OFF'}`;
      const pups = await fetchAllPups();
      const filteredPups = filterOn ? pups.filter((pup) => pup.isGoodDog) : pups;
      renderPups(filteredPups);
    };
    
    // Event listener for filter button click
    filterButton.addEventListener('click', filterGoodDogs);
    
    // Initial load of all pups
    const initialPups = await fetchAllPups();
    renderPups(initialPups);
  });
  